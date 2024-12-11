'use client';
import React, { useState } from 'react';
import { Layout, Menu, Button, Grid, Drawer } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  CarOutlined,
  RollbackOutlined,
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;
const { useBreakpoint } = Grid;

function Sidebar() {
  const screens = useBreakpoint(); // ตรวจสอบขนาดหน้าจอ
  const [collapsed, setCollapsed] = useState(false); // สำหรับ Sider
  const [visible, setVisible] = useState(false); // สำหรับ Drawer

  const toggleDrawer = () => {
    setVisible(!visible);
  };

  const sidebarContent = (
    <>
      <div
        className="logo"
        style={{
          padding: '16px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: collapsed ? 'none' : 'block',
        }}
      >
        ระบบจองรถ
      </div>
      <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
          <Link href="/users/home/car">หน้าหลัก</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<InfoCircleOutlined />}>
          <Link href="/users/home/car/detail">รายละเอียด</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<CarOutlined />}>
          <Link href="/users/home/car/complete">จองรถ</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<RollbackOutlined />}>
          <Link href="/users/home">ย้อนกลับ</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<LogoutOutlined />}>
          <Link href="/">ออกจากระบบ</Link>
        </Menu.Item>
      </Menu>
    </>
  );

  return (
    <>
      {screens.md ? (
        <Sider
          width="240px"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            height: '100vh',
            background: '#fff',
            transition: 'all 0.3s',
          }}
        >
          {sidebarContent}
        </Sider>
      ) : (
        <>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            style={{
              fontSize: '20px',
              margin: '16px',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1000,
            }}
          />
          <Drawer
            width="50%"
            title="ระบบจองรถ"
            placement="left"
            onClose={toggleDrawer}
            visible={visible}
            bodyStyle={{ padding: 0 }}
            headerStyle={{ background: '#fafafa' }}
          >
            {sidebarContent}
          </Drawer>
        </>
      )}
    </>
  );
}

export default Sidebar;
