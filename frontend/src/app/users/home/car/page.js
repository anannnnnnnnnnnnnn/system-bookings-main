'use client';

import React, { useState } from 'react';
import { Layout, Calendar, Badge, Divider, Tag, Typography, Modal, List } from 'antd';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { Content } from 'antd/lib/layout/layout';
import Navigation from './components/navigation';

const { Header } = Layout;
const { Title } = Typography;

function Home() {
  // ข้อมูลการจองรถ
  const bookings = [
    {
      date: '2024-12-26',
      type: 'รถเก๋ง',
      time: '09:00 - 12:00',
      destination: 'การประชุมภายนอก',
    },
    {
      date: '2024-12-26',
      type: 'รถเก๋ง',
      time: '09:00 - 12:00',
      destination: 'การประชุมภายนอก',
    },
    {
      date: '2024-12-27',
      type: 'รถตู้',
      time: '13:00 - 16:00',
      destination: 'เดินทางไปสาขาย่อย',
    },
    {
      date: '2024-11-27',
      type: 'รถบัส',
      time: '13:00 - 16:00',
      destination: 'เดินทางไปสาขาย่อย',
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);

  // สีประจำรถ (สีมินิมอล)
  const carColors = {
    รถเก๋ง: '#a3d8f4', // สีฟ้าพาสเทล
    รถตู้: '#c8e6c9', // สีเขียวพาสเทล
    รถบัส: '#ffebc2', // สีส้มอ่อน
  };

  // ฟังก์ชันกรองข้อมูลตามวันที่
  const getListData = (value) => {
    const formattedDate = value.format('YYYY-MM-DD');
    return bookings.filter((booking) => booking.date === formattedDate);
  };

  // ฟังก์ชันจัดการแสดงผลในเซลล์วันที่
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {listData.map((item, index) => (
          <li key={index} style={{ marginBottom: '8px' }}>
            <Badge
              color={carColors[item.type] || '#dcdcdc'} // ใช้สีประจำรถที่มินิมอล
              text={`${item.type} (${item.time})`}
            />
            <div style={{ fontSize: '12px', color: '#888' }}>{item.destination}</div>
          </li>
        ))}
      </ul>
    );
  };

  // ฟังก์ชันเมื่อเลือกวันที่
  const onSelectDate = (value) => {
    const listData = getListData(value);
    setSelectedBookings(listData);  // เก็บข้อมูลการจองที่เลือก
    setIsModalVisible(true);  // เปิด Modal
  };

  return (
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
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'start', marginBottom: '24px', color: 'black' }}>ปฏิทิน</Title>

              <Divider />

              {/* ปฏิทิน */}
              <div style={{ marginTop: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '20px' }}>ปฏิทินการจองรถของสำนักงาน</h3>
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
                    onSelect={onSelectDate}  // เพิ่มฟังก์ชันนี้
                    style={{
                      width: '100%',
                      transform: 'scale(0.8)', // ปรับให้เล็กลงอีก 
                      transformOrigin: 'top center',
                    }}
                  />
                </div>
              </div>

              {/* รายการจองรถใต้ปฏิทิน */}
              <div style={{ marginTop: '10px' }}>
                <h3>สีประจำรถ</h3>
                {Object.entries(carColors).map(([type, color]) => (
                  <Tag key={type} color={color} style={{ marginBottom: '5px', display: 'flex' }}>
                    {type}
                  </Tag>
                ))}
              </div>

              {/* Modal สำหรับแสดงข้อมูลการจอง */}
              <Modal
                title={`รายละเอียดการจอง`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
              >
                <List
                  itemLayout="horizontal"
                  dataSource={selectedBookings}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div>
                            <Badge status={item.type} text={item.type} />
                            <span style={{ marginLeft: '10px' }}>เวลา: {item.time}</span>
                          </div>
                        }
                        description={`วัตถุประสงค์: ${item.destination}`}
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
}

export default Home;
