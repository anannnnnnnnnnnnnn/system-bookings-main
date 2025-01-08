'use client';
import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Input, Upload, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CarForm = () => {
  const [formValues, setFormValues] = useState({
    brand: "",
    model: "",
    license_plate: "",
    seating_capacity: null,
    fuel_type: "",
    status: "",
    image_url: null,  // image_url should be null initially
  });

  const handleValuesChange = (changedValues, allValues) => {
    setFormValues(allValues);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("brand", formValues.brand);
    formData.append("model", formValues.model);
    formData.append("license_plate", formValues.license_plate);
    formData.append("seating_capacity", formValues.seating_capacity);
    formData.append("fuel_type", formValues.fuel_type);
    formData.append("status", formValues.status);

    // ตรวจสอบว่าไฟล์รูปภาพถูกเลือก
    if (formValues.image_url) {
      formData.append("image_url", formValues.image_url);
    }

    try {
      const response = await axios.post("http://localhost:5182/api/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // บอกให้ axios ส่งในรูปแบบ multipart/form-data
        },
      });

      if (response.status === 200) {
        console.log("ข้อมูลถูกบันทึกแล้ว:", response.data);
        // ปิด modal หรือทำการรีเซ็ตฟอร์ม
        Modal.success({
          title: "สำเร็จ",
          content: "บันทึกข้อมูลสำเร็จ",
        });
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
      Modal.error({
        title: "เกิดข้อผิดพลาด",
        content: "ไม่สามารถบันทึกข้อมูลได้ โปรดลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <Form onFinish={handleSubmit} onValuesChange={handleValuesChange} layout="vertical">
      <Form.Item label="ยี่ห้อ" name="brand" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="รุ่น" name="model" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="ทะเบียน" name="license_plate" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="ที่นั่ง" name="seating_capacity">
        <Input type="number" />
      </Form.Item>
      <Form.Item label="ประเภทเชื้อเพลิง" name="fuel_type">
        <Input />
      </Form.Item>
      <Form.Item label="สถานะ" name="status">
        <Input />
      </Form.Item>
      <Form.Item label="อัปโหลดรูปภาพ" name="image_url">
        <Upload
          accept="image/*"
          beforeUpload={(file) => {
            // Update the formValues state with the selected file
            setFormValues({ ...formValues, image_url: file });
            return false;  // Don't upload the file yet, we handle it manually in handleSubmit
          }}
        >
          <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">บันทึกข้อมูล</Button>
      </Form.Item>
    </Form>
  );
};

export default CarForm;
