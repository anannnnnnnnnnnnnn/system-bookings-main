'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;

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
                    <Button type="primary" onClick={() => handleEdit(record)} size="small">แก้ไข</Button>
                    <Button danger onClick={() => handleDelete(record.room_id)} size="small">ลบ</Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ padding: '0 50px', marginTop: '80px' }}>
                <Sidebar />
                <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
                    <h2>การจัดการห้องประชุม</h2>
                    <Button type="primary" onClick={handleAdd}>เพิ่มห้องประชุม</Button>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey="room_id" />
                    <Modal title={editingRecord ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                        <Form form={form} onFinish={handleSubmit} layout="vertical">
                            <Form.Item label="ชื่อห้องประชุม" name="room_name" rules={[{ required: true, message: 'กรุณากรอกชื่อห้องประชุม' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="ประเภทห้อง" name="capacity" rules={[{ required: true, message: 'กรุณากรอกความจุห้อง' }]}>
                                <Input type="number" />
                            </Form.Item>

                            <Form.Item label="ความจุ" name="capacity" rules={[{ required: true, message: 'กรุณากรอกความจุห้อง' }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="อุปกรณ์" name="equipment" rules={[{ required: true, message: 'กรุณากรอกอุปกรณ์ที่มีในห้อง' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="สถานที่" name="location" rules={[{ required: true, message: 'กรุณากรอกตำแหน่งห้อง' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="สถานะ"
                                name="status"
                                rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}
                                initialValue={1}
                            >
                                <Select>
                                    <Option value={1}>พร้อมใช้งาน</Option>
                                    <Option value={2}>ซ่อมบำรุง</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="อัปโหลดรูปภาพ">
                                <Upload beforeUpload={() => false} onChange={handleFileChange} listType="picture">
                                    <Button icon={<UploadOutlined />}>เลือกไฟล์</Button>
                                </Upload>
                            </Form.Item>
                            <Button type="primary" htmlType="submit">บันทึก</Button>
                        </Form>

                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
}
export default MeetingRoomManagement;
