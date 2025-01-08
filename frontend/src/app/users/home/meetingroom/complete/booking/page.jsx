'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Button, Divider, Modal, Image, Select, List, Card, Space } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { FileTextOutlined, } from '@ant-design/icons';
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
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลห้องประชุมที่เลือกจาก Session Storage
    const storedRooms = sessionStorage.getItem('selectedRooms');
    if (storedRooms) {
      setSelectedRooms(JSON.parse(storedRooms));
    }
  }, []);

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

  const handleConfirmBooking = () => {
    // เก็บข้อมูลใน sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(formData));
    // สามารถทำการเปลี่ยนเส้นทางไปยังหน้าจองรายละเอียด
    window.location.href = '/users/home/meetingroom/complete/approv'; // หรือใช้ router.push() ใน Next.js
  };

  const handleConfirm = () => {
    // setBookingData(formData);
    // setIsModalVisible(false);
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
              <div style={{ maxWidth: '800px', padding: '0 30px' }}>
                <h2
                  style={{
                    marginBottom: '16px',
                    fontWeight: 'bold',
                    fontSize: '20px',
                    color: '#4D4D4D',
                  }}
                >
                  ห้องประชุมที่เลือกจอง
                </h2>
                <List
                  grid={{ gutter: 24, column: 1 }}
                  dataSource={selectedRooms}
                  renderItem={(room) => (
                    <List.Item>
                      <Card
                        hoverable
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          padding: '12px',
                          backgroundColor: '#f9f9f9',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        bodyStyle={{ padding: 0 }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {/* Room Image */}
                          <Image
                            src={room.image}
                            alt={room.name}
                            width={100} // ลดขนาดความกว้างของภาพ
                            height={80} // ลดความสูงของภาพ
                            style={{
                              borderRadius: '8px',
                              objectFit: 'cover',
                              marginRight: '16px',
                            }}
                          />

                          {/* Room Details */}
                          <div style={{ flex: 1, margin: '0 20px' }}>
                            <Text
                              style={{
                                width: '100px',
                                fontSize: '16px', // ขนาดตัวอักษร
                                fontWeight: 'bold',
                                color: '#333',
                                marginBottom: '4px',
                                display: 'block',
                                backgroundColor: '#66CDAA', // ไฮไลต์ด้วยแถบสีเหลืองอ่อน
                                padding: '5px 7px', // เพิ่มระยะห่างรอบข้อความให้ดูชัดเจน
                                borderRadius: '4px', // ทำมุมมน
                              }}
                            >
                              {room.name}
                            </Text>

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                fontSize: '12px', // ลดขนาดตัวอักษร
                                color: '#666',
                              }}
                            >
                              <Text>
                                <strong style={{ color: '#444' }}>จำนวนที่นั่ง:</strong> {room.capacity} คน
                              </Text>
                              <Text>
                                <strong style={{ color: '#444' }}>หมายเลขห้อง:</strong> {room.roomNumber}
                              </Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
              <Divider />

              {/* ส่วนเลือกเวลาที่ต้องการ */}
              <div style={{ padding: '0 30px' }}>
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
                <div style={{ maxWidth: '720px', margin: '0 auto', fontFamily: 'var(--font-kanit)', }}>
                  <Divider />
                  <div >
                    <h2
                      style={{
                        fontWeight: 'bold',
                        fontSize: '20px',
                        marginBottom: '12px',
                        color: '#4D4D4D',
                        fontFamily: 'var(--font-kanit)',
                        textTransform: 'uppercase',
                      }}
                    >
                      ข้อมูลของผู้จอง
                    </h2>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '16px',
                      margin: '20px 50px',
                    }}
                  >
                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>วันที่จอง</label>
                      <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                        {formData.bookingDate}
                      </p>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>เวลา</label>
                      <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                        {formData.selectedTime.join(', ')}
                      </p>
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>วัตถุประสงค์</label>
                      <Input
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        style={{ fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontWeight: 'bold', fontSize: '14px' }}>จำนวนผู้เข้าร่วม</label>
                      <Input
                        type="number"
                        name="capacity"
                        placeholder="จำนวนผู้โดยสาร"
                        onChange={handleChange}
                        style={{ fontSize: '14px' }}
                      />
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
                        value={formData.additionalEquipment}
                        onChange={(value) => setFormData({ ...formData, additionalEquipment: value })}
                        style={{ width: '100%', margin: '6px 0px', fontSize: '14px' }}
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
                        <Select.Option value="ตัวควบคุมการนำเสนอ (Presenter Remote)">
                          ตัวควบคุมการนำเสนอ (Presenter Remote)
                        </Select.Option>
                        <Select.Option value="สายต่อ HDMI">สายต่อ HDMI</Select.Option>
                        <Select.Option value="สายต่อ VGA">สายต่อ VGA</Select.Option>
                        <Select.Option value="พัดลม">พัดลม</Select.Option>
                        <Select.Option value="เครื่องปรับอากาศ">เครื่องปรับอากาศ</Select.Option>
                        <Select.Option value="โทรศัพท์สื่อสาร">โทรศัพท์สื่อสาร</Select.Option>
                        <Select.Option value="แฟลชไดรฟ์ USB">แฟลชไดรฟ์ USB</Select.Option>
                      </Select>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={handleBack}
                      style={{
                        backgroundColor: '#fff',
                        color: '#4D4D4D',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        padding: '10px 24px',
                        fontSize: '14px',
                        border: '1px solid #4D4D4D',  // เส้นขอบเป็นสีเทา
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#4D4D4D'; // เปลี่ยนสีพื้นหลังเมื่อ hover
                        e.target.style.color = '#fff'; // เปลี่ยนสีตัวอักษรเมื่อ hover
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff'; // กลับสีพื้นหลังเมื่อเลิก hover
                        e.target.style.color = '#4D4D4D'; // กลับสีตัวอักษรเมื่อเลิก hover
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
                        fontSize: '14px',
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
                  { label: 'ชื่อห้อง', value: selectedRooms.length > 0 ? selectedRooms.map(room => room.name).join(', ') : '-' },
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
