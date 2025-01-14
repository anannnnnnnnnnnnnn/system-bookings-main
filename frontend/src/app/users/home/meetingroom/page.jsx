'use client';

import React, { useState } from 'react';
import { Layout, Calendar, Badge, Divider, Tag, Typography, Modal, List } from 'antd';
import Navbar from '../navbar';
import Sidebar from './components/sidebar';
import Navigation from './components/navigation';
import { Content } from 'antd/lib/layout/layout';

const { Header } = Layout;
const { Title } = Typography;

function Home() {
  // ข้อมูลการจองห้องประชุม
  const bookings = [
    {
      date: '2024-12-26',
      room: 'ห้องประชุม A',
      time: '09:00 - 12:00',
      purpose: 'ประชุมภายนอก',
    },
    {
      date: '2024-12-26',
      room: 'ห้องประชุม B',
      time: '13:00 - 16:00',
      purpose: 'อบรมพนักงาน',
    },
    {
      date: '2024-12-27',
      room: 'ห้องประชุม C',
      time: '09:00 - 12:00',
      purpose: 'การประชุมทางธุรกิจ',
    },
    {
      date: '2024-11-27',
      room: 'ห้องประชุม D',
      time: '13:00 - 16:00',
      purpose: 'การนำเสนอโครงการ',
    },
  ];

  // สีประจำห้องประชุม
  const roomColors = {
    'ห้องประชุม A': '#ff5733', // สีแดง
    'ห้องประชุม B': '#33cc33', // สีเขียว
    'ห้องประชุม C': '#0077ff', // สีน้ำเงิน
    'ห้องประชุม D': '#f39c12', // สีเหลือง
  };

  // สถานะของ Modal และข้อมูลการจองที่เลือก
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBookings, setSelectedBookings] = useState([]);

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
              color={roomColors[item.room] || 'default'}
              text={`${item.room} (${item.time})`}
            />
            <div style={{ fontSize: '12px', color: '#888' }}>{item.purpose}</div>
          </li>
        ))}
      </ul>
    );
  };

  // ฟังก์ชันที่เปิด Modal เมื่อเลือกวันที่
  const onSelectDate = (value) => {
    const listData = getListData(value);
    setSelectedBookings(listData);  // เก็บข้อมูลการจองที่เลือก
    setIsModalVisible(true);  // เปิด Modal
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 49px', marginTop: '20px', backgroundColor: '#fff' }}>
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

          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'start', marginBottom: '24px', color: 'black' }}>หน้าหลัก</Title>

              <Divider />

              {/* ปฏิทิน */}
              <div style={{ marginTop: '20px', maxWidth: '900px', margin: '0 auto' }}>
                <h3 style={{ marginBottom: '20px' }}>ปฏิทินการจองห้องประชุม</h3>
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
                <Divider />

                {/* รายการจองห้องประชุมใต้ปฏิทิน */}
                <div style={{ marginTop: '10px' }}>
                  <h3>สีประจำห้องประชุม</h3>
                  {Object.entries(roomColors).map(([room, color]) => (
                    <Tag key={room} color={color} style={{ marginBottom: '5px', display: 'flex' }}>
                      {room}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal สำหรับแสดงข้อมูลการจอง */}
            <Modal
              title={`รายละเอียดการจองห้องประชุม`}
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
                          <Badge status={item.room} text={item.room} />
                          <span style={{ marginLeft: '10px' }}>เวลา: {item.time}</span>
                        </div>
                      }
                      description={`วัตถุประสงค์: ${item.purpose}`}
                    />
                  </List.Item>
                )}
              />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
