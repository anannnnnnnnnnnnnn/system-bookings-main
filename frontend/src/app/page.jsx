"use client";

import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, message } from "antd";
import { Image } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5182/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        message.success("Login successful");

        // บันทึกข้อมูลผู้ใช้ใน localStorage
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userFullName", data.fullName);

        // แปลง role เป็นตัวเลขก่อนตรวจสอบ
        const role = parseInt(data.role, 10);

        if (role === 0) {
          window.location.href = "/user/home"; // สำหรับ User
        } else if (role === 1) {
          window.location.href = "/admin"; // สำหรับ Admin
        } else if (role === 2) {
          window.location.href = "/admin/manager/car"; // สำหรับ Admin
        } else if (role === 3) {
          window.location.href = "/admin/officer"; // สำหรับ Admin
        } else {
          console.error("Unknown role value:", role);
          message.error("Unknown role");
        }
      } else {
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      message.error("Something went wrong, please try again");
    }
  };

  return (
<Layout style={{ minHeight: "100vh", backgroundColor: "#ffff" }}>
  <Content style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
    {/* กล่องที่ครอบเนื้อหาทั้งหมด */}
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // การเพิ่มเงาให้กล่อง
        overflow: "hidden", // ป้องกันไม่ให้เนื้อหาล้นออกจากกล่อง
        maxWidth: "1000px",
        width: "100%",
        padding: "20px",
        backgroundColor: "#ffffff", // สีพื้นหลังของกล่อง
      }}
    >
      {/* ซ้าย: ชื่อและรูปภาพ */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#236927", // สีเขียว
          color: "#fff", // เปลี่ยนข้อความให้เป็นสีขาว
          height: "100%", // ทำให้ฝั่งซ้ายเต็มความสูงของกล่อง
        }}
      >
        <Image
          src="/assets/imacs.webp"  // ใช้ src เพื่อชี้ไปที่ไฟล์รูปภาพใน public/assets
          alt="Logo"
          style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "cover" }}
        />
        <Title level={3} style={{color:'white'}}>ระบบจองรถและห้องประชุมของสำนักงาน</Title>
        <Text type="secondary" style={{color:'white'}}>Car and meeting room booking system</Text>
      </div>

      {/* ขวา: ฟอร์ม Login */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={3} style={{ margin: 0 }}>เข้าสู่ระบบ</Title>
          <Text type="secondary">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</Text>
        </div>
        <Form name="login" layout="vertical" style={{ width: "100%", maxWidth: "400px" }} onFinish={handleLogin}>
          <Form.Item label="อีเมล" name="email" rules={[{ required: true, message: "กรุณากรอกอีเมล!" }]}>
            <Input placeholder="กรอกอีเมลของคุณ" />
          </Form.Item>
          <Form.Item label="รหัสผ่าน" name="password" rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}>
            <Input.Password placeholder="กรอกรหัสผ่าน" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#236927", color: "#ffff" }} loading={loading}>
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </Content>
</Layout>

  
  );
}

export default Login;
