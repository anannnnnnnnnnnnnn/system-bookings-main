"use client";

import React from 'react';
import { Layout, Form, Input, Button, Typography } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

function Login() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
      <Content style={{ display: 'flex', flexDirection: 'row' }}>
        {/* กล่องฝั่งซ้าย */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#236927',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            height: '620px',
            maxWidth: '528px',
            margin: '20px auto',  // จัดให้อยู่ตรงกลาง
            marginLeft: '40px',
            borderRadius: '5px', // เพิ่มความโค้งมนให้กล่อง
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ color: '#ffff' }}>LOGO</Title>
            <Title level={3} style={{ color: '#ffff' }}>จองรถสำนักและห้องประชุม</Title>
            <Text
              type="secondary"
              style={{ color: '#ffff' }}>
              Book office cars and
              Conference rooms
            </Text>
          </div>
        </div>

        {/* กล่องฝั่งขวา */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title level={3} style={{ margin: 0 }}>
              เข้าสู่ระบบ
            </Title>
            <Text type="secondary">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</Text>
          </div>
          <Form
            name="login"
            layout="vertical"
            style={{ width: '50%', maxWidth: '400px' }}
            onFinish={(values) => console.log('Form values:', values)}
          >
            <Form.Item
              label="อีเมล"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            <Form.Item
              label="รหัสผ่าน"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block style={{backgroundColor:'#236927', color:'#ffff'}}>
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
