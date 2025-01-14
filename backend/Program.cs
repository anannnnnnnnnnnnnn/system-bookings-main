using Microsoft.EntityFrameworkCore;
using YourNamespace.Data;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],   // อ่านค่าจาก appsettings.json
            ValidAudience = builder.Configuration["Jwt:Audience"], // อ่านค่าจาก appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])) // อ่านคีย์จาก appsettings.json
        };
    });

var app = builder.Build(); 
app.UseAuthentication(); // ตรวจสอบ JWT token
app.UseAuthorization();  // ตรวจสอบสิทธิ์ของผู้ใช้


app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseRouting();

app.MapControllers();

app.Run();