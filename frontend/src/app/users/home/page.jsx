'use client'

import React from 'react'
import { Card, Row, Col, Typography, Layout } from 'antd'
import { CarOutlined, TeamOutlined } from '@ant-design/icons'
import Navbar from './car/components/navbar'
import Link from 'next/link'

const { Title, Text } = Typography

function SelectSystem() {
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
          กรุณาเลือกระบบที่ต้องการ
        </Title>

        {/* กล่องเลือกระบบ */}
        <Row gutter={[24, 24]} justify="center" style={{ width: '100%', maxWidth: '900px' }}>
          {/* ระบบจองรถ */}
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
            >
              <CarOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '15px' }} />
              <Link href="/users/home/car">
                <Title level={4} style={{
                  fontFamily: 'var(--font-kanit)',
                  color: '#333',
                  margin: 0,
                }}>
                  ระบบจองรถ
                </Title>
              </Link>
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#666',
                fontSize: '14px',
              }}>
                บริการจองและจัดการรถสำนักงาน
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
            >
              <TeamOutlined style={{ fontSize: '48px', color: '#73d13d', marginBottom: '15px' }} />
              <Link href="/users/home/meetingroom">
                <Title level={4} style={{
                  fontFamily: 'var(--font-kanit)',
                  color: '#333',
                  margin: 0,
                }}>
                  ระบบจองห้องประชุม
                </Title>
              </Link>
              <Text style={{
                fontFamily: 'var(--font-kanit)',
                color: '#666',
                fontSize: '14px',
              }}>
                บริการจองและจัดการห้องประชุม
              </Text>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default SelectSystem
