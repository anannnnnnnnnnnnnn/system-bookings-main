'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../car/components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Spin, Row, Col, Card, Typography, Divider } from 'antd';
import { HomeOutlined, } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { Kanit } from 'next/font/google';
import { Grid } from 'antd'; // นำเข้า Grid
import { useRouter } from 'next/navigation'; // Import useRouter

const { Title } = Typography;

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
    subsets: ['latin', 'thai'],
    weight: ['300', '400', '700'],
});

function CarBooking() {
    // ใช้ useBreakpoint จาก Grid
    const screens = Grid.useBreakpoint();   
    const [cars, setCars] = useState([]); // เก็บข้อมูลรถ
    const [loading, setLoading] = useState(true); // สำหรับสถานะโหลดข้อมูล
    const router = useRouter(); // เรียกใช้ Router

    useEffect(() => {
        // ดึงข้อมูลจาก API
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:5182/api/cars');
                if (!response.ok) throw new Error('Error fetching car data');
                const data = await response.json();
                setCars(data);
            } catch (error) {
                message.error('ไม่สามารถดึงข้อมูลรถได้');
            } finally {
                setLoading(false); // ปิดสถานะโหลด
            }
        };

        fetchCars();
    }, []);

    const handleSelectCar = (car) => {
        // ตรวจสอบว่า car มีข้อมูลและ car_id ถูกต้อง
        if (car && car.car_id) {
            // ถ้ามี car_id ให้ทำการเปลี่ยนเส้นทาง
            router.push(`/user/home/car/complete/booking?carId=${car.car_id}`);
        } else {
            // ถ้าไม่มี car_id หรือ car ขาดข้อมูล
            console.error("car.car_id is undefined or null");
        }
    };



    return (
        <main className={kanit.className}>
            {/* Layout หลักที่ครอบทุกส่วน */}
            <Layout style={{ backgroundColor: '#fff' }}>
                {/* Navbar */}
                <Navbar />

                {/* Layout หลักของหน้า */}
                <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Layout ด้านขวาหลัก */}
                    <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                        {/* Breadcrumb */}
                        {/* ไอคอนหลัก */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
                                margin: '0 70px',
                            }}
                        >
                            {/* ไอคอนหลัก */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#d9e8d2', // สีพื้นหลังไอคอน
                                    borderRadius: '50%', // รูปทรงกลม
                                    marginRight: '10px', // ระยะห่างระหว่างไอคอนและข้อความ
                                }}
                            >
                                <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                            </div>

                            {/* Breadcrumb */}
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#666', // สีข้อความหลัก
                                        }}
                                    >
                                        ระบบจองรถ
                                    </span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <span
                                        style={{
                                            fontWeight: '500',
                                            fontSize: '14px',
                                            color: '#333', // สีข้อความรอง
                                        }}
                                    >
                                        เลือกรถที่ต้องการจอง
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>


                        {/* Content */}
                        <Content
                            style={{
                                background: '#ffffff', // พื้นหลังสีขาว
                                marginTop: '10px',
                                marginLeft: '50px',
                                padding: '20px',
                                borderRadius: '8px',
                            }}
                        >
                            <Title
                                level={2}
                                style={{
                                    marginBottom: '24px',
                                    fontSize: screens.xs ? '20px' : '28px',
                                    color: '#666',
                                }}
                            >
                                เลือกรถที่ต้องการจอง
                            </Title>
                            {/* ตรวจสอบสถานะโหลดข้อมูล */}
                            {loading ? (
                                <Spin tip="กำลังโหลดข้อมูล..." />
                            ) : (
                                <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                    {cars.map((car) => (
                                        <Col xs={24} sm={12} md={12} key={car.id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        alt={car.name}
                                                        src={`http://localhost:5182${car.image_url}`}
                                                        style={{
                                                            height: '250px',
                                                            objectFit: 'cover',
                                                            borderTopLeftRadius: '8px',
                                                            borderTopRightRadius: '8px',
                                                        }}
                                                    />
                                                }
                                                style={{
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#ffffff',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงา
                                                    transition: 'transform 0.3s ease-in-out',
                                                }}
                                                bodyStyle={{ padding: '16px' }}
                                                onMouseEnter={(e) =>
                                                    e.currentTarget.style.transform = 'scale(1.02)' // เอฟเฟกต์ขยายเมื่อ hover
                                                }
                                                onMouseLeave={(e) =>
                                                    e.currentTarget.style.transform = 'scale(1)' // กลับสู่ขนาดเดิมเมื่อเลิก hover
                                                }
                                            >
                                                <Card.Meta
                                                    title={
                                                        <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#4CAF50' }}>
                                                            {car.brand}
                                                        </span>
                                                    }
                                                    description={
                                                        <span style={{ fontSize: '14px', color: '#666' }}>{car.details}</span>
                                                    }
                                                />
                                                <div style={{ marginTop: '10px' }}>
                                                    <p style={{ fontSize: '14px', margin: '5px 0' }}>
                                                        <strong>รุ่น:</strong> {car.model}
                                                    </p>
                                                    <p style={{ fontSize: '14px', margin: '5px 0' }}>
                                                        <strong>ป้ายทะเบียน:</strong> {car.license_plate}
                                                    </p>
                                                    <p style={{ fontSize: '14px', margin: '5px 0' }}>
                                                        <strong>ผู้โดยสาร:</strong> {car.seating_capacity} คน
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '14px',
                                                            color: car.status === 1 ? '#4CAF50' : '#FF4D4F',
                                                            fontWeight: 'bold',
                                                        }}
                                                    >
                                                        <strong style={{ color: '#333' }}>สถานะ:</strong> {car.status === 1 ? 'ว่าง' : 'ไม่ว่าง'}
                                                    </p>
                                                    <button
                                                        style={{
                                                            marginTop: '10px',
                                                            padding: '10px 20px',
                                                            backgroundColor: '#4CAF50',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px',
                                                        }}
                                                        onClick={() => handleSelectCar(car)} // ส่งทั้ง car object ไป
                                                    >
                                                        จองรถ
                                                    </button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </main>
    );
}
export default CarBooking;
