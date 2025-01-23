'use client';
import React, { useState } from 'react';
import { Layout, Menu, Button, Grid, Drawer } from 'antd';
import { MenuOutlined, CarOutlined, HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
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
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{
          background: '#fff',
          borderRight: 'none',
        }}
      >
        <Menu.Item key="1" icon={<CarOutlined />}>
          <Link href="/users/home/car/complete">จองรถ</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<HomeOutlined />}>
          <Link href="/users/home/car">ปฎิทิน</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<InfoCircleOutlined />}>
          <Link href="/users/home/car/detail">รายละเอียด</Link>
        </Menu.Item>
      </Menu>
    </>
  );

  return (
    <>
      {screens.md ? ( // ตรวจสอบหน้าจอใหญ่ (>= 768px)
        <Sider
          width="275px"
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            backgroundColor: '#fff',
            boxShadow:
              '0px 4px 8px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(0, 0, 0, 0.1), 4px 0px 8px rgba(0, 0, 0, 0.1), -4px 0px 8px rgba(0, 0, 0, 0.1)', // เงาทุกด้าน
            borderRadius: '10px', // มุมโค้ง
            overflow: 'hidden',
          }}
        >
          {sidebarContent}
        </Sider>
      ) : (
        // สำหรับหน้าจอเล็ก (< 768px)
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
            width="75%" // เปลี่ยนขนาด Drawer เพื่อให้เหมาะสมกับหน้าจอเล็ก
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
      <style jsx global>{`
        .ant-menu-item-selected {
          background-color: #478d00 !important; /* สีเขียวเมื่อ active */
          color: #ffffff !important; /* ตัวอักษรสีขาว */
        }
        .ant-menu-item:hover {
          background-color: #6abf40 !important; /* สีเขียวอ่อนเมื่อ hover */
          color: #ffffff !important; /* ตัวอักษรสีขาว */
        }
        .ant-menu-submenu-title:hover {
          background-color: #e7f5e6 !important; /* สีเขียวอ่อนเมื่อ hover submenu */
          color: #478d00 !important;
        }
        .ant-menu-item a {
          color: #000000; /* ตัวอักษรสีดำเมื่อไม่ได้เลือก */
        }
      `}</style>
    </>
  );
}

export default Sidebar;
  