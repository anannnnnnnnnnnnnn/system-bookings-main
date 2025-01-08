using System.ComponentModel.DataAnnotations;

namespace YourNamespace.Models
{
    public class Reservation
    {
        [Key]  // ระบุว่า reservation_id เป็น Primary Key
        public int? reservation_id { get; set; }  // Primary Key

        public int? car_id { get; set; }  // ห้ามเป็น NULL
        public DateTime start_date { get; set; }  // เปลี่ยนจาก string เป็น DateTime
        public DateTime end_date { get; set; }  // เปลี่ยนจาก string เป็น DateTime
        public int? status { get; set; } = 1;  // สามารถเป็น NULL ได้ แต่มีค่าเริ่มต้นเป็น 1
        public DateTime created_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp()
        public DateTime updated_at { get; set; } = DateTime.UtcNow;  // ค่าเริ่มต้นเป็น current_timestamp() และ ON UPDATE CURRENT_TIMESTAMP()
    }
}
