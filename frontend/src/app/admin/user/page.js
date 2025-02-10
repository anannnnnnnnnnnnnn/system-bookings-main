'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Select, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { Option } = Select;

function UserManagement() {
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5182/api/users');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        setImageFile(null);
        setIsModalVisible(true);
    };

    const handleDelete = async (user_id) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าจะลบผู้ใช้นี้?')) {
            try {
                await axios.delete(`http://localhost:5182/api/users/${user_id}`);
                message.success('ลบข้อมูลสำเร็จ');
                fetchUsers();
            } catch (error) {
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            full_name: record.full_name,
            email: record.email,
            phone_number: record.phone_number,
            department: record.department,
            role: record.role,
        });
        setIsModalVisible(true);
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append('full_name', values.full_name);
        formData.append('email', values.email);
        formData.append('password_hash', values.password_hash);
        formData.append('phone_number', values.phone_number);
        formData.append('role', values.role);
        formData.append('department', values.department);
    
        if (imageFile) {
            formData.append('profile_picture', imageFile);
        }
    
        try {
            await axios.post('http://localhost:5182/api/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('User registered successfully');
        } catch (error) {
            console.error('Error:', error.response?.data);
            message.error('Registration failed');
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
            dataIndex: 'profile_picture',
            key: 'profile_picture',
            render: (image) => (
                <img src={image ? `http://localhost:5182${image}` : '/default-profile.png'}
                    alt="Profile"
                    style={{ width: 80, height: 60, objectFit: 'cover' }} />
            ),
        },
        {
            title: 'ชื่อผู้ใช้',
            dataIndex: 'full_name',
            key: 'full_name',
        },
        {
            title: 'อีเมล',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'เบอร์โทรศัพท์',
            dataIndex: 'phone_number',
            key: 'phone_number',
        },
        {
            title: 'บทบาท',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (role === 1 ? 'Admin' : 'User'),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button type="primary" onClick={() => handleEdit(record)} size="small">แก้ไข</Button>
                    <Button danger onClick={() => handleDelete(record.id)} size="small">ลบ</Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            
            <Layout style={{ padding: '0 50px', marginTop: '80px' }}>
             
                <Content style={{ padding: '24px', backgroundColor: '#fff' }}>
                    <h2>การจัดการผู้ใช้</h2>
                    <Button type="primary" onClick={handleAdd}>เพิ่มผู้ใช้</Button>
                    <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />
                    <Modal title={editingRecord ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                        <Form form={form} onFinish={handleSubmit} layout="vertical">
                            <Form.Item label="ชื่อผู้ใช้" name="full_name" rules={[{ required: true, message: 'กรุณากรอกชื่อผู้ใช้' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="อีเมล" name="email" rules={[{ required: true, message: 'กรุณากรอกอีเมล' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item label="รหัสผ่าน" name="password_hash" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item label="เบอร์โทรศัพท์" name="phone_number">
                                <Input />
                            </Form.Item>
                            <Form.Item label="แผนก" name="department">
                                <Input />
                            </Form.Item>
                            <Form.Item label="บทบาท" name="role" rules={[{ required: true, message: 'กรุณาเลือกบทบาท' }]}>
                                <Select>
                                    <Option value={1}>Admin</Option>
                                    <Option value={0}>User</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="อัปโหลดรูปโปรไฟล์">
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
export default UserManagement;
