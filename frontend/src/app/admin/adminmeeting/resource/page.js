'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, message, Upload,Breadcrumb,Typography } from 'antd';
import { UploadOutlined,HomeOutlined, } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

function MeetingRoomManagement() {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5182/api/rooms');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setImageFile(null);
        setIsModalVisible(true);
    };

    const handleDelete = async (room_id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าจะลบห้องประชุมนี้?')) {
            try {
                await axios.delete(`http://localhost:5182/api/rooms/${room_id}`);
                message.success('ลบข้อมูลสำเร็จ');
                fetchRooms();
            } catch (error) {
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            room_name: record.room_name,
            capacity: Number(record.capacity), // แปลงเป็นตัวเลข
            equipment: record.equipment,
            location: record.location,
            status: record.status || 1, // กำหนดค่าเริ่มต้นถ้าไม่มี
        });
        setIsModalVisible(true);
    };


    const handleSubmit = async (values) => {
        console.log('Form values:', values); // ตรวจสอบค่าก่อนส่ง

        if (!values.capacity) {
            message.error('ค่าความจุห้องประชุมหายไป');
            return;
        }

        const formData = new FormData();
        formData.append('room_name', values.room_name);
        formData.append('capacity', values.capacity);
        formData.append('equipment', values.equipment ?? '');
        formData.append('location', values.location ?? '');
        formData.append('status', values.status ?? 1); // ถ้า `undefined` ให้เป็น `1`

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (editingRecord) {
                await axios.put(`http://localhost:5182/api/rooms/${editingRecord.room_id}`, formData);
                message.success('แก้ไขข้อมูลสำเร็จ');
            } else {
                await axios.post('http://localhost:5182/api/rooms', formData);
                message.success('เพิ่มห้องประชุมสำเร็จ');
            }
            setIsModalVisible(false);
            fetchRooms();
        } catch (error) {
            console.error('Error:', error);
            message.error('เกิดข้อผิดพลาด');
        }
    };

    const handleFileChange = ({ file }) => {
        setImageFile(file);
    };

    const columns = [
        {
            title: 'NO',
            key: 'no',
            render: (_, __, index) => index + 1,
            width: '5%',
            align: 'center',
        },
        {
            title: 'รูปภาพ',
            dataIndex: 'room_img',
            key: 'room_img',
            render: (image) => (
                <img src={image ? `http://localhost:5182${image}` : '/default-room.png'}
                    alt="Room"
                    style={{ width: 80, height: 60, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'ชื่อห้องประชุม',
            dataIndex: 'room_name',
            key: 'room_name',
        },
        {
            title: 'รายละเอียด',
            key: 'roomDetails',
            render: (_, record) => (
                <div>
                    <p><strong>ความจุ:</strong> {record.capacity} คน</p>
                    <p><strong>อุปกรณ์:</strong> {record.equipment}</p>
                    <p><strong>สถานที่:</strong> {record.location}</p>
                </div>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'พร้อมใช้งาน' : 'ซ่อมบำรุง'}
                </Tag>
            ),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleEdit(record)} size="small" style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}>แก้ไข</Button>
                    <Button danger onClick={() => handleDelete(record.room_id)} size="small">ลบ</Button>
                </div>
            ),
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
                            alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
                            margin: '0 70px',
                        }}
                    >
                        {/* ไอคอนหลัก */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#d9e8d2', // สีพื้นหลังไอคอน
                                borderRadius: '50%', // รูปทรงกลม
                                marginRight: '10px', // ระยะห่างระหว่างไอคอนและข้อความ
                            }}
                        >
                            <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                        </div>

                        {/* Breadcrumb */}
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#666', // สีข้อความหลัก
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
                                        color: '#666', // สีข้อความรอง
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
                                        color: '#333', // สีข้อความรอง
                                    }}
                                >
                                    กรอกรายละเอียกการจอง
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                    <Content style={{
                        background: '#ffffff', // พื้นหลังสีขาว
                        marginTop: '10px',
                        marginLeft: '50px',
                        padding: '20px',
                        borderRadius: '8px',
                    }}>
                        <Title
                            level={2}
                            style={{
                                marginBottom: '10px',
                                color: '#666',
                            }}
                        >
                            เพิ่มห้องประชุม
                        </Title>
                        <Button type="primary" onClick={handleAdd} style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}>เพิ่มห้องประชุม</Button>
                        <Table columns={columns} dataSource={data} pagination={false} rowKey="room_id" />
                        <Modal
                            title={editingRecord ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'}
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                            width={600}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)', // จัดให้มันอยู่กลาง
                                maxWidth: '90%',
                                height: '500px',
                            }}
                            bodyStyle={{ overflowY: 'auto' }}
                        >
                            <Form form={form} onFinish={handleSubmit} layout="horizontal">
                                <Form.Item
                                    label="ชื่อห้องประชุม"
                                    name="room_name"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อห้องประชุม' }]}
                                    labelCol={{ span: 6 }}  // กำหนดขนาดของ label
                                    wrapperCol={{ span: 18 }} // กำหนดขนาดของ input
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="ประเภทห้อง"
                                    name="room_type"
                                    rules={[{ required: true, message: 'กรุณาเลือกประเภทห้อง' }]}
                                    initialValue={1}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Select>
                                        <Option value={1}>ห้องขนาดเล็ก</Option>
                                        <Option value={2}>ห้องขนาดใหญ่</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="ความจุ"
                                    name="capacity"
                                    rules={[{ required: true, message: 'กรุณากรอกความจุห้อง' }]}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input type="number" />
                                </Form.Item>

                                <Form.Item
                                    label="อุปกรณ์"
                                    name="equipment"
                                    rules={[{ required: true, message: 'กรุณากรอกอุปกรณ์ที่มีในห้อง' }]}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="สถานที่"
                                    name="location"
                                    rules={[{ required: true, message: 'กรุณากรอกตำแหน่งห้อง' }]}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="สถานะ"
                                    name="status"
                                    rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
                                    initialValue={1}
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Select>
                                        <Option value={1}>พร้อมใช้งาน</Option>
                                        <Option value={2}>ซ่อมบำรุง</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="อัปโหลดรูปภาพ"
                                    labelCol={{ span: 6 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ marginBottom: 8 }}
                                >
                                    <Upload beforeUpload={() => false} onChange={handleFileChange} listType="picture">
                                        <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item wrapperCol={{ span: 24, offset: 6 }}>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }} // ปรับสีปุ่ม
                                    >
                                        บันทึก
                                    </Button>
                                </Form.Item>
                            </Form>

                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}
export default MeetingRoomManagement;
