'use client'

import React, { useState } from 'react'
import { Layout, Typography, Space, DatePicker, Divider, Button, Radio, List, Card, Badge } from 'antd'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import { Content } from 'antd/lib/layout/layout'
import Link from 'next/link'

const { Title } = Typography

function CarBooking() {
  const [cars, setCars] = useState([]); // สถานะข้อมูลรถ
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [filter, setFilter] = useState('available'); // ตัวกรองสถานะรถ
    const [startDate, setStartDate] = useState(null); // วันเริ่มต้น
  const [endDate, setEndDate] = useState(null); // วันสิ้นสุด

  // Mock ข้อมูลรถ
  const carData = [
    { id: 1, plate: '1กม 6195', name: 'Toyota', model: 'Altis', status: 'ว่าง', image: 'https://via.placeholder.com/150' },
    { id: 2, plate: 'กม 945', name: 'Toyota', model: 'Vios', status: 'ว่าง', image: 'https://via.placeholder.com/150' },
    { id: 3, plate: 'ขน 9178', name: 'Honda', model: 'Mobilio', status: 'ไม่ว่าง', image: 'https://via.placeholder.com/150' },
  ];

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    setLoading(true); // เริ่มโหลดข้อมูล
    setTimeout(() => {
      setCars(carData); // ดึงข้อมูลรถ
      setLoading(false); // เสร็จสิ้นการโหลด
    }, 1000);
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ
  const filteredCars = cars.filter((car) => {
    if (filter === 'available') return car.status === 'ว่าง';
    if (filter === 'unavailable') return car.status === 'ไม่ว่าง';
    return true;
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* เนื้อหาหลัก */}
        <Layout style={{ padding: '0px 20px' }}>
          <Content style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>ฟอร์มจองรถ</Title>

              {/* Section: ค้นหารถ */}
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
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  type="primary"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#029B36',
                    borderColor: '#ffff',
                    height: '43px',
                    fontSize: '16px',
                  }}
                  onClick={handleSearch}
                  loading={loading}
                >
                  ค้นหารถ
                </Button>
              </div>

              <Divider />

              {/* ตัวเลือกสถานะ */}
              <Radio.Group
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                style={{ marginBottom: '16px' }}
              >
                <Radio value="available">เฉพาะว่าง</Radio>
                <Radio value="unavailable">ไม่ว่าง</Radio>
                <Radio value="all">ทุกสถานะ</Radio>
              </Radio.Group>

              {/* แสดงรายการรถ */}
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={filteredCars}
                renderItem={(car) => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      cover={<img alt={car.name} src={car.image}
                        style={{
                          borderRadius: '8px 8px 0 0',
                          objectFit: 'cover',
                          width: '50px',
                          height: '100px'
                        }} />}
                    >
                      <div>
                        <Title level={5}>{car.plate}</Title>
                        <p>รถ: {car.name}, {car.model}</p>
                        <Badge
                          status={car.status === 'ว่าง' ? 'success' : 'error'}
                          text={`สถานะ: ${car.status}`}
                        />
                      </div>
                      <div>
                        <Link href="/users/home/car/complete/booking">
                          <Button type="primary" disabled={car.status !== 'ว่าง'} style={{ marginTop: '16px' ,background: '#029B36'}}>
                            เลือก
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default CarBooking;
