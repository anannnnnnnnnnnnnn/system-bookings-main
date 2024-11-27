  'use client';

  import React, { useState } from 'react';
  import { Layout, Typography, Input, Radio, Button, Divider } from 'antd';
  import { useRouter } from 'next/navigation'; // สำหรับเปลี่ยนหน้า
  import Navbar from '../../components/navbar';
  import Sidebar from '../../components/sidebar';
  import { Content } from 'antd/lib/layout/layout';

  const { TextArea } = Input;
  const { Title } = Typography;

  const MeetingBooking = () =>{
    const router = useRouter(); // ใช้เพื่อเปลี่ยนหน้า
    const [formData, setFormData] = useState({
      bookingNumber: 'ABC0000001',
      bookingDate: '',
      purpose: '',
      department: '',
      participants: '',
      contactNumber: '',
      roomRequired: 'yes',
      
      
    });

    // ฟังก์ชันจัดการการเปลี่ยนแปลงข้อมูล
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    // ฟังก์ชันจัดการเปลี่ยนหน้าพร้อมส่งข้อมูล
    const handleNext = () => {
      sessionStorage.setItem('bookingData', JSON.stringify(formData)); // เก็บข้อมูลลงใน sessionStorage
      router.push('/users/home/meetingroom/complete/confirm'); // เปลี่ยนหน้าโดยไม่ต้องใช้ query
    };

    return (
      <Layout style={{ minHeight: '100vh' }}>
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
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>
                  รายละเอียดการจองห้องประชุม
                </Title>

                <Divider />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>เลขที่ใบจอง</label>
                    <Input value={formData.bookingNumber} disabled />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลา</label> {bookingDate.showTime}
                  
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>จุดประสงค์การประชุม</label>
                    <TextArea name="purpose" rows={2} placeholder="กรุณาระบุจุดประสงค์" onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>แผนก/ฝ่าย</label>
                    <Input name="department" placeholder="กรุณาป้อนแผนกหรือฝ่าย" onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>จำนวนผู้เข้าร่วมประชุม</label>
                    <Input type="number" name="participants" placeholder="จำนวนผู้เข้าร่วมประชุม" onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ fontWeight: 'bold' }}>เบอร์ติดต่อ</label>
                    <Input name="contactNumber" placeholder="กรุณาป้อนเบอร์ติดต่อ" onChange={handleChange} />
                  </div>

                </div>

                <Divider />

                <div style={{ textAlign: 'right', marginTop: '24px' }}>
                  <Button type="primary" onClick={handleNext}>
                    ถัดไป
                  </Button>
                </div>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }

  export default MeetingBooking;
