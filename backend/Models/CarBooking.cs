using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // ใช้ AUTO_INCREMENT
        public int confirmation_id { get; set; } // Primary Key

        [Required]
        [MaxLength(20)] // จำกัดความยาวของ booking_number
        public string? booking_number { get; set; } // หมายเลขการจอง

        [Required]
        [MaxLength(150)] // จำกัดความยาวของชื่อผู้จอง
        public string? full_name { get; set; } // ชื่อผู้จอง

        [Required]
        public int car_id { get; set; } // รหัสรถ (Foreign Key)

        [Required]
        [Column(TypeName = "date")]
        public DateTime booking_date { get; set; } // วันที่จอง

        [Column(TypeName = "text")]
        public string? purpose { get; set; } = "ไม่ได้ระบุ"; // วัตถุประสงค์ (Nullable)

        [Column(TypeName = "text")]
        public string? destination { get; set; } = "ไม่ได้ระบุ"; // จุดหมายปลายทาง (Nullable)

        public int? passenger_count { get; set; } // จำนวนผู้โดยสาร (Nullable)

        [MaxLength(100)]
        public string? department { get; set; } = "ไม่ได้ระบุ"; // แผนก (Nullable)

        public int? driver_required { get; set; } = 0; // ต้องการคนขับ (0: ไม่ต้องการ, 1: ต้องการ)

        [Column(TypeName = "timestamp")]
        public DateTime created_at { get; set; } = DateTime.UtcNow; // วันที่สร้าง

        [Column(TypeName = "timestamp")]
        public DateTime updated_at { get; set; } = DateTime.UtcNow; // วันที่อัปเดต
    }
}
