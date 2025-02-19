using System.ComponentModel.DataAnnotations;

namespace YourNamespace.Models
{
    public class Room
    {
        [Key]  // ระบุว่า room_id เป็น Primary Key
        public int room_id { get; set; }  // Primary Key

        [Required]  // ระบุว่า room_name ห้ามเป็น NULL
        public string? room_name { get; set; }

        [Required]  // ระบุว่า capacity ห้ามเป็น NULL
        public int capacity { get; set; }

        public string? equipment { get; set; }  // สามารถเป็น NULL ได้

        [Required]  // ระบุว่า location ห้ามเป็น NULL
        public string? location { get; set; }
        public string? room_img { get; set; }

        public int status { get; set; } = 1;  // มีค่าเริ่มต้นเป็น 1

        public int room_type { get; set; }        

        public DateTime created_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp()
        public DateTime updated_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp() และ ON UPDATE CURRENT_TIMESTAMP()
    }
}
