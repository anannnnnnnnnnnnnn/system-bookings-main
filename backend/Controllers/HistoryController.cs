using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using Newtonsoft.Json; // นำเข้าไลบรารี


namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/bookings")]
    public class HistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HistoryController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet("history/{fullName}")]
        public async Task<IActionResult> GetBookingHistory(string fullName)
        {
            if (string.IsNullOrEmpty(fullName))
            {
                return BadRequest(new { message = "ชื่อผู้ใช้ไม่ถูกต้อง" });
            }
            try
            {
                // ค้นหาประวัติการจองตาม full_name โดยใช้ JOIN
                var bookings = await (from b in _context.Carbookings
                                      join c in _context.Cars on b.car_id equals c.car_id
                                      where b.full_name == fullName
                                      orderby b.booking_date descending
                                      select new
                                      {
                                          b.confirmation_id,
                                          b.full_name,
                                          b.booking_number,
                                          b.booking_date,
                                          b.booking_time,
                                          b.return_date,
                                          b.return_time,
                                          b.destination,
                                          b.purpose,
                                          b.department,
                                          b.booking_status,
                                          // ข้อมูลรถที่จอง
                                          Car = new
                                          {
                                              c.model,
                                              c.type,
                                              c.license_plate,
                                              c.seating_capacity,
                                              c.image_url
                                          }
                                      }).ToListAsync();

                if (bookings == null || !bookings.Any())
                {
                    return NotFound(new { message = "ไม่พบประวัติการจอง" });
                }

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                // Log error for debugging
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์", error = ex.Message });
            }
        }

        [HttpGet("active/{fullName}")]
        public async Task<IActionResult> GetActiveBookings(string fullName)
        {
            if (string.IsNullOrEmpty(fullName))
            {
                return BadRequest(new { message = "ชื่อผู้ใช้ไม่ถูกต้อง" });
            }

            try
            {
                var currentDateTime = DateTime.Now; // เวลาปัจจุบัน
                var currentDate = currentDateTime.Date; // วันที่ปัจจุบัน (ตัดเวลาออก)

                var activeBookings = await _context.Carbookings
                    .Where(b => b.full_name == fullName &&
                                (b.booking_status == 1 || b.booking_status == 2 ||  // สถานะ 1, 2 แสดงเสมอ
                                 (b.booking_status == 3 &&
                                  (b.return_date == null || b.return_date >= currentDate)))) // สถานะ 3 ให้แสดงจนถึง 23:59 ของ return_date
                    .Select(b => new
                    {
                        b.confirmation_id,
                        b.booking_number,
                        b.booking_date,
                        b.booking_time,
                        b.return_date,
                        b.return_time,
                        b.destination,
                        b.purpose,
                        b.booking_status,
                        Car = new
                        {
                            b.Car.model,
                            b.Car.type,
                            b.Car.license_plate,
                            b.Car.image_url
                        }
                    })
                    .ToListAsync();

                if (!activeBookings.Any())
                {
                    return NotFound(new { message = "ไม่พบการจองที่ยังใช้งานได้" });
                }

                return Ok(activeBookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการดึงข้อมูล", error = ex.Message });
            }
        }


        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var carbooking = await _context.Carbookings.FindAsync(id);
            if (carbooking == null) return NotFound();

            if (carbooking.booking_status == 5) // ถ้าสถานะเป็น "ยกเลิกแล้ว"
            {
                return BadRequest(new { message = "This booking has already been cancelled." });
            }

            carbooking.booking_status = 5; // เปลี่ยนสถานะเป็น "ยกเลิกการจอง"
            await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลง

            return Ok(new { message = "Booking has been cancelled." });
        }
        [HttpGet("status2")]
        public async Task<IActionResult> GetApprovedBookings()
        {
            var bookings = await _context.Carbookings
                .Where(b => b.booking_status == 2) // กรองเฉพาะสถานะที่เป็น 2
                .ToListAsync();

            return Ok(bookings);
        }

        [HttpPut("update-status/{confirmationId}")]
        public async Task<IActionResult> UpdateBookingStatus(int confirmationId)
        {
            var booking = await _context.Carbookings.FirstOrDefaultAsync(b => b.confirmation_id == confirmationId);

            if (booking == null)
            {
                return NotFound(new { message = "ไม่พบการจอง" });
            }

            if (booking.booking_status != 2)
            {
                return BadRequest(new { message = "สามารถเปลี่ยนสถานะได้เฉพาะการจองที่อนุมัติแล้ว (2)" });
            }

            booking.booking_status = 4; // เปลี่ยนเป็น 4
            await _context.SaveChangesAsync();

            return Ok(new { message = "อัปเดตสถานะเรียบร้อยแล้ว" });
        }

        [HttpPut("update-booking/{confirmationId}")]
        public async Task<IActionResult> UpdateBooking(int confirmationId, [FromBody] Carbooking bookingUpdateDto)
        {
            if (bookingUpdateDto == null)
            {
                return BadRequest(new { message = "Invalid booking data." });
            }

            var booking = await _context.Carbookings.FirstOrDefaultAsync(b => b.confirmation_id == confirmationId);

            if (booking == null)
            {
                return NotFound(new { message = "ไม่พบการจอง" });
            }

            // ตรวจสอบว่าข้อมูลที่จำเป็นมีค่า
            if (!bookingUpdateDto.booking_date.HasValue || !bookingUpdateDto.return_date.HasValue)
            {
                return BadRequest(new { message = "Booking date and return date are required." });
            }

            // ตรวจสอบ booking_time และ return_time ให้ไม่เป็น null
            var bookingTime = bookingUpdateDto.booking_time ?? TimeSpan.Zero;
            var returnTime = bookingUpdateDto.return_time ?? TimeSpan.Zero;

            // คำนวณวัน-เวลาเริ่มต้นและสิ้นสุด
            var bookingStartNew = bookingUpdateDto.booking_date.Value.Add(bookingTime);
            var bookingEndNew = bookingUpdateDto.return_date.Value.Add(returnTime);

            if (bookingStartNew >= bookingEndNew)
            {
                return BadRequest(new { message = "Return date and time must be after booking date and time." });
            }

            // ตรวจสอบการจองทับซ้อนโดยใช้ AsEnumerable() เพื่อให้คำนวณบนฝั่งของ C#
            // ดึงข้อมูลการจองทั้งหมดที่อาจทับซ้อน
            var bookings = await _context.Carbookings
                .Where(b =>
                    b.car_id == bookingUpdateDto.car_id &&
                    b.booking_status == 1 &&
                    b.confirmation_id != confirmationId &&
                    b.booking_date.HasValue &&
                    b.return_date.HasValue)
                .ToListAsync()
                .ConfigureAwait(false);

            // ตรวจสอบการจองทับซ้อน
            var isOverlapping = bookings.Any(b =>
            {
                var existingBookingStart = b.booking_date.Value.Add(b.booking_time ?? TimeSpan.Zero);
                var existingBookingEnd = b.return_date.Value.Add(b.return_time ?? TimeSpan.Zero);

                return existingBookingStart < bookingEndNew && existingBookingEnd > bookingStartNew;
            });

            // หากมีการจองทับซ้อน
            if (isOverlapping)
            {
                return BadRequest(new { message = "This car is already booked for the selected time slot." });
            }


            // อัปเดตข้อมูลการจอง
            booking.booking_date = bookingUpdateDto.booking_date;
            booking.booking_time = bookingUpdateDto.booking_time;
            booking.return_date = bookingUpdateDto.return_date;
            booking.return_time = bookingUpdateDto.return_time;
            booking.destination = bookingUpdateDto.destination;
            booking.purpose = bookingUpdateDto.purpose;

            booking.Car = null; // ป้องกันการอัปเดตข้อมูล Car

            await _context.SaveChangesAsync();

            return Ok(new { message = "การจองถูกแก้ไขเรียบร้อยแล้ว", booking });
        }

        [HttpGet("get-booking/{confirmationId}")]
        public async Task<IActionResult> GetBookingById(int confirmationId)
        {
            // ค้นหาการจองจาก confirmationId
            var booking = await _context.Carbookings
                .Where(b => b.confirmation_id == confirmationId)
                .Select(b => new
                {
                    b.confirmation_id,
                    b.booking_date,
                    b.booking_time,
                    b.return_date,
                    b.return_time,
                    b.destination,
                    b.purpose,
                    // ข้อมูลที่ต้องการแสดงในหน้า Frontend
                })
                .FirstOrDefaultAsync();

            if (booking == null)
            {
                return NotFound(new { message = "ไม่พบการจอง" });
            }

            return Ok(booking); // ส่งข้อมูลการจองที่สามารถแก้ไขได้
        }
    }
}





