'use client';
import React, { useState } from 'react';
import { Layout, Typography, Space, DatePicker, Divider, Button, List, Card, Badge, Grid, Breadcrumb, Tag, message } from 'antd';
import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import Sidebar from '../components/sidebar';
import Navbar from '../../navbar';
import Navigation from '../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import Link from 'next/link';
import { Kanit } from 'next/font/google';
import axios from 'axios';
import '/src/app/globals.css';
import { useRouter } from 'next/navigation';  // นำเข้า useRouter
import moment from 'moment'; // ถ้ายังไม่ได้ import moment

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

  const [formData, setFormData] = useState({
    selectedTime: [], // Initialize with an empty array or default selected times
  });

  const unavailableTimes = []; // เวลาที่ไม่สามารถเลือกได้

  const validateSearchInputs = () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      message.warning('กรุณากรอกข้อมูลให้ครบก่อนค้นหา');
      return false;
    }
    return true;
  };

  const handleTimeSelect = (time) => {
    // ตรวจสอบว่าช่วงเวลานี้ไม่สามารถเลือกได้หรือไม่
    if (unavailableTimes.includes(time)) {
      message.error('เวลานี้ไม่สามารถเลือกได้'); // แสดงข้อความแสดงข้อผิดพลาด
      return; // หยุดการทำงานของฟังก์ชัน
    }

    const selectedTimes = [...formData.selectedTime];

    if (selectedTimes.includes(time)) {
      // หากเลือกปุ่มที่ถูกเลือกอยู่แล้ว ให้ยกเลิกการเลือก
      setFormData({
        ...formData,
        selectedTime: selectedTimes.filter(item => item !== time),
      });
    } else if (selectedTimes.length < 2) {
      // หากยังเลือกไม่ถึง 2 ปุ่ม ให้เลือก
      selectedTimes.push(time);
      setFormData({
        ...formData,
        selectedTime: selectedTimes,
      });

      // กำหนดค่า startTime และ endTime จากการเลือก
      if (selectedTimes.length === 1) {
        setStartTime(time);  // กำหนดเวลาเริ่มต้น
      } else if (selectedTimes.length === 2) {
        setEndTime(time);  // กำหนดเวลาสิ้นสุด
      }
    }
  };

  // For example, you can fetch unavailable times from an API or set them manually
  const fetchUnavailableTimes = async () => {
    try {
      const response = await axios.get('http://localhost:5182/api/bookings/unavailable-times');
      setUnavailableTimes(response.data); // Assuming the response is an array of times
    } catch (error) {
      console.error('Error fetching unavailable times:', error);
    }
  };

  const handleSelectCar = (car) => {
    // ตรวจสอบว่ามี startTime และ endTime หรือไม่
    if (!startTime || !endTime) {
      message.error('กรุณาเลือกเวลาที่ต้องการ');
      return;
    }
    // ตรวจสอบว่า car มีข้อมูล
    if (car && car.car_id) {
      const formattedStartDate = startDate ? startDate.format('YYYY-MM-DD') : '';
      const formattedEndDate = endDate ? endDate.format('YYYY-MM-DD') : '';

      router.push(`/users/home/car/complete/booking?carId=${car.car_id}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&startTime=${startTime}&endTime=${endTime}`);
    } else {
      console.error("car.car_id is undefined or null");
    }
  };

  // ฟังก์ชันสำหรับค้นหารถตามวันที่และเวลา
  // ฟังก์ชัน handleSearch
  const handleSearch = async () => {
    if (!validateSearchInputs()) return;
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);

    if (
      !startDate?.isValid?.() || // ตรวจสอบว่า startDate เป็น Moment และ valid
      !endDate?.isValid?.() ||   // ตรวจสอบว่า endDate เป็น Moment และ valid
      !startTime ||              // ตรวจสอบว่า startTime มีค่า
      !endTime                   // ตรวจสอบว่า endTime มีค่า
    ) {
      message.warning('กรุณากรอกข้อมูลทั้งหมดก่อนค้นหารถ');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5182/api/bookings/search', {
        params: {
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          startTime: startTime, // สมมติว่า startTime อยู่ในรูป 'HH:mm'
          endTime: endTime,     // สมมติว่า endTime อยู่ในรูป 'HH:mm'
        },
      });
      console.log('API Response:', response.data);
      setCars(response.data);
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
      {/* Layout หลักที่ครอบทุกส่วน */}
      <Layout style={{backgroundColor: '#fff' }}>
        {/* Navbar */}
        <Navbar />

        {/* Layout หลักของหน้า */}
        <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
          {/* Sidebar */}
          <Sidebar />

          {/* Layout ด้านขวาหลัก */}
          <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
            {/* Breadcrumb */}
            {/* ไอคอนหลัก */}
            <div
              style={{
                display: "flex",
                alignItems: "center", // จัดให้อยู่กลางแนวตั้ง
                margin:'0 100px'
             
              }}
            >
              {/* ไอคอนหลัก */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#d9e8d2", // สีพื้นหลังไอคอน
                  borderRadius: "50%", // รูปทรงกลม
                  marginRight: "10px", // ระยะห่างระหว่างไอคอนและข้อความ
                }}
              >
                <HomeOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
              </div>

              {/* Breadcrumb */}
              <Breadcrumb separator=">">
                <Breadcrumb.Item>
                  <span
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#333", // สีข้อความหลัก
                    }}
                  >
                    ระบบจองรถ
                  </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span
                    style={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#333", // สีข้อความรอง
                    }}
                  >
                    ค้นหารถ
                  </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            {/* Content */}
            <Content
              style={{
                marginTop: '10px',    
                padding: '24px',
                backgroundColor: '#fff',
                borderRadius: '8px',
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
                  จองรถ
                </Title>

                <Divider />
                {/* Section: ค้นหารถ */}
                <div style={{ maxWidth: '1200px', marginBottom: '32px' }}>
                  <Space size="large" direction="vertical" style={{ width: '100%', maxWidth: '800px' }}>
                    <div style={{ marginLeft: '40px' }}>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ flex: 1, minWidth: '100px' }}>
                            <Title style={{
                              marginBottom: '16px',
                              fontWeight: 'bold',
                              fontSize: '20px',
                              color: '#4D4D4D'
                            }}>เวลาที่การจอง</Title>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', margin: '0 50px' }}>
                            <DatePicker.RangePicker
                              format="YYYY-MM-DD"
                              value={startDate && endDate ? [startDate, endDate] : null}
                              onChange={(dates) => {
                                if (dates) {
                                  setStartDate(dates[0]);
                                  setEndDate(dates[1]);
                                } else {
                                  setStartDate(null);
                                  setEndDate(null);
                                }
                              }}
                              placeholder={["วันที่ต้องการจอง", "วันที่สิ้นสุดการจอง"]}
                              style={{ width: '90%' }}
                            />

                          </div>
                        </div>
                        <Divider style={{ marginBottom: '10px' }} />
                        <div style={{ margin: '0px' }}>
                          <h2
                            style={{
                              marginBottom: '16px',
                              fontWeight: 'bold',
                              fontSize: '20px',
                              color: '#4D4D4D',
                            }}
                          >
                            เลือกเวลาที่ต้องการจอง
                          </h2>
                          {[
                            { label: 'ก่อนเที่ยง', times: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'] },
                            { label: 'หลังเที่ยง', times: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'] }
                          ].map((section, sectionIndex) => (
                            <div key={sectionIndex} style={{ marginBottom: '20px' }}>
                              <p
                                style={{
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  marginBottom: '12px',
                                  color: '#4D4D4D',
                                  fontFamily: 'Arial, sans-serif',
                                  textTransform: 'uppercase',
                                  margin: '20px 50px'
                                }}
                              >
                                {section.label}
                              </p>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: '0 50px' }}>
                                {section.times.map((time, index) => {
                                  const isSelected = formData.selectedTime.includes(time);
                                  const selectedIndex = formData.selectedTime.indexOf(time);

                                  // ปุ่มที่เลือกครบ 2 ปุ่มแล้วจะไม่สามารถเลือกได้
                                  const isDisabled = formData.selectedTime.length >= 2 && !isSelected;

                                  // กำหนดสีตามการเลือก (ปุ่มแรกสีเขียว, ปุ่มที่สองสีแดง)
                                  let buttonStyle = {
                                    borderRadius: '10px',
                                    width: '100px',
                                    height: '30px',
                                    fontWeight: 'bold',
                                    padding: '8px 18px',
                                    border: isSelected ? '2px solid' : '2px solid #ccc',
                                    backgroundColor: isSelected
                                      ? selectedIndex === 0
                                        ? '#478D00' // สีเขียวสำหรับปุ่มแรก
                                        : '#FF4D4F'  // สีแดงสำหรับปุ่มที่สอง
                                      : isDisabled ? '#f5f5f5' : '#ffffff', // สีเทาสำหรับปุ่มที่ไม่สามารถเลือกได้
                                    color: isSelected ? '#fff' : isDisabled ? '#a9a9a9' : '#333',
                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                  };
                                  return (
                                    <Button
                                      key={index}
                                      type={isSelected ? 'primary' : 'default'}
                                      disabled={unavailableTimes.includes(time) || isDisabled}
                                      style={buttonStyle}
                                      onClick={() => handleTimeSelect(time)}
                                    >
                                      {time}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
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
