using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/cars")]
    public class CarController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/cars
        [HttpPost]
        public async Task<IActionResult> CreateCar([FromForm] string brand, [FromForm] string model, [FromForm] string license_plate,
            [FromForm] int? seating_capacity, [FromForm] int? fuel_type, [FromForm] int? status, [FromForm] int type, [FromForm] IFormFile image_url)
        {
            if (string.IsNullOrEmpty(brand) || string.IsNullOrEmpty(model) || string.IsNullOrEmpty(license_plate))
            {
                return BadRequest(new { message = "Brand, Model, and License Plate are required." });
            }

            string imagePath = null;
            if (image_url != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, image_url.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image_url.CopyToAsync(stream);
                }
                imagePath = "/images/" + image_url.FileName;
            }

            var car = new Car
            {
                brand = brand,
                model = model,
                license_plate = license_plate,
                seating_capacity = seating_capacity ?? 0,
                fuel_type = fuel_type ?? 0,
                status = status ?? 1,
                type = type,  // เพิ่มประเภทของรถ
                image_url = imagePath,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car created successfully", car });
        }
        
        [HttpGet("date")]
        public async Task<IActionResult> GetBookingDatesAndTimesByCar([FromQuery] int carId)
        {
            var today = DateTime.Today; // เวลาปัจจุบัน (ตามเซิร์ฟเวอร์)

            var bookings = await _context.Carbookings
                .Where(b => b.car_id == carId
                            && b.booking_date != null
                            && b.return_date != null
                            && b.return_date >= today) // ✅ กรองเฉพาะที่ยังไม่หมดอายุ
                .Select(b => new
                {
                    BookingDate = b.booking_date,
                    BookingTime = b.booking_time,
                    ReturnDate = b.return_date,
                    ReturnTime = b.return_time
                })
                .ToListAsync();
                
            return Ok(bookings);
        }

        // PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, [FromForm] string brand, [FromForm] string model, [FromForm] string license_plate,
            [FromForm] int? seating_capacity, [FromForm] int? fuel_type, [FromForm] int? status, [FromForm] int? type, [FromForm] IFormFile image_url)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound(new { message = "Car not found." });
            }

            // Update the fields
            car.brand = brand ?? car.brand;
            car.model = model ?? car.model;
            car.license_plate = license_plate ?? car.license_plate;
            car.seating_capacity = seating_capacity ?? car.seating_capacity;
            car.fuel_type = fuel_type ?? car.fuel_type;
            car.status = status ?? car.status;
            car.type = type ?? car.type;  // อัปเดตประเภทของรถ
            

            if (image_url != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, image_url.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image_url.CopyToAsync(stream);
                }
                car.image_url = "/images/" + image_url.FileName;
            }

            car.updated_at = DateTime.UtcNow;

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car updated successfully", car });
        }

        // GET: api/cars
        [HttpGet]
        public async Task<IActionResult> GetCars()
        {
            var cars = await _context.Cars.ToListAsync();
            return Ok(cars);
        }

        // GET: api/cars/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCarById(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound(new { message = "Car not found." });
            }

            return Ok(car);
        }

        // DELETE: api/cars/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound(new { message = "Car not found." });
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car deleted successfully." });
        }
    }
}
