'use client';
import React from 'react';
import Sidebar from '../../components/sidebar';
import Navbar from '../../../navbar';
import { Layout, Typography, Row, Col, Input, Card, Divider,Button } from 'antd';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Text } = Typography;

function Confirm() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Layout style={{ padding: '0px 20px' }}>
          <Content
            bordered={false}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
              รายละเอียดการใช้รถ
            </Title>

            {/* Section: ข้อมูลรถ */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <img
                src="/path/to/car-image.jpg"
                alt="Car"
                style={{ width: '150px', height: '100px', borderRadius: '8px', marginRight: '16px', objectFit: 'cover' }}
              />
              <div>
                <Title level={4} style={{ marginBottom: '4px' }}>รถยนต์ Honda</Title>
                <p style={{ marginBottom: '4px' }}>วันที่ใช้งาน: 06 ก.พ. 58 เวลา 06:00</p>
                <p>ถึงวันที่: 10 ก.พ. 58 เวลา 17:55</p>
              </div>
            </div>

            <Divider />

            {/* Display Form Data */}
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>ใบจองรถ:</label>
                  <Input value="ไม่มี" disabled />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>เลขที่ใบจองรถ:</label>
                  <Input value="REV58020001" disabled />
                </div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>วันที่จอง:</label>
                  <Input value="22 ก.ค. 58" disabled />
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>เวลาเริ่มต้น:</label>
                  <Input value="07:00" disabled />
                </div>
              </Col>
              <Col span={6}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>เวลาสิ้นสุด:</label>
                  <Input value="15:55" disabled />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold' }}>สถานที่:</label>
              <Input value="ศูนย์ราชการ" disabled />
            </div>

            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>ใช้สำหรับแผนก:</label>
                  <Input value="การเงิน" disabled />
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>จำนวนผู้โดยสาร:</label>
                  <Input value="2 คน" disabled />
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: 'bold' }}>รายละเอียดเพิ่มเติม:</label>
              <Input value="เดินทางเพื่อประชุม" disabled />
            </div>

            {/* Divider for clean separation */}
            <Divider style={{ margin: '30px 0' }} />

            {/* Footer Buttons */}
            <div style={{ textAlign: 'right', marginTop: '24px' }}>

              <dive style={{ marginRight: '16px', }}>
                <Link href="/users/home/car/complete">
                  <Button type="default">ยกเลิก</Button>
                </Link>
              </dive>

              <Link href="/users/home/car/complete/comfirm">
                <Button type="primary" style={{ backgroundColor: '#029B36', borderColor: '#029B36' }}>
                  ยืนยันการจอง
                </Button>
              </Link>
            </div>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Confirm;
