'use client'

import React from 'react'
import { Layout, Typography, Space, DatePicker, Divider, Input, Radio, Select, Button } from 'antd'
import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import { Content } from 'antd/lib/layout/layout'

const { Option } = Select
const { TextArea } = Input
const { Title, } = Typography

function carreturn() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    {/* Navbar */}
    <Navbar />

    <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* เนื้อหาหลักของหน้า */}
      <Layout style={{ padding: '0px 20px' }}>
        <Content style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>ฟอร์มจองรถ</Title>

            {/* Section 1: ค้นหารถที่ว่างพร้อมใช้งาน */}
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ color: 'black' }}>1. ค้นหารถที่ว่างพร้อมใช้งาน</Title>
              <Space size="large" direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องการ</label>
                    <DatePicker showTime placeholder="เลือกวันเวลาเริ่มต้น" style={{ width: '100%' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องคืน</label>
                    <DatePicker showTime placeholder="เลือกวันเวลาคืน" style={{ width: '100%' }} />
                  </div>
                </div>
              </Space>
            </div>

            <Divider />

            {/* Section 2: ข้อมูลผู้จอง */}
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ color: 'black' }}>2. ข้อมูลผู้จอง</Title>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                  <Input placeholder="กรุณาป้อนชื่อ-สกุล" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>ตำแหน่งหรือแผนก</label>
                  <Input placeholder="กรุณาป้อนตำแหน่งหรือแผนก" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>เบอร์ติดต่อ</label>
                  <Input placeholder="กรุณาป้อนเบอร์ติดต่อ" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>ต้องการขับเอง</label>
                  <Radio.Group style={{ marginRight: '200px' }}>
                    <Radio value="yes">ต้องการ</Radio>
                    <Radio value="no">ไม่ต้องการ</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>

            <Divider />

            {/* Section 3: รายละเอียดการจอง  */}
            <div style={{ marginBottom: '32px' }}>
              <Title level={4} style={{ color: 'black' }}>3. รายละเอียดการจอง</Title>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>ประเภทรถที่ต้องการ</label>
                  <Select placeholder="เลือกประเภทรถ" style={{ width: '100%' }}>
                    <Option value="car">รถยนต์ส่วนตัว</Option>
                    <Option value="van">รถตู้</Option>
                  </Select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>วันที่และเวลาเริ่มใช้งาน</label>
                  <DatePicker showTime placeholder="เลือกวันเวลาเริ่มใช้งาน" style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>วันที่และเวลาคืนรถ</label>
                  <DatePicker showTime placeholder="เลือกวันเวลาคืนรถ" style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>วัตถุประสงค์ในการใช้รถ</label>
                  <TextArea rows={3} placeholder="กรุณาป้อนวัตถุประสงค์ เช่น การประชุม การเดินทาง" />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontWeight: 'bold' }}>สถานที่ปลายทาง</label>
                  <TextArea rows={3} placeholder="กรุณาป้อนสถานที่ปลายทาง เช่น ชื่อสถานที่ ตำบล อำเภอ จังหวัด" />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button type="primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#029B36', borderColor: '#ffff', height: '48px', fontSize: '16px' }}>ยืนยันการจอง</Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  </Layout>
  )
}

export default carreturn