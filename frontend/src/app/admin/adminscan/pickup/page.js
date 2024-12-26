'use client';
import React, { useRef, useEffect, useState } from 'react';
import { Typography, Button, Row, Col, Card, Modal } from 'antd';
import Navbar from '../../admincar/component/navbar';

const { Title } = Typography;

const PickupScanPage = () => {
    const videoRef = useRef(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    // ตัวอย่างข้อมูลการจองที่สร้างขึ้นเอง
    const sampleBookingData = {
        username: "John Doe",
        carType: "Sedan",
        time: "14:30",
        destination: "Central Park",
        startDate: "2024-12-11",
        endDate: "2024-12-12",
    };

    useEffect(() => {
        // ตัวอย่างการใช้ข้อมูลการจองที่สร้างขึ้นเอง (ใช้ sampleBookingData แทน)
        setBookingDetails(sampleBookingData); // ตั้งค่า bookingDetails ด้วยข้อมูลที่สร้างขึ้นเอง
    }, []);

    // ฟังก์ชันสำหรับการตรวจสอบ QR code และแสดงข้อมูล
    const scanQRCode = async () => {
        if (videoRef.current) {
            const videoElement = videoRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = videoElement.videoHeight;
            canvas.width = videoElement.videoWidth;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
                const decodedData = JSON.parse(code.data);
                setBookingDetails(decodedData); // Update state with decoded data
                setIsModalVisible(true);
            } else {
                alert('ไม่สามารถสแกน QR Code ได้');
            }
        }
    };

    // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
    

    return (
        <div style={{ minHeight: '100vh', background: '#ffff', padding: '30px 20px', position: 'relative' }}>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
                <Row justify="center" style={{ marginTop: '20px' }}>
                    <Col xs={22} sm={20} md={18} lg={10} xl={8}>
                        <Card
                            bordered={false}
                            style={{
                                background: '#fff',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                borderRadius: '16px',
                                padding: '16px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ marginBottom: '20px' }}>
                                <Title level={2} style={{ color: '#4caf50', fontWeight: 400 }}>
                                    สแกน QR Code สำหรับรับรถ
                                </Title>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        border: '2px solid #b9f6ca',
                                        marginBottom: '15px',
                                    }}
                                />
                                <p style={{ color: '#388e3c', fontSize: '16px', fontWeight: 500 }}>
                                    กรุณานำ QR Code มาแสดงหน้ากล้อง
                                </p>
                                <Button
                                    type="primary"
                                    onClick={scanQRCode}
                                    style={{
                                        borderRadius: '25px',
                                        marginTop: '10px',
                                        backgroundColor: '#66bb6a',
                                        borderColor: '#66bb6a',
                                        padding: '8px 20px',
                                        fontWeight: '600',
                                    }}
                                >
                                    เริ่มต้นสแกน
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setIsModalVisible(true); // เปิด Modal แสดงข้อมูลผู้จอง
                                    }}
                                    style={{
                                        borderRadius: '25px',
                                        marginTop: '15px',
                                        backgroundColor: '#00bfa5',
                                        borderColor: '#00bfa5',
                                        padding: '8px 20px',
                                        fontWeight: '600',
                                    }}
                                >
                                    สแกนเสร็จแล้ว
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Modal แสดงข้อมูลผู้จอง */}
            <Modal
                title="ข้อมูลผู้จอง"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button
                        key="done"
                        type="primary"
                        style={{
                            borderRadius: '25px',
                            backgroundColor: '#66bb6a',
                            borderColor: '#66bb6a',
                            padding: '8px 24px',
                            fontWeight: '600',
                            fontSize: '16px',
                            width: '100%',
                            marginTop: '16px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.3s ease',
                        }}
                        onClick={() => {
                            setIsModalVisible(false);
                            // ส่งข้อมูลไปยัง API
                            submitBookingDetails();
                            Modal.success({
                                title: 'ดำเนินการเสร็จสิ้น',
                                content: 'คุณได้ยืนยันการรับรถสำเร็จแล้ว',
                                centered: true,
                            });
                        }}
                    >
                        ยืนยันการรับรถ
                    </Button>
                ]}
                centered
                style={{
                    top: '20px',
                    borderRadius: '16px',
                }}
                bodyStyle={{
                    padding: '24px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '16px',
                    color: '#333',
                    lineHeight: '1.6',
                }}
                headerStyle={{
                    background: '#f5f5f5',
                    fontSize: '18px',
                    fontWeight: '500',
                    color: '#333',
                    textAlign: 'center',
                    borderRadius: '16px 16px 0 0',
                }}
                closable={false} // ปิดปุ่มปิด (optional)
            >
                {bookingDetails ? (
                    <div style={{ textAlign: 'left', lineHeight: '1.8' }}>
                        <p><strong>ชื่อผู้จอง:</strong> {bookingDetails.username}</p>
                        <p><strong>รถที่จอง:</strong> {bookingDetails.carType}</p>
                        <p><strong>เวลา:</strong> {bookingDetails.time}</p>
                        <p><strong>ปลายทาง:</strong> {bookingDetails.destination}</p>
                        <p><strong>วันที่เริ่มต้น:</strong> {bookingDetails.startDate}</p>
                        <p><strong>วันที่สิ้นสุด:</strong> {bookingDetails.endDate}</p>
                    </div>
                ) : (
                    <p>ไม่พบข้อมูลการจอง</p>   
                )}
            </Modal>
        </div>
    );
};

export default PickupScanPage;
