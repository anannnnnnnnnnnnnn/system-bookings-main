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
