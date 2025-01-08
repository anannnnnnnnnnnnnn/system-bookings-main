'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Navigation from '../component/navigation';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, Divider,message  } from 'antd';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;

function MeetingRoomManagement() {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const fetchRooms = async () => {
        try {
            const response = await axios.get('http://localhost:5182/api/rooms');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleDelete = async (room_id) => { // ใช้ room_id แทน
        if (window.confirm('คุณแน่ใจหรือไม่ว่าจะลบห้องประชุมนี้?')) {
            try {
                // ทำการลบห้องประชุมจาก API
                await axios.delete(`http://localhost:5182/api/rooms/${room_id}`);
                message.success('ลบข้อมูลห้องประชุมสำเร็จ');
                
                // รีเฟรชข้อมูลห้องประชุม
                fetchRooms(); 
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการลบข้อมูลห้องประชุม:', error);
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };  
    
    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            room_name: record.room_name,
            capacity: record.capacity,
            equipment: record.equipment,
            location: record.location,
            status: record.status === 1 ? 'พร้อมใช้งาน' : 'ซ่อมบำรุง', // แปลงสถานะ
        });
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        if (editingRecord) {
            // แปลงค่า status จากข้อความที่เลือกในฟอร์มกลับเป็นตัวเลข
            const updatedValues = {
                ...values,
                status: values.status === 'พร้อมใช้งาน' ? 1 : 2,
            };

            try {
                // ตรวจสอบว่า API ของคุณใช้ `room_id` หรือ `key`
                await axios.put(`http://localhost:5182/api/rooms/${editingRecord.room_id || editingRecord.key}`, updatedValues);

                // อัพเดทข้อมูลใน state
                setData((prevData) =>
                    prevData.map((item) =>
                        item.key === editingRecord.key ? { ...item, ...updatedValues } : item
                    )
                );
                setIsModalVisible(false); // ปิด Modal
            } catch (error) {
                console.error('Error updating room:', error);
            }
        } else {
            // เพิ่มข้อมูลห้องใหม่
            try {
                const response = await axios.post('http://localhost:5182/api/rooms', {
                    room_name: values.room_name,
                    capacity: values.capacity,
                    equipment: values.equipment,
                    location: values.location,
                    status: values.status === 'พร้อมใช้งาน' ? 1 : 2, // ส่งสถานะเป็นตัวเลข
                });

                setData((prevData) => [
                    ...prevData,
                    { ...values, key: response.data.room.key }, // เพิ่มห้องใหม่
                ]);
                setIsModalVisible(false); // ปิด Modal
            } catch (error) {
                console.error('Error adding room:', error);
            }
        }
    };


    const statusTypes = {
        1: 'พร้อมใช้งาน',
        2: 'ปิดปรับปรุง',
    };

    const columns = [
        {
            title: 'NO',
            key: 'no',
            render: (_, __, index) => index + 1, // แสดงเลขลำดับที่เริ่มจาก 1
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
            dataIndex: 'room_name', // ถ้าในฐานข้อมูลเป็น 'room_name'
            key: 'room_name',
        },
        {
            title: 'รายละเอียดห้อง',
            key: 'roomDetails',
            render: (text, record) => (
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
            render: (text, record) => (
                <Tag color={record.status === 1 ? 'green' : 'red'}>
                    {record.status === 1 ? 'พร้อมใช้งาน' : 'ซ่อมบำรุง'}
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
                    <Button
                        danger
                        onClick={() => handleDelete(record.room_id)} // ใช้ record.room_id แทน
                        size="small"
                    >
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
                    <Content style={{
                        marginTop: '21px',
                        padding: '24px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}>
                        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
                            <h2>การจัดการห้องประชุม</h2>
                            <Divider />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                <Button type="primary" style={{ background: '#029B36', border: 'none' }} onClick={handleAdd}>
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
                            >
                                <Form form={form} onFinish={handleSubmit} layout="vertical">
                                    <Form.Item label="ชื่อห้องประชุม" name="room_name" rules={[{ required: true, message: 'กรุณาใส่ชื่อห้องประชุม' }]}>
                                        <Input placeholder="เช่น ห้องประชุม A" />
                                    </Form.Item>
                                    <Form.Item label="ความจุ" name="capacity" rules={[{ required: true, message: 'กรุณาใส่ความจุของห้อง' }]}>
                                        <Input type="number" min={1} max={100} />
                                    </Form.Item>
                                    <Form.Item label="อุปกรณ์ในห้อง" name="equipment" rules={[{ required: true, message: 'กรุณาระบุอุปกรณ์ในห้องประชุม' }]}>
                                        <Input placeholder="เช่น โปรเจคเตอร์, กระดานไวท์บอร์ด" />
                                    </Form.Item>
                                    <Form.Item label="สถานที่" name="location" rules={[{ required: true, message: 'กรุณาระบุสถานที่ห้องประชุม' }]}>
                                        <Input placeholder="เช่น ชั้น 3 อาคาร A" />
                                    </Form.Item>
                                    <Form.Item label="สถานะ" name="status" rules={[{ required: true, message: 'กรุณาเลือกสถานะห้องประชุม' }]}>
                                        <Select placeholder="เลือกสถานะ">
                                            <Option value={1}>พร้อมใช้งาน</Option>
                                            <Option value={2}>ซ่อมบำรุง</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>บันทึก</Button>
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