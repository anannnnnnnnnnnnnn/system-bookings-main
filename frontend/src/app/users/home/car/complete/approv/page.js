'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Divider, Alert, Card, Space, message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { CheckCircleOutlined, WarningOutlined, PrinterOutlined, CheckOutlined, QrcodeOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

function ApprovalPending() {
    const [bookingData, setBookingData] = useState(null); // เก็บข้อมูลการจอง
    const [isApproved, setIsApproved] = useState(false);
    const [qrCodeData, setQrCodeData] = useState(null); // เก็บข้อมูลสำหรับ QR Code
    const [isModalVisible, setIsModalVisible] = useState(false); // สถานะของ Modal
    const router = useRouter();

    useEffect(() => {
        // ดึงข้อมูลการจองจาก sessionStorage หรือ API
        const data = sessionStorage.getItem('bookingData');
        if (data) {
            setBookingData(JSON.parse(data)); // ถ้ามีข้อมูลการจองให้เซ็ตลงใน state
        } else {
            message.error('ไม่พบข้อมูลการจอง');
        }
    }, []);

    const handleApprove = () => {
        setIsApproved(true);
        message.success('อนุมัติเรียบร้อยแล้ว');
    };

    const handlePrint = () => {
        if (!isApproved) {
            message.warning('รออนุมัติก่อนพิมพ์ใบจอง');
            return;
        }

    };

    const handleScanQRCode = () => {
        setIsModalVisible(true); // เปิด Modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // ปิด Modal
    };

    return (
        <Layout style={{ minHeight: '100vh',backgroundColor:'#ffff' }}>
            <Navbar />
            <Layout style={{ padding: '0px 50px', marginTop: '20px',backgroundColor:'#ffff' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 30px' ,backgroundColor:'#ffff'}}>
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
                        <div style={{ maxWidth: '800px', margin: '0px auto' }}>
                            <Title level={3} style={{ textAlign: 'left', color: '#333' }}>
                                รออนุมัติ
                            </Title>
                            <Divider style={{ margin: '0 0 10px 0' }} />    
                            <Alert
                                message={`สถานะ: ${isApproved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}`}
                                type={isApproved ? 'success' : 'warning'}
                                showIcon
                                icon={isApproved ? <CheckCircleOutlined /> : <WarningOutlined />}
                                style={{
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    marginBottom: '15px',
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
                                                backgroundColor: '#FAD5A8',
                                                borderColor: '#FAD5A8',
                                                padding: '4px',
                                            }}
                                        />
                                    )
                                }
                            />
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
                                                src="/assets/car1.jpg"
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
                                                <Text strong>ทะเบียนรถ:</Text> {bookingData.licensePlate || 'N/A'} <br />
                                                <Text strong>ประเภทรถ:</Text> {bookingData.carType || 'N/A'} <br />
                                                <Text strong>วันที่ใช้รถ:</Text> {bookingData.startDate || 'N/A'} <br />
                                                <Text strong>ถึงวันที่:</Text> {bookingData.endDate || 'N/A'}
                                            </div>
                                        </div>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <div>
                                            <Text strong>เลขที่ใบจอง:</Text> {bookingData.bookingNumber || 'N/A'} <br />
                                            <Text strong>วันที่-เวลา:</Text> {bookingData.bookingDate || 'N/A'} <br />
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
                                <p>กำลังโหลดข้อมูล...</p>
                            )}
                            <Divider style={{ margin: '10px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                                <Button
                                    type="default"
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}

                                >
                                    พิมพ์ใบจอง
                                </Button>
                                <Button
                                    type="default"
                                    icon={<QrcodeOutlined />}
                                    onClick={handleScanQRCode}
                                    disabled={!isApproved}
                                >
                                    สแกน QR Code
                                </Button>
                            </div>
                        </div>

                        {/* Modal สำหรับ QR Code */}
                        <Modal
                            title={
                                <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                                    QR Code การจองรถ
                                </div>
                            }
                            open={isModalVisible}
                            onCancel={handleCancel}
                            footer={[
                                <Button key="close" type="primary" onClick={handleCancel} style={{ borderRadius: '8px' }}>
                                    ปิด
                                </Button>
                            ]}
                            centered
                            bodyStyle={{
                                padding: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    border: '3px dashed #d9d9d9',
                                    borderRadius: '16px',
                                    padding: '30px',
                                    background: '#f7f7f7',
                                    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                                    width: '350px',
                                    height: '350px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                            </div>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
export default ApprovalPending;
