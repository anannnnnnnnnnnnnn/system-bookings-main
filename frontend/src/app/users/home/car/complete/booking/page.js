'use client';

import React, { useState } from 'react';
import { Layout, Typography, Input, Radio, Button, Divider, Modal, Space } from 'antd';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { CheckOutlined, FileTextOutlined, CarOutlined, CalendarOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
    const [formData, setFormData] = useState({
        carImage: 'url-to-car-image',  // ใส่ URL ของภาพรถ
        licensePlate: 'XYZ-1234',
        username: 'Anan Tohtia',
        carType: 'Sedan',
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        bookingNumber: 'AAA0001',
        bookingDate: '2024-12-05',
        purpose: ' ',
        destination: '',
        passengers: '',
        department: 'โปรแกรมเมอร์',
        contactNumber: '',
        driverRequired: '',
    });

    const [isModalVisible, setIsModalVisible] = useState(false);

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

                {/* เนื้อหาหลัก */}
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

                            {/* ข้อมูลรถและรูปภาพ */}
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', padding: '16px' }}>
                                    <img
                                        src="/assets/car1.jpg"
                                        alt="Car"
                                        style={{
                                            width: '25%',
                                            height: '150px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            marginRight: '16px'
                                        }}
                                    />
                                    <div style={{ flex: 1, textAlign: 'left', fontFamily: 'Arial, sans-serif' }}>
                                        <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '16px' }}>1234-XYZ</Text><br />

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#555' }}>
                                            <p style={{ margin: '8px 0' }}><strong>ประเภทรถ:</strong> Sedan</p>
                                            <p style={{ margin: '8px 0' }}><strong>ยี่ห้อ:</strong> Toyota</p>
                                            <p style={{ margin: '8px 0' }}><strong>ประเภทเชื้อเพลิง:</strong> เบนซิน</p>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#555' }}>
                                            <p ><strong>วันที่ใช้รถ:</strong> 1 มกราคม 2024</p>
                                            <p><strong>ถึงวันที่ใช้รถ:</strong> 10 มกราคม 2024</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ฟอร์มการจอง */}
                            <Title
                                level={2}
                                style={{
                                    color: '#2C3E50',
                                    fontWeight: '600',
                                    marginBottom: '20px',
                                    textAlign: 'start',
                                    fontSize: '24px'
                                }}
                            >
                                เลือกรถที่ต้องการจอง
                            </Title>
                            <div style={{
                                maxWidth: '700px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', justifyContent: 'center', // จัดตำแหน่งแนวนอน
                                alignItems: 'center',     // จัดตำแหน่งแนวตั้ง
                                margin: '0 auto',
                            }}>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        เลขที่ใบจอง
                                    </label>
                                    <Input value={formData.bookingNumber} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        วันที่-เวลา
                                    </label>
                                    <Input value={formData.bookingDate} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        ชื่อ-สกุล
                                    </label>
                                    <Input value={formData.username} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        จุดประสงค์การใช้งาน
                                    </label>
                                    <TextArea
                                        name="purpose"
                                        rows={2}
                                        placeholder="กรุณาระบุจุดประสงค์"
                                        onChange={handleChange}
                                        style={{ height: '10px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        ปลายทาง
                                    </label>
                                    <TextArea
                                        name="destination"
                                        rows={2}
                                        placeholder="กรุณาระบุปลายทาง"
                                        onChange={handleChange}
                                        style={{ height: '10px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        จำนวนผู้โดยสาร
                                    </label>
                                    <Input
                                        type="number"
                                        name="passengers"
                                        placeholder="จำนวนผู้โดยสาร"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        ต้องการพนักงานขับรถ
                                    </label>
                                    <div style={{ display: 'flex', flexDirection: 'column-reverse', margin: '10px' }}>
                                        <Radio.Group
                                            name="driverRequired"
                                            value={formData.driverRequired}
                                            onChange={handleChange}
                                        >
                                            <Radio value="yes">ต้องการ</Radio>
                                            <Radio value="no">ไม่ต้องการ</Radio>
                                        </Radio.Group>
                                    </div>
                                </div>

                            </div>

                            <Divider />
                            <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                <Button
                                    type="primary"
                                    onClick={() => setIsModalVisible(true)}
                                    style={{
                                        backgroundColor: '#28a745', // สีเขียว
                                        borderColor: '#28a745', // สีขอบปุ่ม

                                        fontWeight: 'bold',
                                        padding: '10px 20px',
                                        borderRadius: '8px', // ให้ขอบปุ่มดูเรียบ
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงาให้ปุ่มดูมีมิติ
                                        transition: 'all 0.3s ease', // เพิ่มเอฟเฟกต์การเปลี่ยนแปลงเมื่อ hover
                                    }}

                                >
                                    ถัดไป
                                </Button>
                            </div>

                        </div>

                        {/* Modal สำหรับยืนยันการจอง */}
                        <Modal
                            title={
                                <div
                                    style={{
                                        textAlign: 'center',
                                        color: '#029B36',
                                        fontWeight: 'bold',
                                        fontSize: '20px', // ขนาดเล็กลง
                                    }}
                                >
                                    ยืนยันการจอง
                                </div>
                            }
                            visible={isModalVisible}
                            onOk={handleConfirm}
                            onCancel={() => setIsModalVisible(false)}
                            centered
                            okText="ยืนยันการจอง"
                            cancelText="ยกเลิก"
                            width={400} // ความกว้างเล็กลง
                            style={{
                                borderRadius: '12px', // ขอบมน
                                overflow: 'hidden',
                                backgroundColor: '#fff',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                            }}
                            bodyStyle={{
                                padding: '16px',
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                color: '#333',
                            }}
                            okButtonProps={{
                                style: {
                                    backgroundColor: '#029B36', // สีเขียวสำหรับปุ่ม OK
                                    borderColor: '#029B36',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                },
                            }}
                            cancelButtonProps={{
                                style: {
                                    backgroundColor: '#E0F2E9', // สีเขียวอ่อนสำหรับปุ่ม Cancel
                                    borderColor: '#E0F2E9',
                                    color: '#029B36',
                                    fontWeight: 'bold',
                                },
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#4A4A4A',
                                }}
                            >
                                {[
                                    { label: 'เลขที่ใบจอง', value: formData.bookingNumber || '-' },
                                    { label: 'ชื่อ-สกุล', value: formData.username || '-' },
                                    { label: 'ประเภทของรถ', value: formData.carType || '-' },
                                    { label: 'วันที่จอง', value: formData.bookingDate || '-' },
                                    { label: 'จุดประสงค์การใช้', value: formData.purpose || '-' },
                                    { label: 'ปลายทาง', value: formData.destination || '-' },
                                    { label: 'จำนวนผู้โดยสาร', value: formData.passengers || '-' },
                                    { label: 'แผนก/ฝ่าย', value: formData.department || '-' },
                                    {
                                        label: 'ต้องการพนักงานขับ',
                                        value: formData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ',
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: index !== 7 ? '1px solid #E0E0E0' : 'none',
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '13px',
                                            }}
                                        >
                                            <strong style={{ color: '#555', fontWeight: 'bold' }}>{item.label}:</strong>
                                            <span style={{ color: '#029B36', fontWeight: '500' }}>{item.value}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Modal>

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
export default BookingDetails;