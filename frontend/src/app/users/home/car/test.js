'use client';

import React from 'react';
import { Layout, Calendar, Badge, Divider, Tag } from 'antd';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import { Content } from 'antd/lib/layout/layout';

const { Header } = Layout;

function Home() {
  // ข้อมูลการจองรถ
  const bookings = [
    {
      date: '2024-11-26',
      type: 'รถเก๋ง',
      time: '09:00 - 12:00',
      destination: 'การประชุมภายนอก',
      color: 'orange',
    },
    {
      date: '2024-11-27',
      type: 'รถตู้',
      time: '13:00 - 16:00',
      destination: 'เดินทางไปสาขาย่อย',
      color: 'green',
    },
    {
      date: '2024-11-28',
      type: 'รถบรรทุก HINO',
      time: '09:00 - 12:00',
      destination: 'ขนส่งสินค้า',
      color: 'blue',
    },
    {
      date: '2024-11-29',
      type: 'รถเก๋ง',
      time: '10:00 - 12:00',
      destination: 'ประชุมในบริษัท',
      color: 'purple',
    },
  ];

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
              status="processing"
              text={`${item.type} (${item.time})`}
              style={{ backgroundColor: item.color }}
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
          <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
            {/* ปฏิทิน */}
            <Calendar dateCellRender={dateCellRender} />
            <Divider />

            {/* รายการจองรถใต้ปฏิทิน */}
            <div style={{ marginTop: '20px' }}>
              <h3>สีประจำรถ</h3>
              {bookings.map((booking, index) => (
                <Tag key={index} color={booking.color} style={{ margin: '5px' }}>
                  {`${booking.type} - ${booking.destination} (${booking.time})`}
                </Tag>
              ))}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
