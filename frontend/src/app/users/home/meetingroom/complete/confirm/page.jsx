'use client';

import React, { useEffect, useState } from 'react';
import { Typography, Divider, Layout, Card, Space, Button } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { Content } from 'antd/lib/layout/layout';
import { useRouter } from 'next/navigation';
import { CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ConfirmBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const router = useRouter(); // ใช้เพื่อเปลี่ยนหน้า

  useEffect(() => {
    // ดึงข้อมูลจาก sessionStorage
    const storedData = sessionStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    }
  }, []);

  if (!bookingData) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>กำลังโหลดข้อมูล...</p>;
  }
  const handleNext = () => {
    router.push('/users/home/meetingroom/complete/booking'); // เปลี่ยนหน้าโดยไม่ต้องใช้ query
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <Layout style={{ padding: '0px 20px' }}>
          <Content
            style={{
              padding: '24px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '16px', color: '#333' }}>
                ยืนยันการจอง
              </Title>
              <Divider />

              <Card
                bordered={false}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#fafafa',
                  marginBottom: '20px',
                }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <p>
                    <Text strong>เลขที่ใบจอง:</Text> {bookingData.bookingNumber}
                  </p>
                  <p>
                    <Text strong>วันที่-เวลา:</Text> {bookingData.bookingDate}
                  </p>
                  <p>
                    <Text strong>จุดประสงค์การใช้งาน:</Text> {bookingData.purpose}
                  </p>
                  <p>
                    <Text strong>ปลายทาง:</Text> {bookingData.destination}
                  </p>
                  <p>
                    <Text strong>จำนวนผู้โดยสาร:</Text> {bookingData.passengers}
                  </p>
                  <p>
                    <Text strong>แผนก/ฝ่าย:</Text> {bookingData.department}
                  </p>
                  <p>
                    <Text strong>เบอร์ติดต่อ:</Text> {bookingData.contactNumber}
                  </p>
                  <p>
                    <Text strong>ต้องการพนักงานขับรถ:</Text>{' '}
                    {bookingData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ'}
                  </p>
                </Space>
              </Card>

              {/* Action Buttons */}
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Button
                  type="default"
                  onClick={handleNext}
                  icon={<ArrowLeftOutlined />}
                  style={{ marginRight: '12px', borderRadius: '8px' }}
                >
                  ย้อนกลับ
                </Button>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  style={{ backgroundColor: '#029B36', borderColor: '#029B36', borderRadius: '8px' }}
                >
                  ยืนยันการจอง
                </Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ConfirmBooking;
