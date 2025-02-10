'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, Image, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;

function ResourceManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5182/api/cars');
                const formattedData = response.data.map((item, index) => ({
                    ...item,
                    key: item.id,
                    no: index + 1,
                }));
                setData(formattedData);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            }
        };
        fetchData();
    }, []);

    const fuelTypes = {
        1: 'น้ำมัน',
        2: 'ไฟฟ้า',
        3: 'อื่นๆ'
    };

    const statusTypes = {
        1: 'ใช้งานปกติ',
        2: 'ไม่พร้อมใช้งาน'
    };

    const columns = [
        {
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
            align: 'center',
        },
        {
            title: 'รูปรถ',
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image) => (
                <div style={{ textAlign: 'center' }}>
                    <Image
                        src={`http://localhost:5182${image}`}
                        width={100}
                        alt="Car Image"
                    />
                </div>
            ),
        },
        {
            title: 'รายละเอียดรถ',
            key: 'details',
            render: (record) => (
                <div>
                    <p><strong>ยี่ห้อ:</strong> {record.brand}</p>
                    <p><strong>รุ่น:</strong> {record.model}</p>
                    <p><strong>ทะเบียน:</strong> {record.license_plate}</p>
                    <p><strong>จำนวนที่นั่ง:</strong> {record.seating_capacity} ที่นั่ง</p>
                    <p><strong>เชื้อเพลิง:</strong> {fuelTypes[record.fuel_type]}</p>
                    <p>
                        <strong>สถานะ:</strong>
                        <Tag color={record.status === 1 ? 'green' : 'red'}>
                            {statusTypes[record.status]}
                        </Tag>
                    </p>
                </div>
            ),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleEdit(record)} size="small">
                        แก้ไข
                    </Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)} size="small">
                        ลบ
                    </Button>
                </div>
            ),
        },
    ];

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalVisible(true);
        form.setFieldsValue({
            brand: record.brand,
            model: record.model,
            license_plate: record.license_plate,
            seating_capacity: record.seating_capacity,
            fuel_type: record.fuel_type,
            status: record.status,
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5182/api/cars/${id}`);
            message.success('ลบรถยนต์สำเร็จ');
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            message.error('ลบรถยนต์ไม่สำเร็จ');
            console.error('Error:', error);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            // ใส่ข้อมูลใน FormData
            Object.keys(values).forEach((key) => formData.append(key, values[key]));

            // เพิ่มไฟล์ภาพถ้ามี
            if (previewImage?.file) {
                formData.append('image_url', previewImage.file.originFileObj);
            }

            if (editingRecord) {
                // Update
                await axios.put(`http://localhost:5182/api/cars/${editingRecord.id}`, formData);
                message.success('แก้ไขข้อมูลสำเร็จ');
            } else {
                // Add new
                await axios.post('http://localhost:5182/api/cars', formData);
                message.success('เพิ่มรถยนต์ใหม่สำเร็จ');
            }

            setIsModalVisible(false);
            setEditingRecord(null);
            form.resetFields();

            // โหลดข้อมูลใหม่
            const response = await axios.get('http://localhost:5182/api/cars');
            setData(response.data.map((item, index) => ({
                ...item,
                key: item.id,
                no: index + 1,
            })));
        } catch (error) {
            message.error('การดำเนินการล้มเหลว');
            console.error('Error:', error);
        }
    };


    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
            <Content style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ maxWidth: '900px', margin: '40px auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2 style={{ margin: 0 }}>การจัดการทรัพยากร</h2>
                        <Button type="primary" onClick={() => setIsModalVisible(true)}>เพิ่มรถยนต์</Button>
                    </div>
                    <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
                </div>

                {/* Modal for Add/Edit */}
                <Modal
                    title={editingRecord ? 'แก้ไขข้อมูลรถยนต์' : 'เพิ่มข้อมูลรถยนต์'}
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>ยกเลิก</Button>,
                        <Button key="submit" type="primary" onClick={handleOk}>ยืนยัน</Button>,
                    ]}
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="brand" label="ยี่ห้อ" rules={[{ required: true, message: 'กรุณากรอกยี่ห้อ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="brand" label="ยี่ห้อ" rules={[{ required: true, message: 'กรุณากรอกยี่ห้อ' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="model" label="รุ่น" rules={[{ required: true, message: 'กรุณากรอกรุ่น' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="license_plate" label="ทะเบียน" rules={[{ required: true, message: 'กรุณากรอกทะเบียน' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="seating_capacity" label="จำนวนที่นั่ง" rules={[{ required: true, message: 'กรุณากรอกจำนวนที่นั่ง' }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="fuel_type" label="ประเภทเชื้อเพลิง" rules={[{ required: true, message: 'กรุณาเลือกประเภทเชื้อเพลิง' }]}>
                            <Select>
                                <Option value={1}>น้ำมัน</Option>
                                <Option value={2}>ไฟฟ้า</Option>
                                <Option value={3}>อื่นๆ</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="สถานะ" rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}>
                            <Select>
                                <Option value={1}>ใช้งานปกติ</Option>
                                <Option value={2}>ไม่พร้อมใช้งาน</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="ภาพรถ" valuePropName="fileList">
                            <Upload
                                listType="picture"
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={(info) => setPreviewImage(info)}
                            >
                                <Button icon={<UploadOutlined />}>เลือกไฟล์ภาพ</Button>
                            </Upload>
                        </Form.Item>

                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
}

export default ResourceManagement;
