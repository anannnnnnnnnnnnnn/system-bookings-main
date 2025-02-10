'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Spin, Row, Col, Card, Typography, Button, Modal, List, message, Select, Timeline, Tag, } from 'antd';
import { HomeOutlined, InfoCircleOutlined, CarOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { Kanit } from 'next/font/google';
import { Grid } from 'antd';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";  // ✅ เพิ่มการ import dayjs
import "dayjs/locale/th"; // ✅ ใช้ภาษาไทย
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import 'dayjs/locale/th';

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
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch('http://localhost:5182/api/cars');
                if (!response.ok) throw new Error('Error fetching car data');
                const data = await response.json();
                setCars(data);
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

    const [selectedCar, setSelectedCar] = useState(null);
    const [bookingTimes, setBookingTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [carType, setCarType] = useState(''); // State สำหรับประเภทของรถที่เลือก
    const [filteredCars, setFilteredCars] = useState([]); // สร้าง state สำหรับกรองรถ

    const handleCheckAvailability = async (car) => {
        setSelectedCar(car);
        setIsModalVisible(true);
        setLoadingTimes(true);

        try {
            const response = await fetch(`http://localhost:5182/api/cars/date?carId=${car.car_id}`);
            if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลการจองได้');

            const data = await response.json();

            // กรองข้อมูล: แสดงเฉพาะรายการที่ยังไม่หมดอายุ
            const today = dayjs().tz("Asia/Bangkok").startOf("day");
            const filteredData = data.filter(item => dayjs(item.returnDate).tz("Asia/Bangkok").isAfter(today));

            setBookingTimes(filteredData);
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
            setBookingTimes([]);
        } finally {
            setLoadingTimes(false);
        }
    };
    const [isCarInfoModalOpen, setIsCarInfoModalOpen] = useState(false);


    const showCarInfoModal = (car) => {
        setSelectedCar(car);
        setIsCarInfoModalOpen(true);
    };

    const handleCarInfoCancel = () => {
        setIsCarInfoModalOpen(false);
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
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: '-20px', marginRight: '20px' }}>
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
                            </div>

                            {loading ? (
                                <Spin tip="กำลังโหลดข้อมูล..." />
                            ) : (
                                <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                                    {filteredCars.map((car) => (
                                        <Col xs={24} sm={12} md={12} key={car.car_id}>
                                            <Card
                                                hoverable
                                                cover={
                                                    <img
                                                        alt={car.name}
                                                        src={`http://localhost:5182${car.image_url}`}
                                                        style={{
                                                            height: '200px',
                                                            objectFit: 'cover',
                                                            borderTopLeftRadius: '8px',
                                                            borderTopRightRadius: '8px',
                                                        }}
                                                    />
                                                }
                                                style={{
                                                    marginTop: '10px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#ffffff',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    marginBottom: '20px',
                                                }}
                                            >
                                                <Card.Meta
                                                    title={
                                                        <div style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}>
                                                            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#4CAF50' }}>
                                                                {car.brand}
                                                            </span>

                                                            <span style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                fontWeight: 'bold',
                                                                fontSize: '15px',
                                                                color: '#666'
                                                            }}>
                                                                รายละเอียดรถ
                                                                <InfoCircleOutlined
                                                                    onClick={() => showCarInfoModal(car)}
                                                                    style={{ cursor: 'pointer', color: '#4CAF50', fontSize: '18px' }}
                                                                />
                                                            </span>

                                                        </div>
                                                    }
                                                />

                                                <div style={{ marginTop: '10px' }}>
                                                    <Button
                                                        type="default"
                                                        size="small"
                                                        style={{
                                                            width: '80px',
                                                            fontSize: '12px',
                                                            padding: '2px 6px',
                                                            backgroundColor: 'white',
                                                            border: '1px solid black',
                                                            color: 'black',
                                                        }}
                                                        onClick={() => handleCheckAvailability(car)}
                                                    >
                                                        ดูคิวรถ
                                                    </Button>

                                                    <Button
                                                        style={{
                                                            marginTop: '10px',
                                                            width: '100%',
                                                            backgroundColor: '#4CAF50',
                                                            color: '#fff',
                                                            border: 'none',
                                                        }}
                                                        onClick={() => handleSelectCar(car)}
                                                    >
                                                        จองรถ
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            <Modal
                                title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>เวลาจองของ {selectedCar?.brand || 'รถ'}</span>}
                                open={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                footer={
                                    <Button type="primary" onClick={() => setIsModalVisible(false)}>
                                        ปิด
                                    </Button>
                                }
                                centered
                                width={500}
                            >
                                {loadingTimes ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <Spin tip="กำลังโหลดข้อมูล..." />
                                    </div>
                                ) : bookingTimes.length > 0 ? (
                                    <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                                        <Timeline mode="left">
                                            {bookingTimes.map((item, index) => (
                                                <Timeline.Item key={index} color="green">
                                                    <Card size="small" bordered={false} style={{ backgroundColor: '#f6ffed' }}>
                                                        <p style={{ marginBottom: '6px' }}>
                                                            <Tag color="blue">วันที่จอง</Tag>
                                                            <strong>{dayjs(item.bookingDate).tz("Asia/Bangkok").format("DD MMMM YYYY")}</strong> เวลา {item.bookingTime}
                                                        </p>
                                                        <p style={{ marginBottom: '0px' }}>
                                                            <Tag color="red">วันที่คืนรถ</Tag>
                                                            <strong>{dayjs(item.returnDate).tz("Asia/Bangkok").format("DD MMMM YYYY")}</strong> เวลา {item.returnTime}
                                                        </p>
                                                    </Card>
                                                </Timeline.Item>
                                            ))}
                                        </Timeline>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <p style={{ color: '#4CAF50', fontSize: '16px' }}>รถคันนี้ยังไม่มีการจอง</p>
                                    </div>
                                )}
                            </Modal>

                            <Modal
                                title="รายละเอียดรถ"
                                open={isCarInfoModalOpen}
                                onCancel={handleCarInfoCancel}
                                footer={null}
                                centered
                                width={380}
                                style={{
                                    borderRadius: '12px', // ทำให้มุมโค้งมนขึ้น
                                    overflow: 'hidden', // ให้แน่ใจว่าเนื้อหาทั้งหมดอยู่ภายใน
                                    padding: '10px',
                                }}
                            >
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    {/* ภาพของรถ */}
                                    <img
                                        alt={selectedCar?.name}
                                        src={`http://localhost:5182${selectedCar?.image_url}`}
                                        style={{
                                            width: '100%',
                                            maxHeight: '180px',
                                            objectFit: 'cover',
                                            borderRadius: '12px', // เพิ่มความโค้งมนให้ภาพ
                                            marginBottom: '20px', // เพิ่มระยะห่างจากข้อความ
                                            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', // เพิ่มเงาให้ภาพดูโดดเด่น
                                        }}
                                    />

                                    {/* ข้อมูลของรถ */}
                                    <div
                                        style={{
                                            textAlign: 'left',
                                            color: '#333',
                                            fontFamily: 'Arial, sans-serif', // ใช้ฟอนต์ที่อ่านง่าย
                                            padding: '0 10px',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: '20px', // ขยายขนาดตัวอักษรให้เด่น
                                                fontWeight: 'bold',
                                                marginBottom: '10px',
                                                color: '#1D1D1D', // สีเข้มสำหรับข้อความ
                                                letterSpacing: '0.5px', // เพิ่มการเว้นระยะระหว่างตัวอักษร
                                            }}
                                        >
                                            {selectedCar?.brand}
                                        </p>

                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#777' }}>
                                            <strong>รุ่น:</strong> {selectedCar?.model}
                                        </p>
                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#777' }}>
                                            <strong>ทะเบียน:</strong> {selectedCar?.license_plate}
                                        </p>
                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#777' }}>
                                            <strong>ที่นั่ง:</strong> {selectedCar?.seating_capacity} คน
                                        </p>

                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#777' }}>
                                            <strong>ประเภทเชื้อเพลิง:</strong>
                                            {selectedCar?.fuel_type === 1 ? 'น้ำมัน' :
                                                selectedCar?.fuel_type === 2 ? 'ไฟฟ้า' :
                                                    selectedCar?.fuel_type === 3 ? 'แก๊ส' : 'ไม่ระบุ'}
                                        </p>

                                        <p style={{ fontSize: '14px', marginBottom: '8px', color: '#777' }}>
                                            <strong>ประเภท:</strong> {getCarType(selectedCar?.type)}
                                        </p>
                                    </div>
                                </div>
                            </Modal>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </main>
    );
}

export default CarBooking;
