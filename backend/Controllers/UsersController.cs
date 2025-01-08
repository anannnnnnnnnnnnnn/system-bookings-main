using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class RegisterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RegisterController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/users (สำหรับการลงทะเบียนผู้ใช้)
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UsersRequest request)
        {
            // ตรวจสอบฟิลด์ที่จำเป็น
            if (string.IsNullOrEmpty(request.full_name) || string.IsNullOrEmpty(request.email) || string.IsNullOrEmpty(request.password_hash))
            {
                return BadRequest(new { message = "Full name, email, and password are required." });
            }

            // สร้าง User object ตามฟิลด์ในตารางฐานข้อมูล
            var user = new User
            {
                full_name = request.full_name,
                email = request.email,
                password_hash = request.password_hash,
                phone_number = request.phone_number,
                role = request.role ?? 0 // ถ้าไม่มีค่า role ให้ใช้ค่าเริ่มต้นเป็น 0
            };

            // บันทึกข้อมูลลงในฐานข้อมูล
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User registered successfully",
                user = user
            });
        }

        // GET: api/users (ดึงข้อมูลผู้ใช้ทั้งหมด)
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync(); // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล

            if (users == null || users.Count == 0)
            {
                return NotFound(new { message = "No users found." });
            }

            return Ok(users);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UsersRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            user.full_name = request.full_name ?? user.full_name;
            user.email = request.email ?? user.email;
            user.phone_number = request.phone_number ?? user.phone_number;
            user.role = request.role ?? user.role;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully", user });
        }

    }

    // Model สำหรับรับคำขอ (Request)
    public class UsersRequest
    {
        public string? full_name { get; set; }
        public string? email { get; set; }
        public string? password_hash { get; set; }
        public string? phone_number { get; set; }
        public int? role { get; set; }
    }
}
