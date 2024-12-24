using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private static List<Booking> Bookings = new List<Booking>();

    // POST: api/booking
    [HttpPost]
    public IActionResult AddBooking([FromBody] Booking booking)
    {
        // กำหนด ID ให้กับการจองใหม่
        booking.Id = Bookings.Count == 0 ? 1 : Bookings.Max(b => b.Id) + 1;
        Bookings.Add(booking);
        return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
    }

    // GET: api/booking
    [HttpGet]
    public IActionResult GetBookings()
    {
        return Ok(Bookings);
    }

    // GET: api/booking/{id}
    [HttpGet("{id}")]
    public IActionResult GetBookingById(int id)
    {
        var booking = Bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found!" });
        }
        return Ok(booking);
    }

    
    // DELETE: api/booking/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteBooking(int id)
    {
        var booking = Bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found!" });
        }

        // ลบ booking ที่พบ
        Bookings.Remove(booking);

        // แสดงผลการลบ
        return Ok(new { Message = "Booking deleted successfully!" });
    }

    // PUT: api/booking/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateBooking(int id, [FromBody] Booking updatedBooking)
    {
        var booking = Bookings.FirstOrDefault(b => b.Id == id);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found!" });
        }

        // อัปเดตข้อมูลการจอง
        booking.carId = updatedBooking.carId;
        booking.date = updatedBooking.date;
        booking.userName = updatedBooking.userName;
        booking.userPhone = updatedBooking.userPhone;

        return Ok(new { Message = "Booking updated successfully!" });
    }
}

public class Booking
{
    public int Id { get; set; } // ID สำหรับการจอง
    public string carId { get; set; } // ID ของรถ
    public DateTime date { get; set; } // วันที่จอง (เปลี่ยนเป็น DateTime)
    public string userName { get; set; } // ชื่อผู้จอง
    public string userPhone { get; set; } // เบอร์โทรศัพท์ของผู้จอง
}
