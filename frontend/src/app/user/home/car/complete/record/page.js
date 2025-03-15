'use client';
import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Layout } from 'antd';
import moment from 'moment';
import Navbar from '@/app/users/home/navbar';

const BookingHistory = ({ userId }) => {
    const [bookingHistory, setBookingHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchBookingHistory();
        }
    }, [userId]);

    const fetchBookingHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5182/api/bookings/history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Credentials': 'include', // เพื่อให้ session ถูกส่งไปพร้อมกับ request
                }
            });
            const data = await response.json();
            if (response.ok) {
                setBookingHistory(data);
            } else {
                console.error('Error fetching booking history:', data);
            }
        } catch (error) {
            console.error('Error fetching booking history:', error);
        }
        setLoading(false);
    };


    const columns = [
        {
            title: 'วันที่จอง',
            dataIndex: 'booking_date',
            key: 'booking_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'รถที่จอง',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'เวลาจอง',
            dataIndex: 'booking_time',
            key: 'booking_time',
            render: (text) => moment(text, 'HH:mm:ss').format('HH:mm'),
        },
        {
            title: 'สถานะ',
            dataIndex: 'booking_status',
            key: 'booking_status',
            render: (status) => {
                const statusColors = {
                    'approved': 'green',
                    'pending': 'orange',
                    'rejected': 'red'
                };
                return <Tag color={statusColors[status] || 'default'}>{status}</Tag>;
            }
        },
        {
            title: 'การกระทำ',
            key: 'actions',
            render: (_, record) => (
                <Button type="link" onClick={() => handleViewDetails(record)}>ดูรายละเอียด</Button>
            )
        }
    ];

    const handleViewDetails = (record) => {
        console.log('ดูรายละเอียดการจอง:', record);
        // สามารถนำไปใช้แสดง Modal หรือเปลี่ยนหน้าไปยังรายละเอียดการจองได้
    };

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />
            <Layout style={{ marginTop: '100px', backgroundColor: '#ffff', padding: '20px' }}></Layout>
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
                        backgroundColor: '#d9e8d2',
                        borderRadius: '50%',
                        marginRight: '10px',
                    }}
                >
                    <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                </div>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <span style={{
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#666',
                            padding: '6px 14px',
                            borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                            backgroundColor: '#f5f5f5',
                        }}>
                            ระบบจองรถ
                        </span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span style={{
                            fontWeight: '500',
                            fontSize: '14px',
                            color: '#333',
                            padding: '6px 14px',
                            borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                            backgroundColor: '#f5f5f5',

                        }}>
                            หน้าประวัติการจอง
                        </span>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div>
                <h3>ประวัติการจองของคุณ</h3>
                <Table
                    dataSource={bookingHistory}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                />
            </div>
        </Layout>

    );
};

export default BookingHistory;
