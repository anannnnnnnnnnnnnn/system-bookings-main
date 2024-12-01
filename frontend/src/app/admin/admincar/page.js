'use client';

import React, { useState } from 'react';
import { Layout, Card, Row, Col, Statistic, Calendar, Modal, Badge, List } from 'antd';
import { CarFilled, UserOutlined, ToolOutlined, IdcardOutlined } from '@ant-design/icons';
import Sidebar from './component/sidebar';
import Navbar from './component/navbar';

const { Content } = Layout;

const getListData = (value) => {
  let listData = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'processing', car: 'รถเก๋ง', time: '09:00 - 12:00', destination: 'การประชุมภายนอก' },
        { type: 'success', car: 'รถตู้', time: '13:00 - 16:00', destination: 'เดินทางไปโรงงาน' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', car: 'รถกระบะ', time: '10:00 - 12:00', destination: 'ส่งของที่คลังสินค้า' },
        { type: 'error', car: 'รถเก๋ง', time: '14:00 - 17:00', destination: 'เข้าอู่ซ่อม' },
      ];
      break;
    case 22:
      listData = [
        { type: 'processing', car: 'รถตู้', time: '08:00 - 12:00', destination: 'ตรวจสุขภาพพนักงาน' },
      ];
      break;
    default:
  }
  return listData || [];
};

const App = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const handleDateClick = (value) => {
    const bookings = getListData(value);
    if (bookings.length > 0) {
      setSelectedDate(value.format('YYYY-MM-DD'));
      setSelectedBookings(bookings);
      setIsModalVisible(true);
    }
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ padding: 0, listStyle: 'none', cursor: listData.length > 0 ? 'pointer' : 'default' }} onClick={() => handleDateClick(value)}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={`${item.car} (${item.time})`} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
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
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              {/* สถิติ */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>ข้อมูลสถิติ</h3>
                <Row gutter={[24, 24]} style={{ justifyContent: 'center' }}>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#a5d6a7', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Statistic
                        title="จำนวนรถ"
                        value={27}
                        prefix={<CarFilled style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#1b5e20', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#c5e1a5', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Statistic
                        title="สมาชิก"
                        value={114}
                        prefix={<UserOutlined style={{ color: '#388e3c' }} />}
                        valueStyle={{ color: '#2e7d32', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#aed581', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Statistic
                        title="Admin"
                        value={2}
                        prefix={<IdcardOutlined style={{ color: '#8bc34a' }} />}
                        valueStyle={{ color: '#4caf50', fontWeight: 'bold' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                    <Card bordered={false} style={{ backgroundColor: '#81c784', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
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
              <div style={{ marginTop: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '20px' }}>ปฏิทินการจองรถ</h3>
                <div
                  style={{
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    height: '500px', // กำหนดความสูงใหม่
                  }}
                >
                  <Calendar
                    dateCellRender={dateCellRender}
                    style={{
                      width: '100%',
                      transform: 'scale(0.8)', // ปรับให้เล็กลงอีก 
                      transformOrigin: 'top center',
                    }}
                  />
                </div>

              </div>
              {/* Modal แสดงข้อมูลการจอง */}
              <Modal
                title={`รายละเอียดการจองสำหรับวันที่ ${selectedDate}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered // ใช้ property นี้
              >
                <List
                  itemLayout="horizontal"
                  dataSource={selectedBookings}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            <Badge status={item.type} text={item.car} />
                            <span style={{ marginLeft: '10px' }}>เวลา: {item.time}</span>
                          </div>
                        }
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
