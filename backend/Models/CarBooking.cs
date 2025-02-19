using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace YourNamespace.Models
{
    public class Carbooking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int confirmation_id { get; set; }

        [Required]
        [MaxLength(20)]
        public string? booking_number { get; set; }

        [Required]
        [MaxLength(150)]
        public string? full_name { get; set; }

        [Required]
        [ForeignKey("Car")]  // ใช้ ForeignKey ชี้ไปที่ Car
        public int car_id { get; set; }

        public DateTime? booking_date { get; set; }
        public TimeSpan? booking_time { get; set; }
        public DateTime? return_date { get; set; }
        public TimeSpan? return_time { get; set; }
        public string purpose { get; set; } = "ไม่ได้ระบุ";
        public string destination { get; set; } = "ไม่ได้ระบุ";
        public int? passenger_count { get; set; }
        public string department { get; set; } = "ไม่ได้ระบุ";
        public int driver_required { get; set; } = 0;
        public int booking_status { get; set; } = 1;
        public string? reject_reason { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;
        public DateTime updated_at { get; set; } = DateTime.UtcNow;

        // Navigation Property (ให้ EF เข้าใจว่าเป็นความสัมพันธ์)
        public virtual Car? Car { get; set; }
    }
}