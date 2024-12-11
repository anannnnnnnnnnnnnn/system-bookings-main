'use client';
import React from 'react';
import { Row, Col, Card, Typography, Layout } from 'antd';
import { QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Navbar from '../admincar/component/navbar';

const { Title } = Typography;

const ScanPage = () => {
    const router = useRouter();

    const handlePickupScan = () => {
        router.push('/scan/pickup'); // ลิงก์ไปยังหน้าสแกนรับรถ
    };

    const handleReturnScan = () => {
        router.push('/scan/return'); // ลิงก์ไปยังหน้าสแกนคืนรถ
    };

    return (
        <Layout>
            <Navbar />
            <div
                style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#ffff',
                }}
            >
                <div
                    style={{
                        maxWidth: '600px',
                        width: '100%',
                        padding: '10px',
                        marginBottom: '150px',
                        backgroundColor: 'white',
                        borderRadius: '16px',
                    }}
                >
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '30px', color: '#595959' }}>
                        กรุณาเลือกระบบสแกนที่ต้องการ
                    </Title>
                    <Row gutter={[24, 24]} justify="center">
                        {/* ระบบสแกนรับรถ */}
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                onClick={handlePickupScan}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: '12px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                bodyStyle={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '20px',
                                }}
                            >
                                <QrcodeOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                <Title level={5} style={{ marginTop: '16px', color: '#1890ff' }}>
                                    สแกนรับรถ
                                </Title>
                            </Card>
                        </Col>
                        {/* ระบบสแกนคืนรถ */}
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                onClick={handleReturnScan}
                                style={{
                                    textAlign: 'center',
                                    borderRadius: '12px',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                bodyStyle={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '20px',
                                }}
                            >
                                <QrcodeOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                                <Title level={5} style={{ marginTop: '16px', color: '#52c41a' }}>
                                    สแกนคืนรถ
                                </Title>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </Layout>
    );
};

export default ScanPage;
