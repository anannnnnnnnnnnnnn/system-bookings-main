import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, CarOutlined,RollbackOutlined  } from '@ant-design/icons';
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
        ระบบจองรถ
      </div>
      <Menu defaultSelectedKeys={['1']} style={{ background: '#fafafa' }}>
        <Menu.Item key="1" icon={<HomeOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/car">
            หน้าหลัก
          </Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/car/detail">
            รายละเอียด
          </Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<CarOutlined />} style={{ fontSize: '18px' }}>
          <Link href="/users/home/car/complete">
            จองรถ
          </Link>
        </Menu.Item>

        <Menu.Item key="4" icon={<RollbackOutlined/>} style={{ fontSize: '18px' }}>
          <Link href="/users/home">
            จองรถ
          </Link>
        </Menu.Item>

        
      </Menu>
    </Sider>
  );
}

export default Sidebar;
