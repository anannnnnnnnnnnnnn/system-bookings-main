'use client'

import React from 'react'
import { Card, Row, Col, Typography, Layout } from 'antd'
import { CarOutlined, TeamOutlined } from '@ant-design/icons'
import Navbar from './car/components/navbar'
import Link from 'next/link'

const { Title } = Typography

function SelectSystem() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Navbar */}
      <Navbar />
      
      <div style={{
        padding: '50px 20px',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 64px)', // Subtract navbar height
        background: '#f5f5f5',
        borderRadius: '16px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <Typography.Title level={2} style={{fontFamily: 'var(--font-kanit)' , color: 'black', marginBottom: '30px' }}>
            กรุณาเลือกระบบที่ต้องการ
          </Typography.Title>
          <Row gutter={[16, 24]} justify="center">
            {/* ระบบจองรถ */}
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <CarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <Typography.Title level={4} style={{ marginTop: '10px' }}>
                  <Link href="/users/home/car">
                    <span style={{ fontFamily: 'var(--font-kanit)' ,color: '#1890ff' }}>ระบบจองรถ</span>
                  </Link>
                </Typography.Title>
              </Card>
            </Col>

            {/* ระบบจองห้องประชุม */}
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease-in-out',
                  backgroundColor: '#ffffff',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <TeamOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <Typography.Title level={4} style={{ marginTop: '10px' }}>
                  <Link href="/users/home/meetingroom">
                    <span style={{fontFamily: 'var(--font-kanit)' , color: '#52c41a' }}>ระบบจองห้องประชุม</span>
                  </Link>
                </Typography.Title>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  )
}

export default SelectSystem
