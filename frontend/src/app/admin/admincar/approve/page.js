'use client'
import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Typography, Modal, Breadcrumb, Tag, Row, Col, Card, Statistic } from "antd";
import { UploadOutlined, HomeOutlined, CarFilled, UserOutlined, IdcardOutlined, ToolOutlined } from '@ant-design/icons';
import Sidebar from "../component/sidebar";
import Navbar from "@/app/users/home/navbar";

const { Content } = Layout;
const { Title } = Typography;

function Approve() {
    const [data, setData] = useState([]);
    const [statusCount, setStatusCount] = useState({
        pending: 0,   // รออนุมัติ
        approved: 0,  // อนุมัติแล้ว
        rejected: 0,  // ไม่อนุมัติ
        returned: 0,  // คืนรถแล้ว
        canceled: 0,  // ยกเลิกการจอง
    });
    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    useEffect(() => {
        // ดึงข้อมูลการจองจาก API
        fetch("http://localhost:5182/api/bookings")
            .then((response) => response.json())
            .then((data) => {
                // จัดเรียงข้อมูลการจองโดยใช้ booking_date ล่าสุด
                const sortedData = data.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
                setData(sortedData);

                // คำนวณจำนวนคนจองตามสถานะ
                const statusCounts = {
                    pending: 0,   // รออนุมัติ
                    approved: 0,  // อนุมัติแล้ว
                    rejected: 0,  // ไม่อนุมัติ
                    returned: 0,  // คืนรถแล้ว
                    canceled: 0,  // ยกเลิกการจอง
                };

                data.forEach(item => {
                    switch (item.booking_status) {
                        case 1:
                            statusCounts.pending++;
                            break;
                        case 2:
                            statusCounts.approved++;
                            break;
                        case 3:
                            statusCounts.rejected++;
                            break;
                        case 4:
                            statusCounts.returned++;
                            break;
                        case 5:
                            statusCounts.canceled++;
                            break;
                        default:
                            break;
                    }
                });

                setStatusCount(statusCounts);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleReject = (record) => {
        setSelectedRow(record);
        setIsRejectModalVisible(true);
    };

    const handleRejectSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRow.key ? { ...item, status: "ไม่อนุมัติ" } : item
            )
        );
        setRejectReason("");
        setIsRejectModalVisible(false);
    };

    const columns = [
        {
            title: "สถานะ",
            dataIndex: "booking_status",
            key: "booking_status",
            render: (status) => {
                let statusText = "";
                let color = "";

                switch (status) {
                    case 1:
                        statusText = "รออนุมัติ";
                        color = "orange";
                        break;
                    case 2:
                        statusText = "อนุมัติแล้ว";
                        color = "green";
                        break;
                    case 3:
                        statusText = "ไม่อนุมัติ";
                        color = "red";
                        break;
                    case 4:
                        statusText = "คืนรถแล้ว";
                        color = "blue";
                        break;
                    case 5:
                        statusText = "ยกเลิกการจอง";
                        color = "gray";
                        break;
                    default:
                        statusText = "ไม่ระบุ";
                        color = "default";
                }

                return <Tag color={color}>{statusText}</Tag>;
            },
        },
        {
            title: "เลขที่ใบจอง",
            dataIndex: "booking_number",
            key: "booking_number",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "วันที่จองและเวลาจอง",
            key: "bookingDateTime",
            render: (record) => {
                const bookingDate = record.booking_date
                    ? new Date(record.booking_date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })
                    : "ไม่ระบุ";

                const bookingTime = record.booking_time || "ไม่ระบุ";

                return <span>{`${bookingDate} - ${bookingTime}`}</span>;
            },
        },
        {
            title: "ชื่อผู้จอง",
            dataIndex: "full_name",
            key: "full_name",
            render: (text) => <span>{text}</span>,
        },
    ];

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />

            <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                <Sidebar />

                <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', margin: '0 70px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#d9e8d2',
                            borderRadius: '50%',
                            marginRight: '10px',
                        }}>
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
                                    ระบบแอดมิน
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
                                    หน้าหลักระบบดูแลรถ
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Content style={{
                        background: '#ffffff',
                        marginTop: '10px',
                        marginLeft: '50px',
                        padding: '20px',
                        borderRadius: '8px',
                    }}>
                        <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: '900px', margin: '0 auto' }}></div>
                        <div style={{ marginBottom: '30px' }}>
                            <Title
                                level={2}
                                style={{
                                    marginBottom: '24px',
                                    color: '#666',
                                }}
                            >
                                ข้อมูลการจอง
                            </Title>
                            <Row gutter={[24, 24]} style={{ justifyContent: 'center' }}>
                                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <Card bordered={false} style={{ backgroundColor: '#a5d6a7', borderRadius: '8px' }}>
                                        <Statistic
                                            title="รออนุมัติ"
                                            value={statusCount.pending}
                                            prefix={<CarFilled style={{ color: '#388e3c' }} />}
                                            valueStyle={{ color: '#1b5e20', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <Card bordered={false} style={{ backgroundColor: '#c5e1a5', borderRadius: '8px' }}>
                                        <Statistic
                                            title="อนุมัติแล้ว"
                                            value={statusCount.approved}
                                            prefix={<UserOutlined style={{ color: '#388e3c' }} />}
                                            valueStyle={{ color: '#2e7d32', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <Card bordered={false} style={{ backgroundColor: '#aed581', borderRadius: '8px' }}>
                                        <Statistic
                                            title="ไม่อนุมัติ"
                                            value={statusCount.rejected}
                                            prefix={<IdcardOutlined style={{ color: '#388e3c' }} />}
                                            valueStyle={{ color: '#1b5e20', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                                    <Card bordered={false} style={{ backgroundColor: '#81c784', borderRadius: '8px' }}>
                                        <Statistic
                                            title="คืนรถแล้ว"
                                            value={statusCount.returned}
                                            prefix={<ToolOutlined style={{ color: '#388e3c' }} />}
                                            valueStyle={{ color: '#1b5e20', fontWeight: 'bold' }}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                        <Title
                            level={2}
                            style={{
                                marginBottom: '24px',
                                color: '#666',
                            }}
                        >
                            ข้อมูลการจอง
                        </Title>
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="id"
                            pagination={false}
                        />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Approve;
