'use client'

import React from 'react'
import { Card, Row, Col, Typography, Layout } from 'antd'
import { CarOutlined, TeamOutlined } from '@ant-design/icons'
import Navbar from '../users/home/navbar'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

function SelectSystem() {
  const router = useRouter()

  const navigate = (path) => {
    router.push(path)
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Navbar */}
      <Navbar />

      <div style={{
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: 'calc(100vh - 64px)', // Subtract navbar height
      }}>
        {/* หัวข้อหลัก */}
        <Title level={3} style={{
          fontFamily: 'var(--font-kanit)',
          color: '#333',
          margin: '20px 0 30px',
        }}>
          เลือกระบบที่ต้องการดูแล
        </Title>

        {/* กล่องเลือกระบบ */}
        <Row gutter={[24, 24]} justify="center" style={{ width: '100%', maxWidth: '1200px' }}>
          {/* ระบบจองรถสำนักงาน */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                textAlign: 'center',
                border: 'none',
                backgroundColor: '#236927', // สีเขียวเข้ม
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                height: '380px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%', // ให้กล่องกว้างสุดที่มี
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => navigate('/admin/admincar/approve')}
            >
              <CarOutlined style={{ fontSize: '64px', color: '#fff', marginBottom: '20px' }} />
              <Title level={3} style={{
                fontFamily: 'var(--font-kanit)',
                color: '#fff',
                margin: '0 0 10px 0',
              }}>
                ระบบจองรถสำนักงาน
              </Title>
              <Text type="secondary" style={{ color: 'white' }}>(Car booking system)</Text><br />
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#fff',
                fontSize: '10px',
                lineHeight: '1.5',
              }}>
                สามารถเลือกห้องประชุมที่ต้องการจอง
              </Text>
            </Card>
          </Col>

          {/* ระบบจองห้องประชุม */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                textAlign: 'center',
                border: 'none',
                backgroundColor: '#236927', // สีเขียวเข้ม
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                height: '380px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%', // ให้กล่องกว้างสุดที่มี
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => navigate('/admin/adminmeeting/approve')}
            >
              <TeamOutlined style={{ fontSize: '64px', color: '#fff', marginBottom: '20px' }} />
              <Title level={3} style={{
                fontFamily: 'var(--font-kanit)',
                color: '#fff',
                margin: '0 0 10px 0',
              }}>
                ระบบจองห้องประชุม
              </Title>
              <Text type="secondary" style={{ color: 'white' }}>(Meetingroom booking system)</Text><br />
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#fff',
                fontSize: '10px',
                lineHeight: '1.5',
              }}>
                สามารถเลือกห้องประชุมที่ต้องการจอง
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default SelectSystem
