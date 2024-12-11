'use client'

import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

function Navigation({ toggleSidebar }) {
  return (
    <Header
      style={{
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        borderRadius: '10px'
      }}
    >
      {/* ปุ่มแฮมเบอร์เกอร์ */}
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={toggleSidebar}
        style={{
          fontSize: '20px',
          color: 'black',
          zIndex: 1000, // ให้ปุ่มแฮมเบอร์เกอร์อยู่ด้านบนสุด
        }}
      />
      <Title
        level={3}
        style={{
          margin: 0,
          color: '#BEBEBE', // เปลี่ยนสีให้โดดเด่น
        }}
      >
        ระบบจองรถสำนักงาน
      </Title>
    </Header>
  );
}

export default Navigation;
