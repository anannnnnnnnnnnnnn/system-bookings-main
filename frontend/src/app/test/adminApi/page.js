'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [editBooking, setEditBooking] = useState(null);
  const [formData, setFormData] = useState({
    carId: "",
    date: "",
    userName: "",
    userPhone: "",
  });

  useEffect(() => {
    // Fetch bookings
    axios.get("http://localhost:5094/api/booking")
      .then((response) => setBookings(response.data))
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const handleEdit = (booking) => {
    setEditBooking(booking);
    setFormData({
      carId: booking.carId,
      date: booking.date,
      userName: booking.userName,
      userPhone: booking.userPhone,
    });
  };

  const handleDelete = async (bookingId) => {
    try {
      // ส่งคำขอลบข้อมูลไปยัง API
      const response = await axios.delete(`http://localhost:5094/api/booking/${bookingId}`);
      // ลบข้อมูลใน state ทันที
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
      alert(response.data.Message);  // แสดงข้อความจาก API
    } catch (error) {
      alert("Failed to delete booking.");
      console.error("Error deleting booking:", error);
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBooking) {
      // Update booking
      try {
        const response = await axios.put(`http://localhost:5094/api/booking/${editBooking.id}`, formData);
        setBookings(bookings.map((booking) =>
          booking.id === editBooking.id ? { ...booking, ...formData } : booking
        ));
        alert(response.data.Message);
        setEditBooking(null);
      } catch (error) {
        alert("Failed to update booking.");
        console.error("Error updating booking:", error);
      }
    } else {
      // Add new booking
      try {
        const response = await axios.post("http://localhost:5094/api/booking", formData);
        setBookings([...bookings, { ...formData, id: bookings.length + 1 }]);
        alert(response.data.Message);
      } catch (error) {
        alert("Failed to add booking.");
        console.error("Error adding booking:", error);
      }
    }
    setFormData({ carId: "", date: "", userName: "", userPhone: "" });
  };
  

  return (
    <div>
      <h1>Bookings List</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Car ID:</label>
          <input
            type="text"
            name="carId"
            value={formData.carId}
            onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="userPhone"
            value={formData.userPhone}
            onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
            required
          />
        </div>
        <button type="submit">{editBooking ? "Update Booking" : "Submit Booking"}</button>
      </form>

      {bookings.length === 0 ? (
        <p>No bookings available.</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              <th>Car ID</th>
              <th>Date</th>
              <th>User Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.carId}</td>
                <td>{booking.date}</td>
                <td>{booking.userName}</td>
                <td>{booking.userPhone}</td>
                <td>
                  <button onClick={() => handleEdit(booking)}>Edit</button>
                  <button onClick={() => handleDelete(booking.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingList;
