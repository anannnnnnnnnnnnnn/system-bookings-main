'use client'
import { useState, useEffect } from "react";
import { Table, Layout, Typography, message, Breadcrumb, Tag, Modal, Button, Image, Space, Row, Col, Card } from "antd";
import { HomeOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
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
                const url = `http://localhost:5182/api/roombookings/roomhistory/${encodeURIComponent(fullName)}`;
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
            dataIndex: "roombooking_number",
            key: "roombooking_number",
        },
        {
            title: "วันที่และเวลาจอง",
            key: "booking_date",
            render: (record) => {
                const options = { day: "2-digit", month: "short", year: "numeric" };
                const formattedDate = new Date(record.booking_date).toLocaleDateString("th-TH", options);
                const formattedreturnDate = new Date(record.return_date).toLocaleDateString("th-TH", options);
                return `${formattedDate} ถึง ${formattedreturnDate}`;
            }
        },

        {
            title: "จุดประสงค์",
            dataIndex: "purpose",
            key: "purpose"
        },

        {
            title: "ชื่อห้องประชุม",
            key: "room_info",
            render: (record) => {
                if (!record.room) return "-"; // กรณีไม่มีข้อมูลห้อง
                return (
                    <>
                        <div><strong>ห้องประชุม:</strong> {record.room.room_name || "-"}</div>
                        <div><strong>ขนาดห้อง:</strong> {record.room.capacity || "-"} ที่นั่ง</div>
                    </>
                );
            }
        },

        {
            title: "สถานะ",
            dataIndex: "booking_status",
            key: "booking_status",
            render: (status) => {
                const statusMap = {
                    1: { text: "รออนุมัติ", color: "orange" },
                    2: { text: "อนุมัติแล้ว", color: "green" },
                    3: { text: "ไม่อนุมัติ", color: "red" },
                    4: { text: "จบการประชุม", color: "purple" },
                    5: { text: "ยกเลิก", color: "gray" }
                };

                const { text, color } = statusMap[status] || { text: "ไม่ทราบสถานะ", color: "gray" };

                return <Tag color={color}>{text}</Tag>;
            },
        },

    ];

    return (
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
                                    ระบบจองห้องประชุม
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>
                                    ประวัติการจอง
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
                            rowKey="booking_id"
                            onRow={(record) => ({ onClick: () => handleRowClick(record) })}
                            style={{ cursor: 'pointer' }}
                        />
                        <Modal
                            title={<Title level={4} style={{ marginBottom: 0, fontWeight: 600, color: "#333" }}>รายละเอียดการจอง</Title>}
                            open={isModalVisible}
                            onCancel={handleCloseModal}
                            footer={[
                                <Button key="close" type="primary" onClick={handleCloseModal}>
                                    ปิดหน้าต่าง
                                </Button>
                            ]}
                            style={{ borderRadius: "12px", overflow: "hidden" }}
                            bodyStyle={{ padding: "24px", backgroundColor: "#ffffff" }}

                        >
                            {/* ข้อมูลห้องประชุม */}
                            {selectedBooking?.room && (
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

                                    {/* แสดงรูปห้องประชุม */}
                                    <Image
                                        src={`http://localhost:5182${selectedBooking.room.room_img}`}  // แสดงรูปห้องประชุม
                                        alt="รูปห้องประชุม"
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
                                                {selectedBooking.room.room_name}
                                            </Text>
                                            <div
                                                style={{
                                                    fontSize: '10px',
                                                    color: '#7F8C8D',
                                                    lineHeight: '1.6',
                                                }}
                                            >
                                                <p style={{ margin: 0 }}>อุปกรณ์ห้อง: {selectedBooking.room.equipment}</p>
                                                <p style={{ margin: 0 }}>จำนวนที่นั่ง: {selectedBooking.room.capacity} ที่นั่ง</p>
                                            </div>
                                        </>
                                    </div>
                                </div>
                            )}

                            {selectedBooking && (
                                <Space direction="vertical" size="middle" style={{ width: "100%" }}>

                                    {/* เลขที่การจอง & สถานะ */}
                                    <Row justify="space-between" align="middle" style={{ paddingBottom: "12px", borderBottom: "1px solid #e0e0e0" }}>
                                        <Col>
                                            <Text strong style={{ fontSize: "16px", color: "#333" }}>เลขที่การจอง: {selectedBooking.roombooking_number}</Text>
                                        </Col>
                                        <Col>
                                            <Tag
                                                color={selectedBooking.booking_status === 2 ? "green" : "orange"}
                                                style={{ fontSize: "14px", padding: "6px 12px", fontWeight: 500, borderRadius: "4px" }}
                                            >
                                                {selectedBooking.booking_status === 2 ? "อนุมัติแล้ว" : "รออนุมัติ"}
                                            </Tag>
                                        </Col>
                                    </Row>

                                    {/* ข้อมูลการจอง */}
                                    <Card
                                        bordered
                                        style={{
                                            borderRadius: "8px",
                                            backgroundColor: "#ffffff",
                                            padding: "16px",
                                            border: "1px solid #e0e0e0",
                                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col span={12}>
                                                <Text type="secondary">วันที่จอง</Text>
                                                <Text
                                                    strong
                                                    style={{ display: "block", color: "#333", fontSize: "14px" }}
                                                >
                                                    {new Date(selectedBooking.booking_date).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                                                    {" - "}
                                                    {new Date(selectedBooking.return_date).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
                                                </Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">เวลาจอง</Text>
                                                <Text
                                                    strong
                                                    style={{ display: "block", color: "#333", fontSize: "14px" }}
                                                >
                                                    {selectedBooking.booking_times}
                                                </Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">จุดประสงค์</Text>
                                                <Text
                                                    strong
                                                    style={{ display: "block", color: "#333", fontSize: "14px" }}
                                                >
                                                    {selectedBooking.meeting_topic || "-"}
                                                </Text>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">จำนวนผู้เข้าร่วม</Text>
                                                <Text
                                                    strong
                                                    style={{ display: "block", color: "#333", fontSize: "14px" }}
                                                >
                                                    {selectedBooking.attendee_count || "-"}
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Space>
                            )}

                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ApproveBookings;
