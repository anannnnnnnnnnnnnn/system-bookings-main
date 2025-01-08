'use client'; // ทำให้ React ใช้งานใน client-side rendering
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/router
import { Result, Button, Layout, Modal, message, Divider, Typography } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import Navigation from '../../components/navigation';

const { Content } = Layout;
const { Text } = Typography;

function BookingSuccess() {
    const [isModalVisible, setIsModalVisible] = useState(false); // ใช้ state เพื่อควบคุมการแสดงผลของ modal
    const [isBookingDetailsVisible, setIsBookingDetailsVisible] = useState(false); // State สำหรับแสดง Modal ของข้อมูลการจอง
    const [bookingDetails, setBookingDetails] = useState(null); // เก็บข้อมูลการจอง
    const router = useRouter();

    // ตัวอย่างข้อมูลการจองที่จะแสดงใน Modal
    const formData = {
        bookingNumber: '12345',
        selectedTime: ['09:00-10:00'],
        objective: 'ประชุมประจำปี',
        capacity: 10,
        additionalEquipment: ['โปรเจคเตอร์', 'กระดานไวท์บอร์ด'],
        username: 'นายสมชาย ใจดี',
        email: 'somchai@example.com',
        contactNumber: '0801234567',
    };

    const selectedRooms = [
        { name: 'ห้องประชุม A' },
        { name: 'ห้องประชุม B' },
    ];

    const handleConfirmBooking = () => {
        // การแสดงข้อความสำเร็จ
        message.success('การจองห้องประชุมสำเร็จ!');

        // แสดง Modal
        setIsModalVisible(true);
    };

    // ฟังก์ชันแสดงข้อมูลการจองใน Modal
    const handleShowBookingDetails = () => {
        setBookingDetails(formData); // กำหนดข้อมูลการจอง
        setIsBookingDetailsVisible(true); // เปิด modal ข้อมูลการจอง
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
            {/* Navbar */}
            <Navbar />

            <Layout style={{ padding: '0px 49px', marginTop: '20px', backgroundColor: '#ffff' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* เนื้อหาหลัก */}
                <Layout style={{ padding: '0px 30px', backgroundColor: '#ffff' }}>
                    <Navigation />
                    <Content
                        style={{
                            marginTop: '21px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffff' }}>
                            <div style={{ padding: '50px' }}>
                                <Result
                                    status="success"
                                    title="การจองห้องประชุมสำเร็จ"
                                    subTitle="ห้องประชุมของคุณได้รับการจองเรียบร้อยแล้ว"
                                    extra={[
                                        <Button
                                            type="primary"
                                            key="console"
                                            onClick={handleConfirmBooking} // เรียกใช้ฟังก์ชัน handleConfirmBooking
                                            style={{
                                                backgroundColor: '#28a745', // สีเขียว
                                                borderColor: '#28a745', // สีขอบเขียว
                                            }}
                                        >
                                            จองห้องประชุมใหม่
                                        </Button>,
                                        <Button
                                            key="buy"
                                            onClick={handleShowBookingDetails} // เปิด Modal แสดงข้อมูลการจอง
                                            style={{
                                                backgroundColor: '#ffff', // สีเขียว
                                                borderColor: '#28a745', // สีขอบเขียว
                                                color: '#28a745'

                                            }}
                                        >
                                            ดูการจองทั้งหมด
                                        </Button>,
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Modal สำหรับการแสดงข้อมูลการจอง */}
                        <Modal
                            title="ข้อมูลการจองห้องประชุม"
                            visible={isBookingDetailsVisible}
                            onCancel={() => setIsBookingDetailsVisible(false)} // ปิด Modal
                            footer={null}
                            width={400} // ลดความกว้างของ Modal
                            bodyStyle={{
                                padding: '16px', // ลด padding
                                backgroundColor: '#fff', // สีพื้นหลัง
                            }}
                            style={{
                                borderRadius: '8px', // มุมโค้ง
                            }}
                        >
                            <Divider style={{ margin: '0 0 12px 0', borderColor: '#e0e0e0' }}/>
                            <div>
                                {/* แสดงข้อมูลการจองแบบมินิมอล */}
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
                                    <div key={index} style={{ marginBottom: '8px' }}> {/* ลดระยะห่าง */}
                                        <Text strong style={{ fontSize: '14px' }}>{item.label}: </Text> {/* ฟอนต์เล็กลง */}
                                        <Text style={{ fontSize: '14px' }}>{item.value}</Text> {/* ฟอนต์เล็กลง */}
                                    </div>
                                ))}
                                <Divider style={{ margin: '12px 0', borderColor: '#e0e0e0' }} /> {/* ลดระยะ Divider */}
                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        type="primary"
                                        onClick={() => setIsBookingDetailsVisible(false)}
                                        style={{
                                            backgroundColor: '#28a745', // สีเขียว
                                            borderColor: '#28a745', // สีขอบเขียว
                                            borderRadius: '6px', // ลดมุมโค้ง
                                            fontWeight: 'bold',
                                            padding: '8px 16px', // ลดขนาดปุ่ม
                                            fontSize: '14px', // ลดขนาดฟอนต์
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        ปิด
                                    </Button>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal ที่จะใช้แสดงข้อความเมื่อการจองสำเร็จ */}
                        <Modal
                            title="การจองห้องประชุมสำเร็จ"
                            visible={isModalVisible}
                            onOk={() => router.push('/users/home/meetingroom/complete')} // ไปที่หน้าการจองสำเร็จ
                            onCancel={() => setIsModalVisible(false)} // ปิด Modal
                            okButtonProps={{
                                style: {
                                    backgroundColor: '#28a745', // สีเขียว
                                    borderColor: '#28a745', // สีขอบเขียว
                                },
                            }}
                        >
                            <p>ห้องประชุมของคุณได้รับการจองเรียบร้อยแล้ว</p>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default BookingSuccess;
