'use client'

import React from 'react';
import { Layout, Table, Tag, Image } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

const { Content } = Layout;



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
      title: 'วันหมดอายุ พรบ.',
      dataIndex: 'insurance',
      key: 'insurance',
    },
    {
      title: 'วันหมดอายุประกันภัย',
      dataIndex: 'expiration',
      key: 'expiration',
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
          <p>ผู้รับผิดชอบ: นายวันอัสรี เจ๊ะหะ</p>
          <p>สถานะ: <Tag color="green">ใช้งานปกติ</Tag></p>
        </div>
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
          <p>ผู้รับผิดชอบ: อัครชัย ใจตรง</p>
          <p>สถานะ: <Tag color="green">ใช้งานปกติ</Tag></p>
        </div>
      ),
      insurance: '01 ก.ค. 2590',
      expiration: '01 มี.ค. 2600',
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
          <p>ผู้รับผิดชอบ: นายอารีฟ นิมะ</p>
          <p>สถานะ: <Tag color="red">ใช้งานไม่ได้</Tag></p>
        </div>
      ),
      insurance: '01 ก.ค. 2590',
      expiration: '01 มี.ค. 2600',
    },
  ];
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        <Sidebar />
        <Layout style={{ padding: '0px 20px' }}>
          <Content style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <h2>ข้อมูลรถ</h2>
            <Table columns={columns} dataSource={data} pagination={false} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default details;
