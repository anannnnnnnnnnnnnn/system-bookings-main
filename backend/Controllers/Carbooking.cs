    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using YourNamespace.Data;
    using YourNamespace.Models;
    using Newtonsoft.Json; // นำเข้าไลบรารี


    namespace YourNamespace.Controllers
    {
        [ApiController]
        [Route("api/bookings")]
        public class BookingController : ControllerBase
        {
            private readonly AppDbContext _context;

            public BookingController(AppDbContext context)
            {
                _context = context;
            }

            // GET: api/bookings/search?status=1 (รถที่ว่าง)
            // GET: api/bookings/search?status=2 (รถที่ไม่ว่าง)
            // GET: api/bookings/search (แสดงทุกสถานะ)
            [HttpGet("search")]
            public async Task<IActionResult> GetCarsByStatus([FromQuery] int? status)
            {
                var carsQuery = _context.Cars.AsQueryable();

                // หากมีการระบุสถานะ ก็จะกรองตามสถานะที่ส่งมา
                if (status.HasValue)
                {
                    carsQuery = carsQuery.Where(car => car.status == status.Value);
                }

                var cars = await carsQuery
                    .Select(car => new
                    {
                        car.car_id,
                        car.brand,
                        car.model,
                        car.license_plate,
                        car.seating_capacity,
                        car.fuel_type,
                        car.image_url,
                        car.status // แสดงสถานะของรถ
                    })
                    .ToListAsync();

                if (!cars.Any())
                {
                    return NotFound(new { message = "No cars found." });
                }

                return Ok(cars);
            }

            [HttpGet]
            public async Task<IActionResult> GetBookings()
            {
                try
                {
                    // ดึงข้อมูลการจองทั้งหมดจากฐานข้อมูลใหม่
                    var bookings = await _context.Carbookings.AsNoTracking().ToListAsync();

                    // ส่งข้อมูลทั้งหมดกลับในรูปแบบ JSON
                    return Ok(bookings);
                }
                catch (Exception ex)
                {
                    // ส่งข้อผิดพลาดถ้ามี
                    return StatusCode(500, new { message = "An error occurred while retrieving bookings.", error = ex.Message });
                }
            }

            [HttpPost]
            public async Task<IActionResult> CreateBooking([FromBody] Carbooking carbooking)
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                                            .SelectMany(v => v.Errors)
                                            .Select(e => e.ErrorMessage)
                                            .ToList();
                    return BadRequest(new { message = "Validation failed", errors });
                }

                if (carbooking.booking_date == null || carbooking.return_date == null)
                {
                    return BadRequest(new { message = "Booking date and return date are required." });
                }

                var bookingStart = carbooking.booking_date.Value.Add(carbooking.booking_time ?? TimeSpan.Zero);
                var bookingEnd = carbooking.return_date.Value.Add(carbooking.return_time ?? TimeSpan.Zero);

                if (bookingStart >= bookingEnd)
                {
                    return BadRequest(new { message = "Return date and time must be after booking date and time." });
                }

                // ตรวจสอบว่ารถมีอยู่จริงหรือไม่
                var carExists = await _context.Cars.AnyAsync(c => c.car_id == carbooking.car_id);
                if (!carExists)
                {
                    return BadRequest(new { message = "Car not found." });
                }

                var carBookings = await _context.Carbookings
                    .Where(b => b.car_id == carbooking.car_id && b.booking_status == 1)
                    .ToListAsync();

                var isOverlapping = carBookings
                    .Any(b =>
                        b.booking_date.HasValue && b.return_date.HasValue &&
                        b.booking_date.Value.Add(b.booking_time ?? TimeSpan.Zero) < bookingEnd &&
                        b.return_date.Value.Add(b.return_time ?? TimeSpan.Zero) > bookingStart);

                if (isOverlapping)
                {
                    return BadRequest(new { message = "This car is already booked for the selected time slot." });
                }

                if (string.IsNullOrEmpty(carbooking.booking_number))
                {
                    carbooking.booking_number = "BN" + DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                }

                if (carbooking.confirmation_id == 0)
                {
                    var lastBooking = await _context.Carbookings
                        .OrderByDescending(b => b.confirmation_id)
                        .FirstOrDefaultAsync();

                    carbooking.confirmation_id = (lastBooking?.confirmation_id ?? 0) + 1;
                }

                carbooking.booking_status = 1;
                carbooking.created_at = DateTime.UtcNow;
                carbooking.updated_at = DateTime.UtcNow;

                // ✅ แก้ปัญหา: อย่าแนบ Car
                carbooking.Car = null;

                _context.Carbookings.Add(carbooking);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetBookingByConfirmationId),
                                        new { confirmation_id = carbooking.confirmation_id },
                                        new
                                        {
                                            message = "Booking created successfully",
                                            confirmation_id = carbooking.confirmation_id,
                                            booking = carbooking
                                        });
            }

            [HttpGet("{confirmation_id}")]
            public async Task<IActionResult> GetBookingByConfirmationId(int confirmation_id)
            {
                // ค้นหาการจองที่มี confirmation_id ตรงกับ id
                var carbooking = await _context.Carbookings
                                            .Where(b => b.confirmation_id == confirmation_id)
                                            .FirstOrDefaultAsync();
                if (carbooking == null)
                {
                    return NotFound(new { message = "Booking not found" });
                }

                return Ok(carbooking);  // คืนค่าข้อมูลการจองที่พบ
            }

            [HttpPut("{id}/approve")]
            public async Task<IActionResult> ApproveBooking(int id)
            {
                var carbooking = await _context.Carbookings.FindAsync(id);
                if (carbooking == null) return NotFound();

                if (carbooking.booking_status != 1)
                {
                    return BadRequest(new { message = "Booking is not in pending status" });
                }

                carbooking.booking_status = 2; // อัปเดตสถานะ
                await _context.SaveChangesAsync(); // บันทึกการเปลี่ยนแปลง

                return Ok(new { message = "Booking approved" });
            }

            [HttpPut("{id}/reject")]
            public async Task<IActionResult> RejectBooking(int id, [FromBody] RejectBookingDto rejectDto)
            {
                var booking = await _context.Carbookings.FindAsync(id);
                if (booking == null) return NotFound();

                booking.booking_status = 3; // เปลี่ยนสถานะเป็น "ปฏิเสธ"
                booking.reject_reason = rejectDto.RejectReason; // บันทึกเหตุผลปฏิเสธ
                booking.updated_at = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Booking rejected", reject_reason = booking.reject_reason });
            }

            [HttpDelete("{id}")]
            public async Task<IActionResult> CancelBooking(int id)
            {
                var booking = await _context.Carbookings.FirstOrDefaultAsync(b => b.confirmation_id == id);

                if (booking == null)
                {
                    return NotFound(new { message = "Booking not found." });
                }

                // Change car status back to available (status = 1)
                var car = await _context.Cars.FirstOrDefaultAsync(c => c.car_id == booking.car_id);
                if (car != null)
                {
                    car.status = 1; // Set the car status back to available
                }

                // Remove the booking
                _context.Carbookings.Remove(booking);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Booking cancelled successfully." });
            }

            [HttpGet("unavailable-times")]
            public IActionResult GetUnavailableTimes(int carId, DateTime bookingDate)
            {
                // ดึงข้อมูลการจองของรถในวันเดียวกัน
                var bookings = _context.Carbookings
                    .Where(b => b.car_id == carId && b.booking_date == bookingDate.Date) // เปรียบเทียบเฉพาะวันที่
                    .Select(b => new
                    {
                        startTime = b.booking_time, // เวลาเริ่มต้นจอง
                        endTime = b.return_time    // เวลาคืนรถ
                    })
                    .ToList();

                // ส่งรายการเวลาที่ไม่ว่างกลับไป
                return Ok(bookings);
            }
        }
        public class RejectBookingDto
        {
            public string RejectReason { get; set; } = string.Empty;
        }

    }