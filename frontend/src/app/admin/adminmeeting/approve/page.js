'use client';
import React, { useState } from "react";
import { Layout, Table, Button, Select, Input, DatePicker, Divider, Modal, Form } from "antd";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";
import Navigation from "../component/navigation";

const { Content } = Layout;
const { Option } = Select;

function Approve() {
    const [data, setData] = useState([
        {
            key: "1",
            status: "รออนุมัติ",
            reservationNumber: "REV58020001",
            roomName: "ห้องประชุม A",
            bookingDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            bookingTime: "09:00 - 12:00",
            purpose: "ประชุมเกี่ยวกับโครงการใหม่",
        },
        {
            key: "2",
            status: "อนุมัติ",
            reservationNumber: "REV58020002",
            roomName: "ห้องประชุม B",
            bookingDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            bookingTime: "13:00 - 15:00",
            purpose: "สัมมนาทางธุรกิจ",
        },
        {
            key: "3",
            status: "รออนุมัติ",
            reservationNumber: "REV58020003",
            roomName: "ห้องประชุม C",
            bookingDate: "10 ก.พ. 67 - 11 ก.พ. 67",
            bookingTime: "10:00 - 12:00",
            purpose: "การอบรมภายในองค์กร",
        },
        {
            key: "4",
            status: "รออนุมัติ",
            reservationNumber: "REV58020004",
            roomName: "ห้องประชุม D",
            bookingDate: "15 ก.พ. 67 - 15 ก.พ. 67",
            bookingTime: "14:00 - 17:00",
            purpose: "การประชุมทางวิชาการ",
        },
        {
            key: "5",
            status: "รออนุมัติ",
            reservationNumber: "REV58020005",
            roomName: "ห้องประชุม E",
            bookingDate: "20 ก.พ. 67 - 21 ก.พ. 67",
            bookingTime: "09:00 - 12:00",
            purpose: "การประชุมผู้บริหาร",
        },
    ]);

    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal สำหรับแก้ไข
    const [selectedRow, setSelectedRow] = useState(null);
    const [form] = Form.useForm(); // ฟอร์มสำหรับแก้ไข

    const handleRowClick = (record) => {
        setSelectedRow(record);
        setIsDetailModalVisible(true);
    };

    const handleEditClick = (record) => {
        setSelectedRow(record);
        form.setFieldsValue(record); // ตั้งค่าฟอร์มจากข้อมูลในแถว
        setIsEditModalVisible(true); // เปิด Modal แก้ไข
    };

    const handleSaveEdit = () => {
        const updatedData = data.map(item =>
            item.key === selectedRow.key ? { ...item, ...form.getFieldsValue() } : item
        );
        setData(updatedData);
        setIsEditModalVisible(false); // ปิด Modal หลังจากบันทึก
    };

    const columns = [


        {
            title: "เลขที่ใบจอง",
            dataIndex: "reservationNumber",
            key: "reservationNumber",
        },
        {
            title: "ชื่อห้องประชุม",
            dataIndex: "roomName",
            key: "roomName",
        },
        {
            title: "วันที่จอง",
            dataIndex: "bookingDate",
            key: "bookingDate",
        },
        {
            title: "เวลา",
            dataIndex: "bookingTime",
            key: "bookingTime", // Add this column for booking time
        },
        {
            title: "จองใช้งานเพื่อ",
            dataIndex: "purpose",
            key: "purpose",
        },
        {
            title: "แก้ไข",
            key: "edit",
            render: (text, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => handleEditClick(record)}
                    style={{ background: '#029B36' }}
                >
                    แก้ไข
                </Button>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
            <Navbar />
            <Layout style={{ padding: '0px 50px', marginTop: '80px', backgroundColor: '#ffff' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px', backgroundColor: '#ffff' }}>
                    <Navigation />
                    <Content
                        style={{
                            marginTop: '21px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            backgroundColor: '#ffff'
                        }}
                    >
                        <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: "800px", margin: "0 auto" }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px',
                                }}
                            >
                                <h2 style={{ margin: 0 }}>หน้ารออนุมัติ</h2>

                            </div>
                            <Divider />
                            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                                <Select
                                    placeholder="==ทุกสถานะ=="
                                    style={{ width: "200px" }}
                                    allowClear
                                >
                                    <Option value="อนุมัติ">อนุมัติ</Option>
                                    <Option value="รออนุมัติ">รออนุมัติ</Option>
                                    <Option value="ไม่อนุมัติ">ไม่อนุมัติ</Option>
                                </Select>
                                <DatePicker placeholder="จากวันที่จอง" style={{ width: "200px" }} />
                                <DatePicker placeholder="ถึงวันที่" style={{ width: "200px" }} />
                                <Input
                                    placeholder="ค้นหา..."
                                    style={{ width: "200px" }}
                                />
                                <Button type="primary" style={{ background: '#029B36' }}>ค้นหา</Button>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                onRow={(record) => ({
                                    onClick: (e) => {
                                        if (!e.target.closest("button")) {
                                            handleRowClick(record);
                                        }
                                    },
                                })}
                                rowClassName="clickable-row"
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>

            {/* Modal Details */}
            <Modal
                title="รายละเอียดการจอง"
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
            >
                <div>
                    <p><strong>เลขที่ใบจอง:</strong> {selectedRow?.reservationNumber}</p>
                    <p><strong>ชื่อห้องประชุม:</strong> {selectedRow?.roomName}</p>
                    <p><strong>วันที่จอง:</strong> {selectedRow?.bookingDate}</p>
                    <p><strong>เวลา:</strong> {selectedRow?.bookingTime}</p>
                    <p><strong>จองใช้งานเพื่อ:</strong> {selectedRow?.purpose}</p>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                title="แก้ไขข้อมูล"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={handleSaveEdit}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="เลขที่ใบจอง" name="reservationNumber">
                        <Input />
                    </Form.Item>
                    <Form.Item label="ชื่อห้องประชุม" name="roomName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="วันที่จอง" name="bookingDate">
                        <Input />
                    </Form.Item>
                    <Form.Item label="เวลา" name="bookingTime">
                        <Input />
                    </Form.Item>
                    <Form.Item label="จองใช้งานเพื่อ" name="purpose">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

export default Approve;
