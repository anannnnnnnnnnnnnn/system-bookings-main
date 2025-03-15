'use client'
import { useState, useEffect } from "react";
import { Table, Layout, Typography, message, Breadcrumb, Tag, Modal, Button, Descriptions, Image, Card, Divider, Row, Col } from "antd";
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
                    5: { text: "ยกเลิก", color: "gray" }
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
                            title={
                                <Title level={4} style={{ marginBottom: 0, fontWeight: 600, color: "#333" }}>
                                    รายละเอียดการจอง
                                </Title>
                            }
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={[
                                <Button key="close" type="primary" onClick={handleCloseModal}>
                                    ปิดหน้าต่าง
                                </Button>,
                            ]}
                            style={{ borderRadius: "12px", overflow: "hidden" }}
                            bodyStyle={{ padding: "0px", backgroundColor: "#ffffff" }}
                            width={600} // ลดขนาดของ Modal ลง
                        >
                            {selectedBooking && (
                                <Card
                                    bordered
                                    style={{
                                        borderRadius: "10px",
                                        border: "1px solid #e0e0e0",
                                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    {/* ข้อมูลรถ (อยู่ด้านบน) */}
                                    {selectedBooking.car?.image_url && (
                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                            <Image
                                                src={`http://localhost:5182${selectedBooking.car.image_url}`}
                                                alt="Car"
                                                style={{
                                                    width: "120px",
                                                    height: "80px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                    marginRight: "16px",
                                                    border: "1px solid #E0E0E0",
                                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                                }}
                                            />
                                            <div>
                                                <Text
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: "600",
                                                        color: "#2C3E50",
                                                        marginBottom: "5px",
                                                    }}
                                                >
                                                    {selectedBooking.car.brand}
                                                </Text>
                                                <div style={{ fontSize: "14px", color: "#7F8C8D", lineHeight: "1.6" }}>
                                                    <p style={{ margin: 0 }}>รถรุ่น: {selectedBooking.car.model}</p>
                                                    <p style={{ margin: 0 }}>ป้ายทะเบียน: {selectedBooking.car.license_plate}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {selectedBooking.car.seating_capacity} ที่นั่ง</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Divider style={{ margin: "16px 0", borderColor: "#e0e0e0" }} />

                                    {/* ข้อมูลการจอง (อยู่ด้านล่าง) */}
                                    <Row justify="space-between" align="middle" style={{ marginBottom: "12px" }}>
                                        <Col>
                                            <Text strong style={{ fontSize: "16px", color: "#333" }}>
                                                เลขที่การจอง: {selectedBooking?.booking_number}
                                            </Text>
                                        </Col>
                                        <Col>
                                            <Tag
                                                color={selectedBooking.booking_status === 2 ? "green" : "orange"}
                                                style={{ fontSize: "14px", padding: "6px 12px", fontWeight: 500, borderRadius: "4px" }}
                                            >
                                                {selectedBooking.status === 2 ? "อนุมัติแล้ว" : "รออนุมัติ"}
                                            </Tag>
                                        </Col>
                                    </Row>

                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text type="secondary">วันที่จอง</Text>
                                            <Text strong style={{ display: "block", color: "#333", fontSize: "14px" }}>
                                                {new Date(selectedBooking.booking_date).toLocaleDateString("th-TH", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                                {" ถึง "}
                                                {new Date(selectedBooking.return_date).toLocaleDateString("th-TH", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">เวลาจอง</Text>
                                            <Text strong style={{ display: "block", color: "#333", fontSize: "14px" }}>
                                                {selectedBooking.booking_time}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">เวลาจอง</Text>
                                            <Text strong style={{ display: "block", color: "#333", fontSize: "14px" }}>
                                                {selectedBooking.return_time}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">จุดประสงค์</Text>
                                            <Text strong style={{ display: "block", color: "#333", fontSize: "14px" }}>
                                                {selectedBooking.purpose || "-"}
                                            </Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">จำนวนผู้เข้าร่วม</Text>
                                            <Text strong style={{ display: "block", color: "#333", fontSize: "14px" }}>
                                                {selectedBooking.seating_capacity || "-"}
                                            </Text>
                                        </Col>
                                    </Row>
                                </Card>
                            )}
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ApproveBookings;
