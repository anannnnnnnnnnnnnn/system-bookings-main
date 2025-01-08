'use client';
import React from 'react';
import { Typography, Row, Col, Card } from 'antd';
import Navbar from './components/navbar';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;


const ScanMenuPage = () => {
    const router = useRouter();

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '30px 20px', position: 'relative' }}>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '80px' }}>
                <Title level={2} style={{ marginBottom: '40px', color: '#333' }}>
                    เลือกประเภทการสแกน QR Code
                </Title>
                <Row gutter={[16, 16]} justify="center">
                    {/* การ์ดสำหรับสแกนเพื่อรับรถ */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            onClick={() => router.push('/scan/pickup')} // นำทางไปยังหน้า Pickup
                            style={{
                                textAlign: 'center',
                                padding: '30px',
                                borderRadius: '16px',
                                backgroundColor: '#e8f5e9',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                            }}
                            bodyStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <Title level={3} style={{ color: '#4caf50' }}>
                                สแกนเพื่อรับรถ
                            </Title>
                            <Text style={{ fontSize: '16px', color: '#388e3c' }}>
                                เริ่มต้นการรับรถด้วยการสแกน QR Code
                            </Text>
                        </Card>
                    </Col>

                    {/* การ์ดสำหรับสแกนเพื่อคืนรถ */}
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            hoverable
                            onClick={() => router.push('/scan/return')} // นำทางไปยังหน้า Return
                            style={{
                                textAlign: 'center',
                                padding: '30px',
                                borderRadius: '16px',
                                backgroundColor: '#e0f7fa',
                                boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                            }}
                            bodyStyle={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            <Title level={3} style={{ color: '#00bfa5' }}>
                                สแกนเพื่อคืนรถ
                            </Title>
                            <Text style={{ fontSize: '16px', color: '#00796b' }}>
                                ดำเนินการคืนรถด้วยการสแกน QR Code
                            </Text>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ScanMenuPage;
