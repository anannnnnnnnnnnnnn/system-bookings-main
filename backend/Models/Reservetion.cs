public class Reservation
{
    public int ReservationId { get; set; }
    public int CarId { get; set; }  // เปลี่ยนจาก car_id เป็น CarId
    public DateTime BookingDate { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public DateTime? ReturnDate { get; set; }
    public DateTime? ReturnTime { get; set; }
    public int OverdueTime { get; set; }
    public decimal OverdueFee { get; set; }
    public int Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
