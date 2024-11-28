'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layout, Typography, Card, Space, Button, Divider, Alert, Spin } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../components/navbar';
import { Content } from 'antd/lib/layout/layout';

const { Title, Text } = Typography;

function CarReturn() {
    const searchParams = useSearchParams();
    const [bookingData, setBookingData] = useState(null);
    const [status, setStatus] = useState(null); // สถานะของการคืนรถ
    const [loading, setLoading] = useState(false); // สถานะ Loading

    useEffect(() => {
        const bookingDataParam = searchParams.get('bookingData');
        if (bookingDataParam) {
            try {
                setBookingData(JSON.parse(bookingDataParam));
            } catch (error) {
                console.error('ข้อมูลการจองไม่ถูกต้อง', error);
            }
        }
    }, [searchParams]);

    const handleSubmitReturn = () => {
        setLoading(true); // เริ่มการโหลด
        setStatus('กำลังดำเนินการคืนรถ...'); // อัปเดตสถานะเบื้องต้น

        // จำลองสถานการณ์ที่แอดมินต้องกดยืนยัน
        // สถานะจะไม่เปลี่ยนจนกว่าแอดมินจะทำการยืนยันการคืนรถ
    };

    // จำลองการคลิกของแอดมินเพื่อเปลี่ยนสถานะ
    const handleAdminComplete = () => {
        setLoading(false); // หยุดการโหลด
        setStatus('การคืนรถสำเร็จ! ขอบคุณที่ใช้บริการ'); // แสดงสถานะการคืนรถสำเร็จ
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
                            

                            <Title level={3}>หน้าคืนรถ</Title>
                            <Divider style={{ margin: '10px 0' }} />
                            {/* ย้ายแถบสถานะไปข้างบน */}
                            {status && (
                                <Alert
                                    message={status}
                                    type={loading ? 'info' : 'success'} // ใช้ 'info' ระหว่างที่โหลด
                                    showIcon
                                    style={{ marginBottom: '15px' }}
                                />
                            )}
                            <Divider style={{ margin: '10px 0' }}/>
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
                                                src={bookingData.carImage || '/default-car-image.jpg'}
                                                alt="Car"
                                                style={{
                                                    width: '200px',
                                                    height: '120px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Text strong>ทะเบียนรถ:</Text> {bookingData.licensePlate} <br />
                                                <Text strong>ประเภทรถ:</Text> {bookingData.carType} <br />
                                                <Text strong>วันที่ใช้รถ:</Text> {bookingData.startDate} <br />
                                                <Text strong>ถึงวันที่:</Text> {bookingData.endDate} <br />
                                            </div>
                                        </div>
                                        
                                        <Divider style={{ margin: '10px 0' }} />
                                        <div>
                                            <Text strong>เลขที่ใบจอง:</Text> {bookingData.bookingNumber || 'N/A'} <br />
                                            <Text strong>จุดประสงค์:</Text> {bookingData.purpose || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>ปลายทาง:</Text> {bookingData.destination || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>จำนวนผู้โดยสาร:</Text> {bookingData.passengers || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>แผนก:</Text> {bookingData.department || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>เบอร์ติดต่อ:</Text> {bookingData.contactNumber || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>พนักงานขับรถ:</Text>{' '}
                                            {bookingData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ'}
                                        </div>
                                    </Space>
                                </Card>
                            ) : (
                                <p>ไม่พบข้อมูลการจอง</p>
                            )}
                            <Divider style={{ margin: '10px 0' }}/>
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    onClick={handleSubmitReturn}
                                    loading={loading} // ปุ่มจะมีสถานะ Loading ระหว่างดำเนินการ
                                    style={{ borderRadius: '8px' }}
                                >
                                    ยืนยันการคืนรถ
                                </Button>
                            </div>
                            <Divider style={{ margin: '10px 0' }}/>
                            <div style={{ textAlign: 'center' }}>
                                {/* ปุ่มจำลองการยืนยันการคืนรถจากแอดมิน */}
                                <Button
                                    type="default"
                                    onClick={handleAdminComplete}
                                    style={{ marginTop: '10px', borderRadius: '8px' }}
                                >
                                    แอดมินยืนยันการคืนรถ
                                </Button>
                            </div>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default CarReturn;
