'use client'

import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { MenuOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Header } = Layout;
const { Title } = Typography;

function Navigation({ toggleSidebar }) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/users/home');
  };

  return (
    <Header
      style={{
        background: '#ffffff',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)', // เพิ่มเงาที่นุ่มนวลมากขึ้น
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        borderRadius: '12px',
        position: 'relative', // เพื่อให้ปุ่มอยู่ข้างบนสุด
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* ปุ่มแฮมเบอร์เกอร์ */}
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
          style={{
            fontSize: '24px',
            color: '#333', // ใช้สีที่ดูทันสมัย
            zIndex: 1000,
            padding: 0, // ลดระยะห่างจากปุ่ม
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* ชื่อระบบ */}
        <Title
          level={3}
          style={{
            margin: 0,
            color: '#1d1d1f', // เปลี่ยนสีให้ดูสะอาดตาและทันสมัย
            fontWeight: 500, // เพิ่มความหนาของตัวอักษรเพื่อให้ดูเด่น
            fontSize: '20px',
          }}
        >
          ระบบจองห้องประชุม
        </Title>
        {/* ปุ่มย้อนกลับ */}
        <Button
          type="text"
          icon={<CloseCircleOutlined />}
          onClick={handleBack}
          style={{
            fontSize: '24px',
            color: '#888', // ใช้สีที่ไม่โดดเด่นเกินไป
            padding: 0,
            marginLeft: '20px', // เพิ่มระยะห่างจากชื่อระบบ
            transition: 'color 0.3s ease', // เพิ่มการเปลี่ยนสีอย่างนุ่มนวล
          }}
          onMouseEnter={(e) => e.target.style.color = '#ff4d4f'} // สีเมื่อเอาเมาส์ชี้
          onMouseLeave={(e) => e.target.style.color = '#888'} // สีเมื่อเมาส์ออก
        />
      </div>
    </Header>
  );
}

export default Navigation;
