'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Layout, Typography, Input, Radio, Button, Divider, Modal, Space } from 'antd';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Text } = Typography;

const CarBookingComplete = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [carDetails, setCarDetails] = useState(null); // ประกาศ state สำหรับเก็บข้อมูลของรถ    
    const [formData, setFormData] = useState({
        bookingNumber: '',
        bookingDate: '',
        username: '',
        purpose: '',
        destination: '',
        passengers: '',
        driverRequired: ''
    });
    const searchParams = useSearchParams();
    const carId = searchParams.get('carId'); // ดึง carId จาก URL
    const startDate = searchParams.get('startDate'); // ดึง startDate จาก URL
    const endDate = searchParams.get('endDate'); // ดึง endDate จาก URL
    const startTime = searchParams.get('startTime'); // ดึง startTime จาก URL
    const endTime = searchParams.get('endTime'); // ดึง endTime จาก URL
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const [userFullName, setUserFullName] = useState(null); // สถานะสำหรับเก็บชื่อผู้ใช้
    useEffect(() => {
        const storedFullName = localStorage.getItem("userFullName");
        if (storedFullName) {
            setUserFullName(storedFullName); // ถ้ามีชื่อผู้ใช้ใน localStorage ก็ให้แสดง
        }
    }, []);

    useEffect(() => {
        if (carId) {
            // ใช้ carId เพื่อดึงข้อมูลของรถจาก API หรือฐานข้อมูล
            axios.get(`http://localhost:5182/api/cars/${carId}`)
                .then(response => {
                    setCarDetails(response.data);  // เก็บรายละเอียดของรถใน state
                })
                .catch(error => {
                    console.error('Error fetching car details:', error);
                });
        } else {
            console.error('carId is missing in the URL');
        }
    }, [carId]);

    const handleConfirm = () => {
        sessionStorage.setItem('bookingData', JSON.stringify(formData));
        window.location.href = '/users/home/car/complete/approv';
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
                            <div style={{ padding: '12px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        backgroundColor: '#FFFFFF',
                                        marginBottom: '16px',
                                        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
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
                                    <div style={{ flex: 1 }}>
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
                                            <Text style={{ fontSize: '14px', color: '#BDC3C7' }}>ข้อมูลรถไม่พบ</Text>
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
                                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการจอง</label>
                                    <Input value={`${startDate} ${startTime}`} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการคืน</label>
                                    <Input value={`${endDate} ${endTime}`} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                                    <Input value={userFullName} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>จุดประสงค์การใช้งาน</label>
                                    <TextArea name="purpose" rows={2} placeholder="กรุณาระบุจุดประสงค์" onChange={handleChange} style={{ height: '30px' }} />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ปลายทาง</label>
                                    <TextArea
                                        name="destination"
                                        placeholder="กรุณาระบุปลายทาง"
                                        onChange={handleChange}
                                        style={{ height: '30px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <label style={{ fontWeight: 'bold' }}>ต้องการพนักงานขับรถ</label>
                                    <Radio.Group name="driverRequired" value={formData.driverRequired} onChange={handleChange} style={{ marginTop: '8px', margin: '8px 20px' }}>
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
                            title={
                                <div
                                    style={{
                                        textAlign: 'center',
                                        color: '#029B36',
                                        fontWeight: 'bold',
                                        fontSize: '20px',
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
                            width={400}
                            style={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                            }}
                            bodyStyle={{
                                padding: '16px',
                                fontFamily: 'var(--font-kanit)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#4A4A4A',
                                }}
                            >
                                <Divider style={{ borderColor: '#E0E0E0', margin: '16px 0' }} />

                                {carDetails && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            backgroundColor: '#FFFFFF',
                                            marginBottom: '16px',
                                            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {/* รูปภาพรถ */}
                                        <img
                                            src={`http://localhost:5182${carDetails.image_url}`}
                                            alt="Car"
                                            style={{
                                                width: '100px',
                                                height: '70px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                marginRight: '16px',
                                                border: '1px solid #E0E0E0',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        {/* ข้อมูลรถ */}
                                        <div style={{ flex: 1 }}>
                                            <>
                                                <Text
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#2C3E50',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    {carDetails.brand}
                                                </Text>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#7F8C8D',
                                                        lineHeight: '1.6',
                                                    }}
                                                >
                                                    <p style={{ margin: 0 }}>รถรุ่น: {carDetails.model}</p>
                                                    <p style={{ margin: 0 }}>ป้ายทะเบียน: {carDetails.license_plate}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {carDetails.seating_capacity} ที่นั่ง</p>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                )}
                                <Divider/>

                                {[
                                    { label: 'วันที่-เวลาการจอง', value: `${startDate} ${startTime}` },
                                    { label: 'วันที่-เวลาการคืน', value: `${endDate} ${endTime}` },
                                    { label: 'ชื่อ-สกุล', value: userFullName },
                                    { label: 'จุดประสงค์การใช้งาน', value: formData.purpose },
                                    { label: 'ปลายทาง', value: formData.destination },
                                    { label: 'ต้องการพนักงานขับรถ', value: formData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ' },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: index !== 5 ? '1px solid #E0E0E0' : 'none',
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
};

export default CarBookingComplete;
