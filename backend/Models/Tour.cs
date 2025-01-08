namespace YourNamespace.Models
{
    public class Tour
    {
        public int TourId { get; set; }  // รหัสทัวร์
        public string TourName { get; set; }  // ชื่อทัวร์
        public string Destination { get; set; }  // สถานที่ท่องเที่ยว
        public string Description { get; set; }  // รายละเอียดทัวร์
        public decimal Price { get; set; }  // ราคา
        public string Inclusions { get; set; }  // สิ่งที่รวมในทัวร์
        public string image_url { get; set; }  // เปลี่ยนชื่อฟิลด์เป็น image_url
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // วันที่สร้าง
        public DateTime UpdatedAt { get; set; } = DateTime.Now;  // วันที่อัปเดต
    }
}
