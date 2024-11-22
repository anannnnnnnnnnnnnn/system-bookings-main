'use client'

import React from 'react'
import { Layout, Typography, Space, DatePicker, Divider, Input, Radio, Select, Button } from 'antd'
import Navbar from '../../components/navbar'
import Sidebar from '../../components/sidebar'
import { Content } from 'antd/lib/layout/layout'
import Link from 'next/link'

const { Option } = Select
const { TextArea } = Input
const { Title } = Typography

function BookingDetails() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Navbar */}
            <Navbar />

            <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Layout style={{ padding: '0px 20px' }}>
                    <Content
                        style={{
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>
                                รายละเอียดการจอง
                            </Title>

                            {/* Section: ข้อมูลรถ */}
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
                                <img
                                    src="/path/to/car-image.jpg"
                                    alt="Car"
                                    style={{ width: '150px', height: '100px', borderRadius: '8px', marginRight: '16px', objectFit: 'cover' }}
                                />
                                <div>
                                    <Title level={4} style={{ marginBottom: '4px' }}>รถยนต์ Honda</Title>
                                    <p style={{ marginBottom: '4px' }}>วันที่ใช้งาน: 06 ก.พ. 58 เวลา 06:00</p>
                                    <p>ถึงวันที่: 10 ก.พ. 58 เวลา 17:55</p>
                                </div>
                            </div>

                            <Divider />

                            {/* Form */}
                            <div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>เลขที่ใบจอง</label>
                                        <Input placeholder="ABC0011624" disabled />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>วันที่-เวลา</label>
                                        <Input placeholder="06 ก.พ. 58 เวลา 06:00" disabled />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>จุดประสงค์การใช้งาน</label>
                                        <TextArea rows={2} placeholder="กรุณาระบุจุดประสงค์" />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>ปลายทาง</label>
                                        <TextArea rows={2} placeholder="กรุณาระบุปลายทาง" />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>จำนวนผู้โดยสาร</label>
                                        <Input type="number" placeholder="จำนวนผู้โดยสาร" />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>แผนก/ฝ่าย</label>
                                        <Input placeholder="กรุณาป้อนแผนกหรือฝ่าย" />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>เบอร์ติดต่อ</label>
                                        <Input placeholder="กรุณาป้อนเบอร์ติดต่อ" />
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 'bold' }}>ต้องการพนักงานขับรถ</label>
                                        <Radio.Group>
                                            <Radio value="yes">ต้องการ</Radio>
                                            <Radio value="no">ไม่ต้องการ</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div style={{ textAlign: 'right', marginTop: '24px' }}>

                                    <dive style={{ marginRight: '16px', }}>
                                        <Link href="/users/home/car/complete">
                                            <Button type="default">ยกเลิก</Button>
                                        </Link>
                                    </dive>

                                    <Link href="/users/home/car/complete/comfirm">
                                        <Button type="primary" style={{ backgroundColor: '#029B36', borderColor: '#029B36' }}>
                                            บันทึกการจอง
                                        </Button>
                                    </Link>
                                    

                                </div>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default BookingDetails
