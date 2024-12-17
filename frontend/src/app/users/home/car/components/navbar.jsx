'use client';

import React from 'react';
import { Layout, Menu, Dropdown, Space, Grid, Popover, Button } from 'antd';
import { GlobalOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { useBreakpoint } = Grid;

function Navbar() {
  const screens = useBreakpoint();

  const languageMenu = (
    <Menu
      items={[
        { key: 'th', label: 'TH' },
        { key: 'en', label: 'EN' },
        { key: 'my', label: 'Melayu' },
      ]}
    />
  );

  // ฟังก์ชันที่ใช้สำหรับออกจากระบบ
  const handleLogout = () => {
    console.log("ออกจากระบบ");
    window.location.href = '/';
    // ที่นี่คุณสามารถเพิ่มฟังก์ชันสำหรับออกจากระบบ เช่น การลบ token หรือ redirect
  };

  // เนื้อหาภายใน Popover
  const userMenuContent = (
    <div style={{ padding: '10px' }}>
      <Button type="link" onClick={handleLogout} style={{ color: '#029B36' }}>
        ออกจากระบบ
      </Button>
    </div>
  );

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#ffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            color: 'black',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          สำนักงาน Anan
        </div>

        {/* User Info and Language Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Language Switcher */}
          {screens.md && ( // ซ่อนในหน้าจอเล็กกว่า md
            <Dropdown overlay={languageMenu} trigger={['click']}>
              <Space style={{ color: 'black', cursor: 'pointer' }}>
                <GlobalOutlined />
                <span>TH</span>
              </Space>
            </Dropdown>
          )}

          {/* User Info */}
          {screens.md ? ( // ซ่อนในหน้าจอเล็กกว่า md
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: 'black',
                gap: '10px',
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                  นายอนันต์ โต๊ะเตียะ
                </div>
              </div>
              <Popover
                content={userMenuContent}
                trigger="click"
                placement="bottomRight"
                arrowPointAtCenter
              >
                <UserOutlined style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} />
              </Popover>
            </div>
          ) : (
            <MenuOutlined style={{ fontSize: '20px', color: 'black', cursor: 'pointer' }} />
          )}
        </div>
      </Header>
    </Layout>
  );
}

export default Navbar;
