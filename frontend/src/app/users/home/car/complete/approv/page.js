'use client'
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Divider, Alert, Card, Space, message, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { CheckCircleOutlined, WarningOutlined, PrinterOutlined, CheckOutlined, QrcodeOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode.react';

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

    useEffect(() => {
        if (bookingData) {
            const qrData = JSON.stringify(bookingData); // แปลงข้อมูลการจองเป็น JSON string สำหรับ QR Code
            setQrCodeData(qrData);
        }
    }, [bookingData]);

    const handleApprove = () => {
        setIsApproved(true);
        message.success('อนุมัติเรียบร้อยแล้ว');
    };

    const handlePrint = () => {
        if (!isApproved) {
            message.warning('กรุณาอนุมัติก่อนพิมพ์ใบจอง');
            return;
        }

        // สร้าง PDF ด้วย jsPDF
        const doc = new jsPDF();

        // เพิ่มข้อมูลการจองใน PDF
        doc.setFontSize(16);
        doc.text('ใบจองรถ', 20, 20);

        doc.setFontSize(12);
        doc.text(`เลขที่ใบจอง: ${bookingData.bookingNumber || 'N/A'}`, 20, 30);
        doc.text(`ทะเบียนรถ: ${bookingData.licensePlate || 'N/A'}`, 20, 40);
        doc.text(`ประเภท: ${bookingData.carType || 'N/A'}`, 20, 50);
        doc.text(`วันที่ใช้รถ: ${bookingData.startDate || 'N/A'}`, 20, 60);
        doc.text(`ถึงวันที่: ${bookingData.endDate || 'N/A'}`, 20, 70);
        doc.text(`จุดประสงค์: ${bookingData.purpose || 'ไม่ได้ระบุ'}`, 20, 80);
        doc.text(`ปลายทาง: ${bookingData.destination || 'ไม่ได้ระบุ'}`, 20, 90);
        doc.text(`จำนวนผู้โดยสาร: ${bookingData.passengers || 'ไม่ได้ระบุ'}`, 20, 100);

        // สร้าง QR Code ใน PDF
        if (qrCodeData) {
            const canvas = document.createElement('canvas');
            QRCode.toCanvas(canvas, qrCodeData, (error) => {
                if (error) {
                    console.error(error);
                } else {
                    const qrImage = canvas.toDataURL('image/png');
                    doc.addImage(qrImage, 'PNG', 20, 110, 50, 50); // วาง QR Code ที่จุด (20, 110) ขนาด 50x50
                    doc.save('booking_confirmation.pdf');
                }
            });
        }
    };

    const handleScanQRCode = () => {
        setIsModalVisible(true); // เปิด Modal
    };

    const handleCancel = () => {
        setIsModalVisible(false); // ปิด Modal
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
                                                backgroundColor: '#4CAF50',
                                                borderColor: '#4CAF50',
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
