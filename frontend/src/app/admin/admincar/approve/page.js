'use client'
import React, { useState } from "react";
import { Layout, Table, Button, Select, Input, DatePicker, Space, Modal, Form } from "antd";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

const { Content } = Layout;
const { Option } = Select;

function Approve() {
    const [data, setData] = useState([
        {
            key: "1",
            status: "รออนุมัติ",
            reservationNumber: "REV58020001",
            license: "กษ 9178",
            usageDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            purpose: "เดินทางไปประชุมจังหวัด",
        },
        {
            key: "2",
            status: "อนุมัติ",
            reservationNumber: "REV58020002",
            license: "1ฒต 6195",
            usageDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            purpose: "นำเช็คไปธนาคาร",
        },
        {
            key: "3",
            status: "รออนุมัติ",
            reservationNumber: "REV58020003",
            license: "2กก 1023",
            usageDate: "10 ก.พ. 67 - 11 ก.พ. 67",
            purpose: "สำรวจพื้นที่โครงการ",
        },
        {
            key: "4",
            status: "รออนุมัติ",
            reservationNumber: "REV58020004",
            license: "4ขค 7294",
            usageDate: "15 ก.พ. 67 - 15 ก.พ. 67",
            purpose: "จัดส่งเอกสารราชการ",
        },
        {
            key: "5",
            status: "รออนุมัติ",
            reservationNumber: "REV58020005",
            license: "5ฟว 3421",
            usageDate: "20 ก.พ. 67 - 21 ก.พ. 67",
            purpose: "สัมมนาอบรมประจำปี",
        },
        {
            key: "6",
            status: "ส่งคืนแล้ว",
            reservationNumber: "REV58020006",
            license: "7งล 2198",
            usageDate: "22 ก.พ. 67 - 23 ก.พ. 67",
            purpose: "เยี่ยมผู้ป่วยในเครือข่าย",
        },
    ]);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isFailedReturnModalVisible, setIsFailedReturnModalVisible] = useState(false);
    const [failedReturnReason, setFailedReturnReason] = useState("");

    const handleApprove = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: "อนุมัติ" } : item
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
                item.key === selectedRecord.key
                    ? { ...item, status: "ไม่อนุมัติ" }
                    : item
            )
        );
        setRejectReason("");
        setIsRejectModalVisible(false);
    };

    const handleConfirmReturn = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: "ส่งคืนเสร็จ" } : item
            )
        );
    };

    const handleFailedReturn = (record) => {
        setSelectedRecord(record);
        setIsFailedReturnModalVisible(true);
    };

    const handleFailedReturnSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRecord.key
                    ? { ...item, status: "ส่งคืนไม่สำเร็จ" }
                    : item
            )
        );
        setFailedReturnReason("");
        setIsFailedReturnModalVisible(false);
    };

    const columns = [
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (text) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                    }}
                >
                    <span
                        style={{
                            backgroundColor:
                                text === "อนุมัติ"
                                    ? "#00bfa5"
                                    : text === "รออนุมัติ"
                                        ? "#ff9800"
                                        : text === "ส่งคืนเสร็จ"
                                            ? "#4caf50"
                                            : text === "ส่งคืนไม่สำเร็จ"
                                                ? "#f44336"
                                                : text === "ไม่อนุมัติ"
                                                    ? "#e53935"
                                                    : "#7e57c2",
                            color: "#fff",
                            padding: "4px 8px",
                            borderRadius: "4px",
                        }}
                    >
                        {text}
                    </span>
                </div>
            ),
        },
        {
            title: "เลขที่ใบจอง",
            dataIndex: "reservationNumber",
            key: "reservationNumber",
        },
        {
            title: "ทะเบียน",
            dataIndex: "license",
            key: "license",
        },
        {
            title: "วันที่ใช้งาน",
            dataIndex: "usageDate",
            key: "usageDate",
        },
        {
            title: "จองใช้งานเพื่อ",
            dataIndex: "purpose",
            key: "purpose",
        },
        {
            title: "การกระทำ",
            key: "action",
            render: (_, record) => (
                <Space>
                    {record.status === "รออนุมัติ" ? (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                style={{ background: "#029B36", color: "#fff" }}
                                onClick={() => handleApprove(record)}
                            >
                                อนุมัติ
                            </Button>
                            <Button
                                type="danger"
                                size="small"
                                onClick={() => handleReject(record)}
                            >
                                ไม่อนุมัติ
                            </Button>
                        </>
                    ) : record.status === "ส่งคืนแล้ว" ? (
                        <>
                            <Button
                                type="primary"
                                size="small"
                                style={{ background: "#4caf50", color: "#fff" }}
                                onClick={() => handleConfirmReturn(record)}
                            >
                                ยืนยันส่งคืนเสร็จ
                            </Button>
                            <Button
                                type="danger"
                                size="small"
                                onClick={() => handleFailedReturn(record)}
                            >
                                ส่งคืนไม่สำเร็จ
                            </Button>
                        </>
                    ) : (
                        <Button type="default" size="small" disabled>
                            {record.status}
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Layout style={{ padding: "0px 20px", marginTop: "20px" }}>
                <Sidebar />
                <Layout style={{ padding: "0px 20px" }}>
                    <Content
                        style={{
                            padding: "24px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                                <Select
                                    placeholder="==ทุกสถานะ=="
                                    style={{ width: "200px" }}
                                    allowClear
                                >
                                    <Option value="อนุมัติ">อนุมัติ</Option>
                                    <Option value="รออนุมัติ">รออนุมัติ</Option>
                                    <Option value="ส่งคืนแล้ว">ส่งคืนแล้ว</Option>
                                </Select>
                                <DatePicker placeholder="จากวันที่ใช้รถ" style={{ width: "200px" }} />
                                <DatePicker placeholder="ถึงวันที่" style={{ width: "200px" }} />
                                <Input
                                    placeholder="ค้นหา..."
                                    style={{ width: "200px" }}
                                />
                                <Button type="primary" style={{ background: '#029B36' }}>ค้นหา</Button>
                            </div>

                            <Table columns={columns} dataSource={data} pagination={false} />
                            <div style={{ marginTop: "16px", textAlign: "right" }}>
                                <span>ค้นเจอทั้งหมด {data.length} รายการ</span>
                            </div>
                        </div>

                        {/* Modal for rejection */}
                        <Modal
                            title="เหตุผลที่ปฏิเสธ"
                            visible={isRejectModalVisible}
                            onOk={handleRejectSubmit}
                            onCancel={() => setIsRejectModalVisible(false)}
                        >
                            <Form>
                                <Form.Item
                                    label="เหตุผล"
                                    rules={[{ required: true, message: "กรุณากรอกเหตุผล" }]}
                                >
                                    <Input.TextArea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={4}
                                        placeholder="กรอกเหตุผลที่ปฏิเสธ..."
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>

                        {/* Modal for failed return */}
                        <Modal
                            title="เหตุผลที่ส่งคืนไม่สำเร็จ"
                            visible={isFailedReturnModalVisible}
                            onOk={handleFailedReturnSubmit}
                            onCancel={() => setIsFailedReturnModalVisible(false)}
                        >
                            <Form>
                                <Form.Item
                                    label="เหตุผล"
                                    rules={[{ required: true, message: "กรุณากรอกเหตุผล" }]}
                                >
                                    <Input.TextArea
                                        value={failedReturnReason}
                                        onChange={(e) => setFailedReturnReason(e.target.value)}
                                        rows={4}
                                        placeholder="กรอกเหตุผลที่ส่งคืนไม่สำเร็จ..."
                                    />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default Approve;
