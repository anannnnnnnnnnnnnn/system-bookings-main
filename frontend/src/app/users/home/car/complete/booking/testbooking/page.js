'use client'
import { useState } from "react";
import { Form, Input, DatePicker, InputNumber, Select, Button, message } from "antd";
import axios from "axios";

const { TextArea } = Input;

export default function CreateBooking() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    // จัดรูปแบบข้อมูลสำหรับ API
    const payload = {
      booking_number: values.booking_number || null, // สามารถปล่อยว่างได้
      car_id: values.car_id,
      full_name: values.full_name,
      booking_date: values.booking_date.toISOString(), // แปลงวันที่ให้เป็น ISO
      return_date: values.return_date.toISOString(),
      purpose: values.purpose || "ไม่ได้ระบุ",
      destination: values.destination || "ไม่ได้ระบุ",
      passenger_count: values.passenger_count || 0,
      department: values.department || "ไม่ได้ระบุ",
      driver_required: values.driver_required ? 1 : 0,
    };

    try {
      // ส่งข้อมูลไปยัง API
      const response = await axios.post("http://localhost:5182/api/bookings", payload);
      message.success("Booking created successfully!");
      form.resetFields(); // ล้างฟอร์มหลังบันทึกเสร็จ
    } catch (error) {
      console.error(error);
      message.error("Failed to create booking. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ driver_required: 0 }}
    >
      <Form.Item
        name="booking_number"
        label="Booking Number (Optional)"
        tooltip="Leave blank to auto-generate"
      >
        <Input placeholder="Booking Number (optional)" />
      </Form.Item>

      <Form.Item
        name="car_id"
        label="Car ID"
        rules={[{ required: true, message: "Please enter the Car ID" }]}
      >
        <InputNumber placeholder="Car ID" min={1} />
      </Form.Item>

      <Form.Item
        name="full_name"
        label="Full Name"
        rules={[{ required: true, message: "Please enter your full name" }]}
      >
        <Input placeholder="Enter your full name" />
      </Form.Item>

      <Form.Item
        name="booking_date"
        label="Booking Date"
        rules={[{ required: true, message: "Please select a booking date" }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="return_date"
        label="Return Date"
        rules={[{ required: true, message: "Please select a return date" }]}
      >
        <DatePicker
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="purpose"
        label="Purpose"
        rules={[{ required: true, message: "Please enter the purpose" }]}
      >
        <TextArea rows={4} placeholder="Enter the purpose" />
      </Form.Item>

      <Form.Item
        name="destination"
        label="Destination"
        rules={[{ required: true, message: "Please enter the destination" }]}
      >
        <TextArea rows={2} placeholder="Enter the destination" />
      </Form.Item>

      <Form.Item
        name="passenger_count"
        label="Passenger Count"
        rules={[{ required: true, message: "Please enter the number of passengers" }]}
      >
        <InputNumber placeholder="Number of passengers" min={1} />
      </Form.Item>

      <Form.Item
        name="department"
        label="Department"
        rules={[{ required: true, message: "Please enter the department" }]}
      >
        <Input placeholder="Enter department name" />
      </Form.Item>

      <Form.Item
        name="driver_required"
        label="Driver Required"
        rules={[{ required: true, message: "Please specify if a driver is required" }]}
      >
        <Select>
          <Select.Option value={1}>Yes</Select.Option>
          <Select.Option value={0}>No</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit Booking
        </Button>
      </Form.Item>
    </Form>
  );
}
