'use client';

import React, { useState } from 'react';
import { Layout, Typography, Input, Radio, Button, Divider, Modal, Space } from 'antd';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { Content } from 'antd/lib/layout/layout';
import { CheckOutlined, FileTextOutlined, CarOutlined, CalendarOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

function BookingDetails() {
    const [formData, setFormData] = useState({
        carImage: 'url-to-car-image',  // ใส่ URL ของภาพรถ
        licensePlate: 'XYZ-1234',
        carType: 'Sedan',
        startDate: '2024-12-01',
        endDate: '2024-12-05',
        bookingNumber: 'AAA0001',
        bookingDate: '2024-12-05',
        purpose: ' ',
        destination: '',
        passengers: '',
        department: '',
        contactNumber: '',
        driverRequired: '',
    });
    

    const [isModalVisible, setIsModalVisible] = useState(false); // สถานะเปิด/ปิด Modal

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleConfirm = () => {
        sessionStorage.setItem('bookingData', JSON.stringify(formData)); // บันทึกข้อมูลใน sessionStorage
        window.location.href = '/users/home/car/complete/approv'; // เปลี่ยนหน้าไปที่ ApprovalPending
    };
     // ฟังก์ชันที่ใช้บันทึกข้อมูลไปที่ sessionStorage
     const handleSaveBooking = () => {
        // เซ็ตข้อมูลลง sessionStorage
        sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
        console.log('บันทึกข้อมูลลงใน sessionStorage:', bookingData);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px' }}>
                    <Content
                        style={{
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <Title
                                level={3}
                                style={{ textAlign: 'left', marginBottom: '16px', color: 'black', fontSize: '20px' }}
                            >
                                <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                                รายละเอียดการจอง
                            </Title>
                            <Divider />

                            {/* ข้อมูลรถและรูปภาพ */}
                            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', padding: '16px' }}>
                                    {/* รูปภาพของรถ */}
                                    <img
                                        src="/path-to-car-image.jpg"
                                        alt="Car"
                                        style={{
                                            width: '25%',
                                            height: '150px',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            marginRight: '16px'
                                        }}
                                    />
                                    {/* ข้อมูลรถ */}
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


                            <Divider />

                             {/* ฟอร์มการจอง */}
                             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <FileTextOutlined style={{ marginRight: '8px' }} />
                                        เลขที่ใบจอง
                                    </label>
                                    <Input value={formData.bookingNumber} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <CalendarOutlined style={{ marginRight: '8px' }} />
                                        วันที่-เวลา
                                    </label>
                                    <Input value={formData.bookingDate} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <FileTextOutlined style={{ marginRight: '8px' }} />
                                        จุดประสงค์การใช้งาน
                                    </label>
                                    <TextArea
                                        name="purpose"
                                        rows={2}
                                        placeholder="กรุณาระบุจุดประสงค์"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <UserOutlined style={{ marginRight: '8px' }} />
                                        ปลายทาง
                                    </label>
                                    <TextArea
                                        name="destination"
                                        rows={2}
                                        placeholder="กรุณาระบุปลายทาง"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <UserOutlined style={{ marginRight: '8px' }} />
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
                                        <UserOutlined style={{ marginRight: '8px' }} />
                                        แผนก/ฝ่าย
                                    </label>
                                    <Input
                                        name="department"
                                        placeholder="กรุณาป้อนแผนกหรือฝ่าย"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <PhoneOutlined style={{ marginRight: '8px' }} />
                                        เบอร์ติดต่อ
                                    </label>
                                    <Input
                                        name="contactNumber"
                                        placeholder="กรุณาป้อนเบอร์ติดต่อ"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>
                                        <UserOutlined style={{ marginRight: '8px' }} />
                                        ต้องการพนักงานขับรถ
                                    </label>
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

                            <Divider />
                            <div style={{ textAlign: 'right', marginTop: '24px' }}>
                                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                                    ถัดไป
                                </Button>
                            </div>
                        </div>


                        {/* Modal สำหรับยืนยันการจอง */}
                        <Modal
                            title={
                                <div style={{ textAlign: 'center', color: '#029B36', fontWeight: 'bold' }}>
                                    <CheckOutlined style={{ fontSize: '24px', color: '#029B36', marginRight: '8px' }} />
                                    ยืนยันการจอง
                                </div>
                            }
                            visible={isModalVisible}
                            onOk={handleConfirm}
                            onCancel={() => setIsModalVisible(false)}
                            centered={true} // ทำให้ Modal แสดงตรงกลางหน้าจอ
                            okText="ยืนยัน"
                            cancelText="ยกเลิก"
                            okButtonProps={{ style: { backgroundColor: '#029B36', borderColor: '#029B36', borderRadius: '8px' } }}
                            cancelButtonProps={{ style: { borderRadius: '8px' } }}
                            width={700}
                            bodyStyle={{
                                padding: '20px 40px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '12px',
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>เลขที่ใบจอง:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.bookingNumber}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>วันที่-เวลา:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.bookingDate}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>จุดประสงค์การใช้งาน:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.purpose || '-'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>ปลายทาง:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.destination || '-'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>จำนวนผู้โดยสาร:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.passengers || '-'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>แผนก/ฝ่าย:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.department || '-'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>เบอร์ติดต่อ:</Text>
                                    <Text style={{ fontSize: '16px', color: '#333' }}>{formData.contactNumber || '-'}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong style={{ fontSize: '16px', color: '#555' }}>ต้องการพนักงานขับรถ:</Text>
                                    <Text style={{ fontSize: '16px', color: formData.driverRequired === 'yes' ? '#029B36' : '#FF4D4F' }}>
                                        {formData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ'}
                                    </Text>
                                </div>
                            </div>
                        </Modal>

                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default BookingDetails;
