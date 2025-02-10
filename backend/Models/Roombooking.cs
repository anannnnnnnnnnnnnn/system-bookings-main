using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class RoomBooking
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int roombooking_id { get; set; } // Primary Key, Auto Increment

    [Required]
    [MaxLength(20)]
    public string? roombooking_number { get; set; }

    [Required]
    [MaxLength(150)]
    public string? full_name { get; set; }

    [Required]
    public int room_id { get; set; } // Foreign Key

    [Required]
    public DateTime booking_date { get; set; }


    [Required]
    public DateTime return_date { get; set; }
    
    [Required]
    [MaxLength(100)] // จำกัดความยาวของ string
    public string booking_times { get; set; } = ""; // เช่น "10:00-11:00,14:00-15:00"


    public string meeting_topic { get; set; } = "ไม่ได้ระบุ";

    public int? attendee_count { get; set; }

    public string department { get; set; } = "ไม่ได้ระบุ";

    [Required]
    public DateTime created_at { get; set; } = DateTime.UtcNow;

    [Required]
    public DateTime updated_at { get; set; } = DateTime.UtcNow;

    public int? booking_status { get; set; } = 1;

}