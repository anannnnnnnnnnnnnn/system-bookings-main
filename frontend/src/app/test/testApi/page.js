'use client'

import axios from 'axios';
import { useState } from 'react';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    carId: "",
    date: "",
    userName: "",
    userPhone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5094/api/booking", formData);
      alert("Booking submitted successfully!");
      setFormData({ carId: "", date: "", userName: "", userPhone: "" }); // Reset form
    } catch (error) {
      alert("Failed to submit booking. Please try again.");
      console.error("Error submitting booking:", error);
    }
  };

  return (
    <div>
      <h1>Car Booking Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Car ID:</label>
          <input
            type="text"
            name="carId"
            value={formData.carId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="userPhone"
            value={formData.userPhone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
