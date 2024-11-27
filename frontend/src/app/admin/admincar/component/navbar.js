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
        { key: 'my', label: 'melayu' }
      ]}
    />
  )

  return (
    <Layout>
      <Header

        style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'

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
          <Dropdown overlay={languageMenu} trigger={['click']}>
            <Space style={{ color: 'black', cursor: 'pointer' }}>
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
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                นายอนันต์ โต๊ะเตียะ
              </div>
            </div>
            <UserOutlined style={{ fontSize: '20px', color: 'black' }} />
          </div>
        </div>
      </Header>
    </Layout>
  )
}

export default Navbar
