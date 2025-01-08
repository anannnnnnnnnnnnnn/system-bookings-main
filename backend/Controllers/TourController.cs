using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using System.IO;

namespace YourNamespace.Controllers
{
    [Route("api/tour")]
    [ApiController]
    public class TourController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        public TourController(AppDbContext context)
        {
            _context = context;
        }
        // กำหนดตัวแปร _imageDirectory สำหรับเก็บไฟล์ภาพ
        private readonly string _imageDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

        [HttpPost]
        public async Task<IActionResult> CreateTour([FromForm] Tour request, [FromForm] IFormFile image_url)
        {
            // ตรวจสอบฟิลด์ที่จำเป็น
            if (string.IsNullOrEmpty(request.TourName) || string.IsNullOrEmpty(request.Destination) || request.Price <= 0)
            {
                return BadRequest(new { message = "TourName, Destination, and Price are required." });
            }

            string imagePath = null;
            if (image_url != null)
            {
                // ตรวจสอบว่าโฟลเดอร์ที่เก็บไฟล์มีอยู่หรือไม่
                if (!Directory.Exists(_imageDirectory))
                {
                    Directory.CreateDirectory(_imageDirectory); // สร้างโฟลเดอร์หากยังไม่มี
                }

                var filePath = Path.Combine(_imageDirectory, image_url.FileName);

                // เปลี่ยนชื่อไฟล์หากมีชื่อไฟล์เดียวกัน
                if (System.IO.File.Exists(filePath))
                {
                    var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(image_url.FileName);
                    var extension = Path.GetExtension(image_url.FileName);
                    var counter = 1;

                    do
                    {
                        var newFileName = $"{fileNameWithoutExtension}_{counter}{extension}";
                        filePath = Path.Combine(_imageDirectory, newFileName);
                        counter++;
                    } while (System.IO.File.Exists(filePath));
                }

                // บันทึกไฟล์ลงในโฟลเดอร์
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image_url.CopyToAsync(stream);
                }

                // เก็บ path ของไฟล์ภาพในฐานข้อมูล
                imagePath = "/images/" + Path.GetFileName(filePath);
            }

            // สร้างและบันทึกข้อมูลทัวร์ในฐานข้อมูล
            var tour = new Tour
            {
                TourName = request.TourName,
                Destination = request.Destination,
                Description = request.Description,
                Price = request.Price,
                Inclusions = request.Inclusions,
                image_url = imagePath,  // เก็บ path ของภาพ
            };

            _context.Tours.Add(tour);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tour created successfully",
                tour = tour
            });
        }


        // 2. อ่านข้อมูลทัวร์ทั้งหมด
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tour>>> GetAllTours()
        {
            var tours = await _context.Tours.ToListAsync();
            return Ok(tours);
        }

        // 3. อ่านข้อมูลทัวร์ตาม ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Tour>> GetTourById(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return Ok(tour);
        }

        // 4. แก้ไขข้อมูลทัวร์
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTour(int id, [FromBody] Tour updatedTour)
        {
            if (id != updatedTour.TourId)
            {
                return BadRequest();
            }

            _context.Entry(updatedTour).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TourExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. ลบข้อมูลทัวร์
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTour(int id)
        {
            var tour = await _context.Tours.FindAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            _context.Tours.Remove(tour);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TourExists(int id)
        {
            return _context.Tours.Any(e => e.TourId == id);
        }
    }
}