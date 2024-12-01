'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Divider, Alert, Card, Space, List } from 'antd';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { Content } from 'antd/lib/layout/layout';
import { CheckCircleOutlined, WarningOutlined, PrinterOutlined, CheckOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ApprovalPending() {
    const [bookingData, setBookingData] = useState(null);
    const [isApproved, setIsApproved] = useState(false); // สถานะการอนุมัติ
    const router = useRouter();  // เรียกใช้ useRouter

    useEffect(() => {
        // ดึงข้อมูลจาก sessionStorage หรือจากที่อื่น
        const data = JSON.parse(sessionStorage.getItem('bookingData'));
        if (data) {
            setBookingData(data);
        } else {
            console.error('ไม่พบข้อมูลการจองใน sessionStorage');
        }
    }, []);

    const handleApprove = () => {
        setIsApproved(true); // เปลี่ยนสถานะเป็นอนุมัติ
    };

    const handlePrint = () => {
        if (!isApproved) {
            alert('สถานะยังไม่ได้รับการอนุมัติ');
            return;
        }
        // ฟังก์ชันการพิมพ์ใบจอง
        console.log('พิมพ์ใบจอง:', bookingData);
    };

    const handleReturnRoom = () => {
        if (!isApproved) {
            alert('สถานะยังไม่ได้รับการอนุมัติ');
            return;
        }
        // ฟังก์ชันการคืนห้องประชุม
        const bookingDataParam = encodeURIComponent(JSON.stringify(bookingData));
        router.push(`/users/home/meetingroom/complete/meetreturn?bookingData=${bookingDataParam}`);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px' }}>
                    <Content
                        style={{
                            padding: '30px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <Title level={3} style={{ textAlign: 'left', color: '#333' }}>
                                รออนุมัติ
                            </Title>
                            <Divider style={{ margin: '0 0 10px 0' }} />
                            {/* แสดงสถานะ */}
                            <Alert
                                message={`สถานะ: ${isApproved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}`}
                                type={isApproved ? 'success' : 'warning'}
                                showIcon
                                icon={isApproved ? <CheckCircleOutlined /> : <WarningOutlined />}
                                style={{
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                                action={
                                    !isApproved && (
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={handleApprove}
                                            shape="circle"
                                            size="small"
                                            style={{
                                                backgroundColor: '#4CAF50',
                                                borderColor: '#4CAF50',
                                                borderRadius: '50%',
                                                padding: '4px',
                                            }}
                                        />
                                    )
                                }
                            />
                            {/* แสดงข้อมูลการจอง */}
                            {bookingData ? (
                                <Card
                                    title="ข้อมูลการจอง"
                                    bordered={false}
                                    style={{
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '15px',
                                    }}
                                >
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <img
                                                src={bookingData.roomImage || '/default-room-image.jpg'}
                                                alt="Room"
                                                style={{
                                                    width: '200px',
                                                    height: '120px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Text strong>ชื่อห้องประชุม:</Text> {bookingData.roomName || 'N/A'} <br />
                                                <Text strong>ความจุ:</Text> {bookingData.capacity || 'N/A'} <br />

                                                <Text strong>วันที่เริ่มต้น:</Text> {bookingData.startDate || 'N/A'} <br />
                                                <Text strong>ถึงวันที่:</Text> {bookingData.endDate || 'N/A'}
                                            </div>
                                        </div>

                                        <Divider style={{ margin: '10px 0' }} />
                                        <div>
                                            <Text strong>เลขที่ใบจอง:</Text> {bookingData.bookingNumber || 'N/A'} <br />
                                            <Text strong>วันที่-เวลา:</Text> {bookingData.bookingDate || 'N/A'} <br />
                                            <Text strong>จุดประสงค์การใช้งาน:</Text> {bookingData.purpose || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>ปลายทาง:</Text> {bookingData.destination || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>แผนก/ฝ่าย:</Text> {bookingData.department || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>เบอร์ติดต่อ:</Text> {bookingData.contactNumber || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>อุปกรณ์เสริมที่เลือก:</Text>
                                            {bookingData.additionalEquipment && bookingData.additionalEquipment.length > 0
                                                ? bookingData.additionalEquipment.join(', ')
                                                : 'ไม่มีการเลือกอุปกรณ์เสริม'}
                                            <br />
                                        </div>
                                    </Space>
                                </Card>
                            ) : (
                                <p>กำลังโหลดข้อมูล...</p>
                            )}
                            <Divider style={{ margin: '10px 0' }} />
                            {/* ปุ่มการกระทำ */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <Button
                                    type="default"
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                    disabled={!isApproved}
                                    style={{
                                        borderRadius: '8px',
                                        backgroundColor: '#f5f5f5',
                                        color: '#1890ff',
                                        borderColor: '#f0f0f0',
                                    }}
                                >
                                    พิมพ์ใบจอง
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    onClick={handleReturnRoom}
                                    disabled={!isApproved}
                                    style={{
                                        backgroundColor: isApproved ? '#1890ff' : '#d9d9d9',
                                        borderColor: isApproved ? '#1890ff' : '#d9d9d9',
                                        borderRadius: '8px',
                                    }}
                                >
                                    คืนห้องประชุม
                                </Button>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default ApprovalPending;