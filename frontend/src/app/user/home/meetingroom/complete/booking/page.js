'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Typography, DatePicker, Divider, Button, Input, Modal, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from '../../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;
const { Text } = Typography;

export const MeetingRoomBooking = () => {
    const searchParams = useSearchParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const roomId = searchParams.get('roomId');
    const [roomDetails, setRoomDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        selectedTime: [],
        bookingNumber: '',
        bookingDate: '',
        username: '',
        purpose: '',
        department: '',
        attendees: ''
    });
    const [userFullName, setUserFullName] = useState('');
    const [department, setDepartment] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [unavailableTimes, setUnavailableTimes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`http://localhost:5182/api/users/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setUserFullName(data.full_name || '');
                        setDepartment(data.department || '');
                    } else {
                        console.error('Failed to fetch user');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        if (roomId) {
            const fetchRoomDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5182/api/rooms/${roomId}`);
                    if (!response.ok) {
                        throw new Error('ไม่สามารถดึงข้อมูลห้องประชุมได้');
                    }
                    const data = await response.json();
                    setRoomDetails(data);
                    setUnavailableTimes(data.unavailable_times || []);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchRoomDetails();
        }
    }, [roomId]);

    const handleChange = (e) => {
        const { name, value } = e.target || e;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ฟังก์ชันที่ใช้ในการเลือกเวลา
    const handleTimeSelect = (time) => {
        setFormData((prev) => {
            const isSelected = prev.selectedTime.includes(time);
            const updatedTimes = isSelected
                ? prev.selectedTime.filter((t) => t !== time) // ลบเวลาออก
                : [...prev.selectedTime, time]; // เพิ่มเวลาเข้าไป

            return {
                ...prev,
                selectedTime: updatedTimes,
            };
        });
    };


    const handleConfirm = async () => {
        if (!formData.purpose || !formData.department || !formData.attendees || !roomId) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
            return;
        }
        const bookingData = {
            booking_number: `BN${new Date().getTime()}`,
            room_id: roomId,
            full_name: userFullName || 'ไม่ได้ระบุ',
            booking_date: formData.bookingDate,
            purpose: formData.purpose,
            department: department || 'ไม่ได้ระบุ',
            attendees_count: formData.attendees ? parseInt(formData.attendees, 10) : null,
            booking_status: 1,
        };

        // ส่งข้อมูลไปยัง API
        axios.post('http://localhost:5182/api/bookings', bookingData)
            .then((response) => {
                if (response.status === 201) {
                    const confirmation_id = response.data.confirmation_id;
                    Modal.success({
                        title: 'การจองสำเร็จ!',
                        content: 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว',
                        onOk: () => {
                            router.push(`/user/home/meeting/complete/approve?confirmation_id=${confirmation_id}`);
                        },
                    });
                } else {
                    Modal.error({
                        title: 'การจองไม่สำเร็จ',
                        content: 'โปรดลองอีกครั้ง',
                    });
                }
            })
            .catch((error) => {
                console.error('Error booking room:', error.response?.data || error.message);
                Modal.error({
                    title: 'เกิดข้อผิดพลาด',
                    content: 'ไม่สามารถบันทึกข้อมูลได้',
                });
            });
    };

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;
    if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />
            <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                <Sidebar />
                <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 70px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: '#d9e8d2', borderRadius: '50%', marginRight: '10px' }}>
                            <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                        </div>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: '500', fontSize: '14px', color: '#666' }}>
                                    ระบบจองห้องประชุม
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>
                                    เลือกห้องประชุมที่ต้องการจอง
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Content
                        style={{
                            background: '#ffffff',
                            marginTop: '10px',
                            marginLeft: '50px',
                            padding: '20px',
                            borderRadius: '8px',
                        }}
                    >
                        <Title level={2} style={{ marginBottom: '24px', color: '#666' }}>
                            กรอกข้อมูลการจอง
                        </Title>
                        <div style={{ padding: '12px' }}>
                            <div style={{ width: "800px", display: 'flex', alignItems: 'center', border: '1px solid #E0E0E0', borderRadius: '12px', padding: '16px', backgroundColor: '#FFFFFF', margin: '0 auto', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                                <img
                                    src={roomDetails?.room_img ? `http://localhost:5182${roomDetails.room_img}` : null}
                                    alt="Room"
                                    style={{ width: '200px', height: '100px', borderRadius: '8px', objectFit: 'cover', marginRight: '16px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    {roomDetails ? (
                                        <>
                                            <Text style={{ fontSize: '18px', fontWeight: '600', color: '#2C3E50', marginBottom: '8px' }}>
                                                {roomDetails.room_name}
                                            </Text>
                                            <div style={{ fontSize: '14px', color: '#7F8C8D', lineHeight: '1.6' }}>
                                                <p style={{ margin: 0 }}>จำนวนที่นั่ง: {roomDetails.capacity}</p>
                                                <p style={{ margin: 0 }}>สถานที่: {roomDetails.location}</p>
                                                <p style={{ margin: 0 }}>อุปกรณ์: {roomDetails.equipment}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <Text style={{ fontSize: '14px', color: '#BDC3C7' }}>ข้อมูลห้องประชุมไม่พบ</Text>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Divider />
                        <DatePicker.RangePicker
                            format="YYYY-MM-DD"
                            value={startDate && endDate ? [startDate, endDate] : null}
                            onChange={(dates) => {
                                setStartDate(dates?.[0] || null);
                                setEndDate(dates?.[1] || null);
                                setFormData((prev) => ({
                                    ...prev,
                                    bookingDate: dates ? `${dates[0]?.format("YYYY-MM-DD")} - ${dates[1]?.format("YYYY-MM-DD")}` : ''
                                }));
                            }}
                            placeholder={["วันที่ต้องการจอง", "วันที่สิ้นสุดการจอง"]}
                            style={{ width: '90%' }}
                        />
                        <Divider />
                        <Title level={3} style={{ color: '#4D4D4D' }}>เลือกเวลาที่ต้องการจอง</Title>
                        {[['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'],
                        ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00']].map((times, sectionIndex) => (
                            <div key={sectionIndex} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {times.map((time, index) => {
                                        const isSelected = formData.selectedTime.includes(time);
                                        let buttonStyle = {
                                            borderRadius: '10px',
                                            width: '100px',
                                            height: '30px',
                                            fontWeight: 'bold',
                                            border: isSelected ? '2px solid' : '2px solid #ccc',
                                            backgroundColor: isSelected ? '#478D00' : '#ffffff',
                                            color: isSelected ? '#fff' : '#333',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        };
                                        return (
                                            <Button
                                                key={index}
                                                type={isSelected ? 'primary' : 'default'}
                                                style={buttonStyle}
                                                onClick={() => handleTimeSelect(time)}
                                            >
                                                {time}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        <Divider />
                        <div >
                            <h2
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '20px',
                                    marginBottom: '12px',
                                    color: '#4D4D4D',
                                    fontFamily: 'var(--font-kanit)',
                                    textTransform: 'uppercase',
                                }}
                            >
                                ข้อมูลของผู้จอง
                            </h2>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                                marginBottom: '16px',
                                margin: '20px 50px',
                            }}
                        >
                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>วันที่จอง</label>
                                <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                                    {formData.bookingDate}
                                </p>
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>เวลา</label>
                                <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                                    {formData.selectedTime.join(', ') || 'ยังไม่ได้เลือกเวลา'}
                                </p>
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>วัตถุประสงค์</label>
                                <Input
                                    name="objective"
                                    value={formData.objective}
                                    onChange={handleChange}
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>จำนวนผู้เข้าร่วม</label>
                                <Input
                                    type="number"
                                    name="capacity"
                                    placeholder="จำนวนผู้เข้าร่วมประชุม"
                                    onChange={handleChange}
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        marginBottom: '8px',
                                        color: '#4D4D4D',
                                    }}
                                >
                                    อุปกรณ์เสริม
                                </label>
                                <Select
                                    mode="multiple" // เปิดใช้งานการเลือกหลายรายการ
                                    allowClear // เพิ่มปุ่มสำหรับล้างค่า
                                    placeholder="เลือกอุปกรณ์เพิ่มเติม"
                                    value={formData.additionalEquipment}
                                    onChange={(value) => setFormData({ ...formData, additionalEquipment: value })}
                                    style={{ width: '100%', margin: '6px 0px', fontSize: '14px' }}
                                >
                                    <Select.Option value="โปรเจคเตอร์">โปรเจคเตอร์</Select.Option>
                                    <Select.Option value="กระดานไวท์บอร์ด">กระดานไวท์บอร์ด</Select.Option>
                                    <Select.Option value="ทีวีจอใหญ่">ทีวีจอใหญ่</Select.Option>
                                </Select>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                type="primary"
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    backgroundColor: '#478D00',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    padding: '10px 24px',
                                    fontSize: '14px',
                                    border: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0px 4px 12px rgba(0, 123, 62, 0.3)',
                                }}
                            >
                                ถัดไป
                            </Button>
                        </div>
                        <Modal
                            title={
                                <div
                                    style={{
                                        textAlign: 'center',
                                        color: '#029B36',
                                        fontWeight: 'bold',
                                        fontSize: '20px', // ขนาดเล็กลง
                                    }}
                                >

                                    ยืนยันการจอง
                                </div>
                            }
                            visible={isModalVisible}
                            onOk={handleConfirm}
                            onCancel={() => setIsModalVisible(false)}
                            centered
                            okText="ยืนยันการจอง"
                            cancelText="ยกเลิก"
                            width={400} // ความกว้างเล็กลง
                            style={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                            }}
                            bodyStyle={{
                                padding: '16px', // ระยะห่างภายในลดลง
                                fontFamily: 'var(--font-kanit)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '14px', // ขนาดข้อความเล็กลง
                                    lineHeight: '1.6', // ลดระยะห่างระหว่างบรรทัด
                                    color: '#4A4A4A',
                                }}
                            >
                                {[
                                    { label: 'ชื่อห้อง', value: roomDetails.room_name||'-' },
                                    { label: 'ช่วงเวลาที่จอง', value: formData.selectedTime?.join(', ') || '-' },
                                    { label: 'หัวข้อการประชุม', value: formData.objective || '-' },
                                    { label: 'จำนวนผู้เข้าร่วม', value: formData.capacity || '-' },
                                    { label: 'อุปกรณ์เสริม', value: formData.additionalEquipment?.join(', ') || 'ไม่มี' },
                                    { label: 'ชื่อผู้จอง', value: formData.username || '-' },
                                    { label: 'อีเมล', value: formData.email || '-' },
                                    { label: 'เบอร์โทรศัพท์', value: formData.contactNumber || '-' },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginBottom: '12px', // ลดระยะห่างด้านล่าง
                                            paddingBottom: '8px', // ลด padding
                                            borderBottom: index !== 7 ? '1px solid #E0E0E0' : 'none', // เส้นคั่นบาง
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '13px', // ปรับขนาดข้อความในแต่ละบรรทัด
                                            }}
                                        >
                                            <strong style={{ color: '#555', fontWeight: 'bold' }}>{item.label}:</strong>
                                            <span style={{ color: '#029B36', fontWeight: '500' }}>{item.value}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Modal>

                    </Content>
                </Layout>
            </Layout>
        </Layout >
    );
}

export default MeetingRoomBooking;
