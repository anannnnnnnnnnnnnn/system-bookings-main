'use client'

import React, { useEffect, useState } from 'react';
import { Layout, Table, Image, Divider, Typography, Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from '../components/sidebar';
import Navbar from '../../navbar';

const { Content } = Layout;
const { Title } = Typography;

function Details() {
  const [cars, setCars] = useState([]);  // ใช้ state สำหรับเก็บข้อมูลจาก API

  const fuelTypes = {
    1: 'น้ำมัน',
    2: 'ไฟฟ้า',
  };

  const columns = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      align: 'center',
    },
    {
      title: 'รูปรถ',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (image) => (
        <div style={{ textAlign: 'center' }}>
          <Image
            src={`http://localhost:5182${image}`}
            width={100}
            alt="Car Image"
          />
        </div>
      ),
    },
    {
      title: 'รายละเอียดรถ',
      dataIndex: 'details',
      key: 'details',
      render: (text, record) => (
        <div style={{ margin: 0, padding: 0 }}>
          <p style={{ margin: 0, padding: 0 }}><strong>ยี่ห้อ:</strong> {record.brand}</p>
          <p style={{ margin: 0, padding: 0 }}><strong>รุ่น:</strong> {record.model}</p>
          <p style={{ margin: 0, padding: 0 }}><strong>ป้ายทะเบียน:</strong> {record.license_plate}</p>
          <p style={{ margin: 0, padding: 0 }}><strong>ความจุที่นั่ง:</strong> {record.seating_capacity}</p>
          <p><strong>ประเภทเชื่อเพลิง:</strong> {fuelTypes[record.fuel_type]}</p>
        </div>
      ),
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 1) {
          return <span style={{ color: 'green' }}>พร้อมใช้งาน</span>;
        } else if (status === 2) {
          return <span style={{ color: 'orange' }}>กำลังซ่อมแซม</span>;
        }
        return <span>ไม่ทราบสถานะ</span>;
      },
    },
  ];

  useEffect(() => {
    fetch('http://localhost:5182/api/cars')
      .then((response) => response.json())
      .then((data) => setCars(data))  // เก็บข้อมูลที่ดึงมาใน state
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Navbar />
      <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
        <Sidebar />
        <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
          <div style={{ display: "flex", alignItems: "center", margin: '0 100px' }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px",
              backgroundColor: "#d9e8d2", borderRadius: "50%", marginRight: "10px"
            }}>
              <HomeOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
            </div>
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <span style={{ fontWeight: "500", fontSize: "14px", color: "#666" }}>ระบบจองรถ</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span style={{ fontWeight: "500", fontSize: "14px", color: "#666" }}>ค้นหารถ</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span style={{ fontWeight: "500", fontSize: "14px", color: "#333" }}>กรอกรายละเอียด</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <Content style={{ marginTop: '21px', padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', marginTop: '10px' }}>
              <Title level={2} style={{ textAlign: 'start', marginBottom: '24px', color: 'black' }}>
                รายละเอียดรถ
              </Title>
              <Divider />
              <div style={{
                backgroundColor: '#fff', borderRadius: '12px', padding: '30px', overflow: 'hidden'
              }}>
                <Table columns={columns} dataSource={cars} pagination={false} />
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Details;
