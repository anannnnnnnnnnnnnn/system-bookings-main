using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            // ค้นหาการจองที่มี confirmation_id ตรงกับ id
            var carbooking = await _context.Carbookings
                                           .Where(b => b.confirmation_id == id)
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
                // ดึงข้อมูลการจองทั้งหมดจากฐานข้อมูล
                var bookings = await _context.Carbookings.ToListAsync();

                // ตรวจสอบถ้ามีการจองหรือไม่
                if (bookings == null || !bookings.Any())
                {
                    return NotFound(new { message = "No bookings found." }); // ถ้าไม่มีการจอง
                }

                // ส่งข้อมูลกลับในรูปแบบ JSON
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
            // ตรวจสอบ ModelState
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                                        .SelectMany(v => v.Errors)
                                        .Select(e => e.ErrorMessage)
                                        .ToList();
                return BadRequest(new { message = "Validation failed", errors });
            }
            // ตรวจสอบว่ามีเวลาจองและเวลาคืน
            if (string.IsNullOrEmpty(carbooking.purpose))
            {
                return BadRequest(new { message = "Purpose is required." });
            }

            if (carbooking.booking_date == null || carbooking.return_date == null)
            {
                return BadRequest(new { message = "Booking and return dates are required." });
            }


            // ตรวจสอบว่ารถพร้อมใช้งาน
            var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == carbooking.car_id && c.status == 1);
            if (car == null)
            {
                return BadRequest(new { message = "Car is not available for booking." });
            }


            // สร้างหมายเลขการจองถ้ายังไม่มี
            if (string.IsNullOrEmpty(carbooking.booking_number))
            {
                carbooking.booking_number = "BN" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            }

            // ตั้งค่า status ของการจองเป็น 1 (รออนุมัติ)
            carbooking.status = 1;

            // ตั้งค่าเวลาสร้างและอัปเดต
            carbooking.created_at = DateTime.UtcNow;
            carbooking.updated_at = DateTime.UtcNow;

            // บันทึกข้อมูลการจองลงฐานข้อมูล
            _context.Carbookings.Add(carbooking);

            // เปลี่ยนสถานะรถเป็นไม่พร้อมใช้งาน
            car.status = 2;

            // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
            await _context.SaveChangesAsync();

            // ส่งข้อมูลการจองกลับพร้อมข้อความสำเร็จ
            return CreatedAtAction(nameof(GetBookingById),
                new { id = carbooking.confirmation_id },
                new
                {
                    message = "Booking created successfully",
                    booking = carbooking
                });
        }
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveBooking(int id)
        {
            var booking = await _context.Carbookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.status = 1; // อนุมัติ
            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking approved" });
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectBooking(int id)
        {
            var booking = await _context.Carbookings.FindAsync(id);
            if (booking == null) return NotFound();

            booking.status = 2; // ไม่อนุมัติ
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