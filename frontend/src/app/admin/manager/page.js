'use client';
import React, { useEffect, useState } from 'react';
import { Table, Typography, Layout, Card, Space, Button } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;

const ManagerDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // ดึงข้อมูลการจอง
                const bookingsResponse = await fetch('http://localhost:5182/api/bookings');
                if (!bookingsResponse.ok) {
                    throw new Error('Failed to fetch bookings');
                }
                const bookingsData = await bookingsResponse.json();

                // ดึงข้อมูลรถ
                const carsResponse = await fetch('http://localhost:5182/api/cars');
                if (!carsResponse.ok) {
                    throw new Error('Failed to fetch cars');
                }
                const carsData = await carsResponse.json();

                // รวมข้อมูลรถเข้ากับข้อมูลการจอง
                const combinedData = bookingsData.map((booking) => {
                    const car = carsData.find((car) => car.car_id === booking.car_id) || {};
                    return {
                        ...booking,
                        car_brand: car.brand || 'ไม่พบข้อมูล',
                        car_model: car.model || '',
                        car_license: car.license_plate || '',
                    };
                });

                setBookings(combinedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // // ฟังก์ชันในการอนุมัติ
    // const handleApprove = (record) => {
    //     // เปลี่ยนสถานะเป็น "อนุมัติ"
    //     record.status = "อนุมัติ";

    //     // อัปเดตสถานะใหม่ในฐานข้อมูลหรือ state ถ้ามี
    //     setData(prevData => prevData.map(item => item.key === record.key ? { ...item, status: "อนุมัติ" } : item));
    // };

    // // ฟังก์ชันในการไม่อนุมัติ
    // const handleReject = (record) => {
    //     // เปลี่ยนสถานะเป็น "ไม่อนุมัติ"
    //     record.status = "ไม่อนุมัติ";

    //     // อัปเดตสถานะใหม่ในฐานข้อมูลหรือ state ถ้ามี
    //     setData(prevData => prevData.map(item => item.key === record.key ? { ...item, status: "ไม่อนุมัติ" } : item));
    // };

    const handleApprove = async () => {
        try {
            const response = await fetch(`http://localhost:5182/api/bookings/${record.confirmation_id}/approve`, {
                method: 'PUT',
            });
            if (response.ok) {
                // อัปเดตสถานะใน state
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.confirmation_id === record.confirmation_id
                            ? { ...booking, status: 2 } // เปลี่ยนสถานะเป็น 2 (อนุมัติ)
                            : booking
                    )
                );
                console.log(`Booking ID: ${record.confirmation_id} approved successfully`);
            } else {
                console.error('Failed to approve booking');
            }
        } catch (error) {
            console.error('Error approving booking:', error);
        }
    };

    const handleReject = async () => {
        try {
            const response = await fetch(`http://localhost:5182/api/bookings/${record.confirmation_id}/reject`, {
                method: 'PUT',
            });
            if (response.ok) {
                // อัปเดตสถานะใน state
                setBookings((prevBookings) =>
                    prevBookings.map((booking) =>
                        booking.confirmation_id === record.confirmation_id
                            ? { ...booking, status: 3 } // เปลี่ยนสถานะเป็น 3 (ไม่อนุมัติ)
                            : booking
                    )
                );
                console.log(`Booking ID: ${record.confirmation_id} rejected successfully`);
            } else {
                console.error('Failed to reject booking');
            }
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    // โครงสร้างคอลัมน์ของตาราง
    const columns = [
        {
            title: 'รหัสการจอง',
            dataIndex: 'confirmation_id',
            key: 'confirmation_id',
        },
        {
            title: 'ชื่อผู้จอง',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'ข้อมูลรถ',
            key: 'car_info',
            render: (_, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={record.car_image || '/placeholder.png'} // เพิ่มรูปภาพรถ
                        alt="Car"
                        style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: '4px',
                            marginRight: '10px',
                        }}
                    />
                    <div>
                        <strong>{record.car_brand} {record.car_model}</strong>
                        <br />
                        <span style={{ color: '#888' }}>ทะเบียน: {record.car_license}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'สถานที่',
            dataIndex: 'destination',
            key: 'destination',
        },
        {
            title: 'จุดประสงค์',
            dataIndex: 'purpose',
            key: 'purpose',
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const statusColors = {
                    "อนุมัติ": "#A5D6A7", // สีเขียวพาสเทลอ่อน
                    "รออนุมัติ": "#DCE775", // สีเขียวอ่อน
                    "ไม่อนุมัติ": "#FFCDD2", // สีแดงอ่อน
                };

                // ตรวจสอบว่า status เป็นเลข 1 หรือไม่ และแสดงสถานะ
                const statusText = status === 1 ? "รออนุมัติ" : status === 2 ? "อนุมัติ" : "ไม่อนุมัติ";
                const color = statusColors[statusText] || "#000"; // หากไม่พบสถานะจะใช้สีดำ

                return <span style={{ color: color }}>{statusText}</span>;
            },
        },
        {
            title: 'ปุ่ม',
            key: 'status',
            render: (_, record) => {
                const statusText = record.status === 1 ? "รออนุมัติ" : record.status === 2 ? "อนุมัติ" : "ไม่อนุมัติ";

                return (
                    <Space size="small">
                        {statusText === "รออนุมัติ" && (
                            <>
                                <Button
                                    type="primary"
                                    size="small"
                                    style={{
                                        backgroundColor: "#0a7e07", // สีเขียวสด
                                        color: "#fff",
                                        border: "none",
                                        transition: "all 0.3s ease",
                                        transform: "scale(1)",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(record); // เรียกฟังก์ชันในการอนุมัติ
                                    }}
                                >
                                    อนุมัติ
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    style={{
                                        backgroundColor: "#bf360c", // สีแดง
                                        color: "#fff",
                                        border: "none",
                                        transition: "all 0.3s ease",
                                        transform: "scale(1)",
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(record); // เรียกฟังก์ชันในการไม่อนุมัติ
                                    }}
                                >
                                    ไม่อนุมัติ
                                </Button>
                            </>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    backgroundColor: '#28a745',
                    padding: '10px 20px',
                    color: 'white',
                    textAlign: 'center',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Manager Dashboard
                </Title>
            </Header>

            <Content style={{ padding: '20px', background: '#f0f2f5' }}>
                <Card
                    title="รายการจองรถยนต์"
                    bordered={false}
                    style={{ maxWidth: '1200px', margin: '0 auto' }}
                >
                    <Table
                        columns={columns}
                        dataSource={bookings.map((booking) => ({
                            ...booking,
                            key: booking.confirmation_id,
                        }))}
                        loading={loading}
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </Content>
        </Layout>
    );
};

export default ManagerDashboard;
