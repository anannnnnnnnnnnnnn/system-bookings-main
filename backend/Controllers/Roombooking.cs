using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using YourNamespace.Data;
using YourNamespace.Models;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/roombookings")]
    public class RoomBookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomBookingController(AppDbContext context)
        {
            _context = context;
        }

        // สร้างการจองห้องประชุม
        [HttpPost]
        public async Task<IActionResult> CreateBooking([FromBody] RoomBooking booking)
        {
            if (booking == null || !ModelState.IsValid || string.IsNullOrWhiteSpace(booking.booking_times))
            {
                return BadRequest(new { message = "Invalid booking data", errors = ModelState.Values });
            }

            // ตรวจสอบรูปแบบของ booking_times (ต้องเป็น HH:mm-HH:mm,HH:mm-HH:mm)
            string pattern = @"^(\d{2}:\d{2}-\d{2}:\d{2})(,\d{2}:\d{2}-\d{2}:\d{2})*$";
            if (!Regex.IsMatch(booking.booking_times, pattern))
            {
                return BadRequest(new { message = "Invalid time format. Use HH:mm-HH:mm,HH:mm-HH:mm" });
            }

            // แปลง booking_times เป็น List ของช่วงเวลา
            var newBookingTimes = ParseBookingTimes(booking.booking_times);

            // ดึงรายการจองที่มีอยู่ในวันเดียวกันของห้องนี้
            var existingBookings = await _context.RoomBookings
                .Where(b => b.room_id == booking.room_id && b.booking_date == booking.booking_date)
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

            // กำหนดโซนเวลาเป็นไทย
            TimeZoneInfo thaiZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime thaiNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, thaiZone);

            booking.created_at = thaiNow;
            booking.updated_at = thaiNow;

            _context.RoomBookings.Add(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking created successfully", booking });
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



        // ดึงรายการจองห้องทั้งหมด
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _context.RoomBookings.ToListAsync();
            return Ok(bookings);
        }

        // ดึงการจองตาม ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.RoomBookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            return Ok(booking);
        }

        // // อัปเดตข้อมูลการจอง
        // [HttpPut("{id}")]
        // public async Task<IActionResult> UpdateBooking(int id, [FromBody] RoomBooking updateRequest)
        // {
        //     var booking = await _context.RoomBookings.FindAsync(id);
        //     if (booking == null)
        //     {
        //         return NotFound(new { message = "Booking not found" });
        //     }

        //     Console.WriteLine($"Updating Booking ID: {id}");
        //     Console.WriteLine($"New Full Name: {updateRequest.full_name}");
        //     Console.WriteLine($"New Room ID: {updateRequest.room_id}");

        //     booking.full_name = updateRequest.full_name ?? booking.full_name;
        //     booking.room_id = updateRequest.room_id;
        //     booking.booking_date = updateRequest.booking_date;
        //     booking.start_time = updateRequest.start_time;
        //     booking.return_date = updateRequest.return_date;
        //     booking.end_time = updateRequest.end_time;
        //     booking.meeting_topic = updateRequest.meeting_topic ?? booking.meeting_topic;
        //     booking.attendee_count = updateRequest.attendee_count ?? booking.attendee_count;
        //     booking.department = updateRequest.department ?? booking.department;
        //     booking.booking_status = updateRequest.booking_status ?? booking.booking_status;
        //     booking.updated_at = DateTime.UtcNow;

        //     _context.RoomBookings.Update(booking);
        //     await _context.SaveChangesAsync();

        //     return Ok(new { message = "Booking updated successfully", booking });
        // }


        // ลบการจอง
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.RoomBookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound(new { message = "Booking not found" });
            }

            _context.RoomBookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking deleted successfully" });
        }
    }
}
