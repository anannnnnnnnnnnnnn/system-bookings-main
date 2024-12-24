'use client'
import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Calendar, Modal, List, Badge, Divider } from 'antd';
import { TeamOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';
import Navbar from './component/navbar';
import Sidebar from './component/sidebar';
import Navigation from './component/navigation';

const { Content } = Layout;

// ข้อมูลการจองตัวอย่าง
const bookings = [
  {
    id: 1,
    room: 'ห้องประชุมใหญ่',
    time: '09:00 - 12:00',
    purpose: 'ประชุมแผนงานรายเดือน',
    startDate: '2024-12-08',
    endDate: '2024-12-08',
    bookedBy: 'User1',
  },
  {
    id: 2,
    room: 'ห้องประชุมย่อย 1',
    time: '13:00 - 15:00',
    purpose: 'ประชุมทีมโปรเจค A',
    startDate: '2024-12-10',
    endDate: '2024-12-10',
    bookedBy: 'User2',
  },
  {
    id: 3,
    room: 'ห้องประชุมย่อย 2',
    time: '10:00 - 12:00',
    purpose: 'อบรมพนักงาน',
    startDate: '2024-12-15',
    endDate: '2024-12-15',
    bookedBy: 'User3',
  },
  {
    id: 4,
    room: 'ห้องประชุมย่อย 2',
    time: '13:00 - 15:00',
    purpose: 'อบรมการเงิน',
    startDate: '2024-12-15',
    endDate: '2024-12-15',
    bookedBy: 'User4',
  },
];

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);



  // ฟังก์ชันดึงข้อมูลการจองสำหรับวันที่ที่เลือก
  const getBookingsForDate = (date) => {
    const formattedDate = date.format('YYYY-MM-DD');
    return bookings.filter(
      (b) => new Date(b.startDate) <= new Date(formattedDate) && new Date(b.endDate) >= new Date(formattedDate)
    );
  };

  // ฟังก์ชันที่ใช้เมื่อคลิกวันที่ในปฏิทิน
  const handleDateClick = (value) => {
    const date = value.format('YYYY-MM-DD');
    const bookingForDate = getBookingsForDate(value);

    if (bookingForDate.length > 0) {
      setSelectedDate(date);
      setSelectedBookings(bookingForDate);
      setIsModalVisible(true);
    }
  };

  const dateCellRender = (value) => {
    const bookingsForDate = getBookingsForDate(value);

    if (bookingsForDate.length > 0) {
      return (
        <div
          style={{
            backgroundColor: '#e8f5e9',
            border: '1px solid #66bb6a',
            borderRadius: '4px',
            padding: '5px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => handleDateClick(value)}
        >
          {bookingsForDate.map((booking, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              <strong>{booking.room}</strong>
              <br />
              <small>{booking.time}</small>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
      <Navbar />
      <Layout style={{ padding: '0px 50px', marginTop: '80px', backgroundColor: '#ffff' }}>
        <Sidebar />
        <Layout style={{ padding: '0px 20px', backgroundColor: '#ffff' }}>
          <Navigation />
          <div
            style={{
              marginTop: '21px',
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: '900px', margin: '0 auto' }}>
              {/* ข้อมูลสถิติ */}
              <div style={{ marginBottom: '30px', maxWidth: '900px' }}>
                <h3
                  style={{
                    marginBottom: '20px',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#333',
                    textAlign: 'start',
                  }}
                >
                  ข้อมูลสถิติ
                </h3>
                <Row gutter={[24, 24]} style={{ justifyContent: 'center' }}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: '#f0f4f7',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Statistic
                        title="จำนวนห้องประชุม"
                        value={5}
                        prefix={
                          <TeamOutlined
                            style={{
                              color: '#0288d1',
                              fontSize: '20px',
                            }}
                          />
                        }
                        valueStyle={{
                          color: '#0288d1',
                          fontWeight: '600',
                          fontSize: '22px',
                        }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: '#e1f5fe',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Statistic
                        title="การจองทั้งหมด"
                        value={23}
                        prefix={
                          <CalendarOutlined
                            style={{
                              color: '#00bcd4',
                              fontSize: '20px',
                            }}
                          />
                        }
                        valueStyle={{
                          color: '#0097a7',
                          fontWeight: '600',
                          fontSize: '22px',
                        }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                      bordered={false}
                      style={{
                        backgroundColor: '#d1c4e9',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Statistic
                        title="สมาชิก"
                        value={42}
                        prefix={
                          <IdcardOutlined
                            style={{
                              color: '#9c27b0',
                              fontSize: '20px',
                            }}
                          />
                        }
                        valueStyle={{
                          color: '#7b1fa2',
                          fontWeight: '600',
                          fontSize: '22px',
                        }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>


          <div
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Slightly more pronounced shadow for a more modern look
              height: '680px',
              overflow: 'hidden',
              margin: '30px 0',
              backgroundColor: '#fff', // Set background to white for a clean look
            }}
          >
            {/* Title Section */}
            <div
              style={{
                margin: '30px 20px', // Adjust margins for better spacing
                fontSize: '28px', // Smaller font size for a minimalist feel
                fontWeight: '600', // Bold for emphasis
                color: '#333', // Dark gray text for a neutral look
                textAlign: 'center', // Center the title
                letterSpacing: '1px', // Add slight letter spacing for a clean feel
              }}
            >
              ปฏิทิน
            </div>

            <Divider
              style={{
                margin: '0', // Remove extra space around divider
                borderColor: '#e0e0e0', // Lighter divider for a minimalist appearance
              }}
            />

            {/* Calendar Section */}
            <Calendar
              dateCellRender={dateCellRender}
              style={{
                width: '100%',
                transform: 'scale(0.85)', // Slightly reduce the scale for compactness
                transformOrigin: 'top center',
                fontFamily: 'var(--font-kanit)', // Ensure font consistency
                margin: '20px 0', // Add spacing around the calendar
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
                    title={`ห้อง: ${item.room} (เวลา: ${item.time})`}
                    description={`วัตถุประสงค์: ${item.purpose}`}
                  />
                </List.Item>
              )}
            />
          </Modal>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
