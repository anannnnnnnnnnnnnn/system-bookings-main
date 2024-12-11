'use client';

import React from 'react';
import { Layout, Calendar, Badge, Divider, Tag,Typography } from 'antd';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { Content } from 'antd/lib/layout/layout';

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

  // สีประจำรถ
  const carColors = {
    รถเก๋ง: '#ff5733', // สีแดง
    รถตู้: '#33cc33', // สีเขียว
    รถบัส: '#0077ff', // สีน้ำเงิน
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
              color={carColors[item.type] || 'default'}
              text={`${item.type} (${item.time})`}
            />
            <div style={{ fontSize: '12px', color: '#888' }}>{item.destination}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* เนื้อหาหลักของหน้า */}
        <Layout style={{ padding: '0px 20px' }}>
          <Content style={{ padding: '24px', backgroundColor: '#ffff' }}>
            <div style={{ maxWidth: '920px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>ปฎิทิน</Title>

              <Divider />
              
              {/* ปฏิทิน */}
              <Calendar dateCellRender={dateCellRender} />
              <Divider />

              {/* รายการจองรถใต้ปฏิทิน */}
              <div style={{ marginTop: '10px' }}>
                <h3>สีประจำรถ</h3>
                {Object.entries(carColors).map(([type, color]) => (
                  <Tag key={type} color={color} style={{ marginBottom: '5px', display: 'flex' }}>
                    {type}
                  </Tag>
                ))}
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
