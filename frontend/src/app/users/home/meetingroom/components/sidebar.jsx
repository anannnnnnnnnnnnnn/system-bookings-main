import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined,  FilePdfOutlined,BankOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider
      width={240}
      className="site-layout-background"
      background="#ffff"
      style={{
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        borderRadius: '20px',
        padding: '20px',
        height: '83vh',
        background: '#ffffff', // พื้นหลังสีขาว
      }}
    >
      <div
        className="logo"
        style={{
          padding: '16px',
          textAlign: 'center',
          color: '#000000',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        ระบบจองห้องประชุม
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        style={{
          background: '#ffffff', // พื้นหลังเมนูสีขาว
          borderRadius: '10px',
        }}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: <Link href="/users/home/meetingroom">หน้าหลัก</Link>,
          },
          {
            key: '2',
            icon: <InfoCircleOutlined />,
            label: <Link href="/users/home/meetingroom/detail">รายละเอียด</Link>,
          },
          {
            key: '3',
            icon: <BankOutlined/>,
            label: <Link href="/users/home/meetingroom/complete">จองประชุม</Link>,
          },
          {
            key: '4',
            icon: <FilePdfOutlined />,
            label: <Link href="">คู่มือการใช้งาน</Link>,
          },
          {
            key: '5',
            icon: <InfoCircleOutlined />,
            label: <Link href="/">แจ้งปัญหา/ข้อเสนอแนะ</Link>,
          },
        ]}
      />
      <style jsx global>{`
        .ant-menu-item-selected {
          background-color: #478D00 !important; /* สีเขียวเมื่อ active */
          color: #ffffff !important; /* ตัวอักษรสีขาว */
        }
        .ant-menu-item:hover {
          background-color: #6abf40 !important; /* สีเขียวอ่อนเมื่อ hover */
          color: #ffffff !important; /* ตัวอักษรสีขาว */
        }
        .ant-menu-item a {
          color: #000000; /* ตัวอักษรสีดำเมื่อไม่ได้เลือก */
        }
      `}</style>
    </Sider>
  );
}

export default Sidebar;
