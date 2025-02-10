'use client'

import React from 'react'
import { Card, Row, Col, Typography, Layout } from 'antd'
import { CarOutlined, TeamOutlined } from '@ant-design/icons'
import Navbar from '@/app/users/home/navbar'
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
          เลือกประเภทการจอง
        </Title>

        {/* กล่องเลือกระบบ */}
        <Row gutter={[24, 24]} justify="center" style={{ width: '100%', maxWidth: '900px' }}>
          {/* ระบบจองรถสำนักงาน */}
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{
                borderRadius: '16px',
                textAlign: 'center',
                border: 'none',
                backgroundColor: '#e6f7e6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => navigate('/user/home/car/complete')}
            >
              <CarOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '15px' }} />
              <Title level={4} style={{
                fontFamily: 'var(--font-kanit)',
                color: '#333',
                margin: 0,
              }}>
                ระบบจองรถสำนักงาน
              </Title>
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#666',
                fontSize: '14px',
              }}>
                สามารถทำการจองได้เลย
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
                backgroundColor: '#e6f7e6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onClick={() => navigate('/user/home/meetingroom/complete')}
            >
              <TeamOutlined style={{ fontSize: '48px', color: '#73d13d', marginBottom: '15px' }} />
              <Title level={4} style={{
                fontFamily: 'var(--font-kanit)',
                color: '#333',
                margin: 0,
              }}>
                ระบบจองห้องประชุม
              </Title>
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#666',
                fontSize: '14px',
              }}>
                สามารถทำการจองได้เลย
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default SelectSystem
