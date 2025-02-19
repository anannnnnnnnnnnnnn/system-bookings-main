using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/roombookings")]
    public class RoomHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomHistoryController(AppDbContext context)
        {
            _context = context;
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

                var activeBookings = await (from rb in _context.RoomBookings
                                            join r in _context.Rooms on rb.room_id equals r.room_id
                                            where rb.full_name == fullName &&
                                                  (rb.booking_status == 1 || rb.booking_status == 2 ||
                                                   (rb.booking_status == 3 &&
                                                    (rb.return_date == null || rb.return_date >= currentDate)))
                                            select new
                                            {
                                                rb.roombooking_id,
                                                rb.roombooking_number,
                                                rb.booking_date,
                                                rb.booking_times,
                                                rb.return_date,
                                                rb.meeting_topic,
                                                rb.attendee_count,
                                                rb.booking_status,
                                                Room = new
                                                {
                                                    r.room_name,
                                                    r.capacity,
                                                    r.equipment,
                                                    r.location,
                                                    r.room_img
                                                }
                                            })
                             .ToListAsync();


                if (!activeBookings.Any())
                {
                    return NotFound(new { message = "ไม่พบการจองห้องประชุมที่ยังใช้งานได้" });
                }

                return Ok(activeBookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดในการดึงข้อมูล", error = ex.Message });
            }
        }
        [HttpGet("roomhistory/{fullName}")]
        public async Task<IActionResult> GetBookingHistory(string fullName)
        {
            if (string.IsNullOrEmpty(fullName))
            {
                return BadRequest(new { message = "ชื่อผู้ใช้ไม่ถูกต้อง" });
            }
            try
            {
                // ค้นหาประวัติการจองห้องประชุมตาม full_name โดยใช้ JOIN
                var bookings = await (from b in _context.RoomBookings
                                      join r in _context.Rooms on b.room_id equals r.room_id
                                      where b.full_name == fullName
                                      orderby b.booking_date descending
                                      select new
                                      {
                                          b.roombooking_id,
                                          b.full_name,
                                          b.roombooking_number,
                                          b.booking_date,
                                          b.booking_times,
                                          b.return_date,
                                          b.meeting_topic,
                                          b.department,
                                          b.attendee_count,
                                          b.booking_status,
                                          // ข้อมูลห้องประชุม
                                          Room = new
                                          {
                                              r.room_name,
                                              r.capacity,
                                              r.equipment,
                                              r.location,
                                              r.room_img
                                          }
                                      }).ToListAsync();

                if (bookings == null || !bookings.Any())
                {
                    return NotFound(new { message = "ไม่พบประวัติการจองห้องประชุม" });
                }

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                // Log error for debugging
                return StatusCode(500, new { message = "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์", error = ex.Message });
            }
        }


        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var roomBooking = await _context.RoomBookings.FindAsync(id);
            if (roomBooking == null) return NotFound();

            if (roomBooking.booking_status == 5) // ถ้าสถานะเป็น "ยกเลิกแล้ว"
            {
                return BadRequest(new { message = "This room booking has already been cancelled." });
            }

            roomBooking.booking_status = 5; // เปลี่ยนสถานะเป็น "ยกเลิกการจอง"
            await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลง

            return Ok(new { message = "Room booking has been cancelled." });
        }

        [HttpPut("roomupdate-booking/{confirmationId}")]
        public async Task<IActionResult> UpdateBooking(int confirmationId, [FromBody] RoomBooking bookingUpdate)
        {
            if (bookingUpdate == null || !ModelState.IsValid || string.IsNullOrWhiteSpace(bookingUpdate.booking_times))
            {
                return BadRequest(new { message = "Invalid booking data", errors = ModelState.Values });
            }

            var booking = await _context.RoomBookings.FirstOrDefaultAsync(b => b.roombooking_id == confirmationId);

            if (booking == null)
            {
                return NotFound(new { message = "ไม่พบการจองห้องประชุม" });
            }

            // ตรวจสอบรูปแบบ booking_times (ต้องเป็น HH:mm-HH:mm,HH:mm-HH:mm)
            string pattern = @"^(\d{2}:\d{2}-\d{2}:\d{2})(,\d{2}:\d{2}-\d{2}:\d{2})*$";
            if (!Regex.IsMatch(bookingUpdate.booking_times, pattern))
            {
                return BadRequest(new { message = "Invalid time format. Use HH:mm-HH:mm,HH:mm-HH:mm" });
            }

            // แปลง booking_times เป็น List ของช่วงเวลา
            var newBookingTimes = ParseBookingTimes(bookingUpdate.booking_times);

            // ดึงรายการจองที่มีอยู่ในวันเดียวกันของห้องนี้ (ยกเว้นรายการที่กำลังแก้ไข)
            var existingBookings = await _context.RoomBookings
                .Where(b => b.room_id == bookingUpdate.room_id && b.booking_date == bookingUpdate.booking_date && b.roombooking_id != confirmationId)
                .ToListAsync();

            // ตรวจสอบว่ามีช่วงเวลาทับซ้อนกันหรือไม่
            foreach (var existingBooking in existingBookings)
            {
                var existingBookingTimes = ParseBookingTimes(existingBooking.booking_times);

                foreach (var newTime in newBookingTimes)
                {
                    if (existingBookingTimes.Any(existingTime => IsTimeOverlap(newTime, existingTime)))
                    {
                        return Conflict(new { message = "This time slot overlaps with an existing booking." });
                    }
                }
            }

            // อัปเดตค่าที่มีอยู่
            booking.booking_date = bookingUpdate.booking_date;
            booking.return_date = bookingUpdate.return_date;
            booking.booking_times = bookingUpdate.booking_times;
            booking.meeting_topic = bookingUpdate.meeting_topic;
            booking.attendee_count = bookingUpdate.attendee_count;

            // กำหนดโซนเวลาเป็นไทย
            TimeZoneInfo thaiZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            booking.updated_at = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, thaiZone);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking updated successfully", booking });
        }

        private List<(TimeSpan start, TimeSpan end)> ParseBookingTimes(string bookingTimes)
        {
            var result = new List<(TimeSpan, TimeSpan)>();

            if (string.IsNullOrWhiteSpace(bookingTimes))
                return result;

            var timeRanges = bookingTimes.Split(',');

            foreach (var time in timeRanges)
            {
                var parts = time.Split('-');
                if (parts.Length == 2 &&
                    TimeSpan.TryParse(parts[0], out var start) &&
                    TimeSpan.TryParse(parts[1], out var end) &&
                    start < end) // ตรวจสอบว่า start ต้องน้อยกว่า end
                {
                    result.Add((start, end));
                }
            }
            return result;
        }

        private bool IsTimeOverlap((TimeSpan start, TimeSpan end) newBooking, (TimeSpan start, TimeSpan end) existingBooking)
        {
            return newBooking.start < existingBooking.end && newBooking.end > existingBooking.start;
        }

        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveBooking(int id)
        {
            var meetingRoomBooking = await _context.RoomBookings.FindAsync(id);
            if (meetingRoomBooking == null) return NotFound();

            if (meetingRoomBooking.booking_status != 1)
            {
                return BadRequest(new { message = "Booking is not in pending status" });
            }

            meetingRoomBooking.booking_status = 2; // อัปเดตสถานะเป็นอนุมัติ
            await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลง

            return Ok(new { message = "Meeting room booking approved" });
        }

        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectBooking(int id, [FromBody] RejectBookingDto rejectDto)
        {
            var booking = await _context.RoomBookings.FindAsync(id); // ใช้ RoomBookings แทน Carbookings
            if (booking == null) return NotFound();

            booking.booking_status = 3; // เปลี่ยนสถานะเป็น "ปฏิเสธ"
            booking.roomreject_reason = rejectDto.RejectReason; // บันทึกเหตุผลปฏิเสธ
            booking.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Booking rejected", reject_reason = booking.roomreject_reason });
        }
    }
}
