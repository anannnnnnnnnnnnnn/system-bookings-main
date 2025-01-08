'use client';
import React, { useState, useEffect } from 'react';

import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Navigation from '../component/navigation';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, Image, previewImage, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;

function ResourceManagement() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editingCarId, setEditingCarId] = useState(null);
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState(null);
    const [data, setData] = useState([]);
    const [formValues, setFormValues] = useState({

        brand: '',
        model: '',
        license_plate: '',
        seating_capacity: '',
        fuel_type: '',
        status: '', 
        image_url: null, // สำหรับการเก็บไฟล์ภาพ
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };
    const handleFileChange = (info) => {
        if (info.file.status === 'done' || info.file.status === 'removed') {
            setFormValues({
                ...formValues,
                image_url: info.file.originFileObj || null,
            });
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5182/api/cars');
                const formattedData = response.data.map((item, index) => ({
                    ...item,
                    key: item.id, // ใช้ id เป็น key ของแต่ละแถว
                    no: index + 1, // เพิ่มลำดับที่
                }));
                setData(formattedData);
            } catch (error) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
            }
        };
        fetchData();
    }, []);
    
    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleValuesChange = (changedValues, allValues) => {
        setFormValues(allValues); // อัปเดตค่าที่เปลี่ยนแปลง
    };
    
    const handleEdit = (record) => {
        setEditingRecord(record); 
        setEditingCarId(record.id); // ตั้งค่า ID ของรถที่กำลังแก้ไข
        form.setFieldsValue(record); // โหลดข้อมูลลงในฟอร์ม
        setIsModalVisible(true); // แสดง modal
    };
        
    const handleDelete = async (car_id) => { // ใช้ car_id แทน id
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await axios.delete(`http://localhost:5182/api/cars/${car_id}`);
                message.success('Car deleted successfully');
                fetchCars(); // รีเฟรชข้อมูลหลังจากลบ
            } catch (error) {
                console.error('Error during deletion', error);
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };
    
    const handleSubmit = async () => {
        const { brand, model, license_plate, seating_capacity, fuel_type, status } = formValues;
        
        const data = {
            brand,
            model,
            license_plate,
            seating_capacity,
            fuel_type: parseInt(fuel_type),
            status: parseInt(status),
        };
        
        try {
            if (editingCarId) {
                // แก้ไขข้อมูล (PUT)
                await axios.put(`http://localhost:5182/api/cars/${editingCarId}`, data);
                message.success('แก้ไขข้อมูลสำเร็จ');
            } else {
                // เพิ่มข้อมูลใหม่ (POST)
                const formData = new FormData();
                Object.keys(data).forEach((key) => formData.append(key, data[key]));
                if (formValues.image_url) {
                    formData.append('image_url', formValues.image_url);
                }
                await axios.post('http://localhost:5182/api/cars', formData);
                message.success('เพิ่มข้อมูลสำเร็จ');
            }
            setIsModalVisible(false);
            await fetchData(); // รีเฟรชข้อมูลในตาราง
        } catch (error) {
            console.error('เกิดข้อผิดพลาด:', error);
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };

    // การตรวจสอบก่อนการอัปโหลดไฟล์
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        const isSmallEnough = file.size / 1024 / 1024 < 2; // ขนาดไฟล์ไม่เกิน 2MB

        if (!isImage) {
            Modal.error({ title: 'ไฟล์ที่เลือกไม่ใช่รูปภาพ' });
            return false;
        }

        if (!isSmallEnough) {
            Modal.error({ title: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB' });
            return false;
        }

        return true;
    };

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
    
    // แปลประเภทเชื้อเพลิง (fuel_type) และสถานะ (status)
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
            dataIndex: 'image_url', // ชื่อฟิลด์ที่ถูกต้องใน API
            key: 'image_url',
            render: (image) => (
                <div style={{ textAlign: 'center' }}>
                    <Image src={image} width={100} alt="Car Image" />
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
                    <Button type="link" danger onClick={() => handleDelete(record.car_id)} size="small">
                        
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
                        <div style={{ maxWidth: '900px', margin: '40px auto' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '16px',
                                }}
                            >
                                <h2 style={{ margin: 0 }}>การจัดการทรัพยากร</h2>
                                <Button
                                    type="primary"
                                    onClick={handleAdd}
                                    style={{
                                        background: '#029B36', border: 'none',
                                        transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                                        transform: "scale(1)", // ขนาดปกติ
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                                    }}
                                >
                                    เพิ่มข้อมูลรถ
                                </Button>
                            </div>
                            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
                            <Modal
                                title="เพิ่มข้อมูลรถ"
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                footer={null}
                                centered
                                width={800}
                                bodyStyle={{ padding: '24px', background: '#f7f7f7', borderRadius: '12px' }}
                            >
                                <Form layout="vertical" onFinish={handleSubmit}>
                                    <Form.Item label="ยี่ห้อ" name="brand" rules={[{ required: true, message: 'กรุณากรอกยี่ห้อ' }]}>
                                        <Input name="brand" value={formValues.brand} onChange={handleChange} />
                                    </Form.Item>

                                    <Form.Item label="รุ่น" name="model" rules={[{ required: true, message: 'กรุณากรอกรุ่น' }]}>
                                        <Input name="model" value={formValues.model} onChange={handleChange} />
                                    </Form.Item>

                                    <Form.Item label="ทะเบียน" name="license_plate" rules={[{ required: true, message: 'กรุณากรอกทะเบียน' }]}>
                                        <Input name="license_plate" value={formValues.license_plate} onChange={handleChange} />
                                    </Form.Item>

                                    <Form.Item label="จำนวนที่นั่ง" name="seating_capacity" rules={[{ required: true, message: 'กรุณากรอกจำนวนที่นั่ง' }]}>
                                        <Input type="number" name="seating_capacity" value={formValues.seating_capacity} onChange={handleChange} />
                                    </Form.Item>

                                    <Form.Item label="ประเภทเชื้อเพลิง" name="fuel_type" rules={[{ required: true, message: 'กรุณาเลือกประเภทเชื้อเพลิง' }]}>
                                        <Select name="fuel_type" value={formValues.fuel_type} onChange={(value) => setFormValues({ ...formValues, fuel_type: value })}>
                                            <Option value="1">น้ำมัน</Option>
                                            <Option value="2">ไฟฟ้า</Option>
                                            <Option value="3">อื่นๆ</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item label="สถานะ" name="status" rules={[{ required: true, message: 'กรุณาเลือกสถานะ' }]}>
                                        <Select name="status" value={formValues.status} onChange={(value) => setFormValues({ ...formValues, status: value })}>
                                            <Option value="1">ใช้งานปกติ</Option>
                                            <Option value="2">ไม่พร้อมใช้งาน</Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        label="เพิ่มรูปภาพรถ"
                                        name="image_url"
                                        rules={[{ required: true, message: 'กรุณาอัปโหลดรูปภาพของรถ' }]}>
                                        <Upload
                                            listType="picture-card"
                                            maxCount={1}
                                            beforeUpload={beforeUpload}
                                            onChange={handleFileChange}
                                        >
                                            <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
                                        </Upload>
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            เพิ่มข้อมูลรถ
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

export default ResourceManagement;