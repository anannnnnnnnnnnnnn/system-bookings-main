'use client'
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Spin, Row, Col, Card, Typography, Button, message, Modal, Timeline, Tag, Divider, Select } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { Kanit } from 'next/font/google';
import { Grid } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th"; // ✅ ใช้ภาษาไทย

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("th"); // ✅ ตั้งค่า locale เป็นไทย

const { Title } = Typography;
const { Option } = Select;

const kanit = Kanit({
    subsets: ['latin', 'thai'],
    weight: ['300', '400', '700'],
});

function RoomBooking() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomType, setRoomType] = useState('');
    const screens = Grid.useBreakpoint();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [bookingTimes, setBookingTimes] = useState([]);
    const [isRoomInfoModalOpen, setIsRoomInfoModalOpen] = useState(false);
    const [filteredRooms, setFilteredRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:5182/api/rooms');

                if (!response.ok) {
                    throw new Error('Error fetching room data');
                }

                const data = await response.json();
                setRooms(data);
                setFilteredRooms(data); // เริ่มต้นแสดงห้องประชุมทั้งหมด
            } catch (error) {
                console.error('Fetch error:', error);
                message.error('ไม่สามารถดึงข้อมูลห้องประชุมได้');
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        if (!roomType) {
            setFilteredRooms(rooms); // ถ้าไม่ได้เลือกประเภทห้องประชุม แสดงห้องประชุมทั้งหมด
        } else {
            setFilteredRooms(rooms.filter(room => String(room.room_type) === roomType)); // กรองห้องประชุมตามประเภทที่เลือก
        }
    }, [roomType, rooms]);

    const handleSelectRoom = (room) => {
        if (room && room.room_id && room.status === 1) {
            router.push(`/user/home/meetingroom/complete/booking?roomId=${room.room_id}`);
        } else if (room.status === 2) {
            message.error('ห้องประชุมนี้ไม่สามารถจองได้ในขณะนี้');
        }
    };

    const handleCheckAvailability = async (room) => {
        setSelectedRoom(room);
        setIsModalVisible(true);
        setLoadingTimes(true);
        try {
            const response = await fetch(`http://localhost:5182/api/rooms/date?roomId=${room.room_id}`);
            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลการจองได้');
            const data = await response.json();
            setBookingTimes(data);
        } catch (error) {
            console.error(error);
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            setBookingTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    };

    const fetchRoomDetails = async (roomId) => {
        try {
            const response = await fetch(`http://localhost:5182/api/rooms/${roomId}`);
            if (!response.ok) {
                throw new Error('ไม่สามารถดึงข้อมูลห้องประชุมได้');
            }
            const data = await response.json();
            setSelectedRoom(data);
            setIsRoomInfoModalOpen(true);
        } catch (error) {
            console.error(error);
            message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    };

    const showroomInfoModal = (room) => {
        fetchRoomDetails(room.room_id);
    };

    const handleRoomTypeChange = (value) => {
        setRoomType(value); // อัปเดตค่า roomType เมื่อมีการเลือก
    };

    const getRoomType = (type) => {
        switch (type) {
            case 1:
                return 'ห้องประชุมทั่วไป';
            case 2:
                return 'ห้องประชุมใหญ่';
            case 3:
                return 'ห้องประชุมวีไอพี';
            default:
                return 'ไม่ระบุประเภท';
        }
    };

    return (
        <main className={kanit.className}>
            <Layout style={{ backgroundColor: '#fff' }}>
                <Navbar />
                <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                    <Sidebar />
                    <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0 70px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#d9e8d2',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}>
                                <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                            </div>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item><span style={{ fontWeight: '500', fontSize: '14px', color: '#666' }}>ระบบจองห้องประชุม</span></Breadcrumb.Item>
                                <Breadcrumb.Item><span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>เลือกห้องประชุมที่ต้องการจอง</span></Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        <Content style={{
                            background: '#ffffff',
                            marginTop: '10px',
                            marginLeft: '50px',
                            padding: '20px',
                            borderRadius: '8px',
                        }}>
                            <Title level={2} style={{
                                marginBottom: '24px',
                                fontSize: screens.xs ? '20px' : '28px',
                                color: '#666',
                            }}>เลือกห้องประชุมที่ต้องการจอง</Title>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '-20px', marginRight: '20px' }}>
                                <Select
                                    value={roomType}
                                    style={{ width: 200 }}
                                    onChange={handleRoomTypeChange}
                                    placeholder="เลือกประเภทของห้องประชุม"
                                >
                                    <Option value="">ทั้งหมด</Option>
                                    <Option value="1">ห้องประชุมทั่วไป</Option>
                                    <Option value="2">ห้องประชุมใหญ่</Option>
                                    <Option value="3">ห้องประชุมวีไอพี</Option>
                                </Select>
                            </div>
                            {loading ? (
                                <Spin tip="กำลังโหลดข้อมูล..." />
                            ) : (
                                <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                    {filteredRooms.map((room) => (
                                        <Col xs={24} sm={12} md={12} key={room.room_id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img alt={room.room_name} src={`http://localhost:5182${room.room_img}`} style={{
                                                        height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'
                                                    }} />
                                                }
                                                style={{
                                                    marginTop: '10px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#ffffff',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    marginBottom: '20px',
                                                }}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#4CAF50' }}>
                                                                {room.room_name}
                                                            </span>

                                                            <span style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                fontWeight: 'bold',
                                                                fontSize: '15px',
                                                                color: '#666'
                                                            }}>
                                                                รายละเอียดห้องประชุม
                                                                <InfoCircleOutlined
                                                                    onClick={() => showroomInfoModal(room)}  // เรียกฟังก์ชันนี้เมื่อคลิก
                                                                    style={{ cursor: 'pointer', color: '#4CAF50', fontSize: '18px' }}
                                                                />
                                                            </span>
                                                        </div>
                                                    }
                                                />

                                                <div style={{ marginTop: '10px' }}>
                                                    <Button
                                                        type="default"
                                                        size="small"
                                                        style={{
                                                            width: '80px',
                                                            fontSize: '12px',
                                                            padding: '2px 6px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid black',
                                                            color: 'black',
                                                        }}
                                                        onClick={() => handleCheckAvailability(room)}
                                                    >
                                                        ดูคิวรถ
                                                    </Button>

                                                    <Button
                                                        style={{
                                                            marginTop: '10px',
                                                            width: '100%',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            fontSize: '14px',
                                                        }}
                                                        type="primary"
                                                        onClick={() => handleSelectRoom(room)}
                                                    >
                                                        จองห้องประชุม
                                                    </Button>
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

            {/* Modal for Room Info */}
            <Modal
                visible={isRoomInfoModalOpen}
                title="ข้อมูลห้องประชุม"
                onCancel={() => setIsRoomInfoModalOpen(false)}
                footer={null}
                width={800}
            >
                {selectedRoom ? (
                    <div>
                        <p><strong>ชื่อห้องประชุม:</strong> {selectedRoom.room_name}</p>
                        <p><strong>ประเภท:</strong> {getRoomType(selectedRoom.room_type)}</p>
                        <p><strong>รายละเอียด:</strong> {selectedRoom.room_description}</p>
                        <p><strong>ความจุ:</strong> {selectedRoom.capacity} คน</p>
                    </div>
                ) : (
                    <Spin tip="กำลังโหลดข้อมูล..." />
                )}
            </Modal>
        </main>
    );
}

export default RoomBooking;
