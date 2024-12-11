'use client'; // ทำให้ React ใช้งานใน client-side rendering
import React, { useState } from 'react';
import { useRouter } from 'next/router';  // ใช้ useRouter จาก next/router
import { Result, Button, Layout, Modal, message } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';

const { Content } = Layout;

function BookingSuccess() {
    const [isModalVisible, setIsModalVisible] = useState(false);  // ใช้ state เพื่อควบคุมการแสดงผลของ modal


    const handleConfirmBooking = () => {
        // การแสดงข้อความสำเร็จ
        message.success("การจองห้องประชุมสำเร็จ!");

        // แสดง Modal
        setIsModalVisible(true);
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
                            <div style={{ padding: '50px' }}>
                                <Result
                                    status="success"
                                    title="การจองห้องประชุมสำเร็จ"
                                    subTitle="ห้องประชุมของคุณได้รับการจองเรียบร้อยแล้ว"
                                    extra={[
                                        <Button
                                            type="primary"
                                            key="console"
                                            onClick={handleConfirmBooking}  // เรียกใช้ฟังก์ชัน handleConfirmBooking
                                        >
                                            จองห้องประชุมใหม่
                                        </Button>,
                                        <Button
                                            key="buy"
                                            onClick={() => router.push("/booking-history")}  // ลิงก์ไปหน้าประวัติการจอง
                                        >
                                            ดูการจองทั้งหมด
                                        </Button>,
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Modal ที่จะใช้แสดงข้อความเมื่อการจองสำเร็จ */}
                        <Modal
                            title="การจองห้องประชุมสำเร็จ"
                            visible={isModalVisible}
                            onOk={() => router.push("/users/home/meetingroom/complete")}  // ไปที่หน้าการจองสำเร็จ
                            onCancel={() => setIsModalVisible(false)}  // ปิด Modal
                        >
                            <p>ห้องประชุมของคุณได้รับการจองเรียบร้อยแล้ว</p>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default BookingSuccess;
