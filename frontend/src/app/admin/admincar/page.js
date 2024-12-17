'use client';

import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Calendar, Modal, List } from 'antd';
import { CarFilled, UserOutlined, ToolOutlined, IdcardOutlined } from '@ant-design/icons';
import Sidebar from './component/sidebar';
import Navbar from './component/navbar';

const { Content } = Layout;

// ข้อมูลการจองตัวอย่าง
const bookings = [
  {
    id: 1,
    car: 'รถเก๋ง',
    time: '09:00 - 12:00',
    destination: 'การประชุมภายนอก',
    startDate: '2024-12-08',
    endDate: '2024-12-10',
    bookedBy: 'User1',
  },
  {
    id: 2,
    car: 'รถกระบะ',
    time: '10:00 - 12:00',
    destination: 'ส่งของที่คลังสินค้า',
    startDate: '2024-12-20',
    endDate: '2024-12-22',
    bookedBy: 'User2',
  },
  {
    id: 3,
    car: 'รถตู้',
    time: '10:00 - 12:00',
    destination: 'ส่งของที่คลังสินค้า',
    startDate: '2024-12-10',
    endDate: '2024-12-15',
    bookedBy: 'User2',
  },
  {
    id: 4,
    car: 'รถกระบะ',
    time: '10:00 - 12:00',
    destination: 'ไปประชุม',
    startDate: '2024-12-11',
    endDate: '2024-12-12',
    bookedBy: 'User1',
  },
];

// รวมช่วงวันที่ที่จองติดกันโดยคนเดียวกัน
const mergeBookings = () => {
  let mergedBookings = [];
  bookings.sort((a, b) => new Date(a.startDate) - new Date(b.startDate)); // เรียงตามวันที่เริ่มต้น
  let current = bookings[0];

  for (let i = 1; i < bookings.length; i++) {
    const next = bookings[i];
    const currentEndDate = new Date(current.endDate);
    const nextStartDate = new Date(next.startDate);

    if (current.bookedBy === next.bookedBy && currentEndDate >= new Date(nextStartDate.setDate(nextStartDate.getDate() - 1))) {
      // รวมช่วงวันที่ที่จองติดกัน
      current.endDate = next.endDate;
    } else {
      mergedBookings.push(current);
      current = next;
    }
  }
  mergedBookings.push(current);
  return mergedBookings;
};

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const mergedBookings = mergeBookings();

  const handleDateClick = (value) => {
    const date = value.format('YYYY-MM-DD');
    const bookingForDate = mergedBookings.find(
      (b) => new Date(b.startDate) <= new Date(date) && new Date(b.endDate) >= new Date(date)
    );

    if (bookingForDate) {
      setSelectedDate(date);
      setSelectedBookings([bookingForDate]);
      setIsModalVisible(true);
    }
  };

  const getCarColor = (carType) => {
    // กำหนดสีตามประเภทของรถ
    switch (carType) {
      case 'รถเก๋ง':
        return '#4caf50'; // สีเขียว
      case 'รถตู้':
        return '#2196f3'; // สีน้ำเงิน
      case 'รถกระบะ':
        return '#ff9800'; // สีส้ม
      default:
        return '#9e9e9e'; // สีเทาสำหรับรถที่ไม่ระบุประเภท
    }
  };

  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const bookingsForDate = mergedBookings.filter(
      (b) => new Date(b.startDate) <= new Date(date) && new Date(b.endDate) >= new Date(date)
    );

    if (bookingsForDate.length > 0) {
      return (
        <div
          style={{
            backgroundColor: '#e0f7fa',
            border: '1px solid #26a69a',
            borderRadius: '4px',
            padding: '5px',
            cursor: 'pointer',
            textAlign: 'center',
            position: 'relative',
          }}
          onClick={() => handleDateClick(value)}
        >
          {bookingsForDate.map((booking, index) => {
            const isStartDate = booking.startDate === date;
            const isEndDate = booking.endDate === date;
            const barColor = getCarColor(booking.car); // ใช้สีที่กำหนดจาก getCarColor

            return (
              <div
                key={index}
                style={{
                  position: 'relative',
                  margin: '2px 0',
                }}
              >
                {isStartDate && (
                  <>
                    <strong>{booking.car}</strong>
                    <br />
                    <small>{booking.time}</small>
                    <br />
                    <small>{booking.destination}</small>
                  </>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: isStartDate ? '50%' : 0,
                    right: isEndDate ? '50%' : 0,
                    backgroundColor: barColor, // ใช้สีที่กำหนด
                    opacity: 0.3,
                    zIndex: -1,
                  }}
                />
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout style={{ padding: "0px 20px", marginTop: "65px" }}>
        <Sidebar />
        <Layout style={{ padding: "0px 20px" }}>
          <Content
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              marginTop: '20px',
            }}
          >
            <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: '900px', margin: '0 auto' }}>
              {/* ข้อมูลสถิติ */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>ข้อมูลสถิติ</h3>
                <Row gutter={[24, 24]} style={{ justifyContent: 'center' }}>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#a5d6a7', borderRadius: '8px' }}>
                      <Statistic
                        title="จำนวนรถ"
                        value={27}
                        prefix={<CarFilled style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#1b5e20', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                      <Statistic
                        title="สมาชิก"
                        value={114}
                        prefix={<UserOutlined style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#2e7d32', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#aed581', borderRadius: '8px' }}>
                      <Statistic
                        title="Admin"
                        value={2}
                        prefix={<IdcardOutlined style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#4caf50', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#81c784', borderRadius: '8px' }}>
                      <Statistic
                        title="พนักงานขับรถ"
                        value={11}
                        prefix={<ToolOutlined style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#2e7d32', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* ปฏิทิน */}
              <h3 style={{ marginBottom: '20px' }}>ปฏิทินการจองรถ</h3>
              <div
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  height: '500px', // ขนาดเท่าเดิม
                  overflow: 'hidden',

                }}
              >
                <Calendar
                  dateCellRender={dateCellRender}
                  style={{
                    width: '100%',
                    transform: 'scale(0.8)', // ย่อให้ดูเหมือนก่อน
                    transformOrigin: 'top center',
                    fontFamily: 'var(--font-kanit)',
                  }}
                />
              </div>

              {/* Modal */}
              <Modal
                style={{ fontFamily: 'var(--font-kanit)' }}
                title={`รายละเอียดการจองสำหรับวันที่ ${selectedDate}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
              >
                <List
                  style={{ fontFamily: 'var(--font-kanit)' }}
                  itemLayout="horizontal"
                  dataSource={selectedBookings}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={`รถ: ${item.car} (เวลา: ${item.time})`}
                        description={`ปลายทาง: ${item.destination}`}
                      />
                    </List.Item>
                  )}
                />
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
