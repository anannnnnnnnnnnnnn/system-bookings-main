'use client';
import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Navigation from '../component/navigation';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, Divider } from 'antd';

const { Content } = Layout;
const { Option } = Select;

function MeetingRoomManagement() {
    const [data, setData] = useState([
        {
            key: '1',
            no: '1',
            roomName: 'ห้องประชุม A',
            capacity: '10',
            equipment: 'โปรเจคเตอร์, กระดานไวท์บอร์ด',
            status: 'พร้อมใช้งาน',
            location: 'ชั้น 3 อาคาร A', // เพิ่มข้อมูลสถานที่
            roomImage: 'path_to_image_A.jpg', // เพิ่มลิงค์รูปภาพห้องประชุม A
        },
        {
            key: '2',
            no: '2',
            roomName: 'ห้องประชุม B',
            capacity: '20',
            equipment: 'จอแสดงผล, ลำโพง',
            status: 'ซ่อมบำรุง',
            location: 'ชั้น 2 อาคาร B', // เพิ่มข้อมูลสถานที่
            roomImage: 'path_to_image_B.jpg', // เพิ่มลิงค์รูปภาพห้องประชุม B
        },
    ]);


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        setData((prevData) => prevData.filter((item) => item.key !== record.key));
    };

    const handleSubmit = (values) => {
        if (editingRecord) {
            // Update existing record
            setData((prevData) =>
                prevData.map((item) =>
                    item.key === editingRecord.key ? { ...item, ...values } : item
                )
            );
        } else {
            // Add new record
            const newKey = (data.length + 1).toString();
            const newRecord = { ...values, key: newKey, no: newKey };
            setData([...data, newRecord]);
        }
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            width: '5%',
            align: 'center',
        },
        {
            title: 'รูปภาพ',
            dataIndex: 'roomImage',
            key: 'roomImage',
            render: (image) => <img src={image} alt="Room" style={{ width: 80, height: 60, objectFit: 'cover' }} />,
            width: '15%',
        },
        {
            title: 'ชื่อห้องประชุม',
            dataIndex: 'roomName',
            key: 'roomName',
        },
        {
            title: 'รายละเอียดห้อง',
            key: 'roomDetails',
            render: (text, record) => (
                <div>
                    <p><strong>ความจุ:</strong> {record.capacity} คน</p>
                    <p><strong>อุปกรณ์:</strong> {record.equipment}</p>
                    <p><strong>สถานที่:</strong> {record.location}</p> {/* เพิ่มสถานที่ */}
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'พร้อมใช้งาน' ? 'green' : 'orange'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        onClick={() => handleEdit(record)}
                        size="small"
                        style={{ background: '#029B36', border: 'none' }}
                    >
                        แก้ไข
                    </Button>
                    <Button danger onClick={() => handleDelete(record)} size="small">
                        ลบ
                    </Button>
                </div>
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
                        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px',
                                }}
                            >
                                <h2 style={{ margin: 0 }}>การจัดการห้องประชุม</h2>

                            </div>
                            <Divider />
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end', // จัดปุ่มไปชิดขวา
                                    marginBottom: '16px',
                                }}
                            >
                                <Button
                                    type="primary"
                                    style={{ background: '#029B36', border: 'none' }}
                                    onClick={handleAdd}
                                >
                                    เพิ่มข้อมูลห้องประชุม
                                </Button>
                            </div>
                            <Table columns={columns} dataSource={data} pagination={false} />

                            <Modal
                                title={editingRecord ? 'แก้ไขข้อมูลห้องประชุม' : 'เพิ่มข้อมูลห้องประชุม'}
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                footer={null}
                                centered
                                width={500}
                                style={{
                                    borderRadius: '8px', // เพิ่มความโค้งให้กับขอบ
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', // เพิ่มเงาเล็กน้อย
                                }}
                            >
                                <Form
                                    form={form}
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                    style={{
                                        background: '#fff',
                                        padding: '20px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <Form.Item
                                        label="ชื่อห้องประชุม"
                                        name="roomName"
                                        rules={[{ required: true, message: 'กรุณาใส่ชื่อห้องประชุม' }]}
                                        style={{ marginBottom: '12px' }} // ลดระยะห่างระหว่างกล่อง
                                    >
                                        <Input
                                            placeholder="เช่น ห้องประชุม A, ห้องประชุม B"
                                            allowClear
                                            style={{
                                                borderRadius: '4px',
                                                borderColor: '#E4E4E4',
                                                padding: '10px',
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="ความจุ"
                                        name="capacity"
                                        rules={[{ required: true, message: 'กรุณาใส่ความจุของห้อง' }]}
                                        style={{ marginBottom: '12px' }} // ลดระยะห่างระหว่างกล่อง
                                    >
                                        <Input
                                            type="number"
                                            placeholder="เช่น 10, 20"
                                            min={1}
                                            max={100}
                                            style={{
                                                borderRadius: '4px',
                                                borderColor: '#E4E4E4',
                                                padding: '10px',
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="อุปกรณ์ในห้อง"
                                        name="equipment"
                                        rules={[{ required: true, message: 'กรุณาระบุอุปกรณ์ในห้องประชุม' }]}
                                        style={{ marginBottom: '12px' }} // ลดระยะห่างระหว่างกล่อง
                                    >
                                        <Input
                                            placeholder="เช่น โปรเจคเตอร์, กระดานไวท์บอร์ด"
                                            allowClear
                                            style={{
                                                borderRadius: '4px',
                                                borderColor: '#E4E4E4',
                                                padding: '10px',
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="สถานที่"
                                        name="location"
                                        rules={[{ required: true, message: 'กรุณาระบุสถานที่ห้องประชุม' }]}
                                        style={{ marginBottom: '12px' }} // ลดระยะห่างระหว่างกล่อง
                                    >
                                        <Input
                                            placeholder="เช่น ชั้น 3 อาคาร A"
                                            allowClear
                                            style={{
                                                borderRadius: '4px',
                                                borderColor: '#E4E4E4',
                                                padding: '10px',
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="สถานะ"
                                        name="status"
                                        rules={[{ required: true, message: 'กรุณาเลือกสถานะห้องประชุม' }]}
                                        style={{ marginBottom: '10px' }}
                                    >
                                        <Select
                                            placeholder="เลือกสถานะ"
                                            style={{
                                                borderRadius: '4px',
                                                borderColor: '#E4E4E4',
                                                padding: '10px',
                                                width: '100%', // กำหนดความกว้างเต็มที่
                                                fontSize: '14px', // ปรับขนาดตัวอักษรให้เหมือนกัน
                                            }}
                                        >
                                            <Option value="พร้อมใช้งาน">พร้อมใช้งาน</Option>
                                            <Option value="ซ่อมบำรุง">ซ่อมบำรุง</Option>
                                        </Select>
                                    </Form.Item>


                                    <Form.Item style={{ marginBottom: '0' }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            style={{
                                                backgroundColor: '#4CAF50',
                                                borderRadius: '4px',
                                                padding: '12px 0',
                                                borderColor: '#4CAF50',
                                                fontWeight: 'bold',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            บันทึก
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default MeetingRoomManagement;
