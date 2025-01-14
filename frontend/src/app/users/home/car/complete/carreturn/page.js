'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Layout, Typography, Card, Space, Button, Divider, Alert, Modal, Form, Input, Row, Col } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../../navbar';
import { Content } from 'antd/lib/layout/layout';

const { Title, Text } = Typography;

function CarReturn() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [bookingData, setBookingData] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const bookingDataParam = searchParams.get('bookingData');
        if (bookingDataParam) {
            try {
                setBookingData(JSON.parse(bookingDataParam));
            } catch (error) {
                console.error('ข้อมูลการจองไม่ถูกต้อง', error);
            }
        }
    }, [searchParams]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleModalOk = () => {
        form.validateFields()
            .then((values) => {
                setLoading(true);
                setStatus('กำลังดำเนินการคืนรถ...');
                console.log('ข้อมูลที่กรอกในฟอร์ม:', values);

                setIsModalOpen(false); // ปิด Modal
            })
            .catch((info) => {
                console.error('ฟอร์มไม่สมบูรณ์:', info);
            });
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
    };

    const handleAdminComplete = () => {
        setLoading(false);
        setStatus('การคืนรถสำเร็จ! ขอบคุณที่ใช้บริการ');
    };

    const handleBackToStart = () => {
        router.push('/users/home/car/complete');
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Layout style={{ padding: '0px 20px', marginTop: '20px' }}>
                <Sidebar />
                <Layout style={{ padding: '0px 20px' }}>
                    <Content
                        style={{
                            padding: '30px',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <Title level={3}>หน้าคืนรถ</Title>
                            <Divider style={{ margin: '10px 0' }} />
                            {status && (
                                <Alert
                                    message={status}
                                    type={loading ? 'info' : 'success'}
                                    showIcon
                                    style={{ marginBottom: '15px' }}
                                />
                            )}
                            <Divider style={{ margin: '10px 0' }} />
                            {bookingData ? (
                                <Card
                                    title="ข้อมูลการจอง"
                                    bordered={false}
                                    style={{
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        marginBottom: '15px',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <img
                                                src={bookingData.carImage || '/default-car-image.jpg'}
                                                alt="Car"
                                                style={{
                                                    width: '200px',
                                                    height: '120px',
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Text strong>ทะเบียนรถ:</Text> {bookingData.licensePlate} <br />
                                                <Text strong>ประเภทรถ:</Text> {bookingData.carType} <br />
                                                <Text strong>วันที่ใช้รถ:</Text> {bookingData.startDate} <br />
                                                <Text strong>ถึงวันที่:</Text> {bookingData.endDate} <br />
                                            </div>
                                        </div>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <div>
                                            <Text strong>เลขที่ใบจอง:</Text> {bookingData.bookingNumber || 'N/A'} <br />
                                            <Text strong>จุดประสงค์:</Text> {bookingData.purpose || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>ปลายทาง:</Text> {bookingData.destination || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>จำนวนผู้โดยสาร:</Text> {bookingData.passengers || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>แผนก:</Text> {bookingData.department || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>เบอร์ติดต่อ:</Text> {bookingData.contactNumber || 'ไม่ได้ระบุ'} <br />
                                            <Text strong>พนักงานขับรถ:</Text>{' '}
                                            {bookingData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ'}
                                        </div>
                                    </Space>
                                </Card>
                            ) : (
                                <p>ไม่พบข้อมูลการจอง</p>
                            )}
                            <Divider style={{ margin: '10px 0' }} />
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    onClick={handleOpenModal}
                                    style={{ borderRadius: '8px', marginRight: '10px' }}
                                >
                                    ยืนยันการคืนรถ
                                </Button>
                                <Button
                                    type="dashed"
                                    onClick={handleBackToStart}
                                    style={{ borderRadius: '8px' }}
                                >
                                    ย้อนกลับไปหน้าเริ่มต้นการจอง
                                </Button>
                            </div>
                            <Divider style={{ margin: '10px 0' }} />
                            <div style={{ textAlign: 'center' }}>
                                <Button
                                    type="default"
                                    onClick={handleAdminComplete}
                                    style={{ marginTop: '10px', borderRadius: '8px' }}
                                    disabled={!loading} // ปุ่มนี้จะใช้งานได้เฉพาะเมื่อกำลังโหลด
                                >
                                    แอดมินยืนยันการคืนรถ
                                </Button>
                            </div>

                            {/* Modal สำหรับการคืนรถ */}
                            <Modal
                                title={<Title level={4}>แบบฟอร์มการคืนรถ</Title>}
                                open={isModalOpen}
                                onOk={handleModalOk}
                                onCancel={handleModalCancel}
                                okText="ยืนยัน"
                                cancelText="ยกเลิก"
                                confirmLoading={loading}
                                centered
                                bodyStyle={{ padding: '20px 30px' }}
                                width={600}
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    style={{ rowGap: '10px' }} // ลดระยะห่างระหว่าง Form.Item
                                >
                                    {/* วันที่และเวลาคืนรถ */}
                                    <Row gutter={[12, 12]}> {/* ลดค่า gutter */}
                                        <Col span={12}>
                                            <Form.Item
                                                name="returnDate"
                                                label="วันที่คืนรถ"
                                                rules={[{ required: true, message: 'กรุณาระบุวันที่คืนรถ' }]}
                                                style={{ marginBottom: '10px' }} // ลด margin-bottom
                                            >
                                                <Input type="date" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="returnTime"
                                                label="เวลาคืนรถ"
                                                rules={[{ required: true, message: 'กรุณาระบุเวลาคืนรถ' }]}
                                                style={{ marginBottom: '10px' }}
                                            >
                                                <Input type="time" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* สภาพรถและเลขไมล์ */}
                                    <Row gutter={[12, 12]}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="carCondition"
                                                label="สภาพรถ"
                                                rules={[{ required: true, message: 'กรุณาระบุสภาพรถ' }]}
                                                style={{ marginBottom: '10px' }}
                                            >
                                                <Input placeholder="กรุณาระบุสภาพรถ" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="mileage"
                                                label="เลขไมล์"
                                                rules={[{ required: true, message: 'กรุณาระบุเลขไมล์' }]}
                                                style={{ marginBottom: '10px' }}
                                            >
                                                <Input type="number" placeholder="กรุณาระบุเลขไมล์" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/* ระดับน้ำมัน */}
                                    <Row gutter={[12, 12]}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="fuelLevel"
                                                label="ระดับน้ำมัน"
                                                rules={[{ required: true, message: 'กรุณาระบุระดับน้ำมัน' }]}
                                                style={{ marginBottom: '10px' }}
                                            >
                                                <Input placeholder="กรุณาระบุระดับน้ำมัน เช่น 50%" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    
                                    {/* หมายเหตุเพิ่มเติม */}
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item
                                                name="remarks"
                                                label="หมายเหตุเพิ่มเติม"
                                                style={{ marginBottom: '10px' }}
                                            >
                                                <Input.TextArea rows={3} placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default CarReturn;