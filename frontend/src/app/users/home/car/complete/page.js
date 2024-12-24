'use client';

import React, { useState } from 'react';
import { Layout, Typography, Space, DatePicker, Divider, Button, Radio, List, Card, Badge, Grid, TimePicker } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Navigation from '../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import Link from 'next/link';
import { Kanit } from 'next/font/google'; // เปลี่ยน @next/font เป็น next/font
import '/src/app/globals.css';
; // ใช้ "./" เพราะไฟล์อยู่ในโฟลเดอร์เดียวกัน

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
  subsets: ['latin', 'thai'], // รองรับภาษาไทย
  weight: ['300', '400', '700'], // น้ำหนักของฟอนต์
});


const { Title } = Typography;
const { useBreakpoint } = Grid;

function CarBooking() {
  const [cars, setCars] = useState([]); // สถานะข้อมูลรถ
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [filter, setFilter] = useState('available'); // ตัวกรองสถานะรถ
  const screens = useBreakpoint();

  // Mock ข้อมูลรถ
  const carData = [
    { id: 1, plate: '1กม 6195', name: 'Toyota', model: 'Altis', status: 'ว่าง', image: '/assets/car1.jpg' },
    { id: 2, plate: 'กม 945', name: 'Toyota', model: 'Vios', status: 'ว่าง', image: '/assets/car2.jpeg' },
    { id: 3, plate: 'ขน 9178', name: 'Honda', model: 'Mobilio', status: 'ไม่ว่าง', image: '/assets/car1f.jpg' },
    { id: 4, plate: 'กต 1234', name: 'Ford', model: 'Focus', status: 'ว่าง', image: '/assets/car3.jpg' },
    { id: 5, plate: 'ขม 6789', name: 'Mazda', model: 'Mazda3', status: 'ว่าง', image: '/assets/car4.jpg' },
    { id: 6, plate: 'บข 9031', name: 'Nissan', model: 'Altima', status: 'ไม่ว่าง', image: '/assets/car2f.jpg' },
    { id: 7, plate: 'สข 2587', name: 'Honda', model: 'Civic', status: 'ว่าง', image: '/assets/car5.jpg' },
    { id: 8, plate: 'จข 4920', name: 'Toyota', model: 'Camry', status: 'ไม่ว่าง', image: '/assets/car3f.png' },
    { id: 9, plate: 'ฟฟ 6711', name: 'BMW', model: 'X5', status: 'ว่าง', image: '/assets/car6.png' },
    { id: 10, plate: 'จจ 5203', name: 'Mercedes-Benz', model: 'C-Class', status: 'ไม่ว่าง', image: '/assets/car4f.jpg' },
  ];

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setCars(carData);
      setLoading(false);
    }, 1000);
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ
  const filteredCars = cars.filter((car) => {
    if (filter === 'available') return car.status === 'ว่าง';
    if (filter === 'unavailable') return car.status === 'ไม่ว่าง';
    return true;
  });

  return (
    <main className={kanit.className}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        {/* Navbar */}
        <Navbar />

        <Layout style={{ padding: '0px 50px', marginTop: '20px', backgroundColor: '#fff' }}>
          {/* Sidebar */}
          <Sidebar />

          {/* เนื้อหาหลัก */}
          <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
            <Navigation />
            <Content
              style={{
                marginTop: '21px',
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  maxWidth: screens.xs ? '100%' : '800px',
                  margin: '0 auto',
                }}
              >
                <Title
                  level={2}
                  style={{
                    marginBottom: '24px',
                    font: '24px',
                    fontSize: screens.xs ? '20px' : '28px',
                    color: 'black',
                  }}
                >
                  ค้นหารถ
                </Title>

                <Divider />
                {/* Section: ค้นหารถ */}
                <div style={{ maxWidth: '700px', marginBottom: '32px', }}>
                  <Space size="large" direction="vertical" style={{ width: '100%', maxWidth: '800px' }}>
                    <div style={{marginLeft:'40px'}}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap',marginTop:'10px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องการ</label>
                          <DatePicker placeholder="วัน/เดือน/ปี" style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>เวลาเดินทาง</label>
                          <TimePicker
                            format="HH:mm"  // กำหนดให้แสดงเป็นเวลา (ชั่วโมง:นาที)
                            placeholder="เลือกเวลา"
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap',marginTop:'15px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องคืน</label>
                          <DatePicker placeholder="วัน/เดือน/ปี" style={{ width: '100%' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>เวลาคืนรถ</label>
                          <TimePicker
                            format="HH:mm"  // กำหนดให้แสดงเป็นเวลา (ชั่วโมง:นาที)
                            placeholder="เลือกเวลา"
                            style={{ width: '100%' }}
                          />
                        </div>
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
                      fontSize: screens.xs ? '14px' : '16px',
                    }}
                    onClick={handleSearch}
                    loading={loading}
                  >
                    ค้นหารถ
                  </Button>
                </div>

                <Divider />

                {/* ตัวเลือกสถานะ */}
                {cars.length > 0 && (
                  <>
                    <Title
                      level={2}
                      style={{
                        color: '#2C3E50',
                        fontWeight: '600',
                        marginBottom: '20px',
                        textAlign: 'start',
                        fontSize: '24px'
                      }}
                    >
                      เลือกรถที่ต้องการจอง
                    </Title>
                    <Button.Group
                      style={{
                        display: 'flex',
                        justifyContent: 'start',
                        gap: '12px',
                        margin: '20px 0px',
                      }}
                    >
                      <Button
                        type={filter === 'available' ? 'primary' : 'default'}
                        onClick={() => setFilter('available')}
                        style={{
                          borderRadius: '6px',
                          padding: '8px 20px',
                          fontSize: '14px',
                          fontWeight: filter === 'available' ? '600' : '400',
                          backgroundColor: filter === 'available' ? '#4CAF50' : '#FFFFFF',
                          color: filter === 'available' ? '#FFFFFF' : '#2C3E50',
                          border: 'none',
                        }}
                      >
                        เฉพาะว่าง
                      </Button>
                      <Button
                        type={filter === 'unavailable' ? 'primary' : 'default'}
                        onClick={() => setFilter('unavailable')}
                        style={{
                          borderRadius: '6px',
                          padding: '8px 20px',
                          fontSize: '14px',
                          fontWeight: filter === 'unavailable' ? '600' : '400',
                          backgroundColor: filter === 'unavailable' ? '#FF7043' : '#FFFFFF',
                          color: filter === 'unavailable' ? '#FFFFFF' : '#2C3E50',
                          border: 'none',
                        }}
                      >
                        ไม่ว่าง
                      </Button>
                      <Button
                        type={filter === 'all' ? 'primary' : 'default'}
                        onClick={() => setFilter('all')}
                        style={{
                          borderRadius: '6px',
                          padding: '8px 20px',
                          fontSize: '14px',
                          fontWeight: filter === 'all' ? '600' : '400',
                          backgroundColor: filter === 'all' ? '#2196F3' : '#FFFFFF',
                          color: filter === 'all' ? '#FFFFFF' : '#2C3E50',
                          border: 'none',
                        }}
                      >
                        ทุกสถานะ
                      </Button>
                    </Button.Group>

                    {/* แสดงรายการรถ */}
                    <List
                      grid={{
                        gutter: 16,
                        column: screens.xs ? 1 : 2,
                      }}
                      dataSource={filteredCars}
                      renderItem={(car) => (
                        <List.Item>
                          <Card
                            hoverable
                            style={{
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: 'none',
                              transition: 'transform 0.3s, box-shadow 0.3s',
                              overflow: 'hidden',
                            }}
                            bodyStyle={{ padding: '16px 20px' }}
                            cover={
                              <div
                                style={{
                                  position: 'relative',
                                  overflow: 'hidden',
                                  borderRadius: '12px 12px 0 0',
                                }}
                              >
                                <img
                                  alt={car.name}
                                  src={car.image}
                                  style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: screens.xs ? '160px' : '220px',
                                    transition: 'transform 0.3s',
                                  }}
                                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                                />
                              </div>
                            }
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <Title level={5} style={{ margin: 0, color: '#333' }}>
                                {car.plate}
                              </Title>
                              <p style={{ fontSize: screens.xs ? '14px' : '16px', color: '#555', margin: 0 }}>
                                รถ: {car.name}, {car.model}
                              </p>
                              <Badge
                                status={car.status === 'ว่าง' ? 'success' : 'error'}
                                text={
                                  <span style={{ fontSize: '14px', color: car.status === 'ว่าง' ? '#52c41a' : '#ff4d4f' }}>
                                    สถานะ: {car.status}
                                  </span>
                                }
                              />
                            </div>
                            <div style={{ marginTop: '12px', textAlign: 'right' }}>
                              <Link href="/users/home/car/complete/booking">
                                <Button
                                  type="primary"
                                  disabled={car.status !== 'ว่าง'}
                                  style={{
                                    background: car.status === 'ว่าง' ? '#029B36' : '#d9d9d9',
                                    borderColor: 'transparent',
                                    fontSize: screens.xs ? '14px' : '16px',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    transition: 'background 0.3s, transform 0.2s',
                                  }}
                                  onMouseOver={(e) => {
                                    if (car.status === 'ว่าง') e.target.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                  }}
                                >
                                  เลือก
                                </Button>
                              </Link>
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </>
                )}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </main>
  );
}

export default CarBooking;
