'use client'

import React from 'react';
import { Layout, Table, Tag, Image, Divider, Typography } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../../navbar';
import Navigation from '../components/navigation';

const { Content } = Layout;
const { Title } = Typography;

function details() {
  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
    },
    {
      title: 'รูปรถ',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={100} alt="Car Image" />,
    },
    {
      title: 'รายละเอียดรถ',
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
      image: '/tests', // เปลี่ยนเป็น path รูปภาพจริง
      details: (
        <div>
          <p>รุ่น/ยี่ห้อ: MITSUBISHI</p>
          <p>ประเภท: รถแวนด์</p>
          <p>ทะเบียน: กค 7137 มค.</p>
          <p>จำนวนที่นั่ง: 5 ที่นั่ง</p>
          <p>เชื้อเพลิง: ดีเซล</p>

        </div>
      ),
      status: (
        <Tag color="green">ใช้งานปกติ</Tag>
      ),
      insurance: '1 ต.ค. 2578',
      expiration: '15 ธ.ค. 2580',
    },
    {
      key: '2',
      no: '2',
      image: '/test-image2.jpg', // เปลี่ยนเป็น path รูปภาพจริง
      details: (
        <div>
          <p>รุ่น/ยี่ห้อ: TOYOTA</p>
          <p>ประเภท: รถตู้</p>
          <p>ทะเบียน: ทร 1111 นร.</p>
          <p>จำนวนที่นั่ง: 16 ที่นั่ง</p>
          <p>เชื้อเพลิง: ดีเซล</p>

        </div>
      ),
      status: (
        <Tag color="green">ใช้งานปกติ</Tag>
      ),
      insurance: '01 ก.ค. 2590',
      expiration: '01 มี.ค. 2600',
    },
    {
      key: '3',
      no: '3',
      image: '/test-image2.jpg', // เปลี่ยนเป็น path รูปภาพจริง
      details: (
        <div>
          <p>รุ่น/ยี่ห้อ: TOYOTA</p>
          <p>ประเภท: รถตู้</p>
          <p>ทะเบียน: ทร 1111 นร.</p>
          <p>จำนวนที่นั่ง: 16 ที่นั่ง</p>
          <p>เชื้อเพลิง: ดีเซล</p>
        </div>
      ),
      status: (
        <Tag color="red">ใช้งานปกติ</Tag>
      ),
      insurance: '01 ก.ค. 2590',
      expiration: '01 มี.ค. 2600',
    },
  ];
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 50px', marginTop: '20px', backgroundColor: '#fff' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* เนื้อหาหลัก */}
        <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
          <Navigation/>
          <Content
            style={{
              marginTop: '21px',
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '10px' }}>
              <Title level={2} style={{ textAlign: 'start', marginBottom: '24px', color: 'black' }}>รายละเอียดรถ</Title>

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
};

export default details;
