using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

namespace RoomNamespace.Controllers
{
    [ApiController]
    [Route("api/rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoomsController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/rooms
        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] RoomRequest request)
        {
            // ตรวจสอบฟิลด์ที่จำเป็น
            if (string.IsNullOrEmpty(request.room_name) || string.IsNullOrEmpty(request.location))
            {
                return BadRequest(new { message = "room_name and location are required." });
            }

            // สร้าง Room object และบันทึกลงในฐานข้อมูล
            var room = new Room
            {
                room_name = request.room_name,
                capacity = request.capacity ?? 0,
                equipment = request.equipment,
                location = request.location,
                status = request.status ?? 1,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Room created successfully",
                room = room
            });
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

        // PUT: api/rooms/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomRequest request)
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
    }

    // Model สำหรับรับคำขอ (Request) สำหรับข้อมูลห้องประชุม
    public class RoomRequest
    {
        public string? room_name { get; set; }
        public int? capacity { get; set; }
        public string? equipment { get; set; }
        public string? location { get; set; }
        public int? status { get; set; }
    }
}
