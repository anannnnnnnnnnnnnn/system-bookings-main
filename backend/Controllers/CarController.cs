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
        public async Task<IActionResult> CreateCar([FromForm] CarRequest request, IFormFile? image)
        {
            // ตรวจสอบข้อมูลที่จำเป็น
            if (string.IsNullOrEmpty(request.brand) || string.IsNullOrEmpty(request.model) || string.IsNullOrEmpty(request.license_plate))
            {
                return BadRequest(new { message = "brand, model, and license_plate are required." });
            }

            string? imagePath = null;
            if (image != null)
            {
                // สร้างโฟลเดอร์สำหรับเก็บรูปภาพหากไม่มี
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // ตั้งชื่อไฟล์รูปภาพให้ไม่ซ้ำกัน
                var fileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                // บันทึกรูปภาพ
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // เก็บเส้นทางรูปภาพ
                imagePath = "/images/" + fileName;
            }

            // สร้างอ็อบเจกต์รถยนต์
            var car = new Car
            {
                brand = request.brand,
                model = request.model,
                license_plate = request.license_plate,
                seating_capacity = request.seating_capacity ?? 0,
                fuel_type = request.fuel_type ?? 1,
                status = request.status ?? 1,
                image_url = imagePath,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            // เพิ่มข้อมูลรถยนต์ในฐานข้อมูล
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
public async Task<IActionResult> UpdateCar(int id, [FromForm] CarRequest request, IFormFile? image)
{
    // ค้นหารถในฐานข้อมูล
    var car = await _context.Cars.FindAsync(id);
    if (car == null)
    {
        return NotFound(new { message = "Car not found." });
    }

    // อัปเดตข้อมูลรถยนต์
    car.brand = request.brand ?? car.brand;
    car.model = request.model ?? car.model;
    car.license_plate = request.license_plate ?? car.license_plate;
    car.seating_capacity = request.seating_capacity ?? car.seating_capacity;
    car.fuel_type = request.fuel_type ?? car.fuel_type;
    car.status = request.status ?? car.status;
    car.updated_at = DateTime.UtcNow;

    // หากมีการอัปโหลดภาพ ให้บันทึกภาพ
    if (image != null)
    {
        car.image_url = await SaveImage(image); // ใช้ฟังก์ชันในการจัดการการอัปโหลดรูปภาพ
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    _context.Cars.Update(car);
    await _context.SaveChangesAsync();

    // ส่งข้อความยืนยันว่าอัปเดตสำเร็จ
    return Ok(new { message = "Car updated successfully", car });
}

// ฟังก์ชันที่จัดการการอัปโหลดรูปภาพ
private async Task<string> SaveImage(IFormFile image)
{
    if (image == null)
    {
        return null; // หากไม่มีภาพให้ส่งค่า null
    }

    // สร้างโฟลเดอร์สำหรับเก็บไฟล์หากไม่มี
    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
    if (!Directory.Exists(uploadsFolder))
    {
        Directory.CreateDirectory(uploadsFolder);
    }

    // ตั้งชื่อไฟล์ให้ไม่ซ้ำกัน
    var fileName = $"{Guid.NewGuid()}_{image.FileName}";
    var filePath = Path.Combine(uploadsFolder, fileName);

    // บันทึกไฟล์
    using (var stream = new FileStream(filePath, FileMode.Create))
    {
        await image.CopyToAsync(stream);
    }

    // คืนค่า URL ของไฟล์ที่อัปโหลด
    return "/images/" + fileName;
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
    public class CarRequest
    {
        public string brand { get; set; }
        public string model { get; set; }
        public string license_plate { get; set; }
        public int? seating_capacity { get; set; }
        public int? fuel_type { get; set; }
        public int? status { get; set; }
    }

}
