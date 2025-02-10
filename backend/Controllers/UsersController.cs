using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using YourNamespace.Models;
using System.IO;

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
        public async Task<IActionResult> Register([FromForm] string full_name, [FromForm] string email, [FromForm] string password_hash,
  [FromForm] string phone_number, [FromForm] int? role, [FromForm] string department, [FromForm] IFormFile profile_picture)
        {
            // ตรวจสอบฟิลด์ที่จำเป็น
            if (string.IsNullOrEmpty(full_name) || string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password_hash))
            {
                return BadRequest(new { message = "Full name, email, and password are required." });
            }

            string filePath = null;
            if (profile_picture != null)
            {
                // กำหนดที่เก็บรูปภาพ
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images");

                // สร้างโฟลเดอร์หากไม่มี
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
                var fileName = profile_picture.FileName; // ใช้ชื่อไฟล์ที่ผู้ใช้ส่งมา
                var filePathFull = Path.Combine(uploadsFolder, fileName);

                // อัปโหลดไฟล์ไปยังเซิร์ฟเวอร์
                using (var stream = new FileStream(filePathFull, FileMode.Create))
                {
                    await profile_picture.CopyToAsync(stream);
                }

                // เก็บ relative path สำหรับ URL
                filePath = "/images/" + fileName;
            }

            // สร้าง User object ตามฟิลด์ในตารางฐานข้อมูล
            var user = new User
            {
                full_name = full_name,
                email = email,
                password_hash = password_hash,
                phone_number = phone_number,
                role = role ?? 0, // ถ้าไม่มีค่า role ให้ใช้ค่าเริ่มต้นเป็น 0
                department = department,
                profile_picture = filePath // เก็บที่อยู่ของไฟล์รูปภาพ
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

        // GET: api/users/{userId} - ดึงข้อมูลผู้ใช้ตาม userId
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }
            return Ok(user);
        }

        [HttpGet("by-name")]
        public async Task<IActionResult> GetUserByFullName([FromQuery] string full_name)
        {
            if (string.IsNullOrEmpty(full_name))
                return BadRequest(new { message = "Full name is required" });

            var users = await _context.Users
                .Where(u => u.full_name.Contains(full_name)) // อาจใช้ `==` ถ้าข้อมูลต้องตรงกันเป๊ะ
                .ToListAsync();

            if (users.Count == 0)
                return NotFound(new { message = "User not found" });

            return Ok(users);
        }
        
        // PUT: api/users/{id} - อัปเดตข้อมูลผู้ใช้
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromForm] string full_name, [FromForm] string email, [FromForm] string phone_number,
    [FromForm] int? role, [FromForm] string department, [FromForm] IFormFile profile_picture)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Update the user fields
            user.full_name = full_name ?? user.full_name;
            user.email = email ?? user.email;
            user.phone_number = phone_number ?? user.phone_number;
            user.role = role ?? user.role;
            user.department = department ?? user.department;

            // Update the profile picture (if provided)
            if (profile_picture != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "profile_pictures");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var FileName = Guid.NewGuid() + Path.GetExtension(profile_picture.FileName);
                var filePathFull = Path.Combine(uploadsFolder, FileName);
                using (var stream = new FileStream(filePathFull, FileMode.Create))
                {
                    await profile_picture.CopyToAsync(stream);
                }
                user.profile_picture = "/images/" + profile_picture.FileName; // Updated profile picture path
            }
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully", user });
        }
    }

    // Model สำหรับรับคำขอ (Request)
    public class UsersRequest
    {
        public string full_name { get; set; }
        public string email { get; set; }
        public string password_hash { get; set; }
        public string phone_number { get; set; }
        public int? role { get; set; }
        public string department { get; set; }
        public IFormFile ProfilePicture { get; set; } // ฟิลด์สำหรับอัปโหลดรูปภาพ
    }
}
