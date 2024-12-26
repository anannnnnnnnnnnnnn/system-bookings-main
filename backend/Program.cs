using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://localhost:3000")  
            .AllowAnyMethod()  
            .AllowAnyHeader();
    });
});

// เชื่อมต่อกับฐานข้อมูล MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        "server=localhost;database=systemcar_room;user=root;password='';",
        new MySqlServerVersion(new Version(8, 0, 21))
    ));


builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowAll");  

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.MapControllers();  

app.Run();