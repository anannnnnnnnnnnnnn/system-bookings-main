using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}