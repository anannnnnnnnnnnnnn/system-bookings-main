using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace YourNamespace.Data
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.email == request.Email && u.password_hash == request.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(new
            {
                message = "Login successful",
                role = user.role,
                userId = user.Id,
                fullName = user.full_name,
                department = user.department
            });
        }

        // GET สำหรับดึงข้อมูลผู้ใช้ทั้งหมด
        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();

            if (users == null || users.Count == 0)
            {
                return NotFound(new { message = "No users found" });
            }

            return Ok(users);
        }
    }

    // Model สำหรับรับข้อมูลการ Login
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
