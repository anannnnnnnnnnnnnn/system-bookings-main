public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();

        // Add CORS policy
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins", policy =>
            {
                policy.AllowAnyOrigin() // อนุญาตให้ทุกโดเมนเข้าถึง
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });

        var app = builder.Build();

        // Use CORS policy before UseRouting()
        app.UseCors("AllowAllOrigins");

        app.UseRouting();  // เรียกใช้ routing หลังจาก CORS

        app.MapControllers();

        app.Run();
    }
}
