'use client'
import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Typography, Modal, Breadcrumb, Tag, Row, Col, Card, Statistic } from "antd";
import { HomeOutlined, TeamOutlined, UserOutlined, IdcardOutlined, CarFilled, ToolOutlined } from '@ant-design/icons';
import Sidebar from "../component/sidebar";
import Navbar from "@/app/users/home/navbar";

const { Content } = Layout;
const { Title } = Typography;

function Approve() {
    const [data, setData] = useState([]);
    const [statusCount, setStatusCount] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        canceled: 0,
    });

    useEffect(() => {
        fetch("http://localhost:5182/api/roombookings")
            .then((response) => response.json())
            .then((data) => {
                const sortedData = data.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
                setData(sortedData);

                const statusCounts = {
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    completed: 0,
                    canceled: 0,
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
                            statusCounts.completed++;
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
                        statusText = "เสร็จสิ้น";
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
            dataIndex: "roombooking_number",
            key: "roombooking_number",
        },
        {
            title: "วันที่จองและคืน",
            key: "bookingDetails",
            render: (record) => {
                const formatDate = (date) => {
                    return date
                        ? new Date(date).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })
                        : "ไม่ระบุ";
                };

                return (
                    <span>
                        <strong>วันที่จอง:</strong> {formatDate(record.booking_date)} <br />
                        <strong>วันที่คืน:</strong> {formatDate(record.return_date)}
                    </span>
                );
            },
        },
        {
            title: "ช่วงเวลาที่จอง",
            dataIndex: "booking_times",
            key: "booking_times",
        },

        {
            title: "ชื่อผู้จอง",
            dataIndex: "full_name",
            key: "full_name",
        },
    ];

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />

            <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
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
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#666',
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
                                        color: '#666',
                                    }}
                                >
                                    เลือกรถที่ต้องการจอง
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#333',
                                    }}
                                >
                                    กรอกรายละเอียกการจอง
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
                                สถิติการจอง
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
                                            title="ยกเลิกการจอง"
                                            value={statusCount.canceled}
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
                        <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Approve;
