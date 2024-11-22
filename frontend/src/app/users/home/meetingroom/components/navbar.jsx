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
      ]}
    />
  )

  return (
    <Layout>
      <Header
        
        style={{
          backgroundColor: '#001529',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
        }}
      >
        {/* Logo */}
        <div
          className="logo"
          style={{
            color: '#fff',
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
            <Space style={{ color: '#fff', cursor: 'pointer' }}>
              <GlobalOutlined />
              <span>TH</span>
            </Space>
          </Dropdown>

          {/* User Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#fff',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                นายอนันต์ โต๊ะเตียะ
              </div>
            </div>
            <UserOutlined style={{ fontSize: '20px', color: '#fff' }} />
          </div>
        </div>
      </Header>
    </Layout>
  )
}

export default Navbar
