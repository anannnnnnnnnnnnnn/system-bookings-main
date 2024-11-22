import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined,CarOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

function Sidebar() {
  return (
    <Sider
      width={250}
      className="site-layout-background"
      theme="dark"
      style={{
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        borderRadius: '20px',
        padding: '20px ', // ลด padding ด้านบน
        height: '83vh', // ให้ Sidebar สูงเต็มจอ

      }}
    >
      <div
        className="logo"
        style={{
          padding: '16px',
          textAlign: 'center',
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        ระบบจองห้องประชุม
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
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

        {/* SubMenu Implementation */}
        <Menu.SubMenu          
          key="sub1"
          icon={<CarOutlined />}
          title="จองห้องประชุม"
          style={{
            fontSize: '18px',
            backgroundColor: '#001529'
            
          }}

        >
          <Menu.Item key="3-1" style={{ fontSize: '16px',backgroundColor: '#001529' }}>
            <Link href="/users/home/meetingroom/complete">
              การจอง
            </Link>
          </Menu.Item>
          <Menu.Item key="3-2" style={{ fontSize: '16px' }}>
            <Link href="/users/home/meetingroom/complete/approve">
              รออนุมัติ
            </Link>
          </Menu.Item>
          <Menu.Item key="3-3" style={{ fontSize: '16px' }}>
            <Link href="/users/home/meetingroom/complete/roomreturn">
              คืนห้องประชุม
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Sider>
  );
}

export default Sidebar;
