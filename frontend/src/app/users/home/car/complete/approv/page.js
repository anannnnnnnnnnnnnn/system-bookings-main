'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';  // เพิ่มการนำเข้า axios สำหรับดึงข้อมูลรถจาก API
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
    const searchParams = useSearchParams(); // ใช้ useSearchParams เพื่อดึง query string
    const carId = searchParams.get('carId');
    const [bookingData, setBookingData] = useState(null);
    const [carDetails, setCarDetails] = useState(null);  // สถานะสำหรับเก็บข้อมูลของรถ
    const [isApproved, setIsApproved] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const router = useRouter();

    // ดึงข้อมูลการจองจาก query string
    useEffect(() => {
        const bookingDataQuery = searchParams.get('bookingData');
        if (bookingDataQuery) {
            try {
                setBookingData(JSON.parse(bookingDataQuery));  // แปลงข้อมูลที่ได้จาก query string
            } catch (error) {
                console.error('Error parsing booking data:', error);
            }
        }
    }, [searchParams]);

    // ดึงข้อมูลของรถจาก carId
    useEffect(() => {
        if (carId) {
            axios.get(`http://localhost:5182/api/cars/${carId}`)
                .then((response) => {
                    setCarDetails(response.data);  // เก็บข้อมูลรถในสถานะ
                })
                .catch((error) => {
                    console.error('Error fetching car details:', error);
                });
        }
    }, [carId]);

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
                                        src={carDetails?.image_url ? `http://localhost:5182${carDetails.image_url}` : null}
                                        alt="Car"
                                        style={{
                                            width: '200px',
                                            height: '100px',
                                            borderRadius: '8px',
                                            objectFit: 'cover',
                                            marginRight: '16px',
                                            border: '1px solid #E0E0E0',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                            <div style={{ flexGrow: 1 }}>
                                            {carDetails ? (
                                           <>
                                            <Text
                                            
                                                    style={{
                                                        fontSize: '18px',
                                                        fontWeight: '600',
                                                        color: '#2C3E50',
                                                        marginBottom: '8px',
                                                    }}
                                                >
                                                    {carDetails.brand}
                                                </Text>
                                                <div
                                                    style={{
                                                        fontSize: '14px',
                                                        color: '#7F8C8D',
                                                        lineHeight: '1.6',
                                                    }}
                                                >
                                                    <p style={{ margin: 0 }}>รถรุ่น: {carDetails.model}</p>
                                                    <p style={{ margin: 0 }}>ป้ายทะเบียน: {carDetails.license_plate}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {carDetails.seating_capacity} ที่นั่ง</p>
                                                </div>
                                            </>
                                            ) : (
                                                <p>กำลังโหลดข้อมูลรถ...</p>  // ข้อความระหว่างโหลดข้อมูล
                                            )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ข้อมูลการจอง */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '30px', justifyContent: 'center' }}>
                                        {/* ฟอร์ม 1 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            หมายเลขการจอง:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.booking_number || 'N/A'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 2 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            วันที่-เวลาการจอง:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                { `${bookingData.booking_date } ${bookingData.booking_time}` || 'N/A'}
                                            </span>
                                           
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            วันที่-เวลาการคืน:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {`${bookingData.return_date} ${bookingData.return_time}`  || 'N/A'}
                                            </span>    
                                        </div>

                                        {/* ฟอร์ม 3 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                จุดประสงค์:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.purpose|| 'ไม่ได้ระบุ'}
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
                                                แผนก:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.department || 'ไม่ได้ระบุ'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 7 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                                พนักงานขับรถ:
                                            </label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {bookingData.driver_required === 1 ? 'ต้องการ' : 'ไม่ต้องการ'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Text>กำลังโหลดข้อมูล...</Text>
                            )}
                            <Divider />


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