'use client';
import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Divider, Modal, Checkbox, Form, Row, Col, Radio, Image, Select } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { CheckOutlined, FileTextOutlined, CalendarOutlined, TeamOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    roomImage: 'url-to-room-image', // ใส่ URL ของภาพห้อง
    username: 'anan',
    roomName: 'Conference Room A',
    capacity: '',
    amenities: 'โปรเจคเตอร์, กระดานไวท์บอร์ด',
    email: 'anantohtia@gmail.com',
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
  const [unavailableTimes, setUnavailableTimes] = useState(['08:00-09:00', '14:00-15:00']); // เวลาที่ไม่ว่าง

  const handleTimeSelect = (time) => {
    if (!unavailableTimes.includes(time)) {
      setFormData((prev) => ({
        ...prev,
        selectedTime: prev.selectedTime.includes(time)
          ? prev.selectedTime.filter((t) => t !== time)
          : [...prev.selectedTime, time],
      }));
    }
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
    // แสดง SweetAlert เมื่อการจองสำเร็จ
    Swal.fire({
      title: 'จองสำเร็จ!',
      text: 'การจองของคุณได้รับการยืนยันแล้ว.',
      icon: 'success',
      showConfirmButton: false, // ไม่แสดงปุ่มตกลง
      timer: 1500, // ตั้งเวลาให้แสดง 1.5 วินาที
      timerProgressBar: true, // แสดงแถบความคืบหน้าของเวลา
    }).then(() => {
      // หลังจาก SweetAlert ปิดเองแล้ว ให้เปลี่ยนหน้า
      router.push('/users/home/meetingroom/complete/approv'); // เปลี่ยนไปที่หน้าใหม่ (เช่น หน้า Home หรือ หน้าอื่น)
    });

    // ปิดโมดอลหลังจากแสดง SweetAlert
    setIsModalVisible(false);
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
  const handleBack = () => {
    window.location.href = '/users/home/meetingroom/complete';
  }


  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 49px', marginTop: '20px', backgroundColor: '#fff' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* เนื้อหาหลัก */}
        <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
          <Navigation />
          <Content style={{
            marginTop: '21px',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',

          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title
                level={3}
                style={{ textAlign: 'left', marginBottom: '16px', color: 'black', fontSize: '20px' }}
              >
                <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                รายละเอียดการจองห้องประชุม
              </Title>
              <Divider />

              {/* ข้อมูลห้องประชุมและรูปภาพ */}
              <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '20px',
                    backgroundColor: '#fff',
                    marginBottom: '20px', // เพิ่มการเว้นระยะระหว่างรายการ
                  }}
                >
                  <Image
                    src="/assets/pg1.jpg"
                    alt="Meeting Room"
                    width={140} // ขนาดรูปภาพที่เหมาะสม
                    style={{
                      borderRadius: '8px', // มุมที่โค้งมนขึ้น
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // เพิ่มเงาที่นุ่มนวลขึ้น
                      marginRight: '20px', // เว้นระยะจากข้อความ
                    }}
                  />
                  <div style={{ flex: 1, textAlign: 'left', fontFamily: 'Arial, sans-serif', marginLeft: '30px' }}>
                    <Text
                      style={{
                        fontSize: '20px', // ขนาดตัวอักษรที่ใหญ่ขึ้นเล็กน้อย
                        fontWeight: '600', // ทำให้ตัวหนามากขึ้น
                        color: '#333',
                        marginBottom: '10px', // ลดระยะห่างจากเนื้อหาตามลำดับ
                        lineHeight: '1.4',
                      }}
                    >
                      {formData.roomName}
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '24px', // เพิ่มระยะห่างระหว่างข้อความ
                        fontSize: '14px', // ขนาดตัวอักษรที่เล็กลงเล็กน้อยเพื่อให้ดูทันสมัย
                        color: '#777', // เปลี่ยนสีให้ดูนุ่มนวล
                        flexWrap: 'wrap', // ทำให้ไม่ติดกัน
                      }}
                    >
                      <p style={{ margin: '4px 0' }}>
                        <strong>ความจุ:</strong> {formData.capacity}
                      </p>
                      <p style={{ margin: '4px 0' }}>
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
                          type={
                            unavailableTimes.includes(time)
                              ? 'default'
                              : formData.selectedTime.includes(time)
                                ? 'primary'
                                : 'default'
                          }
                          disabled={unavailableTimes.includes(time)} // ปุ่มนี้จะกดไม่ได้ถ้าเวลาอยู่ใน unavailableTimes
                          style={{
                            borderRadius: '10px',
                            width: '100px',
                            height: '30px',
                            fontWeight: 'bold',
                            padding: '8px 18px',
                            border: unavailableTimes.includes(time)
                              ? '2px solid #d9d9d9'
                              : formData.selectedTime.includes(time)
                                ? '2px solid #478D00'
                                : '2px solid #ccc',
                            backgroundColor: unavailableTimes.includes(time)
                              ? '#f5f5f5'
                              : formData.selectedTime.includes(time)
                                ? '#478D00'
                                : '#ffffff',
                            color: unavailableTimes.includes(time)
                              ? '#a9a9a9'
                              : formData.selectedTime.includes(time)
                                ? '#fff'
                                : '#333',
                            cursor: unavailableTimes.includes(time) ? 'not-allowed' : 'pointer',
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
                <Divider style={{ margin: '25px' }} />

                <div style={{ textAlign: 'end' }}>
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
                <div>
                  <Divider />
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
                      <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                        {formData.bookingDate}
                      </p>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>เวลา</label>
                      <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                        {formData.selectedTime.join(', ')}
                      </p>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold' }}>
                        วัตถุประสงค์
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
                      <Select
                        mode="multiple" // เปิดใช้งานการเลือกหลายรายการ
                        allowClear // เพิ่มปุ่มสำหรับล้างค่า
                        placeholder="เลือกอุปกรณ์เพิ่มเติม"
                        value={formData.additionalEquipment} // ค่า default ที่มาจาก state
                        onChange={(value) => setFormData({ ...formData, additionalEquipment: value })} // อัปเดต state เมื่อเปลี่ยนค่า
                        style={{ width: '100%', margin: '6px 0px' }} // ปรับแต่งสไตล์
                      >
                        <Select.Option value="โปรเจคเตอร์">โปรเจคเตอร์</Select.Option>
                        <Select.Option value="กระดานไวท์บอร์ด">กระดานไวท์บอร์ด</Select.Option>
                        <Select.Option value="ทีวีจอใหญ่">ทีวีจอใหญ่</Select.Option>
                        <Select.Option value="ลำโพง">ลำโพง</Select.Option>
                        <Select.Option value="ไมโครโฟนไร้สาย">ไมโครโฟนไร้สาย</Select.Option>
                        <Select.Option value="กล้องวิดีโอคอนเฟอเรนซ์">กล้องวิดีโอคอนเฟอเรนซ์</Select.Option>
                        <Select.Option value="อินเทอร์เน็ตความเร็วสูง">อินเทอร์เน็ตความเร็วสูง</Select.Option>
                        <Select.Option value="โต๊ะและเก้าอี้">โต๊ะและเก้าอี้</Select.Option>
                        <Select.Option value="ไฟสำหรับการบันทึกวิดีโอ">ไฟสำหรับการบันทึกวิดีโอ</Select.Option>
                        <Select.Option value="ตัวควบคุมการนำเสนอ (Presenter Remote)">ตัวควบคุมการนำเสนอ (Presenter Remote)</Select.Option>
                        <Select.Option value="สายต่อ HDMI">สายต่อ HDMI</Select.Option>
                        <Select.Option value="สายต่อ VGA">สายต่อ VGA</Select.Option>
                        <Select.Option value="พัดลม">พัดลม</Select.Option>
                        <Select.Option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ</Select.Option>
                        <Select.Option value="โทรศัพท์สื่อสาร">โทรศัพท์สื่อสาร</Select.Option>
                        <Select.Option value="แฟลชไดรฟ์ USB">แฟลชไดรฟ์ USB</Select.Option>
                        วิธีเพิ่มในโค้ด
                      </Select>

                    </div>

                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                      type="primary"
                      onClick={handleBack}
                      style={{
                        backgroundColor: '#B0BEC5 ',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        padding: '10px 24px',
                        fontSize: '16px',
                        border: 'none',
                        transition: 'all 0.3s ease',

                      }}
                    >
                      ย้อนกลับ
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setIsModalVisible(true)}
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
              )}
            </div>

            {/* Modal สำหรับยืนยันการจอง */}
            <Modal
              title={
                <div
                  style={{
                    textAlign: 'center',
                    color: '#029B36',
                    fontWeight: 'bold',
                    fontSize: '20px', // ขนาดเล็กลง
                  }}
                >

                  ยืนยันการจอง
                </div>
              }
              visible={isModalVisible}
              onOk={handleConfirm}
              onCancel={() => setIsModalVisible(false)}
              centered
              okText="ยืนยันการจอง"
              cancelText="ยกเลิก"
              width={400} // ความกว้างเล็กลง
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
              }}
              bodyStyle={{
                padding: '16px', // ระยะห่างภายในลดลง
                fontFamily: 'var(--font-kanit)',
              }}
            >
              <div
                style={{
                  fontSize: '14px', // ขนาดข้อความเล็กลง
                  lineHeight: '1.6', // ลดระยะห่างระหว่างบรรทัด
                  color: '#4A4A4A',
                }}
              >
                {[
                  { label: 'รหัสการจอง', value: formData.bookingNumber || '-' },
                  { label: 'ช่วงเวลาที่จอง', value: formData.selectedTime?.join(', ') || '-' },
                  { label: 'หัวข้อการประชุม', value: formData.objective || '-' },
                  { label: 'จำนวนผู้เข้าร่วม', value: formData.capacity || '-' },
                  { label: 'อุปกรณ์เสริม', value: formData.additionalEquipment?.join(', ') || 'ไม่มี' },
                  { label: 'ชื่อผู้จอง', value: formData.username || '-' },
                  { label: 'อีเมล', value: formData.email || '-' },
                  { label: 'เบอร์โทรศัพท์', value: formData.contactNumber || '-' },
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '12px', // ลดระยะห่างด้านล่าง
                      paddingBottom: '8px', // ลด padding
                      borderBottom: index !== 7 ? '1px solid #E0E0E0' : 'none', // เส้นคั่นบาง
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '13px', // ปรับขนาดข้อความในแต่ละบรรทัด
                      }}
                    >
                      <strong style={{ color: '#555', fontWeight: 'bold' }}>{item.label}:</strong>
                      <span style={{ color: '#029B36', fontWeight: '500' }}>{item.value}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
export default BookingDetails;
