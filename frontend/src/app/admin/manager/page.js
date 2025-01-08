'use client';
import React, { useState } from 'react';
import { Layout, Table, Button, Modal, Typography, Card } from 'antd';
import { useMediaQuery } from 'react-responsive';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const ManagerDashboard = () => {
    const [data, setData] = useState([
        {
            key: '1',
            name: 'Anan',
            reservationNumber: 'AAA0001',
            carType: 'Sedan',
            destination: 'ห้องประชุมจังหวัดพัทลุง',
            usageDate: '05 ก.พ. 67 - 05 ก.พ. 67',
            status: 'รออนุมัติ',
        },
        {
            key: '2',
            name: 'สมชาย ใจดี',
            reservationNumber: 'AAA0002',
            carType: 'SUV',
            destination: 'สำนักงานสาขาเชียงใหม่',
            usageDate: '10 ก.พ. 67 - 12 ก.พ. 67',
            status: 'อนุมัติ',
        },
        {
            key: '3',
            name: 'จารุวรรณ แสนดี',
            reservationNumber: 'AAA0003',
            carType: 'Sedan',
            destination: 'ธนาคารกรุงเทพ สาขาสุราษฎร์ธานี',
            usageDate: '08 ก.พ. 67 - 08 ก.พ. 67',
            status: 'รออนุมัติ',
        },
    ]);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const isMobile = useMediaQuery({ maxWidth: 768 });

    const handleApprove = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: 'อนุมัติ' } : item
            )
        );
    };

    const handleReject = (record) => {
        setSelectedRecord(record);
        setIsRejectModalVisible(true);
    };

    const handleRejectSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRecord.key ? { ...item, status: 'ไม่อนุมัติ' } : item
            )
        );
        setIsRejectModalVisible(false);
    };

    const handleRowClick = (record) => {
        setSelectedRecord(record);
        setIsDetailsModalVisible(true);
    };

    const columns = [
        {
            title: 'ชื่อพนักงาน',
            dataIndex: 'name',
            key: 'name',
            responsive: ['xs', 'sm', 'md', 'lg'], // แสดงในทุกหน้าจอ
        },
        {
            title: 'เลขที่ใบจอง',
            dataIndex: 'reservationNumber',
            key: 'reservationNumber',
            responsive: ['md', 'lg'], // แสดงเฉพาะหน้าจอขนาดกลางขึ้นไป
        },
        {
            title: 'สถานที่',
            dataIndex: 'destination',
            key: 'destination',
            responsive: ['lg'], // แสดงเฉพาะหน้าจอใหญ่
        },
        {
            title: 'วันที่ใช้งาน',
            dataIndex: 'usageDate',
            key: 'usageDate',
            responsive: ['md', 'lg'], // แสดงเฉพาะหน้าจอขนาดกลางขึ้นไป
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <Text
                    style={{
                        color: text === 'อนุมัติ' ? '#28a745' : text === 'รออนุมัติ' ? '#ffc107' : '#dc3545',
                        fontWeight: 'bold',
                        fontSize: isMobile ? '12px' : '14px',
                    }}
                >
                    {text}
                </Text>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // แสดงในทุกหน้าจอ
        },
        {
            title: 'การกระทำ',
            key: 'action',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    {record.status === 'รออนุมัติ' && (
                        <>
                            <Button
                                type="primary"
                                size={isMobile ? 'small' : 'middle'}
                                style={{
                                    backgroundColor: '#28a745',
                                    borderColor: '#28a745',
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(record);
                                }}
                            >
                                อนุมัติ
                            </Button>
                            <Button
                                type="primary"
                                size={isMobile ? 'small' : 'middle'}
                                danger
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(record);
                                }}
                            >
                                ไม่อนุมัติ
                            </Button>
                        </>
                    )}
                </div>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'], // แสดงในทุกหน้าจอ
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    background: '#28a745',
                    padding: '0 20px',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: isMobile ? '14px' : '18px',
                }}
            >
                <Title level={4} style={{ color: 'white', margin: 0, fontSize: 'inherit' }}>
                    Manager Dashboard
                </Title>
            </Header>

            <Content style={{ backgroundColor: '#f9f9f9', padding: isMobile ? '10px' : '20px' }}>
                <Card
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <Title level={3} style={{ textAlign: 'center', marginBottom: '20px', fontSize: isMobile ? '16px' : '20px' }}>
                        ระบบจัดการการจองรถยนต์
                    </Title>
                    <Table
                        columns={columns}
                        dataSource={data}
                        rowKey="key"
                        pagination={{ position: ['bottomCenter'] }}
                        size={isMobile ? 'small' : 'middle'}
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                            style: { cursor: 'pointer' },
                        })}
                    />
                </Card>
            </Content>

            <Modal
                title="เหตุผลในการไม่อนุมัติ"
                visible={isRejectModalVisible}
                onOk={handleRejectSubmit}
                onCancel={() => setIsRejectModalVisible(false)}
            >
                <textarea rows={4} style={{ width: '100%', padding: '10px' }} placeholder="กรุณากรอกเหตุผลในการไม่อนุมัติ" />
            </Modal>

            <Modal
                title="รายละเอียดการจอง"
                visible={isDetailsModalVisible}
                onCancel={() => setIsDetailsModalVisible(false)}
                footer={null}
            >
                {selectedRecord && (
                    <div>
                        <p><strong>ชื่อพนักงาน:</strong> {selectedRecord.name}</p>
                        <p><strong>เลขที่ใบจอง:</strong> {selectedRecord.reservationNumber}</p>
                        <p><strong>สถานที่:</strong> {selectedRecord.destination}</p>
                        <p><strong>วันที่ใช้งาน:</strong> {selectedRecord.usageDate}</p>
                        <p><strong>สถานะ:</strong> {selectedRecord.status}</p>
                    </div>
                )}
            </Modal>
        </Layout>
    );
};

export default ManagerDashboard;
