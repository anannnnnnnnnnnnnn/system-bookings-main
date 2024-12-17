'use client';

import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { MenuOutlined, ArrowLeftOutlined,CloseCircleOutlined} from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // ใช้สำหรับการนำทาง

const { Header } = Layout;
const { Title } = Typography;

function Navigation({ toggleSidebar }) {
  const router = useRouter(); // เรียกใช้ useRouter สำหรับการจัดการการนำทาง

  const handleBack = () => {
    router.push('/users/home'); // เปลี่ยนเส้นทางไปหน้า /home หรือหน้าที่คุณต้องการ
  };

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
        borderRadius: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
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
      </div>
      <div style={{display:'flex'}}>
        <Title
          level={3}
          style={{
            margin: 0,
            color: '#BEBEBE', // เปลี่ยนสีให้โดดเด่น
          }}
        >
          ระบบจองรถสำนักงาน
        </Title>
        {/* ปุ่มย้อนกลับที่ไปยังหน้าที่กำหนด */}
        <Button
          type="text"
          icon={<CloseCircleOutlined/>}
          onClick={handleBack} // ฟังก์ชันที่ไปยังหน้า /home
          style={{
            fontSize: '20px',
            color: '#000',
            marginRight: '10px',
          }}
        />
      </div>
    </Header>
  );
}

export default Navigation;
