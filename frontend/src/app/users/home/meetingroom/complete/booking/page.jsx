'use client';

import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Divider, Modal, Checkbox, Form, Row, Col, Radio } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { Content } from 'antd/lib/layout/layout';
import { CheckOutlined, FileTextOutlined, CalendarOutlined, TeamOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
  const [formData, setFormData] = useState({
    roomImage: 'url-to-room-image', // ใส่ URL ของภาพห้อง
    username: 'anan',
    roomName: 'Conference Room A',
    capacity: '10 คน',
    amenities: 'โปรเจคเตอร์, กระดานไวท์บอร์ด',
    email: '',
    time: '09.00-11.00',
    bookingNumber: 'RM001',
    bookingDate: '2024-12-10',
    purpose: '',
    department: '',
    objective: '',  
    contactNumber: '0987654321',
    additionalEquipment: [], // เก็บข้อมูลอุปกรณ์เสริม
    selectedTime: [], // เพิ่มสถานะเก็บเวลาที่เลือก
    
  });

  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimeConfirmed, setIsTimeConfirmed] = useState(false); // สถานะยืนยันเวลา

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({
      ...prev,
      selectedTime: prev.selectedTime.includes(time)
        ? prev.selectedTime.filter((t) => t !== time)
        : [...prev.selectedTime, time],
    }));
  };

  const handleTimeConfirm = () => {
    if (formData.selectedTime.length > 0) {
      setIsTimeConfirmed(true);
    } else {
      alert('กรุณาเลือกเวลาอย่างน้อยหนึ่งช่วง!');
    }
  };

  const handleEquipmentChange = (checkedValues) => {
    setFormData({ ...formData, additionalEquipment: checkedValues });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleConfirm = () => {
    sessionStorage.setItem('bookingData', JSON.stringify(formData));
    window.location.href = '/users/home/meetingroom/complete/approv';
  };

  const BookingSummaryModal = ({ isModalVisible, setIsModalVisible, formData }) => {
    const handleConfirm = () => {
      console.log("ข้อมูลการจอง:", formData);
      setIsModalVisible(false);
    }
  };

  // เพิ่มฟังก์ชันสำหรับการแสดง Modal
  const showModal = () => {
    if (formData.selectedTime.length === 0) {
      alert('กรุณาเลือกเวลาจองก่อน!');
    } else {
      setIsModalVisible(true);
    }
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

              {/* ส่วนเลือกเวลาที่ต้องการ */}
              <div style={{ padding: '20px' }}>
                <h2
                  style={{
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: '#4D4D4D',
                  }}
                >
                  เลือกเวลาที่ต้องการจอง
                </h2>

                {[
                  { label: 'ก่อนเที่ยง', times: ['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'] },
                  { label: 'หลังเที่ยง', times: ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] }
                ].map((section, sectionIndex) => (
                  <div key={sectionIndex} style={{ marginBottom: '20px' }}>
                    <p
                      style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                        marginBottom: '12px',
                        color: '#4D4D4D',
                        fontFamily: 'Arial, sans-serif',
                        textTransform: 'uppercase',
                        margin: '20px 50px'
                      }}
                    >
                      {section.label}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {section.times.map((time, index) => (
                        <Button
                          key={index}
                          type={formData.selectedTime.includes(time) ? 'primary' : 'default'}
                          style={{
                            borderRadius: '10px',
                            width: '101px',
                            height: '30px',
                            fontWeight: 'bold',
                            padding: '8px 18px',
                            border: formData.selectedTime.includes(time) ? '2px solid #478D00' : '2px solid #ccc',
                            backgroundColor: formData.selectedTime.includes(time) ? '#478D00' : '#ffffff',
                            color: formData.selectedTime.includes(time) ? '#fff' : '#333',
                            transition: 'all 0.3s ease',
                          }}
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ textAlign: 'end', marginTop: '20px' }}>
                  <Button
                    type="primary"
                    onClick={handleTimeConfirm}
                    style={{
                      backgroundColor: '#478D00',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      padding: '10px 24px',
                      fontSize: '16px',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0px 4px 12px rgba(0, 123, 62, 0.3)',
                    }}
                  >
                    ถัดไป
                  </Button>
                </div>
              </div>

              {/* ฟอร์มการจอง */}
              {isTimeConfirmed && (
                <div> <Divider />
                  <div>
                    <h2 style={{
                      fontWeight: 'bold',
                      fontSize: '15px',
                      marginBottom: '12px',
                      color: '#4D4D4D',
                      fontFamily: 'Arial, sans-serif',
                      textTransform: 'uppercase',
                    }}>
                      ข้อมูลของผู้จอง
                    </h2>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', margin: '20px 50px' }}>
                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        วันที่จอง
                      </label>
                      <Input name="bookingDate" value={formData.bookingDate} disabled />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        วันที่-เวลา
                      </label>
                      <Input value={formData.selectedTime.join(', ')} disabled />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        หัวข้อการประชุม
                      </label>
                      <Input name="objective" value={formData.objective} onChange={handleChange} />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        จำนวนผู้เข้าร่วม
                      </label>
                      <Input
                        type="number"
                        name="capacity"
                        placeholder="จำนวนผู้โดยสาร"
                        onChange={handleChange} />
                    </div>

                    <div>
                      <label
                        style={{
                          fontWeight: 'bold',
                          fontSize: '16px',
                          marginBottom: '8px',
                          color: '#4D4D4D',
                        }}
                      >
                        อุปกรณ์เสริม
                      </label>
                      <Checkbox.Group
                        name="additionalEquipment"
                        value={formData.additionalEquipment}
                        onChange={handleEquipmentChange}
                        style={{ display: 'flex', gap: '8px', margin:'6px 15px'}} // จัดเรียงให้ checkbox อยู่ด้านล่าง label
                      >
                        <Checkbox value="โปรเจคเตอร์">โปรเจคเตอร์</Checkbox>
                        <Checkbox value="กระดานไวท์บอร์ด">กระดานไวท์บอร์ด</Checkbox>
                      </Checkbox.Group>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        ชื่อผู้จอง
                      </label>
                      <Input name="username" value={formData.username} onChange={handleChange} />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        อีเมล
                      </label>
                      <Input name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        เบอร์โทรศัพท์
                      </label>
                      <Input name="contactName" value={formData.contactNumber} onChange={handleChange} />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                      <Button type="primary" onClick={() => setIsModalVisible(true)}>
                        ถัดไป
                      </Button>
                    </div>
                  </div>
                </div>

              )}
            </div>

            {/* Modal สำหรับยืนยันการจอง */}
            <Modal
              title={
                <div style={{ textAlign: 'center', color: '#029B36', fontWeight: 'bold', fontSize: '24px' }}>
                  <CheckOutlined style={{ fontSize: '28px', color: '#029B36', marginRight: '8px' }} />
                  ยืนยันการจอง
                </div>
              }
              visible={isModalVisible}
              onOk={handleConfirm}
              onCancel={() => setIsModalVisible(false)}
              centered
              okText="ยืนยันการจอง"
              cancelText="ยกเลิก"
              width={600}
            >
              <div style={{ fontSize: '16px', lineHeight: '1.5' }}>
                {/* แสดงข้อมูลจาก formData */}
                <p><strong>รหัสการจอง:</strong> {formData.bookingNumber}</p>
                <p><strong>ช่วงเวลาที่จอง:</strong> {formData.selectedTime.join(', ')}</p>
                <p><strong>หัวข้อการประชุม:</strong> {formData.objective}</p>
                <p><strong>จำนวนผู้เข้าร่วม:</strong> {formData.capacity}</p>
                <p><strong>อุปกรณ์เสริม:</strong> {formData.additionalEquipment.join(', ')}</p>
                <p><strong>ชื่อผู้จอง:</strong> {formData.username}</p>
                <p><strong>อีเมล:</strong> {formData.email}</p>
                <p><strong>เบอร์โทรศัพท์:</strong> {formData.contactNumber}</p>
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default BookingDetails;
