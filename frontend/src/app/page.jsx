"use client";

import React, { useState } from "react";
import { Layout, Form, Input, Button, Typography, message } from "antd";

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
          window.location.href = "/users/home"; // สำหรับ User
        } else if (role === 1) {
          window.location.href = "/admin"; // สำหรับ Admin
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
      <Content style={{ display: "flex", flexDirection: "row" }}>
       

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <Title level={3} style={{ margin: 0 }}>เข้าสู่ระบบ</Title>
            <Text type="secondary">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</Text>
          </div>
          <Form name="login" layout="vertical" style={{ width: "50%", maxWidth: "400px" }} onFinish={handleLogin}>
            <Form.Item label="อีเมล" name="email" rules={[{ required: true, message: "Please input your email!" }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item label="รหัสผ่าน" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#236927", color: "#ffff" }} loading={loading}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
}

export default Login;
