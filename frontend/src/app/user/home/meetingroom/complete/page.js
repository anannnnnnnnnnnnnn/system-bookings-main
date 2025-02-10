'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Spin, Row, Col, Card, Typography, Divider, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { Kanit } from 'next/font/google';
import { Grid } from 'antd'; // นำเข้า Grid
import { useRouter } from 'next/navigation'; // Import useRouter

const { Title } = Typography;

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
    subsets: ['latin', 'thai'],
    weight: ['300', '400', '700'],
});

function RoomBooking() {
    // ใช้ useBreakpoint จาก Grid
    const screens = Grid.useBreakpoint();
    const [rooms, setRooms] = useState([]); // เก็บข้อมูลห้องประชุม
    const [loading, setLoading] = useState(true); // สำหรับสถานะโหลดข้อมูล
    const router = useRouter(); // เรียกใช้ Router

    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:5182/api/rooms');
                if (!response.ok) throw new Error('Error fetching room data');
                const data = await response.json();
                setRooms(data); // เปลี่ยนจาก setCars เป็น setRooms
            } catch (error) {
                message.error('ไม่สามารถดึงข้อมูลห้องประชุมได้');
            } finally {
                setLoading(false); // ปิดสถานะโหลด
            }
        };

        fetchRooms();
    }, []);

    const handleSelectRoom = (room) => {
        // ตรวจสอบว่า room มีข้อมูลและ room_id ถูกต้อง
        if (room && room.room_id && room.status === 1) {
            // ถ้ามี room_id และสถานะเป็น 1 (จองได้) ให้ทำการเปลี่ยนเส้นทาง
            router.push(`/user/home/meetingroom/complete/booking?roomId=${room.room_id}`);
        } else if (room.status === 2) {
            message.error('ห้องประชุมนี้ไม่สามารถจองได้ในขณะนี้');
        } else {
            console.error("room.room_id is undefined or null");
        }
    };

    return (
        <main className={kanit.className}>
            {/* Layout หลักที่ครอบทุกส่วน */}
            <Layout style={{ backgroundColor: '#fff' }}>
                {/* Navbar */}
                <Navbar />

                {/* Layout หลักของหน้า */}
                <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Layout ด้านขวาหลัก */}
                    <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                        {/* Breadcrumb */}
                        {/* ไอคอนหลัก */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
                                margin: '0 70px',
                            }}
                        >
                            {/* ไอคอนหลัก */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#d9e8d2', // สีพื้นหลังไอคอน
                                    borderRadius: '50%', // รูปทรงกลม
                                    marginRight: '10px', // ระยะห่างระหว่างไอคอนและข้อความ
                                }}
                            >
                                <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                            </div>

                            {/* Breadcrumb */}
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#666', // สีข้อความหลัก
                                        }}
                                    >
                                        ระบบจองห้องประชุม
                                    </span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#333', // สีข้อความรอง
                                        }}
                                    >
                                        เลือกห้องประชุมที่ต้องการจอง
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        {/* Content */}
                        <Content
                            style={{
                                background: '#ffffff', // พื้นหลังสีขาว
                                marginTop: '10px',
                                marginLeft: '50px',
                                padding: '20px',
                                borderRadius: '8px',
                            }}
                        >
                            <Title
                                level={2}
                                style={{
                                    marginBottom: '24px',
                                    fontSize: screens.xs ? '20px' : '28px',
                                    color: '#666',
                                }}
                            >
                                เลือกห้องประชุมที่ต้องการจอง
                            </Title>
                            {/* ตรวจสอบสถานะโหลดข้อมูล */}
                            {loading ? (
                                <Spin tip="กำลังโหลดข้อมูล..." />
                            ) : (
                                <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                    {rooms.map((room) => (
                                        <Col xs={24} sm={12} md={12} key={room.id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        alt={room.name}
                                                        src={`http://localhost:5182${room.room_img}`}
                                                        style={{
                                                            height: '200px', // ลดขนาดของรูปภาพให้เล็กลง
                                                            objectFit: 'cover',
                                                            borderTopLeftRadius: '8px',
                                                            borderTopRightRadius: '8px',
                                                        }}
                                                    />
                                                }
                                                style={{
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#ffffff',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงา
                                                    transition: 'transform 0.3s ease-in-out',
                                                    marginBottom: '20px', // เพิ่มระยะห่างระหว่างการ์ด
                                                }}
                                                bodyStyle={{
                                                    padding: '12px', // ลด padding ในตัวการ์ดให้เล็กลง
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'} // เอฟเฟกต์ขยายเมื่อ hover
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} // กลับสู่ขนาดเดิมเมื่อเลิก hover
                                            >
                                                <Card.Meta
                                                    title={
                                                        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#4CAF50' }}>
                                                            {room.room_name}
                                                        </span>
                                                    }
                                                    description={
                                                        <span style={{ fontSize: '12px', color: '#666' }}>
                                                            {room.details}
                                                        </span>
                                                    }
                                                />
                                                <div style={{ marginTop: '10px' }}>
                                                    <p style={{ fontSize: '12px', margin: '5px 0' }}>
                                                        <strong>ความจุ:</strong> {room.capacity} คน
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '12px',
                                                            color: room.status === 1 ? '#4CAF50' : '#FF4D4F',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        <strong style={{ color: '#333' }}>สถานะ:</strong> {room.status === 1 ? 'จองได้' : 'ไม่สามารถจองได้'}
                                                    </p>
                                                    <button
                                                        style={{
                                                            marginTop: '10px',
                                                            padding: '8px 16px', // ลดขนาดปุ่มให้เล็กลง
                                                            backgroundColor: room.status === 1 ? '#4CAF50' : '#BDBDBD',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: room.status === 1 ? 'pointer' : 'not-allowed',
                                                            fontSize: '12px', // ลดขนาดข้อความในปุ่ม
                                                        }}
                                                        onClick={() => handleSelectRoom(room)}
                                                        disabled={room.status !== 1}
                                                    >
                                                        จองห้องประชุม
                                                    </button>
                                                </div>
                                            </Card>

                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </main>
    );
}

export default RoomBooking;
