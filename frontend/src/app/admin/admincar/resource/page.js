'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, message, Upload, Breadcrumb, Typography } from 'antd';
import { UploadOutlined, HomeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

function CarManagement() {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5182/api/cars');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setImageFile(null);
        setIsModalVisible(true);
    };

    const handleDelete = async (car_id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าจะลบข้อมูลรถคันนี้?')) {
            try {
                await axios.delete(`http://localhost:5182/api/cars/${car_id}`);
                message.success('ลบข้อมูลสำเร็จ');
                fetchCars();
            } catch (error) {
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            brand: record.brand,
            model: record.model,
            license_plate: record.license_plate,
            seating_capacity: record.seating_capacity,
            fuel_type: record.fuel_type || 1,
            status: record.status || 1,
            type: record.type || 1,
        });
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        const seatingCapacity = parseInt(values.seating_capacity, 10);
        if (!seatingCapacity) {
            message.error('ค่าความจุที่นั่งหายไป');
            return;
        }

        const formData = new FormData();
        formData.append('brand', values.brand);
        formData.append('model', values.model);
        formData.append('license_plate', values.license_plate);
        formData.append('seating_capacity', seatingCapacity);
        formData.append('fuel_type', values.fuel_type);
        formData.append('status', values.status);
        formData.append('type', values.type);

        // ส่งรูปภาพใหม่ถ้ามีการเลือกไฟล์
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (editingRecord && editingRecord.image_url) {
            // ถ้าไม่มีการเลือกไฟล์ใหม่ ให้ใช้รูปภาพเดิม
            formData.append('image_url', editingRecord.image_url); // ส่ง URL รูปภาพเดิมไป
        }

        try {
            if (editingRecord) {
                // แก้ไขข้อมูล
                formData.append('car_id', editingRecord.car_id);
                await axios.put(`http://localhost:5182/api/cars/${editingRecord.car_id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                message.success('แก้ไขข้อมูลสำเร็จ');
            } else {
                // เพิ่มข้อมูลใหม่
                await axios.post('http://localhost:5182/api/cars', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                message.success('เพิ่มข้อมูลรถยนต์สำเร็จ');
            }

            // หลังจากเพิ่มหรือแก้ไขข้อมูลเสร็จแล้ว ให้ปิด modal และดึงข้อมูลรถยนต์ใหม่
            setIsModalVisible(false);
            fetchCars();  // ฟังก์ชันที่ดึงข้อมูลรถยนต์ทั้งหมดมาแสดง
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error); // เช็คข้อมูลที่ส่งกลับจาก API
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
            dataIndex: 'image_url',
            key: 'image_url',
            render: (image) => (
                <img src={image ? `http://localhost:5182${image}` : '/default-car.png'}
                    alt="Car"
                    style={{ width: 80, height: 60, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'ยี่ห้อ',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'รุ่น',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'ทะเบียน',
            dataIndex: 'license_plate',
            key: 'license_plate',
        },
        {
            title: 'จำนวนที่นั่ง',
            dataIndex: 'seating_capacity',
            key: 'seating_capacity',
        },
        {
            title: 'ประเภทเชื้อเพลิง',
            dataIndex: 'fuel_type',
            key: 'fuel_type',
            render: (fuelType) => (
                <Tag color={fuelType === 1 ? 'green' : fuelType === 2 ? 'blue' : 'gray'}>
                    {fuelType === 1 ? 'น้ำมัน' : fuelType === 2 ? 'ไฟฟ้า' : 'อื่นๆ'}
                </Tag>
            ),
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน'}
                </Tag>
            ),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleEdit(record)} size="small" style={{ backgroundColor: 'green', borderColor: 'green', color: 'white' }}>แก้ไข</Button>
                    <Button danger onClick={() => handleDelete(record.car_id)} size="small">ลบ</Button>
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
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 70px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#d9e8d2',
                            borderRadius: '50%',
                            marginRight: '10px',
                        }}>
                            <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                        </div>

                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#666',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',

                                }}>
                                    ระบบแอดมิน
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#333',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',

                                }}>
                                    หน้าการจัดการรถ
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
                            เพิ่มรถยนต์
                        </Title>
                        <Button type="primary" onClick={handleAdd} style={{ marginBottom: '20px', backgroundColor: 'green', borderColor: 'green', color: 'white' }}>เพิ่มรถยนต์</Button>
                        <Table columns={columns} dataSource={data} pagination={false} rowKey="car_id" />
                        <Modal title={editingRecord ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} onOk={form.submit} footer={null}>
                            <Form form={form} onFinish={handleSubmit} layout="vertical">
                                <Form.Item label="ยี่ห้อ" name="brand" rules={[{ required: true, message: 'กรุณากรอกยี่ห้อ' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="รุ่น" name="model" rules={[{ required: true, message: 'กรุณากรอกรุ่น' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="ทะเบียน" name="license_plate" rules={[{ required: true, message: 'กรุณากรอกทะเบียน' }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="จำนวนที่นั่ง" name="seating_capacity" rules={[{ required: true, message: 'กรุณากรอกจำนวนที่นั่ง' }]}>
                                    <Input type="number" />
                                </Form.Item>
                                <Form.Item label="ประเภทเชื้อเพลิง" name="fuel_type" rules={[{ required: true, message: 'กรุณาเลือกประเภทเชื้อเพลิง' }]}>
                                    <Select>
                                        <Option value={1}>น้ำมัน</Option>
                                        <Option value={2}>ไฟฟ้า</Option>
                                        <Option value={3}>อื่นๆ</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="สถานะ" name="status" rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]} initialValue={1}>
                                    <Select>
                                        <Option value={1}>พร้อมใช้งาน</Option>
                                        <Option value={2}>ไม่พร้อมใช้งาน</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item label="ประเภทรถ" name="type" rules={[{ required: true, message: 'กรุณาเลือกประเภทรถ' }]} initialValue={1}>
                                    <Select>
                                        <Option value={1}>รถส่วนตัว</Option>
                                        <Option value={2}>รถตู้</Option>
                                        <Option value={3}>รถกระบะ</Option>
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
        </Layout>
    );
}

export default CarManagement;
