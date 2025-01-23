using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarbookingController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarbookingController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Carbooking
        [HttpGet]
        public async Task<IActionResult> GetAllBookings()
        {
            // ดึงข้อมูลแบบไม่แคช
            var bookings = await _context.Carbookings
                .AsNoTracking() // ใช้ AsNoTracking เพื่อให้แน่ใจว่าเป็นข้อมูลล่าสุด
                .ToListAsync();
            return Ok(bookings);
        }

        // GET: api/Carbooking/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookingById(int id)
        {
            var booking = await _context.Carbookings
                .AsNoTracking() // ดึงข้อมูลแบบไม่แคช
                .FirstOrDefaultAsync(b => b.confirmation_id == id);

            if (booking == null)
                return NotFound(new { message = "Booking not found" });

            return Ok(booking);
        }

        // PUT: api/Carbooking/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] int newStatus)
        {
            var booking = await _context.Carbookings.FindAsync(id);

            if (booking == null)
                return NotFound(new { message = "Booking not found" });

            // อัปเดตสถานะและเวลาอัปเดตล่าสุด
            booking.status = newStatus;
            booking.updated_at = DateTime.UtcNow;

            await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลงลงฐานข้อมูล

            return Ok(new { message = "Status updated successfully", booking });
        }
    }
}
