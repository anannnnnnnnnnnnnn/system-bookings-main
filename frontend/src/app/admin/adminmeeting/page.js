'use client';

import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Calendar, Modal, List } from 'antd';
import { TeamOutlined, CalendarOutlined, IdcardOutlined } from '@ant-design/icons';
import Navbar from './component/navbar';
import Sidebar from './component/sidebar';

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

  const handleDateClick = (value) => {
    const date = value.format('YYYY-MM-DD');
    const bookingForDate = bookings.filter(
      (b) => new Date(b.startDate) <= new Date(date) && new Date(b.endDate) >= new Date(date)
    );

    if (bookingForDate.length > 0) {
      setSelectedDate(date);
      setSelectedBookings(bookingForDate);
      setIsModalVisible(true);
    }
  };

  const dateCellRender = (value) => {
    const date = value.format('YYYY-MM-DD');
    const bookingsForDate = bookings.filter(
      (b) => new Date(b.startDate) <= new Date(date) && new Date(b.endDate) >= new Date(date)
    );

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
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout style={{ padding: '0px 20px', marginTop: '65px' }}>
        <Sidebar />
        <Layout style={{ padding: '0px 20px' }}>
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
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card bordered={false} style={{ backgroundColor: '#ffcc80', borderRadius: '8px' }}>
                      <Statistic
                        title="จำนวนห้องประชุม"
                        value={5}
                        prefix={<TeamOutlined style={{ color: '#ef6c00' }} />}
                        valueStyle={{ color: '#e65100', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card bordered={false} style={{ backgroundColor: '#80deea', borderRadius: '8px' }}>
                      <Statistic
                        title="การจองทั้งหมด"
                        value={23}
                        prefix={<CalendarOutlined style={{ color: '#00838f' }} />}
                        valueStyle={{ color: '#006064', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card bordered={false} style={{ backgroundColor: '#b39ddb', borderRadius: '8px' }}>
                      <Statistic
                        title="สมาชิก"
                        value={42}
                        prefix={<IdcardOutlined style={{ color: '#5e35b1' }} />}
                        valueStyle={{ color: '#4527a0', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* ปฏิทิน */}
              <h3 style={{ marginBottom: '20px' }}>ปฏิทินการจองห้องประชุม</h3>
              <div
                style={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  height: '500px',
                  overflow: 'hidden',
                }}
              >
                <Calendar
                  dateCellRender={dateCellRender}
                  style={{
                    width: '100%',
                    transform: 'scale(0.8)',
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
                        title={`ห้อง: ${item.room} (เวลา: ${item.time})`}
                        description={`วัตถุประสงค์: ${item.purpose}`}
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
