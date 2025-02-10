using System.ComponentModel.DataAnnotations;

namespace YourNamespace.Models
{
    public class Car
    {
        [Key]  // ระบุว่า car_id เป็น Primary Key
        public int car_id { get; set; }  // Primary Key ไม่สามารถเป็น NULL

        public string? brand { get; set; }  // ห้ามเป็น NULL
        public string? model { get; set; }  // ห้ามเป็น NULL
        public string? license_plate { get; set; }  // ห้ามเป็น NULL

        public int seating_capacity { get; set; }  // ห้ามเป็น NULL
        public int fuel_type { get; set; }  // ห้ามเป็น NULL
        public int? status { get; set; } = 1;  // สามารถเป็น NULL ได้ แต่มีค่าเริ่มต้นเป็น 1

        public string? image_url { get; set; }

        public DateTime created_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp()
        public DateTime updated_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp() และ ON UPDATE CURRENT_TIMESTAMP()

        // เพิ่มคอลัมน์ประเภทของรถ
        public int type { get; set; }  // ประเภทของรถ (1=รถทั่วไป, 2=รถตู้, 3=รถกระบะ)
        
    }
}
