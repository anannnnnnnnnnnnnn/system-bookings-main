'use client';
import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import { Layout, Table, Button, Modal, Form, Input, Select,Image } from 'antd';

const { Content } = Layout;
const { Option } = Select;

function ResourceManagement() {
    const [data, setData] = useState([
        {
            key: '1',
            brand: 'Toyota',
            model: 'Corolla',
            color: 'White',
            equipment: 'GPS, Airbags',
            status: 'พร้อมใช้งาน',
        },
        {
            key: '2',
            brand: 'Honda',
            model: 'Civic',
            color: 'Black',
            equipment: 'Sunroof, Camera',
            status: 'ไม่พร้อมใช้งาน',
        },
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingRecord(null); // ล้างค่า editingRecord
        form.resetFields(); // รีเซ็ตค่าในฟอร์ม
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record); // ตั้งค่า editingRecord
        form.setFieldsValue(record); // เติมค่าฟอร์มด้วยข้อมูลของ record
        setIsModalVisible(true);
    };

    const handleDelete = (record) => {
        setData((prevData) => prevData.filter((item) => item.key !== record.key));
    };

    const handleSubmit = (values) => {
        if (editingRecord) {
            // แก้ไขข้อมูล
            setData((prevData) =>
                prevData.map((item) =>
                    item.key === editingRecord.key ? { ...item, ...values } : item
                )
            );
        } else {
            // เพิ่มข้อมูลใหม่
            const newKey = (data.length + 1).toString();
            setData([...data, { ...values, key: newKey }]);
        }
        setIsModalVisible(false);
    };

    const columns = [

        {
            title: 'NO',
            dataIndex: 'no',
            key: 'no',
        },

        {
            title: 'รูปรถ',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <Image src={image} width={100} alt="Car Image" />,
        },
        {
            title: 'รายละเอียดรถ',
            key: 'details',
            render: (record) => (
                <div style={{ lineHeight: '1.8' }}>
                    <strong>รุ่น/ยี่ห้อ:</strong> {record.brand} {record.model} <br />
                    <strong>สี:</strong> {record.color} <br />
                    <strong>อุปกรณ์:</strong> {record.equipment} <br />
                    <strong>สถานะ:</strong>{' '}
                    <span
                        style={{
                            backgroundColor: record.status === 'พร้อมใช้งาน' ? '#4caf50' : '#f44336',
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                        }}
                    >
                        {record.status}
                    </span>
                </div>
            ),
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        size="small"
                        style={{ background: '#029B36', color: '#fff',display: 'block' }}
                        onClick={() => handleEdit(record)}
                    >
                        แก้ไข
                    </Button>
                    <Button
                        type="link"
                        danger
                        style={{ color: 'black' }}
                        onClick={() => handleDelete(record)}
                    >
                        ลบ
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px' }}>
                    <Content
                        style={{
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
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
                                <h2>การจัดการทรัพยากร</h2>
                                <Button
                                    type="primary"
                                    style={{ background: '#029B36' }}
                                    onClick={handleAdd}
                                >
                                    เพิ่มข้อมูลรถ
                                </Button>
                            </div>
                            <Table columns={columns} dataSource={data} pagination={false} />

                            <Modal
                                title={editingRecord ? 'แก้ไขข้อมูลรถ' : 'เพิ่มข้อมูลรถ'}
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                footer={null}
                            >
                                <Form
                                    form={form} // เชื่อมฟอร์มกับ form instance
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label="ยี่ห้อ"
                                        name="brand"
                                        rules={[{ required: true, message: 'กรุณาใส่ยี่ห้อรถ' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="รุ่น"
                                        name="model"
                                        rules={[{ required: true, message: 'กรุณาใส่รุ่นรถ' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="สี"
                                        name="color"
                                        rules={[{ required: true, message: 'กรุณาใส่สีรถ' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item label="อุปกรณ์ภายใน" name="equipment">
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="สถานะ"
                                        name="status"
                                        rules={[{ required: true, message: 'กรุณาเลือกสถานะรถ' }]}
                                    >
                                        <Select>
                                            <Option value="พร้อมใช้งาน">พร้อมใช้งาน</Option>
                                            <Option value="ไม่พร้อมใช้งาน">ไม่พร้อมใช้งาน</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
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

export default ResourceManagement;
