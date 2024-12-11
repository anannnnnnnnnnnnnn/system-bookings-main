'use client';

import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Divider, Alert, Card, Space, message } from 'antd';
import { useRouter } from 'next/navigation';
import { Html5QrcodeScanner } from 'html5-qrcode'; // import html5-qrcode
import Navbar from '../admincar/component/navbar';
import Sidebar from '../admincar/component/sidebar';
import { Content } from 'antd/lib/layout/layout';
import { CheckCircleOutlined, WarningOutlined, PrinterOutlined, CarOutlined, CheckOutlined, QrcodeOutlined } from '@ant-design/icons';
import QRCode from 'qrcode.react'; // ใช้ default import

const { Title, Text } = Typography;

function ApprovalPending() {
    const [bookingData, setBookingData] = useState(null);
    const [isApproved, setIsApproved] = useState(false);
    const [scanning, setScanning] = useState(false); // เพิ่มสถานะการสแกน
    const [qrCodeData, setQrCodeData] = useState(null); // เก็บข้อมูล QR code
    const router = useRouter();

    useEffect(() => {
        try {
            const data = JSON.parse(sessionStorage.getItem('bookingData'));
            if (data) {
                setBookingData(data);
            } else {
                message.error('ไม่พบข้อมูลการจองใน sessionStorage');
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
        }
    }, []);

    useEffect(() => {
        if (scanning && !qrCodeData) { // ตรวจสอบว่าไม่มี qrCodeData เมื่อเริ่มสแกน
            const html5QrCodeScanner = new Html5QrcodeScanner("qr-code-scanner", {
                fps: 10,
                qrbox: 250
            });
            html5QrCodeScanner.render(onScanSuccess, onScanError);

            return () => {
                html5QrCodeScanner.clear();
            };
        }
    }, [scanning, qrCodeData]);

    const onScanSuccess = (decodedText, decodedResult) => {
        message.success(`QR Code Scanned: ${decodedText}`);
        setQrCodeData(decodedText); // ตั้งค่า qrCodeData เมื่อสแกนสำเร็จ
        setScanning(false);
    };

    const onScanError = (errorMessage) => {
        console.error(errorMessage);
    };

    const handleApprove = () => {
        setIsApproved(true);
        message.success('อนุมัติเรี ยบร้อยแล้ว');
    };

    const handlePrint = () => {
        if (!isApproved) {
            message.warning('กรุณาอนุมัติก่อนพิมพ์ใบจอง');
            return;
        }
        console.log('พิมพ์ใบจอง:', bookingData);
    };

    const handleReturnCar = () => {
        if (!isApproved) {
            message.warning('กรุณาอนุมัติก่อนคืนรถ');
            return;
        }
        if (!bookingData) {
            message.error('ไม่มีข้อมูลการจอง');
            return;
        }
        const bookingDataParam = encodeURIComponent(JSON.stringify(bookingData));
        router.push(`/users/home/car/complete/carreturn?bookingData=${bookingDataParam}`);
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
                                    disabled={!isApproved}
                                >
                                    พิมพ์ใบจอง
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<CarOutlined />}
                                    onClick={handleReturnCar}
                                    disabled={!isApproved}
                                >
                                    คืนรถ
                                </Button>
                                <Button
                                    type="default"
                                    icon={<QrcodeOutlined />}
                                    onClick={() => setScanning(true)} // เมื่อคลิกจะเริ่มการสแกน
                                >
                                    สแกน QR Code
                                </Button>
                            </div>

                            {/* แสดง QR code ให้คนอื่นสแกน */}
                            {qrCodeData ? (
                                <div style={{ marginTop: '20px' }}>
                                    <QRCode value={qrCodeData} size={256} />
                                </div>
                            ) : (
                                <Text>ไม่มีข้อมูลการจอง</Text>
                            )}

                            {/* Div สำหรับ HTML5 QR Code Scanner */}
                            {scanning && !qrCodeData && (  // ตรวจสอบให้แน่ใจว่าไม่มี QR Code แสดงเมื่อกำลังสแกน
                                <div id="qr-code-scanner" style={{ width: '100%', height: '300px' }}></div>
                            )}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default ApprovalPending;
