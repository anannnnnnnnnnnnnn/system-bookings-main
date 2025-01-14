'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Button, Divider, Alert, Card, Space, message, Modal, Row, Col } from 'antd';
import { useRouter } from 'next/navigation';
import { Content } from 'antd/es/layout/layout';
import Navbar from '../../../navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { CheckCircleOutlined, WarningOutlined, PrinterOutlined, CheckOutlined, QrcodeOutlined } from '@ant-design/icons';
import { jsPDF } from 'jspdf';

const { Title, Text } = Typography;

function ApprovalPending() {
    const [bookingData, setBookingData] = useState(null);
    const [isApproved, setIsApproved] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const data = sessionStorage.getItem('bookingData');
        if (data) {
            setBookingData(JSON.parse(data));
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

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('รายละเอียดการจองรถ', 20, 20);

        const bookingDetails = bookingData || {};
        const details = [
            { label: 'ทะเบียนรถ:', value: bookingDetails.licensePlate || 'N/A' },
            { label: 'ประเภทรถ:', value: bookingDetails.carType || 'N/A' },
            { label: 'วันที่ใช้รถ:', value: bookingDetails.startDate || 'N/A' },
            { label: 'ถึงวันที่:', value: bookingDetails.endDate || 'N/A' },
        ];

        let yOffset = 30;
        details.forEach(item => {
            doc.setFontSize(12);
            doc.text(`${item.label} ${item.value}`, 20, yOffset);
            yOffset += 10;
        });

        doc.save('booking-details.pdf');
    };

    const handleScanQRCode = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            <Navbar />
            <Layout style={{ padding: '20px 50px', backgroundColor: '#F9FAFB' }}>
                <Sidebar />
                <Layout style={{ padding: '0 30px', backgroundColor: '#F9FAFB' }}>
                    <Navigation />
                    <Content
                        style={{
                            margin: '20px 0',
                            padding: '24px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <Title level={4} style={{ color: '#333', fontWeight: '600', marginBottom: '16px' }}>
                                รออนุมัติ
                            </Title>
                            <Divider style={{ margin: '0 0 16px 0' }} />
                            <Alert
                                message={`สถานะ: ${isApproved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}`}
                                type={isApproved ? 'success' : 'warning'}
                                showIcon
                                icon={isApproved ? <CheckCircleOutlined /> : <WarningOutlined />}
                                style={{
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    backgroundColor: isApproved ? '#E6F7E6' : '#FFF7E6',
                                }}
                                action={
                                    !isApproved && (
                                        <Button
                                            type="primary"
                                            icon={<CheckOutlined />}
                                            onClick={handleApprove}
                                            style={{ backgroundColor: '#FFC069', borderColor: '#FFC069' }}
                                        >
                                            อนุมัติ
                                        </Button>
                                    )
                                }
                            />
                            {bookingData ? (
                                <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
                                    {/* Title */}
                                    <div style={{ marginBottom: '16px' }}>
                                        <Title level={4} style={{ color: '#333', fontWeight: '600' }}>
                                            ข้อมูลการจอง
                                        </Title>
                                    </div>

                                    {/* ข้อมูลรถ */}
                                    <div style={{
                                        borderRadius: '12px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '20px',
                                    }}>
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                            <img
                                                src="/assets/car1.jpg"
                                                alt="Car"
                                                style={{
                                                    width: '100px',
                                                    height: '70px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div style={{ flexGrow: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'start' }}>
                                                    <Text strong style={{ fontSize: '14px' }}>ทะเบียนรถ:</Text>
                                                    <Text style={{ fontSize: '14px', color: '#666' }}>{bookingData.licensePlate || 'N/A'}</Text>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'start', }}>
                                                    <Text strong style={{ fontSize: '14px' }}>ประเภทรถ:</Text>
                                                    <Text style={{ fontSize: '14px', color: '#666' }}>{bookingData.carType || 'N/A'}</Text>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'start', }}>
                                                    <Text strong style={{ fontSize: '14px' }}>วันที่ใช้รถ:</Text>
                                                    <Text style={{ fontSize: '14px', color: '#666' }}>{bookingData.startDate || 'N/A'}</Text>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'start' }}>
                                                    <Text strong style={{ fontSize: '14px' }}>ถึงวันที่:</Text>
                                                    <Text style={{ fontSize: '14px', color: '#666' }}>{bookingData.endDate || 'N/A'}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ข้อมูลการจอง */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '30px', justifyContent: 'center' }}>
                                        {/* ฟอร์ม 1 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                เลขที่ใบจอง:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.bookingNumber || 'N/A'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 2 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                วันที่-เวลา:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.bookingDate || 'N/A'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 3 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                จุดประสงค์:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.purpose || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 4 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                ปลายทาง:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.destination || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 5 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                จำนวนผู้โดยสาร:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.passengers || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 6 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                แผนก:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.department || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 7 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                เบอร์ติดต่อ:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.contactNumber || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 8 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                พนักงานขับรถ:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ'}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <Text>กำลังโหลดข้อมูล...</Text>
                            )}
                            <Divider/>


                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <Button
                                    type="default"
                                    icon={<PrinterOutlined />}
                                    onClick={handlePrint}
                                    style={{ borderRadius: '8px' }}
                                >
                                    พิมพ์ใบจอง
                                </Button>
                                <Button
                                    type="default"
                                    icon={<QrcodeOutlined />}
                                    onClick={handleScanQRCode}
                                    disabled={!isApproved}
                                    style={{ borderRadius: '8px' }}
                                >
                                    สแกน QR Code
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
