using Microsoft.EntityFrameworkCore;
using YourNamespace.Models; // นำเข้า User class

namespace YourNamespace.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }   
    }
}
