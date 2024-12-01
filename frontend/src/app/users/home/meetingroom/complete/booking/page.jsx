'use client';

import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Divider, Modal, Checkbox, } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { Content } from 'antd/lib/layout/layout';
import { CheckOutlined, FileTextOutlined, CalendarOutlined, TeamOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
  const [formData, setFormData] = useState({
    roomImage: 'url-to-room-image', // ใส่ URL ของภาพห้อง
    roomName: 'Conference Room A',
    capacity: '10 คน',
    amenities: 'โปรเจคเตอร์, กระดานไวท์บอร์ด',
    startDate: '2024-12-01',
    endDate: '2024-12-05',
    bookingNumber: 'RM001',
    bookingDate: '2024-12-05',
    purpose: '',
    department: '',
    contactNumber: '',
    additionalEquipment: [], // เก็บข้อมูลอุปกรณ์เสริม
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirm = () => {
    sessionStorage.setItem('bookingData', JSON.stringify(formData));
    window.location.href = '/users/home/meetingroom/complete/approv';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        <Sidebar />
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
              <Title
                level={3}
                style={{ textAlign: 'left', marginBottom: '16px', color: 'black', fontSize: '20px' }}
              >
                <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                รายละเอียดการจองห้องประชุม
              </Title>
              <Divider />

              {/* ข้อมูลห้องประชุมและรูปภาพ */}
              <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                  }}
                >
                  <img
                    src="/path-to-room-image.jpg"
                    alt="Meeting Room"
                    style={{
                      width: '25%',
                      height: '150px',
                      borderRadius: '12px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      marginRight: '16px',
                    }}
                  />
                  <div style={{ flex: 1, textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
                    <Text
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '16px',
                      }}
                    >
                    {formData.roomName}
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '16px',
                        fontSize: '12px',
                        color: '#555',
                      }}
                    >
                      <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>1234-XYZ</Text><br />

                      <p style={{ margin: '8px 0' }}>
                        <strong>ความจุ:</strong> {formData.capacity}
                      </p>
                      <p style={{ margin: '8px 0' }}>
                        <strong>อุปกรณ์:</strong> {formData.amenities}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* ฟอร์มการจอง */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontWeight: 'bold' }}>
                    <FileTextOutlined style={{ marginRight: '8px' }} />
                    เลขที่ใบจอง
                  </label>
                  <Input value={formData.bookingNumber} disabled />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold' }}>
                    <CalendarOutlined style={{ marginRight: '8px' }} />
                    วันที่-เวลา
                  </label>
                  <Input value={formData.bookingDate} disabled />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold' }}>
                    <FileTextOutlined style={{ marginRight: '8px' }} />
                    จุดประสงค์การใช้งาน
                  </label>
                  <TextArea
                    name="purpose"
                    rows={2}
                    placeholder="กรุณาระบุจุดประสงค์"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold' }}>
                    <UserOutlined style={{ marginRight: '8px' }} />
                    แผนก/ฝ่าย
                  </label>
                  <Input
                    name="department"
                    placeholder="กรุณาป้อนแผนกหรือฝ่าย"
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label style={{ fontWeight: 'bold' }}>
                    <PhoneOutlined style={{ marginRight: '8px' }} />
                    เบอร์ติดต่อ
                  </label>
                  <Input
                    name="contactNumber"
                    placeholder="กรุณาป้อนเบอร์ติดต่อ"
                    onChange={handleChange}
                  />
                </div>

                {/* ส่วนของการเลือกอุปกรณ์เสริม ในคอลัมน์เดียวกับเบอร์ติดต่อ */}
                <div style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column' }}>
                  <label style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    <TeamOutlined style={{ marginRight: '8px' }} />
                    อุปกรณ์เสริมที่ต้องการ
                  </label>
                  <Checkbox.Group
                    options={[
                      { label: 'โปรเจคเตอร์', value: 'projector' },
                      { label: 'จอภาพ', value: 'screen' },
                      { label: 'ไมโครโฟน', value: 'microphone' },
                    ]}
                    onChange={(checkedValues) => setFormData({ ...formData, additionalEquipment: checkedValues })}
                  />
                </div>
              </div>

              <Divider />
              <div style={{ textAlign: 'right', marginTop: '24px' }}>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                  ถัดไป
                </Button>
              </div>
            </div>

            {/* Modal สำหรับยืนยันการจอง */}
            <Modal
              title={
                <div style={{ textAlign: 'center', color: '#029B36', fontWeight: 'bold', fontSize: '24px' }}>
                  <CheckOutlined
                    style={{ fontSize: '28px', color: '#029B36', marginRight: '8px' }}
                  />
                  ยืนยันการจอง
                </div>
              }
              visible={isModalVisible}
              onOk={handleConfirm}
              onCancel={() => setIsModalVisible(false)}
              centered
              okText="ยืนยัน"
              cancelText="ยกเลิก"
              width={600}
              bodyStyle={{
                padding: '16px',
                backgroundColor: '#fff', // เปลี่ยนพื้นหลังเป็นสีขาว
                fontFamily: 'Arial, sans-serif',
                color: '#333',
              }}
            >
              <div style={{ fontSize: '16px', lineHeight: '1.5' }}> {/* ปรับระยะห่างบรรทัดให้ใกล้กัน */}
                {/* แสดงข้อมูลการจอง */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}> {/* ลด gap ระหว่างรายการ */}

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>เลขที่ใบจอง:</p>
                    <p>{formData.bookingNumber}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>วันที่-เวลา:</p>
                    <p>{formData.bookingDate}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>จุดประสงค์การใช้งาน:</p>
                    <p>{formData.purpose || 'ไม่มีการระบุ'}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>แผนก/ฝ่าย:</p>
                    <p>{formData.department || 'ไม่มีการระบุ'}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>เบอร์ติดต่อ:</p>
                    <p>{formData.contactNumber || 'ไม่มีการระบุ'}</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <p style={{ fontWeight: 'bold', color: '#029B36' }}>อุปกรณ์เสริมที่เลือก:</p>
                    <p>{formData.additionalEquipment.length > 0 ? formData.additionalEquipment.join(', ') : 'ไม่มีการเลือกอุปกรณ์เสริม'}</p>
                  </div>

                </div>
              </div>
            </Modal>

          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default BookingDetails;
