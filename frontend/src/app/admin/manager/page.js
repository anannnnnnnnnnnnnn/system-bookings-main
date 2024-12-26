'use client';
import React, { useState } from 'react';
import { Layout, Table, Button, Space, Modal, Typography, Card, Divider } from 'antd';
import Sidebar from '../admincar/component/sidebar';
import Navbar from '../admincar/component/navbar';

const { Content } = Layout;
const { Title, Text } = Typography;

const ManagerDashboard = () => {
    const [data, setData] = useState([
        {
            key: '1',
            name: 'Anan',
            reservationNumber: 'AAA0001',
            carType: 'Sedan',
            destination: 'ห้องประชุมจังหวัดพัทลุง',
            usageDate: '05 ก.พ. 67 - 05 ก.พ. 67',
            status: 'รออนุมัติ',
        },
        {
            key: '2',
            name: 'สมชาย ใจดี',
            reservationNumber: 'AAA0002',
            carType: 'SUV',
            destination: 'สำนักงานสาขาเชียงใหม่',
            usageDate: '10 ก.พ. 67 - 12 ก.พ. 67',
            status: 'อนุมัติ',
        },
        {
            key: '3',
            name: 'จารุวรรณ แสนดี',
            reservationNumber: 'AAA0003',
            carType: 'Sedan',
            destination: 'ธนาคารกรุงเทพ สาขาสุราษฎร์ธานี',
            usageDate: '08 ก.พ. 67 - 08 ก.พ. 67',
            status: 'รออนุมัติ',
        },
    ]);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleApprove = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: 'อนุมัติ' } : item
            )
        );
    };

    const handleReject = (record) => {
        setSelectedRecord(record);
        setIsRejectModalVisible(true);
    };

    const handleRejectSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRecord.key ? { ...item, status: 'ไม่อนุมัติ' } : item
            )
        );
        setIsRejectModalVisible(false);
    };

    const handleRowClick = (record) => {
        setSelectedRecord(record);
        setIsDetailsModalVisible(true);
    };

    const columns = [
        {
            title: "ชื่อพนักงาน",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "เลขที่ใบจอง",
            dataIndex: "reservationNumber",
            key: "reservationNumber",
        },
        {
            title: "ประเภทของรถ",
            dataIndex: "carType",
            key: "carType",
        },
        {
            title: "สถานที่",
            dataIndex: "destination",
            key: "destination",
        },
        {
            title: "วันที่ใช้งาน",
            dataIndex: "usageDate",
            key: "usageDate",
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <Text
                    style={{
                        color: text === "อนุมัติ" ? "green" : text === "ไม่อนุมัติ" ? "red" : "orange",
                        fontWeight: "bold",
                    }}
                >
                    {text}
                </Text>
            ),
        },
        {
            title: "การกระทำ",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "รออนุมัติ" && (
                        <>
                            <Button
                                style={{
                                    backgroundColor: "#28a745", // สีเขียว
                                    color: "#fff",
                                    border: "none",
                                    fontWeight: "bold",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#218838"; // สีเขียวเข้มเมื่อ hover
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#28a745"; // กลับมาเป็นสีเขียวปกติ
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // หยุดการทำงานของ onRow
                                    handleApprove(record);
                                }}
                            >
                                อนุมัติ
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: "#dc3545", // สีแดง
                                    color: "#fff",
                                    border: "none",
                                    fontWeight: "bold",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#c82333"; // สีแดงเข้มเมื่อ hover
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#dc3545"; // กลับมาเป็นสีแดงปกติ
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // หยุดการทำงานของ onRow
                                    handleReject(record);
                                }}
                            >
                                ไม่อนุมัติ
                            </Button>
                        </>
                    )}
                </Space>
            ),
        }
        
    ];
    

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Navbar />
            <Layout style={{ padding: '24px', marginBottom: '50px' }}>
                <Content>
                    <Card
                        title={<Title level={4}>Dashboard - การอนุมัติการจอง</Title>}
                        bordered={false}
                        style={{ boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}
                    >
                        <Table
                            columns={columns}
                            dataSource={data}
                            rowKey="key"
                            pagination={{ position: ['bottomCenter'] }}
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record),
                                style: { cursor: 'pointer' },
                            })}
                        />
                    </Card>

                    {/* Modal สำหรับกรอกเหตุผลในการไม่อนุมัติ */}
                    <Modal
                        title="เหตุผลในการไม่อนุมัติ"
                        visible={isRejectModalVisible}
                        onOk={handleRejectSubmit}
                        onCancel={() => setIsRejectModalVisible(false)}
                    >
                        <textarea
                            rows={4}
                            placeholder="กรุณากรอกเหตุผลในการไม่อนุมัติ"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '14px',
                            }}
                        ></textarea>
                    </Modal>

                    {/* Modal สำหรับแสดงข้อมูลผู้จอง */}
                    <Modal
                        title="ข้อมูลผู้จอง"
                        visible={isDetailsModalVisible}
                        onCancel={() => setIsDetailsModalVisible(false)}
                        footer={null}
                    >
                        <div>
                            <p>
                                <strong>ชื่อพนักงาน:</strong> {selectedRecord?.name}
                            </p>
                            <p>
                                <strong>เลขที่ใบจอง:</strong> {selectedRecord?.reservationNumber}
                            </p>
                            <p>
                                <strong>ประเภทของรถ:</strong> {selectedRecord?.carType}
                            </p>
                            <p>
                                <strong>สถานที่:</strong> {selectedRecord?.destination}
                            </p>
                            <p>
                                <strong>วันที่ใช้งาน:</strong> {selectedRecord?.usageDate}
                            </p>
                            <p>
                                <strong>สถานะ:</strong>{' '}
                                <Text
                                    style={{
                                        color:
                                            selectedRecord?.status === 'อนุมัติ'
                                                ? 'green'
                                                : selectedRecord?.status === 'ไม่อนุมัติ'
                                                ? 'red'
                                                : 'orange',
                                    }}
                                >
                                    {selectedRecord?.status}
                                </Text>
                            </p>
                        </div>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default ManagerDashboard;
