using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Threading.Tasks;

namespace RoomNamespace.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public RoomsController(AppDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // POST: api/rooms (เพิ่มห้องพร้อมรูปภาพ)
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromForm] RoomRequest request, IFormFile? image)
        {
            if (string.IsNullOrEmpty(request.room_name) || string.IsNullOrEmpty(request.location))
            {
                return BadRequest(new { message = "room_name and location are required." });
            }

            string? imagePath = null;
            if (image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = $"{Guid.NewGuid()}_{image.FileName}"; // ป้องกันไฟล์ซ้ำ
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imagePath = "/images/" + fileName; // ใช้ไฟล์ที่สร้างใหม่
            }

            var room = new Room
            {
                room_name = request.room_name,
                equipment = request.equipment ?? string.Empty,
                capacity = request.capacity ?? 0,
                location = request.location,
                room_img = imagePath,
                status = request.status ?? 1,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Room created successfully", room });
        }

        // GET: api/rooms
        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();
            if (rooms == null || rooms.Count == 0)
            {
                return NotFound(new { message = "No rooms found." });
            }
            return Ok(rooms);
        }

        // GET: api/rooms/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found." });
            }
            return Ok(room);
        }

        // PUT: api/rooms/{id} (อัปเดตรูปภาพได้ด้วย)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromForm] RoomRequest request, IFormFile? image)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found." });
            }

            room.room_name = request.room_name ?? room.room_name;
            room.capacity = request.capacity ?? room.capacity;
            room.equipment = request.equipment ?? room.equipment;
            room.location = request.location ?? room.location;
            room.status = request.status ?? room.status;
            room.updated_at = DateTime.UtcNow;

            if (image != null)
            {
                room.room_img = await SaveImage(image);
            }

            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Room updated successfully", room });
        }

        // DELETE: api/rooms/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Room not found." });
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Room deleted successfully" });
        }

        private async Task<string> SaveImage(IFormFile image)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return "/uploads/" + uniqueFileName;
        }

        [HttpGet("date")]
        public async Task<IActionResult> GetBookingDatesAndTimesByRoom([FromQuery] int roomId)
        {
            try
            {
                var today = DateTime.Today; // เวลาปัจจุบัน (ตามเซิร์ฟเวอร์)

                var bookings = await _context.RoomBookings
                    .Where(b => b.room_id == roomId
                                && b.booking_date != null
                                && b.return_date != null
                                && b.return_date >= today)
                    .Select(b => new
                    {
                        roomBookingDate = b.booking_date,
                        roomReturnDate = b.return_date,
                        roomBookingTime = b.booking_times,
                    })
                    .ToListAsync();

                if (bookings == null || bookings.Count == 0)
                {
                    return NotFound("ไม่พบข้อมูลการจองสำหรับห้องนี้.");
                }

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }

    public class RoomRequest
    {
        public string? room_name { get; set; }
        public int? capacity { get; set; }
        public string? equipment { get; set; }
        public string? location { get; set; }
        public int? status { get; set; }
    }
}
