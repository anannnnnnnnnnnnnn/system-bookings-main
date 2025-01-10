'use client';
import React, { useState } from 'react';
import { Layout, Typography, Space, DatePicker, Divider, Button, List, Card, Badge, Grid, TimePicker, Meta,message } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Navigation from '../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import Link from 'next/link';
import { Kanit } from 'next/font/google';
import axios from 'axios';
import '/src/app/globals.css';
import { useRouter } from 'next/navigation';  // นำเข้า useRouter

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
  subsets: ['latin', 'thai'],
  weight: ['300', '400', '700'],
});

const { Title } = Typography;
const { useBreakpoint } = Grid;

function CarBooking() {
  const router = useRouter(); // ใช้ useRouter จาก next/navigation
  const [cars, setCars] = useState([]); // สถานะข้อมูลรถ
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [filter, setFilter] = useState('available'); // ตัวกรองสถานะรถ
  const [startDate, setStartDate] = useState(null); // วันเริ่มต้น
  const [endDate, setEndDate] = useState(null); // วันสิ้นสุด
  const [startTime, setStartTime] = useState(null); // เวลาเริ่มต้น
  const [endTime, setEndTime] = useState(null); // เวลาสิ้นสุด
  const screens = useBreakpoint();



  const handleSelectCar = (car) => {
    console.log("Selected car: ", car); // ตรวจสอบค่าของ car
    if (car && car.car_id) {
      router.push(`/users/home/car/complete/booking?carId=${car.car_id}&startDate=${startDate?.format('YYYY-MM-DD')}&endDate=${endDate?.format('YYYY-MM-DD')}&startTime=${startTime?.format('HH:mm')}&endTime=${endTime?.format('HH:mm')}`);
    } else {
      console.error("car.car_id is undefined or null");
    }
  };
  
  // ฟังก์ชันสำหรับค้นหารถตามวันที่และเวลา
  const handleSearch = async () => {
    // ตรวจสอบว่าได้กรอกเวลาเริ่มต้นและสิ้นสุดหรือไม่
    if (!startTime || !endTime) {
      message.warning('กรุณากรอกเวลาเริ่มต้นและสิ้นสุดก่อนค้นหารถ');  // แสดงข้อความเตือน
      return;  // หยุดการทำงานของฟังก์ชันหากไม่ได้กรอกเวลา
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5182/api/bookings/search', {
        params: {
          startDate: startDate?.format('YYYY-MM-DD'),
          endDate: endDate?.format('YYYY-MM-DD'),
          startTime: startTime?.format('HH:mm'),
          endTime: endTime?.format('HH:mm'),
        },
      });
      console.log('API Response:', response.data); // ดูข้อมูลทั้งหมด
      setCars(response.data); // เก็บข้อมูลรถที่ได้จาก API
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter((car) => {
    if (filter === 'available') return car.status === 1;  // Only available cars
    if (filter === 'unavailable') return car.status === 2; // Only unavailable cars
    return true; // Show all cars
  });


  return (
    <main className={kanit.className}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
        <Navbar />
        <Layout style={{ padding: '0px 50px', marginTop: '20px', backgroundColor: '#fff' }}>
          <Sidebar />
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
                    fontSize: screens.xs ? '20px' : '28px',
                    color: 'black',
                  }}
                >
                  ค้นหารถ
                </Title>

                <Divider />
                {/* Section: ค้นหารถ */}
                <div style={{ maxWidth: '700px', marginBottom: '32px' }}>
                  <Space size="large" direction="vertical" style={{ width: '100%', maxWidth: '800px' }}>
                    <div style={{ marginLeft: '40px' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>วันเริ่มต้น</label>
                          <DatePicker
                            placeholder="วัน/เดือน/ปี"
                            style={{ width: '100%' }}
                            onChange={(date) => setStartDate(date)}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>เวลาเริ่มต้น</label>
                          <TimePicker
                            format="HH:mm"
                            placeholder="เลือกเวลา"
                            style={{ width: '100%' }}
                            onChange={(time) => setStartTime(time)}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '15px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>วันสิ้นสุด</label>
                          <DatePicker
                            placeholder="วัน/เดือน/ปี"
                            style={{ width: '100%' }}
                            onChange={(date) => setEndDate(date)}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label style={{ fontWeight: 'bold' }}>เวลาสิ้นสุด</label>
                          <TimePicker
                            format="HH:mm"
                            placeholder="เลือกเวลา"
                            style={{ width: '100%' }}
                            onChange={(time) => setEndTime(time)}
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
                        fontSize: '24px',
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
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',  // เพิ่มมิติให้การ์ด
                              border: 'none',
                              transition: 'transform 0.3s, box-shadow 0.3s',
                              overflow: 'hidden',
                              backgroundColor: '#fefefe',  // สีพื้นหลังของการ์ด
                              display: 'flex',
                              flexDirection: 'column',  // ให้ทุกอย่างในการ์ดจัดระเบียบในแนวตั้ง
                              height: '100%',  // ทำให้การ์ดยืดความสูงเต็มพื้นที่
                            }}
                            bodyStyle={{
                              padding: '20px 24px',
                              flex: 1,  // ทำให้เนื้อหาภายในยืดตัวให้เต็มพื้นที่
                            }}
                            cover={
                              <div
                                style={{
                                  position: 'relative',
                                  overflow: 'hidden',
                                  borderRadius: '12px 12px 0 0',
                                  paddingBottom: '-10%',  // ทำให้ภาพมีอัตราส่วนที่เหมาะสม
                                }}
                              >
                                <img
                                  alt={car.name}
                                  src={`http://localhost:5182${car.image_url}`}  // ตรวจสอบให้แน่ใจว่า image_url ถูกต้อง
                                  style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    borderRadius: '12px 12px 0 0',  // มุมการ์ดที่โค้งมน
                                  }}
                                  onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                                  onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                                />
                              </div>
                            }
                          >
                            <Title level={5} style={{ margin: 0, fontSize: '16px', color: '#333' }}>
                              {car.plate}
                            </Title>

                            <div style={{ marginTop: '10px', color: '#777' }}>
                              <div style={{ marginBottom: '20px' }}>
                                <p style={{ margin: '5px 0', fontSize: '30px', fontWeight: 'bold' }}>
                                  {car.brand}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                  <strong>รุ่น:</strong> {car.model}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                                  <strong>ที่นั่ง:</strong> {car.seating_capacity} ที่นั่ง
                                </p>
                              </div>
                              {/* สถานะของรถ */}
                              <div
                                style={{
                                  marginTop: '20px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: '14px',
                                    color: car.status === 1 ? '#4CAF50' : '#FF4D4F',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {car.status === 1 ? 'ว่าง' : 'ไม่ว่าง'}
                                </span>


                                <Button
                                  type="primary"
                                  disabled={car.status !== 1}
                                  onClick={() => handleSelectCar(car)}  // เรียกใช้ฟังก์ชัน handleSelectCar
                                  style={{
                                    backgroundColor: car.status === 1 ? '#4CAF50' : '#d9d9d9',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    border: 'none',
                                    transition: 'background-color 0.3s',
                                  }}
                                >
                                  {car.status === 1 ? 'เลือก' : 'ไม่สามารถจองได้'}
                                </Button>

                              </div>
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
