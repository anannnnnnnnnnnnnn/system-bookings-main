'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Spin, Row, Col, Card, Typography, Button, Modal, List, message, Select } from 'antd';
import { HomeOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { Kanit } from 'next/font/google';
import { Grid } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";  // ✅ เพิ่มการ import dayjs
import "dayjs/locale/th"; // ✅ ใช้ภาษาไทย
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("th"); // ✅ ตั้งค่าภาษาไทย


const { Title } = Typography;

// ตั้งค่าฟอนต์ Kanit
const kanit = Kanit({
    subsets: ['latin', 'thai'],
    weight: ['300', '400', '700'],
});

function CarBooking() {
    const screens = Grid.useBreakpoint();
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]); // สร้าง state สำหรับกรองรถ
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [carType, setCarType] = useState(''); // State สำหรับประเภทของรถที่เลือก

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:5182/api/cars');
                if (!response.ok) throw new Error('Error fetching car data');
                const data = await response.json();
                setCars(data);
                setFilteredCars(data); // เมื่อดึงข้อมูลรถมาแล้ว ให้ตั้งค่า filteredCars เป็นข้อมูลทั้งหมด
            } catch (error) {
                message.error('ไม่สามารถดึงข้อมูลรถได้');
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []);

    const handleSelectCar = (car) => {
        if (car && car.car_id) {
            router.push(`/user/home/car/complete/booking?carId=${car.car_id}`);
        } else {
            console.error("car.car_id is undefined or null");
        }
    };

    const handleCheckAvailability = async (car) => {
        // ... รักษาฟังก์ชันนี้ไว้เหมือนเดิม
    };


    useEffect(() => {
        if (!carType) {
            setFilteredCars(cars); // ถ้าไม่ได้เลือกประเภท แสดงรถทั้งหมด
        } else {
            setFilteredCars(cars.filter(car => String(car.type) === carType)); // กรองตาม type ที่เลือก
        }
    }, [carType, cars]);

    const handleCarTypeChange = (value) => {
        setCarType(value); // อัปเดตค่า carType เมื่อมีการเลือก
    };

    const getCarType = (type) => {
        switch (type) {
            case 1:
                return 'รถทั่วไป';
            case 2:
                return 'รถตู้';
            case 3:
                return 'รถกระบะ';
            default:
                return 'ไม่ระบุประเภท';
        }
    };

    return (
        <main className={kanit.className}>
            <Layout style={{ backgroundColor: '#fff' }}>
                <Navbar />
                <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                    <Sidebar />
                    <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                margin: '0 70px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#d9e8d2',
                                    borderRadius: '50%',
                                    marginRight: '10px',
                                }}
                            >
                                <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                            </div>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item>
                                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#666' }}>
                                        ระบบจองรถ
                                    </span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>
                                        เลือกรถที่ต้องการจอง
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>

                        <Content
                            style={{
                                background: '#ffffff',
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

                        

                            <Select
                                defaultValue=""
                                style={{ width: 200 }}
                                onChange={handleCarTypeChange}
                                placeholder="เลือกประเภทของรถ"
                            >
                                <Option value="">ทั้งหมด</Option>
                                <Option value="1">รถทั่วไป</Option>
                                <Option value="2">รถตู้</Option>
                                <Option value="3">รถกระบะ</Option>
                            </Select>

                            {/* ใช้ filteredCars แทน cars */}
                            {loading ? (
                                <Spin tip="กำลังโหลดข้อมูล..." />
                            ) : (
                                <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                    {filteredCars.map((car) => (  // ใช้ filteredCars
                                        <Col xs={24} sm={12} md={12} key={car.car_id}>
                                            <Card
                                                hoverable
                                                cover={<img alt={car.name} src={`http://localhost:5182${car.image_url}`} />}
                                            >
                                                <Card.Meta title={car.brand} />
                                                <Button onClick={() => handleSelectCar(car)}>จองรถ</Button>
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
