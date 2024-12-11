'use client';

import React from 'react';
import { Layout, Table, Tag, Divider, Typography,Image } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

const { Content } = Layout;
const { Title } = Typography;

function Details() {
  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'รูปห้องประชุม',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={100} alt="Car Image" />,
    },
    {
      title: 'ห้องประชุม',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: 'รายละเอียดห้อง',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'สถานะการใช้งาน',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const data = [
    {
      key: '1',
      no: '1',
      room: 'ห้องประชุม A',
      details: (
        <div>
          <p>ขนาด: 20 ที่นั่ง</p>
          <p>อุปกรณ์: โปรเจคเตอร์, ไมโครโฟน</p>
          <p>สถานที่: ชั้น 3 อาคาร A</p>  
        </div>
      ),
      status: (
        <Tag color="green">ห้องว่าง</Tag>
      ),
    },
    {
      key: '2',
      no: '2',
      room: 'ห้องประชุม B',
      details: (
        <div>
          <p>ขนาด: 30 ที่นั่ง</p>
          <p>อุปกรณ์: โปรเจคเตอร์, เครื่องเสียง</p>
          <p>สถานที่: ชั้น 4 อาคาร B</p>
        </div>
      ),
      status: (
        <Tag color="green">ห้องว่าง</Tag>
      ),
    },
    {
      key: '3',
      no: '3',
      room: 'ห้องประชุม C',
      details: (
        <div>
          <p>ขนาด: 50 ที่นั่ง</p>
          <p>อุปกรณ์: โปรเจคเตอร์, ระบบเสียง, กล้อง</p>
          <p>สถานที่: ชั้น 5 อาคาร C</p>
        </div>
      ),
      status: (
        <Tag color="red">ห้องไม่ว่าง</Tag>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        <Sidebar />
        <Layout style={{ padding: '0px 20px' }}>
          <Content style={{ padding: '24px', backgroundColor: '#ffff' }}>
            <div style={{ maxWidth: '920px', margin: '0 auto', marginTop: '10px' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>
                รายละเอียดห้องประชุม
              </Title>

              <Divider />

              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',  // ปรับเงาให้ดูนุ่มนวล
                overflow: 'hidden'  // เพื่อป้องกันเงาหรือขอบที่อาจล้นจากตาราง
              }}>
                <Table columns={columns} dataSource={data} pagination={false} />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Details;
