using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using Newtonsoft.Json; // นำเข้าไลบรารี

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class BookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BookingController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/bookings/search?status=1 (รถที่ว่าง)
        // GET: api/bookings/search?status=2 (รถที่ไม่ว่าง)
        // GET: api/bookings/search (แสดงทุกสถานะ)
        [HttpGet("search")]
        public async Task<IActionResult> GetCarsByStatus([FromQuery] int? status)
        {
            var carsQuery = _context.Cars.AsQueryable();

            // หากมีการระบุสถานะ ก็จะกรองตามสถานะที่ส่งมา
            if (status.HasValue)
            {
                carsQuery = carsQuery.Where(car => car.status == status.Value);
            }

            var cars = await carsQuery
                .Select(car => new
                {
                    car.car_id,
                    car.brand,
                    car.model,
                    car.license_plate,
                    car.seating_capacity,
                    car.fuel_type,
                    car.image_url,
                    car.status // แสดงสถานะของรถ
                })
                .ToListAsync();

            if (!cars.Any())
            {
                return NotFound(new { message = "No cars found." });
            }

            return Ok(cars);
        }

        [HttpGet]
        public async Task<IActionResult> GetBookings()
        {
            try
            {
                // ดึงข้อมูลการจองทั้งหมดจากฐานข้อมูลใหม่
                var bookings = await _context.Carbookings.AsNoTracking().ToListAsync();

                // ส่งข้อมูลทั้งหมดกลับในรูปแบบ JSON
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                // ส่งข้อผิดพลาดถ้ามี
                return StatusCode(500, new { message = "An error occurred while retrieving bookings.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] Carbooking carbooking)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                                        .SelectMany(v => v.Errors)
                                        .Select(e => e.ErrorMessage)
                                        .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }

            if (carbooking.booking_date == null || carbooking.return_date == null)
            {
                return BadRequest(new { message = "Booking date and return date are required." });
            }

            // แปลง DateOnly เป็น DateTime และเพิ่มเวลาเข้าไป
            var bookingStart = carbooking.booking_date.Value.ToDateTime(TimeOnly.FromTimeSpan(carbooking.booking_time ?? TimeSpan.Zero));
            var bookingEnd = carbooking.return_date.Value.ToDateTime(TimeOnly.FromTimeSpan(carbooking.return_time ?? TimeSpan.Zero));

            if (bookingStart >= bookingEnd)
            {
                return BadRequest(new { message = "Return date and time must be after booking date and time." });
            }

            var carBookings = await _context.Carbookings
                .Where(b => b.car_id == carbooking.car_id && b.status == 1)
                .ToListAsync();

            // ตรวจสอบว่าช่วงเวลาจองทับซ้อนกันหรือไม่
            var isOverlapping = carBookings
                .Any(b =>
                {
                    var existingStart = b.booking_date.Value.ToDateTime(TimeOnly.FromTimeSpan(b.booking_time ?? TimeSpan.Zero));
                    var existingEnd = b.return_date.Value.ToDateTime(TimeOnly.FromTimeSpan(b.return_time ?? TimeSpan.Zero));

                    // Log ข้อมูลเพื่อ Debug
                    Console.WriteLine($"New Booking: {bookingStart} - {bookingEnd}");
                    Console.WriteLine($"Existing Booking: {existingStart} - {existingEnd}");

                    return bookingStart < existingEnd && bookingEnd > existingStart;
                });

            if (isOverlapping)
            {
                return BadRequest(new { message = "This car is already booked for the selected time slot." });
            }

            if (string.IsNullOrEmpty(carbooking.booking_number))
            {
                carbooking.booking_number = "BN" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            }

            if (carbooking.confirmation_id == 0)
            {
                carbooking.confirmation_id = new Random().Next(100000, 999999);
            }

            carbooking.status = 1;
            carbooking.created_at = DateTime.UtcNow;
            carbooking.updated_at = DateTime.UtcNow;

            _context.Carbookings.Add(carbooking);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBookingByConfirmationId),
                                    new { confirmation_id = carbooking.confirmation_id },
                                    new
                                    {
                                        message = "Booking created successfully",
                                        confirmation_id = carbooking.confirmation_id,
                                        booking = carbooking
                                    });
        }

        [HttpGet("{confirmation_id}")]
        public async Task<IActionResult> GetBookingByConfirmationId(int confirmation_id)
        {
            // ค้นหาการจองที่มี confirmation_id ตรงกับ id
            var carbooking = await _context.Carbookings
                                           .Where(b => b.confirmation_id == confirmation_id)
                                           .FirstOrDefaultAsync();
            if (carbooking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            return Ok(carbooking);  // คืนค่าข้อมูลการจองที่พบ
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveBooking(int id)
        {
            var Carbooking = await _context.Carbookings.FindAsync(id);
            if (Carbooking == null) return NotFound();

            if (Carbooking.status != 1)
            {
                return BadRequest(new { message = "Booking is not in pending status" });
            }

            Carbooking.status = 2; // อัปเดตสถานะ
            await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลง

            return Ok(new { message = "Booking approved" });
        }


        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectBooking(int id)
        {
            var booking = await _context.Carbookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.status = 3; // ไม่อนุมัติ
            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking rejected" });
        }



        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var booking = await _context.Carbookings.FirstOrDefaultAsync(b => b.confirmation_id == id);

            if (booking == null)
            {
                return NotFound(new { message = "Booking not found." });
            }

            // Change car status back to available (status = 1)
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == booking.car_id);
            if (car != null)
            {
                car.status = 1; // Set the car status back to available
            }

            // Remove the booking
            _context.Carbookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking cancelled successfully." });
        }

    }
}