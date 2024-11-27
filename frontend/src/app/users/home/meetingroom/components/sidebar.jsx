import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined,CarOutlined,RollbackOutlined,LogoutOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider
    width={240}
    className="site-layout-background"
    backgroundColor="#ffffff"
    style={{
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      padding: '20px ', // ลด padding ด้านบน
      height: '83vh', // ให้ Sidebar สูงเต็มจอ
      background: '#fafafa'

      }}
    >
      <div
        className="logo"
        style={{
          padding: '16px',
          textAlign: 'center',
          color: 'eeeee',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        ระบบจองห้องประชุม
      </div>
      <Menu defaultSelectedKeys={['1']} style={{background: '#fafafa'}}>
        <Menu.Item key="1" icon={<HomeOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/meetingroom">
            หน้าหลัก
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/meetingroom/detail">
            รายละเอียด
          </Link>
        </Menu.Item>

        <Menu.Item key="3" icon={<CarOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/meetingroom/complete">
            จองประชุม
          </Link>
        </Menu.Item>

        <Menu.Item key="4" icon={<RollbackOutlined/>} style={{ fontSize: '18px' }}>
          <Link href="/users/home">
            ย้อนกลับ
          </Link>
        </Menu.Item>

        <Menu.Item key="5" icon={<LogoutOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/">
            ออกจากระบบ
          </Link>
        </Menu.Item>  
      </Menu>
    </Sider>
  );
}

export default Sidebar;
