using Microsoft.EntityFrameworkCore;
using YourNamespace.Models; // นำเข้า User class

namespace YourNamespace.Data

{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; } // เปลี่ยน Users เป็นชื่อจริงในฐานข้อมูล
        public DbSet<Car> Cars { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<Carbooking> Carbookings { get; set; }


    }
}