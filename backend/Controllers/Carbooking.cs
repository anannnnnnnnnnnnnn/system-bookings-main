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

            // แปลงวันที่จองและคืนเป็น UTC+7
            carbooking.booking_date = carbooking.booking_date?.AddHours(7);
            carbooking.return_date = carbooking.return_date?.AddHours(7);

            // ตรวจสอบว่าเลขที่การจองมีหรือไม่
            if (string.IsNullOrEmpty(carbooking.booking_number))
            {
                carbooking.booking_number = "BN" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            }

            // ตั้งค่าสถานะการจองเป็น 1 (รออนุมัติ)
            carbooking.status = 1;

            // ตั้งค่าเวลาสร้างและอัปเดต
            carbooking.created_at = DateTime.UtcNow;
            carbooking.updated_at = DateTime.UtcNow;

            // บันทึกการจอง
            _context.Carbookings.Add(carbooking);

            // ตรวจสอบสถานะรถและทำการเปลี่ยนแปลงสถานะ
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == carbooking.car_id && c.status == 1);
            if (car == null)
            {
                return BadRequest(new { message = "Car is not available for booking." });
            }

            // เปลี่ยนสถานะรถเป็นไม่พร้อมใช้งาน
            car.status = 2;

            // บันทึกข้อมูลไปยังฐานข้อมูล
            await _context.SaveChangesAsync();

            // ตรวจสอบว่า confirmation_id ถูกสร้างหรือไม่
            if (carbooking.confirmation_id == 0) // สมมุติว่า confirmation_id เป็น int และ 0 คือค่าดีฟอลต์
            {
                return BadRequest(new { message = "Failed to create confirmation_id." });
            }

            return CreatedAtAction(nameof(GetBookingByConfirmationId), new { id = carbooking.confirmation_id }, new
            {
                message = "Booking created successfully",
                confirmation_id = carbooking.confirmation_id, // ส่งค่า confirmation_id กลับใน Response
                booking = carbooking
            });

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

        // POST: api/bookings
        // [HttpPost]
        // public async Task<IActionResult> CreateBooking([FromBody] Booking booking)
        // {
        //     // ตรวจสอบว่ารถว่างหรือไม่
        //     var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == booking.car_id && c.status == 1);
        //     if (car == null)
        //     {
        //         return BadRequest(new { message = "Car is not available for booking." });
        //     }

        //     // เพิ่มการจองใหม่
        //     _context.booking_confirmations.Add(booking);

        //     // เปลี่ยนสถานะรถเป็นไม่ว่าง
        //     car.status = 2;

        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetAllBookings), new { id = booking.confirmation_id }, booking);
        // }

        // // DELETE: api/bookings/{id}
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> CancelBooking(int id)
        // {
        //     var booking = await _context.booking_confirmations.FirstOrDefaultAsync(b => b.confirmation_id == id);

        //     if (booking == null)
        //     {
        //         return NotFound(new { message = "Booking not found." });
        //     }

        //     // เปลี่ยนสถานะรถกลับเป็นว่าง
        //     var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == booking.car_id);
        //     if (car != null)
        //     {
        //         car.status = 1; // ตั้งสถานะรถกลับเป็น "ว่าง"
        //     }

        //     _context.booking_confirmations.Remove(booking);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Booking cancelled successfully." });
        // }
    }
}