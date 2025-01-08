'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Input, Radio, Button, Divider, Modal, Space } from 'antd';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { FileTextOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
    const [formData, setFormData] = useState({
        bookingNumber: '',
        bookingDate: '',
        username: '',
        purpose: '',
        destination: '',
        passengers: '',
        driverRequired: 'no', // Default value
    });
    const [carData, setCarData] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        // ดึงข้อมูลจาก sessionStorage
        const carDetails = JSON.parse(sessionStorage.getItem('selectedCar'));
        if (carDetails) {
            setCarData(carDetails);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirm = () => {
        sessionStorage.setItem('bookingData', JSON.stringify(formData));
        window.location.href = '/users/home/car/complete/approv';
    };

    const handleSaveBooking = () => {
        sessionStorage.setItem('bookingData', JSON.stringify(formData));
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {/* Navbar */}
            <Navbar />

            <Layout style={{ padding: '0px 50px', marginTop: '20px', backgroundColor: '#fff' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
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
                        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff' }}>
                            <Title level={3} style={{ textAlign: 'left', marginBottom: '16px', color: 'black', fontSize: '20px' }}>
                                <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                                รายละเอียดการจอง
                            </Title>
                            <Divider />

                            {/* Car Details Section */}
                            <div style={{ padding: '5px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        backgroundColor: '#fff',
                                        marginBottom: '16px',
                                        transition: 'border 0.3s ease',
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.border = '1px solid #B0B0B0'}
                                    onMouseLeave={(e) => e.currentTarget.style.border = '1px solid #E0E0E0'}
                                >
                                    <img
                                        src={carData ? carData.imageUrl : '/assets/car1.jpg'}
                                        alt="Car"
                                        style={{
                                            width: '120px',
                                            height: 'auto',
                                            borderRadius: '8px',
                                            border: '1px solid #E0E0E0',
                                            marginRight: '16px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <div style={{ flex: 1, textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
                                        {carData ? (
                                            <>
                                                <Text style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                                                    {carData.carId}
                                                </Text>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                                                    <p><strong>ประเภทรถ:</strong> {carData.carType}</p>
                                                    <p><strong>ยี่ห้อ:</strong> {carData.brand}</p>
                                                    <p><strong>ประเภทเชื้อเพลิง:</strong> {carData.fuelType}</p>
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '14px', color: '#666' }}>
                                                    <p><strong>วันที่ใช้รถ:</strong> {carData.startDate}</p>
                                                    <p><strong>ถึงวันที่ใช้รถ:</strong> {carData.endDate}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <Text>ข้อมูลรถไม่พบ</Text>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Form */}
                            <Title level={2} style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '20px', fontSize: '24px' }}>
                                เลือกรถที่ต้องการจอง
                            </Title>
                            <div style={{ maxWidth: '700px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>เลขที่ใบจอง</label>
                                    <Input value={formData.bookingNumber} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลา</label>
                                    <Input value={formData.bookingDate} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                                    <Input value={formData.username} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>จุดประสงค์การใช้งาน</label>
                                    <TextArea name="purpose" rows={2} placeholder="กรุณาระบุจุดประสงค์" onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ปลายทาง</label>
                                    <TextArea name="destination" rows={2} placeholder="กรุณาระบุปลายทาง" onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>จำนวนผู้โดยสาร</label>
                                    <Input type="number" name="passengers" placeholder="จำนวนผู้โดยสาร" onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ต้องการพนักงานขับรถ</label>
                                    <Radio.Group name="driverRequired" value={formData.driverRequired} onChange={handleChange}>
                                        <Radio value="yes">ต้องการ</Radio>
                                        <Radio value="no">ไม่ต้องการ</Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <Divider />
                            <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                <Button
                                    type="primary"
                                    onClick={() => setIsModalVisible(true)}
                                    style={{
                                        backgroundColor: '#28a745',
                                        borderColor: '#28a745',
                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    ถัดไป
                                </Button>
                            </div>
                        </div>

                        {/* Modal for booking confirmation */}
                        <Modal
                            title={<div style={{ textAlign: 'center', color: '#029B36', fontWeight: 'bold', fontSize: '20px' }}>ยืนยันการจอง</div>}
                            visible={isModalVisible}
                            onOk={handleConfirm}
                            onCancel={() => setIsModalVisible(false)}
                            centered
                            okText="ยืนยันการจอง"
                            cancelText="ยกเลิก"
                            width={500}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ color: '#555', fontSize: '16px', fontWeight: 'bold' }}>คุณต้องการยืนยันการจองหรือไม่?</p>
                                <Button
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#029B36',
                                        color: 'white',
                                        padding: '12px',
                                        fontWeight: '600',
                                    }}
                                    onClick={handleSaveBooking}
                                >
                                    ยืนยัน
                                </Button>
                            </div>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default BookingDetails;
