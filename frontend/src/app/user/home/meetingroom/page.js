  'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
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
                                        ปฎิทิน
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        {/* Content */}
                        <Content>
                          
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </main>
    );
}
export default CarBooking;
