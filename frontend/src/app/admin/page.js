'use client'

import React from 'react'
import { Card, Row, Col, Typography, Layout } from 'antd'
import { CarOutlined, TeamOutlined } from '@ant-design/icons'
import Navbar from './admincar/component/navbar'
import Link from 'next/link'

const { Header } = Layout
const { Title } = Typography


function SelectSystem() {

  const handleSystemSelection = () => {
    
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      <div style={{ padding: '50px', textAlign: 'center', height: '100vh', justifyContent: 'center',marginTop:'100px' }}>
        <Title level={2}>Admin</Title>
        <Row gutter={16} justify="center" style={{ marginTop: '30px' }}>
          {/* ระบบจองรถ */}
          <Col span={8}>
            <Card
              hoverable
              style={{ borderRadius: '8px' }}
              onClick={() => handleSystemSelection('car')}
            >
              <CarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              <Title level={4} style={{ marginTop: '10px' }}>
                <Link href="/admin/admincar">
                  ระบบจองรถ
                </Link>
              </Title>
            </Card>
          </Col>

          {/* ระบบจองห้องประชุม */}
          <Col span={8}>
            <Card
              hoverable
              style={{ borderRadius: '8px' }}
              onClick={() => handleSystemSelection('meeting')}
            >
              <TeamOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
              <Title level={4} style={{ marginTop: '10px' }}>
                <Link href="/admin/adminmeeting">
                  ระบบจองห้องประชุม
                </Link>
              </Title>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default SelectSystem
