'use client'

import React, { useState } from 'react'
import { Layout, Typography, Space, DatePicker, Divider, Button, Radio, List, Card, Badge } from 'antd'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import { Content } from 'antd/lib/layout/layout'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const { Title } = Typography

function MeetingRoomBooking() {
  const router = useRouter(); // ใช้เพื่อเปลี่ยนหน้า
  const [formData, setFormData] = useState({})
  const [rooms, setRooms] = useState([]); // สถานะข้อมูลห้องประชุม
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const [filter, setFilter] = useState('available'); // ตัวกรองสถานะห้อง
  const [startDate, setStartDate] = useState(null); // วันเริ่มต้น
  const [endDate, setEndDate] = useState(null); // วันสิ้นสุด

  // Mock ข้อมูลห้องประชุม
  const roomData = [
    { id: 1, roomNumber: 'ห้อง 101', name: 'ห้องประชุม A', capacity: 10, status: 'ว่าง', image: 'https://via.placeholder.com/150' },
    { id: 2, roomNumber: 'ห้อง 102', name: 'ห้องประชุม B', capacity: 20, status: 'ว่าง', image: 'https://via.placeholder.com/150' },
    { id: 3, roomNumber: 'ห้อง 103', name: 'ห้องประชุม C', capacity: 15, status: 'ไม่ว่าง', image: 'https://via.placeholder.com/150' },
  ];

  // ฟังก์ชันค้นหา
  const handleSearch = () => {
    setLoading(true); // เริ่มโหลดข้อมูล
    setTimeout(() => {
      setRooms(roomData); // ดึงข้อมูลห้องประชุม
      setLoading(false); // เสร็จสิ้นการโหลด
    }, 1000);
  };
  const handleChange = (e) => {
    const {name,value} = e.target
    setFormData({...formData, [name] : value})
  }
  // ฟังก์ชันจัดการเปลี่ยนหน้าพร้อมส่งข้อมูล
  const handleNext = () => {
    sessionStorage.setItem('bookingData', JSON.stringify(formData)); // เก็บข้อมูลลงใน sessionStorage
    router.push('/users/home/meetingroom/complete/booking'); // เปลี่ยนหน้าโดยไม่ต้องใช้ query
  };

  // ฟิลเตอร์ข้อมูลตามสถานะ
  const filteredRooms = rooms.filter((room) => {
    if (filter === 'available') return room.status === 'ว่าง';
    if (filter === 'unavailable') return room.status === 'ไม่ว่าง';
    return true;
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
        {/* Sidebar */}
        <Sidebar />

        {/* เนื้อหาหลัก */}
        <Layout style={{ padding: '0px 20px' }}>
          <Content style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '24px', color: 'black' }}>วันและเวลาที่ต้องการจองห้องประชุม</Title>

              <Divider/>
              {/* Section: ค้นหาห้องประชุม */}
              <div style={{ marginBottom: '32px' }}>
                <Title level={4} style={{ color: 'black' }}>1. ค้นหาห้องประชุมที่ว่างพร้อมใช้งาน</Title>
                <Space size="large" direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องการ</label>
                      <DatePicker name="showTime" placeholder="เลือกวันเวลาเริ่มต้น" onChange={handleChange} style={{ width: '100%' }} /> 
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ fontWeight: 'bold' }}>วันเวลาที่ต้องการคืนห้อง</label>
                      <DatePicker showTime placeholder="เลือกวันเวลาคืนห้อง" style={{ width: '100%' }} />
                    </div>
                  </div>
                </Space>
              </div>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  type="primary"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#029B36',
                    borderColor: '#ffff',
                    height: '43px',
                    fontSize: '16px',
                  }}
                  onClick={handleSearch}
                  loading={loading}
                >
                  ค้นหาห้องประชุม
                </Button>
              </div>

              <Divider />

              {/* ตัวเลือกสถานะ */}
              <Radio.Group
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
                style={{ marginBottom: '16px' }}
              >
                <Radio value="available">เฉพาะว่าง</Radio>
                <Radio value="unavailable">ไม่ว่าง</Radio>
                <Radio value="all">ทุกสถานะ</Radio>
              </Radio.Group>

              {/* แสดงรายการห้องประชุม */}
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={filteredRooms}
                renderItem={(room) => (
                  <List.Item>
                    <Card
                      hoverable
                      style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                      cover={<img alt={room.name} src={room.image}
                        style={{
                          borderRadius: '8px 8px 0 0',
                          objectFit: 'cover',
                          width: '50px',
                          height: '100px'
                        }} />}
                    >
                      <div>
                        <Title level={5}>{room.roomNumber}</Title>
                        <p>ห้อง: {room.name}, ความจุ: {room.capacity} คน</p>
                        <Badge
                          status={room.status === 'ว่าง' ? 'success' : 'error'}
                          text={`สถานะ: ${room.status}`}
                        />
                      </div>
                      <div>
                        
                          <Button type="primary" onClick={handleNext} disabled={room.status !== 'ว่าง'} style={{ marginTop: '16px', background: '#029B36' }}>
                            เลือก
                          </Button>
                      
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </Content>
        </Layout>
      </Layout> 
    </Layout>
  );
}

export default MeetingRoomBooking;
