'use client'
import React, { useState } from "react";
import Sidebar from "../admincar/component/sidebar";
import Navbar from "../admincar/component/navbar";
import { Table, Button, Space, Modal, Layout } from "antd";

const { Content } = Layout;

const ManagerDashboard = () => {
    // สร้างข้อมูลการจองของพนักงาน
    const [data, setData] = useState([
        {
            key: "1",
            name: "Anan",
            reservationNumber: "AAA0001",
            carType: "Sedan",
            destination: "ห้องประชุมจังหวัดพัทลุง",
            usageDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            status: "รออนุมัติ",
        },
        {
            key: "2",
            name: "สมชาย ใจดี",
            reservationNumber: "AAA0002",
            carType: "SUV",
            destination: "สำนักงานสาขาเชียงใหม่",
            usageDate: "10 ก.พ. 67 - 12 ก.พ. 67",
            status: "อนุมัติ",
        },
        {
            key: "3",
            name: "จารุวรรณ แสนดี",
            reservationNumber: "AAA0003",
            carType: "Sedan",
            destination: "ธนาคารกรุงเทพ สาขาสุราษฎร์ธานี",
            usageDate: "08 ก.พ. 67 - 08 ก.พ. 67",
            status: "รออนุมัติ",
        },
    ]);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false); // สำหรับ Modal ของข้อมูลผู้จอง
    const [selectedRecord, setSelectedRecord] = useState(null); // เก็บข้อมูลของแถวที่คลิก

    // ฟังก์ชันอนุมัติการจอง
    const handleApprove = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: "อนุมัติ" } : item
            )
        );
    };

    // ฟังก์ชันไม่อนุมัติการจอง
    const handleReject = (record) => {
        setSelectedRecord(record);
        setIsRejectModalVisible(true);
    };

    // ฟังก์ชันยืนยันการไม่อนุมัติ
    const handleRejectSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRecord.key ? { ...item, status: "ไม่อนุมัติ" } : item
            )
        );
        setIsRejectModalVisible(false);
    };

    // ฟังก์ชันแสดงข้อมูลผู้จองใน Modal
    const handleRowClick = (record) => {
        setSelectedRecord(record);
        setIsDetailsModalVisible(true); // เปิด Modal แสดงข้อมูล
    };

    // คอลัมน์ของตารางการจอง
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
            render: (text) => <span>{text}</span>,
        },
        {
            title: "การกระทำ",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    {record.status === "รออนุมัติ" && (
                        <>
                            <Button type="primary" onClick={() => handleApprove(record)}>
                                อนุมัติ
                            </Button>
                            <Button danger onClick={() => handleReject(record)}>
                                ไม่อนุมัติ
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Layout style={{ padding: "0px 20px", marginTop: "65px" }}>
                <Sidebar />
                <Layout style={{ padding: "0px 20px" }}>
                    <Content
                        style={{
                            padding: "24px",
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                            marginTop: "20px",
                        }}
                    >
                        <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: "900px", margin: "0 auto" }}>
                            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px' }}>
                                Dashboard - การอนุมัติการจอง
                            </h2>
                            <Table
                                columns={columns}
                                dataSource={data}
                                rowKey="key"
                                pagination={false}
                                onRow={(record) => ({
                                    onClick: () => handleRowClick(record), // เปิด Modal เมื่อคลิกแถว
                                    style: { cursor: 'pointer' }, // เปลี่ยนเป็นรูปมือชี้เมื่อชี้แถว
                                })}
                            />
    

                            {/* Modal สำหรับกรอกเหตุผลในการไม่อนุมัติ */}
                            <Modal
                                title="เหตุผลในการไม่อนุมัติ"
                                visible={isRejectModalVisible}
                                onOk={handleRejectSubmit}
                                onCancel={() => setIsRejectModalVisible(false)}
                                style={{ fontFamily: 'var(--font-kanit)' }}
                            >
                                <textarea
                                    rows={4}
                                    placeholder="กรุณากรอกเหตุผลในการไม่อนุมัติ"
                                    value={selectedRecord ? selectedRecord.rejectReason : ''}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        fontSize: "14px",
                                    }}
                                ></textarea>
                            </Modal>

                            {/* Modal สำหรับแสดงข้อมูลผู้จอง */}
                            <Modal
                                title="ข้อมูลผู้จอง"
                                visible={isDetailsModalVisible}
                                onCancel={() => setIsDetailsModalVisible(false)}
                                footer={null}
                                style={{ fontFamily: 'var(--font-kanit)' }}
                            >
                                <div>
                                    <p><strong>ชื่อพนักงาน:</strong> {selectedRecord?.name}</p>
                                    <p><strong>เลขที่ใบจอง:</strong> {selectedRecord?.reservationNumber}</p>
                                    <p><strong>ประเภทของรถ:</strong> {selectedRecord?.carType}</p>
                                    <p><strong>สถานที่:</strong> {selectedRecord?.destination}</p>
                                    <p><strong>วันที่ใช้งาน:</strong> {selectedRecord?.usageDate}</p>
                                    <p><strong>สถานะ:</strong> {selectedRecord?.status}</p>
                                </div>
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default ManagerDashboard;
