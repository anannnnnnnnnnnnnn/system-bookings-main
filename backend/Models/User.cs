using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class User
{
    public int Id { get; set; }
    public string? full_name { get; set; }
    public string? email { get; set; }
    public string? password_hash { get; set; }
    public string? phone_number { get; set; }
    public int role { get; set; }
    public string? department { get; set; }
     public string? profile_picture { get; set; } // ฟิลด์ใหม่สำหรับเก็บรูปภาพ
    }
}
