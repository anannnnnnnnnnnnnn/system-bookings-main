'use client'; // ทำให้ React ใช้งานใน client-side rendering
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/router
import { Result, Button, Layout, Modal, message, Divider, Typography, Form, Input } from 'antd';
import Sidebar from '../../components/sidebar';
import Navbar from '../../../navbar';
import Navigation from '../../components/navigation';

const { Content } = Layout;
const { Text } = Typography;

function BookingSuccess() {
    const [isModalVisible, setIsModalVisible] = useState(false); // ใช้ state เพื่อควบคุมการแสดงผลของ modal
    const [isBookingDetailsVisible, setIsBookingDetailsVisible] = useState(false); // State สำหรับแสดง Modal ของข้อมูลการจอง
    const [bookingDetails, setBookingDetails] = useState(null); // เก็บข้อมูลการจอง
    const [form] = Form.useForm(); // เพิ่มฟอร์มสำหรับ modal
    const router = useRouter();

    // ตัวอย่างข้อมูลการจองที่จะแสดงใน Modal
    const formData = {
        bookingNumber: '12345',
        selectedTime: ['09:00-10:00'],
        objective: 'ประชุมประจำปี',
        capacity: 10,
        additionalEquipment: ['โปรเจคเตอร์', 'กระดานไวท์บอร์ด'],
        username: 'นายสมชาย ใจดี',
        email: 'somchai@example.com',
        contactNumber: '0801234567',
    };

    const selectedRooms = [
        { name: 'ห้องประชุม A' },
        { name: 'ห้องประชุม B' },
    ];

    const handleConfirmBooking = () => {
        // การแสดงข้อความสำเร็จ
        message.success('การจองห้องประชุมสำเร็จ!');


        // แสดง Modal
        setIsModalVisible(true);
    };

    // ฟังก์ชันแสดงข้อมูลการจองใน Modal
    const handleShowBookingDetails = () => {
        setBookingDetails(formData); // กำหนดข้อมูลการจอง
        setIsBookingDetailsVisible(true); // เปิด modal ข้อมูลการจอง
    };

    const showModal = () => {
        setIsModalVisible(true); // แสดงปอปอัพ
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                console.log('ข้อมูลที่กรอก:', values);
                setIsModalVisible(false); // ปิดปอปอัพหลังจากกรอกข้อมูล
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalVisible(false); // ปิดปอปอัพ
    };
    const handleCancelBooking = () => {
        // แสดงยืนยันการยกเลิก
        Modal.confirm({
            title: 'คุณแน่ใจว่าต้องการยกเลิกการจอง?',
            content: 'การยกเลิกจะทำให้การจองห้องประชุมของคุณถูกยกเลิกอย่างถาวร',
            onOk: () => {
                // ลบข้อมูลการจอง (เชื่อมต่อกับ API หรือการเปลี่ยนแปลงสถานะในแอป)
                // ตัวอย่าง: setBookingDetails(null); หรือ API call
                message.success('การจองของคุณถูกยกเลิกแล้ว');
                // ปิด modal หรือกลับไปหน้าหลัก
                setIsBookingDetailsVisible(false);
                router.push('/users/home/meetingroom/complete'); // หรือหน้าอื่นที่คุณต้องการ
            },
            onCancel() {
                console.log('ยกเลิกการยืนยัน');
            },
        });
    };
    const handleNewBooking = () => {
        setIsBookingDetailsVisible(false);
        router.push('/users/home/meetingroom/complete'); // หรือหน้าอื่นที่คุณต้องการ

    };

    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#ffff' }}>
            {/* Navbar */}
            <Navbar />

            <Layout style={{ padding: '0px 49px', marginTop: '110px', backgroundColor: '#ffff' }}>
                {/* Sidebar */}

                {/* เนื้อหาหลัก */}
                <Layout style={{ padding: '0px 30px', backgroundColor: '#ffff' }}>
                    <Navigation />
                    <Content
                        style={{
                            marginTop: '21px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            // boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffff' }}>
                            <div style={{ padding: '50px' }}>
                                <Result
                                    status="success"
                                    title="การจองห้องประชุมสำเร็จ"
                                    subTitle="ห้องประชุมของคุณได้รับการจองเรียบร้อยแล้ว"
                                    extra={[
                                        <Button
                                            type="primary"
                                            key="console"
                                            onClick={handleNewBooking} // เรียกใช้ฟังก์ชัน handleConfirmBooking
                                            style={{
                                                backgroundColor: '#28a745', // สีเขียว
                                                borderColor: '#28a745', // สีขอบเขียว
                                            }}
                                        >
                                            จองห้องประชุมใหม่
                                        </Button>,
                                        <Button
                                            key="buy"
                                            onClick={handleShowBookingDetails} // เปิด Modal แสดงข้อมูลการจอง
                                            style={{
                                                backgroundColor: '#ffff', // สีเขียว
                                                borderColor: '#28a745', // สีขอบเขียว
                                                color: '#28a745',
                                            }}
                                        >
                                            ดูการจองทั้งหมด
                                        </Button>
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Modal สำหรับการแสดงข้อมูลการจอง */}
                        <Modal
                            title="ข้อมูลการจองห้องประชุม"
                            visible={isBookingDetailsVisible}
                            onCancel={() => setIsBookingDetailsVisible(false)} // ปิด Modal
                            footer={null}
                            width={400} // ลดความกว้างของ Modal
                            bodyStyle={{
                                padding: '16px', // ลด padding
                                backgroundColor: '#fff', // สีพื้นหลัง
                            }}
                            style={{
                                borderRadius: '8px', // มุมโค้ง
                            }}
                        >
                            <Divider style={{ margin: '0 0 12px 0', borderColor: '#e0e0e0' }} />
                            <div>
                                {/* แสดงข้อมูลการจองแบบมินิมอล */}
                                {[
                                    { label: 'ชื่อห้อง', value: selectedRooms.length > 0 ? selectedRooms.map(room => room.name).join(', ') : '-' },
                                    { label: 'รหัสการจอง', value: formData.bookingNumber || '-' },
                                    { label: 'ช่วงเวลาที่จอง', value: formData.selectedTime?.join(', ') || '-' },
                                    { label: 'หัวข้อการประชุม', value: formData.objective || '-' },
                                    { label: 'จำนวนผู้เข้าร่วม', value: formData.capacity || '-' },
                                    { label: 'อุปกรณ์เสริม', value: formData.additionalEquipment?.join(', ') || 'ไม่มี' },
                                    { label: 'ชื่อผู้จอง', value: formData.username || '-' },
                                    { label: 'อีเมล', value: formData.email || '-' },
                                    { label: 'เบอร์โทรศัพท์', value: formData.contactNumber || '-' },
                                ].map((item, index) => (
                                    <div key={index} style={{ marginBottom: '8px' }}>
                                        <Text strong style={{ fontSize: '14px' }}>{item.label}: </Text>
                                        <Text style={{ fontSize: '14px' }}>{item.value}</Text>
                                    </div>
                                ))}
                                <Divider style={{ margin: '12px 0', borderColor: '#e0e0e0' }} />
                                <div style={{ textAlign: 'center', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <Button
                                        type="primary"
                                        onClick={() => setIsBookingDetailsVisible(false)}
                                        style={{
                                            backgroundColor: '#28a745', // สีเขียว
                                            borderColor: '#28a745', // สีขอบเขียว
                                            borderRadius: '6px', // ลดมุมโค้ง
                                            fontWeight: '600', // ฟอนต์ตัวหนาปานกลาง
                                            padding: '10px 24px', // ขยายขนาดปุ่ม
                                            fontSize: '14px', // ขนาดฟอนต์
                                            transition: '0.3s ease',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // เพิ่มเงาให้ปุ่ม
                                        }}
                                    >
                                        ปิด
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={showModal}
                                        style={{
                                            backgroundColor: '#6c757d',
                                            borderColor: '#6c757d',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            padding: '10px 24px',
                                            fontSize: '14px',
                                            transition: '0.3s ease',
                                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        แก้ไขข้อมูล
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleCancelBooking}
                                        style={{
                                            backgroundColor: '#dc3545', // สีแดง
                                            borderColor: '#dc3545',
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            padding: '10px 24px',
                                            fontSize: '14px',
                                        }}
                                    >
                                        ยกเลิกการจอง
                                    </Button>
                                </div>
                            </div>
                        </Modal>

                        {/* Modal ที่จะแสดงข้อความเมื่อการจองสำเร็จ */}
                        <Modal
                            title="แก้ไขข้อมูล"
                            visible={isModalVisible}
                            onOk={handleOk}
                            onCancel={handleCancel}
                            okText="บันทึก"
                            cancelText="ยกเลิก"
                            destroyOnClose={true} // ปิดปอปอัพจะรีเซ็ทข้อมูลในฟอร์ม
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                name="edit_booking"
                                initialValues={{
                                    bookingName: '', // ใส่ค่าตั้งต้นหากต้องการ
                                    bookingDate: '', // ใส่ค่าตั้งต้นหากต้องการ
                                }}
                            >
                                <Form.Item
                                    name="bookingName"
                                    label="ชื่อผู้จอง"
                                    rules={[{ required: true, message: 'กรุณากรอกชื่อผู้จอง!' }]}
                                >
                                    <Input placeholder="กรุณากรอกชื่อผู้จอง" />
                                </Form.Item>
                                <Form.Item
                                    name="bookingDate"
                                    label="วันที่จอง"
                                    rules={[{ required: true, message: 'กรุณากรอกวันที่จอง!' }]}
                                >
                                    <Input placeholder="กรุณากรอกวันที่จอง" />
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default BookingSuccess;
