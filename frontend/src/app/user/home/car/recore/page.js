'use client'
import { useState, useEffect } from "react";
import { Table, Layout, Typography, message, Breadcrumb, Tag, Modal, Button, Descriptions, Image, Card, Space, Row, Col } from "antd";
import { HomeOutlined, CalendarOutlined, EnvironmentOutlined, CarOutlined } from '@ant-design/icons'
import Navbar from "@/app/users/home/navbar";
import Sidebar from "../components/sidebar";
import { Content } from 'antd/lib/layout/layout';

const { Title, Text } = Typography;

const ApproveBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState(""); // เก็บชื่อผู้ใช้
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);


    // ฟังก์ชันอัปเดตชื่อผู้ใช้จาก Navbar
    const handleUserFullNameChange = (name) => {
        setFullName(name);
        // เก็บค่าชื่อผู้ใช้ใน localStorage
        localStorage.setItem('fullName', name);
    };

    useEffect(() => {
        // เช็คว่า fullName มีค่าใน localStorage หรือไม่
        const storedFullName = localStorage.getItem('fullName');
        if (storedFullName) {
            setFullName(storedFullName);
        } else if (!fullName) {
            message.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบอีกครั้ง");
            return;
        }

        const fetchBookings = async () => {
            try {
                const url = `http://localhost:5182/api/bookings/history/${encodeURIComponent(fullName)}`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ไม่พบข้อมูลการจอง`);
                }

                const data = await response.json();
                setBookings(data);
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (fullName) {
            fetchBookings();
        }
    }, [fullName]); // ดึงข้อมูลใหม่เมื่อ fullName เปลี่ยน

    const showModal = (record) => {
        setSelectedBooking(record);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };
    const handleRowClick = (record) => {
        setSelectedBooking(record);
        setIsModalVisible(true);
    };


    const columns = [
        {
            title: "เลขการจอง",
            dataIndex: "booking_number",
            key: "booking_number",
        },
        {
            title: "วันที่และเวลาจอง",
            key: "booking_datetime",
            render: (record) => {
                const options = { day: "2-digit", month: "short", year: "numeric" };
                const formattedDate = new Date(record.booking_date).toLocaleDateString("th-TH", options);
                const formattedTime = record.booking_time;
                return `${formattedDate} ${formattedTime}`;
            }
        },

        {
            title: "วันที่และเวลาคืน",
            key: "return_datetime",
            render: (record) => {
                if (!record.return_date || !record.return_time) return "-"; // กรณีไม่มีข้อมูล
                const options = { weekday: "short", day: "2-digit", month: "short", year: "numeric" };
                const formattedDate = new Date(record.return_date).toLocaleDateString("th-TH", options);
                return `${formattedDate} ${record.return_time}`;
            }
        },

        {
            title: "จุดหมาย",
            dataIndex: "purpose",
            key: "purpose"
        },

        {
            title: "ข้อมูลรถ",
            key: "car_info",
            render: (record) => {
                if (!record.car) return "-"; // กรณีไม่มีข้อมูลรถ
                return (
                    <>
                        <div><strong>โมเดล:</strong> {record.car.model || "-"}</div>
                        <div><strong>ประเภทรถ:</strong> {record.car.type || "-"}</div>
                        <div><strong>ทะเบียน:</strong> {record.car.license_plate || "-"}</div>
                    </>
                );
            }
        },

        // {
        //     title: "รูปภาพ",
        //     dataIndex: ["car", "image_url"],  // ใช้การเข้าถึง car.image_url
        //     key: "car.image_url",
        //     render: (image) => (
        //         <img
        //             src={image ? `http://localhost:5182${image}` : '/default-room.png'}
        //             alt="Car"
        //             style={{ width: 80, height: 60, objectFit: 'cover' }}
        //         />
        //     ),
        // },
        {
            title: "สถานะ",
            dataIndex: "booking_status",
            key: "booking_status",
            render: (status) => {
                const statusMap = {
                    1: { text: "รออนุมัติ", color: "orange" },
                    2: { text: "อนุมัติแล้ว", color: "green" },
                    3: { text: "ไม่อนุมัติ", color: "red" },
                    4: { text: "คืนรถแล้ว", color: "purple" },
                    5: { text: "ยกเลิก", color: "gray"}
                };

                const { text, color } = statusMap[status] || { text: "ไม่ทราบสถานะ", color: "gray" };

                return <Tag color={color}>{text}</Tag>;
            },
        },

    ];

    return (
        <Layout style={{ backgroundColor: "#fff" }}>
            {/* ส่งฟังก์ชันไปยัง Navbar */}
            <Navbar onUserFullNameChange={handleUserFullNameChange} />
            <Layout style={{ marginTop: "100px", backgroundColor: "#fff", padding: "20px" }}>
                <Sidebar />
                <Layout style={{ marginTop: "20px", backgroundColor: "#fff", padding: "20px" }}>
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
                        <Title level={3}>ประวัติการจองของฉัน</Title>

                        <Table
                            dataSource={bookings}
                            columns={columns}
                            loading={loading}
                            rowKey="confirmation_id"
                            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                            style={{ cursor: 'pointer' }}
                        />
                        <Modal
                            title="รายละเอียดการจอง"
                            visible={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                        >
                            {selectedBooking && (
                                <>
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
                                        {selectedBooking.car?.image_url && (
                                            <Image
                                                src={`http://localhost:5182${selectedBooking.car.image_url}`}
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
                                        )}
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
                                                    {selectedBooking.brand}
                                                </Text>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#7F8C8D',
                                                        lineHeight: '1.6',
                                                    }}
                                                >
                                                    <p style={{ margin: 0 }}>รถรุ่น: {selectedBooking.car.model}</p>
                                                    <p style={{ margin: 0 }}>ป้ายทะเบียน: {selectedBooking.car.license_plate}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {selectedBooking.car.seating_capacity} ที่นั่ง</p>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                    {/* ข้อมูลการจอง */}
                                    <Space direction="vertical" size="large" style={{ width: "100%" }}>

                                        {/* สถานะการจอง */}
                                        <Row justify="space-between" align="middle">
                                            <Col>
                                                <Title level={4} style={{ marginBottom: 0 }}>📄 เลขการจอง: {selectedBooking?.booking_number}</Title>
                                            </Col>
                                            <Col>
                                                <Tag color={status.color} style={{ fontSize: "14px", padding: "5px 12px" }}>
                                                    {status.text}
                                                </Tag>
                                            </Col>
                                        </Row>

                                        {/* ข้อมูลการจอง */}
                                        <Card bordered={false} style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                                            <Row gutter={[24, 16]}>
                                                <Col span={12}>
                                                    <Text strong><CalendarOutlined /> วันที่จอง</Text>
                                                    <Text style={{ display: "block", color: "#555" }}>
                                                        {new Date(selectedBooking?.booking_date).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })} {selectedBooking?.booking_time}
                                                    </Text>
                                                </Col>
                                                <Col span={12}>
                                                    <Text strong><EnvironmentOutlined /> จุดหมาย</Text>
                                                    <Text style={{ display: "block", color: "#555" }}>
                                                        {selectedBooking?.purpose || "-"}
                                                    </Text>
                                                </Col>
                                            </Row>
                                        </Card>
                                        {/* ข้อมูลรถ */}
                                        <Card bordered={false} style={{ borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                                            <Row gutter={[24, 16]} align="middle">
                                                {/* ข้อมูลรถ */}
                                                <Col span={16}>
                                                    <Row gutter={[16, 8]}>
                                                        <Col span={12}>
                                                            <Text strong><CarOutlined /> โมเดลรถ</Text>
                                                            <Text style={{ display: "block", color: "#555" }}>{selectedBooking?.car?.model || "-"}</Text>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Text strong>🔖 ประเภทรถ</Text>
                                                            <Text style={{ display: "block", color: "#555" }}>{selectedBooking?.car?.type || "-"}</Text>
                                                        </Col>
                                                        <Col span={24}>
                                                            <Text strong>🚘 ทะเบียนรถ</Text>
                                                            <Text style={{ display: "block", color: "#555" }}>{selectedBooking?.car?.license_plate || "-"}</Text>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Space>
                                </>
                            )}
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ApproveBookings;
