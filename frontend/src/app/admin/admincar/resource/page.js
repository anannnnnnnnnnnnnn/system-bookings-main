'use client';
import React, { useState } from 'react';
import Sidebar from '../component/sidebar';
import Navbar from '../component/navbar';
import Navigation from '../component/navigation';
import { Layout, Table, Button, Modal, Form, Input, Select, Tag, Image, previewImage, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;

function ResourceManagement() {
    const [data, setData] = useState([
        {
            key: '1',
            no: '1',
            brand: 'MITSUBISHI',
            type: 'รถแวนด์',
            license: 'กค 7137 ม.ค.',
            seats: '5',
            fuel: 'ดีเซล',
            responsiblePerson: 'นายวันอัสร์ เจ๊ะหะ',
            status: 'ใช้งานปกติ',
            image: 'https://via.placeholder.com/100', // ตัวอย่างรูปภาพ
        },
        {
            key: '2',
            no: '2',
            brand: 'TOYOTA',
            type: 'รถเก๋ง',
            license: 'กค 8125 ม.ค.',
            seats: '4',
            fuel: 'เบนซิน',
            responsiblePerson: 'นางสาวมลฤดี อินทร์สุข',
            status: 'ต้องซ่อมบำรุง',
            image: 'https://via.placeholder.com/100', // ตัวอย่างรูปภาพ
        },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [previewImage, setPreviewImage] = useState(null);

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
            title: 'รูปรถ',
            dataIndex: 'image',
            key: 'image',
            render: (image) => (
                <div style={{ textAlign: 'center' }}>
                    <Image
                        src={image}
                        width={200} // ปรับขนาดของรูปภาพที่แสดง
                        alt="Car Image"
                        style={{ borderRadius: '8px' }} // เพิ่มการตกแต่งให้ภาพดูสวยงาม
                    />
                </div>
            ),
            width: '25%', // เพิ่มความกว้างของแถว
        },
        {
            title: 'รายละเอียดรถ',
            key: 'details',
            render: (record) => (
                <div style={{ lineHeight: '1.8' }}>
                    <strong>รุ่น/ยี่ห้อ:</strong> {record.brand} <br />
                    <strong>ประเภท:</strong> {record.type} <br />
                    <strong>ทะเบียน:</strong> {record.license} <br />
                    <strong>จำนวนที่นั่ง:</strong> {record.seats} ที่นั่ง <br />
                    <strong>เชื้อเพลิง:</strong> {record.fuel} <br />
                    <strong>ผู้รับผิดชอบ:</strong> {record.responsiblePerson} <br />
                    <strong>สถานะ:</strong>{' '}
                    <Tag color={record.status === 'ใช้งานปกติ' ? 'green' : 'red'}>
                        {record.status}
                    </Tag>
                </div>
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
                        style={{
                            background: '#029B36',
                            border: 'none',
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
                        แก้ไข
                    </Button>
                    <Button danger onClick={() => handleDelete(record)} size="small"
                        style={{
                            transition: 'all 0.3s ease',
                            transform: 'scale(1)', // ขนาดปกติ
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.2)'; // ขยายขนาดมากขึ้นเมื่อเมาส์ไปวาง
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)'; // ย่อขนาดกลับเมื่อเมาส์ออก
                        }}
                    >
                        ลบ
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
        <Navbar/>
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
                            <Table columns={columns} dataSource={data} pagination={false} />
                            <Modal
                                title={editingRecord ? 'แก้ไขข้อมูลรถ' : 'เพิ่มข้อมูลรถ'}
                                visible={isModalVisible}
                                onCancel={() => setIsModalVisible(false)}
                                footer={null}
                                centered
                                width={800} // เพิ่มความกว้าง
                                bodyStyle={{ padding: '24px', background: '#f7f7f7', borderRadius: '12px' }}
                            >
                                <Form
                                    form={form}
                                    onFinish={handleSubmit}
                                    layout="vertical"
                                    style={{
                                        background: '#fff',
                                        padding: '20px',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        {/* คอลัมน์ซ้าย */}
                                        <div style={{ flex: 1 }}>
                                            <Form.Item
                                                label="รุ่น/ยี่ห้อ"
                                                name="brand"
                                                rules={[{ required: true, message: 'กรุณาใส่รุ่น/ยี่ห้อรถ' }]}
                                            >
                                                <Input placeholder="เช่น TOYOTA, HONDA" allowClear />
                                            </Form.Item>
                                            <Form.Item
                                                label="ประเภท"
                                                name="type"
                                                rules={[{ required: true, message: 'กรุณาใส่ประเภทของรถ' }]}
                                            >
                                                <Input placeholder="เช่น รถเก๋ง, รถแวน" allowClear />
                                            </Form.Item>
                                            <Form.Item
                                                label="ทะเบียน"
                                                name="license"
                                                rules={[{ required: true, message: 'กรุณาใส่ทะเบียนรถ' }]}
                                            >
                                                <Input placeholder="เช่น กจ 1234 กทม" allowClear />
                                            </Form.Item>
                                            <Form.Item
                                                label="จำนวนที่นั่ง"
                                                name="seats"
                                                rules={[{ required: true, message: 'กรุณาใส่จำนวนที่นั่ง' }]}
                                            >
                                                <Input type="number" placeholder="เช่น 5" min={1} max={20} />
                                            </Form.Item>
                                        </div>
                                        {/* คอลัมน์ขวา */}
                                        <div style={{ flex: 1 }}>
                                            <Form.Item
                                                label="เชื้อเพลิง"
                                                name="fuel"
                                                rules={[{ required: true, message: 'กรุณาใส่ประเภทเชื้อเพลิง' }]}
                                            >
                                                <Input placeholder="เช่น ดีเซล, เบนซิน, ไฟฟ้า" allowClear />
                                            </Form.Item>
                                            <Form.Item
                                                label="ผู้รับผิดชอบ"
                                                name="responsiblePerson"
                                                rules={[{ required: true, message: 'กรุณาใส่ชื่อผู้รับผิดชอบ' }]}
                                            >
                                                <Input placeholder="ชื่อผู้รับผิดชอบ" allowClear />
                                            </Form.Item>
                                            <Form.Item
                                                label="สถานะ"
                                                name="status"
                                                rules={[{ required: true, message: 'กรุณาเลือกสถานะรถ' }]}
                                            >
                                                <Select placeholder="เลือกสถานะ">
                                                    <Option value="ใช้งานปกติ">ใช้งานปกติ</Option>
                                                    <Option value="ต้องซ่อมบำรุง">ต้องซ่อมบำรุง</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="เพิ่มรูปภาพรถ"
                                                name="image"
                                                rules={[{ required: true, message: 'กรุณาอัปโหลดรูปภาพของรถ' }]}
                                            >
                                                <Upload
                                                    listType="text" // ไม่แสดงตัวอย่างรูปภาพ
                                                    maxCount={1} // จำกัดให้เลือกรูปได้เพียง 1 รูป
                                                    beforeUpload={(file) => {
                                                        const isImage = file.type.startsWith('image/');
                                                        const isSmallEnough = file.size / 1024 / 1024 < 2; // จำกัดขนาดไฟล์ < 2MB
                                                        if (!isImage) {
                                                            Modal.error({ title: 'ไฟล์ที่เลือกไม่ใช่รูปภาพ' });
                                                            return false;
                                                        }
                                                        if (!isSmallEnough) {
                                                            Modal.error({ title: 'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 2MB' });
                                                            return false;
                                                        }
                                                        // อนุญาตให้อัปโหลดไฟล์ต่อไปโดยไม่แสดงตัวอย่าง
                                                        return false;
                                                    }}
                                                >
                                                    <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
                                                </Upload>
                                            </Form.Item>


                                        </div>
                                    </div>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            block
                                            style={{
                                                borderRadius: '8px',
                                                backgroundColor: '#029B36',
                                                borderColor: '#029B36',
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

export default ResourceManagement;
