using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/cars")]  // ปรับเป็น '/api/cars'
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
            [FromForm] int? seating_capacity, [FromForm] int? fuel_type, [FromForm] int? status, [FromForm] IFormFile image_url)
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
                imagePath = "/images/" + image_url.FileName; // เก็บ path ลงใน image_url
            }

            var car = new Car
            {
                brand = brand,
                model = model,
                license_plate = license_plate,
                seating_capacity = seating_capacity ?? 0,
                fuel_type = fuel_type ?? 0,
                status = status ?? 1,  // Default status to 1 if not provided
                image_url = imagePath,  // ปรับตรงนี้
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car created successfully", car });
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

        // PUT: api/cars/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCar(int id, [FromForm] string brand, [FromForm] string model, [FromForm] string license_plate,
            [FromForm] int? seating_capacity, [FromForm] int? fuel_type, [FromForm] int? status, [FromForm] IFormFile image_url)
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
                car.image_url = "/images/" + image_url.FileName;  // ปรับตรงนี้
            }

            car.updated_at = DateTime.UtcNow;

            _context.Cars.Update(car);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Car updated successfully", car });
        }

        // // GET: api/cars/available
        // [HttpGet("available")]
        // public async Task<IActionResult> GetAvailableCars()
        // {
        //     var availableCars = await _context.Cars
        //         .Select(car => new
        //         {
        //             car.car_id,  // ใช้ชื่อฟิลด์ที่ถูกต้อง car_id
        //             car.brand,   // ใช้ชื่อฟิลด์ที่ถูกต้อง brand
        //             car.model,   // ใช้ชื่อฟิลด์ที่ถูกต้อง model
        //             car.license_plate,  // ใช้ชื่อฟิลด์ที่ถูกต้อง license_plate
        //             Status = car.status == 1 ? "ว่าง" : "ไม่ว่าง", // แปลงสถานะ 1 เป็น "ว่าง" และ 2 เป็น "ไม่ว่าง"
        //             car.image_url  // ใช้ชื่อฟิลด์ที่ถูกต้อง image_url
        //         })
        //         .ToListAsync();

        //     if (!availableCars.Any())
        //     {
        //         return NotFound(new { message = "No available cars found." });
        //     }

        //     return Ok(availableCars);
        // }


    }
}
