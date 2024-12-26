'use client'

import React from 'react'
import { Layout, Menu, Dropdown, Space } from 'antd'
import { GlobalOutlined, UserOutlined } from '@ant-design/icons'

const { Header } = Layout

function Navbar() {
  const languageMenu = (
    <Menu
      items={[
        { key: 'th', label: 'TH' },
        { key: 'en', label: 'EN' },
        { key: 'my', label: 'Melayu' }
      ]}
    />
  )

  return (
    <Layout>
      <Header
        style={{
          fontFamily: 'var(--font-kanit)',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
          flexWrap: 'wrap', // ช่วยให้เนื้อหาจัดระเบียบตามขนาดหน้าจอ
          position: 'fixed', // ตำแหน่งคงที่
          top: 0, // ชิดด้านบน
          left: 0, // ชิดซ้าย
          right: 0, // ชิดขวา
          zIndex: 1000, // ให้แถบเมนูมีค่า z-index สูงสุด
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            fontFamily: 'var(--font-kanit)',
            color: 'black',
            fontSize: '18px',
            fontWeight: 'bold',
            flex: '1', // ให้โลโก้ขยายเพื่อไม่ให้ซ้อนกัน
            textAlign: 'left', // จัดให้โลโก้อยู่ทางซ้าย
            marginRight: '20px',
          }}
        >
          สำนักงาน Anan
        </div>

        {/* User Info and Language Switcher */}
        <div
          style={{
            fontFamily: 'var(--font-kanit)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flex: '1',
            justifyContent: 'flex-end', // จัดให้ส่วนนี้ไปทางขวา
          }}
        >
          {/* Language Switcher */}
          <Dropdown overlay={languageMenu} trigger={['click']}>
            <Space style={{ fontFamily: 'var(--font-kanit)', color: 'black', cursor: 'pointer' }}>
              <GlobalOutlined />
              <span>TH</span>
            </Space>
          </Dropdown>

          {/* User Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'black',
              gap: '10px',
            }}
          >
            <div className="user-name">
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                นายอนันต์ โต๊ะเตียะ
              </div>
            </div>
            <UserOutlined style={{ fontSize: '20px', color: 'black' }} />
          </div>
        </div>
      </Header>

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .logo {
            font-size: 14px;
          }

          .ant-dropdown-trigger {
            font-size: 14px;
          }

          .ant-space {
            gap: 10px;
          }

          .user-name {
            display: none; /* ซ่อนชื่อผู้ใช้บนหน้าจอขนาดเล็ก */
          }
        }
      `}</style>
    </Layout>
  )
}
export default Navbar
