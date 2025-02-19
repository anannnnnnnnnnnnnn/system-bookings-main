'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Typography, DatePicker, Divider, Button, Input, Modal, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from '../../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // เพิ่ม plugin สำหรับ utc
import timezone from "dayjs/plugin/timezone"; // เพิ่ม plugin สำหรับ timezone
import "dayjs/locale/th"; // ภาษาไทย

dayjs.extend(utc); // เพิ่มการใช้ plugin UTC
dayjs.extend(timezone); // เพิ่มการใช้ plugin Timezone
dayjs.locale("th"); // ตั้งค่า locale เป็นไทย

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
        returnDate: '',
        userFullName: '',  // เปลี่ยนจาก username เป็น userFullName
        department: '',
        meeting_topic: '',
        attendee_count: ''
    });

    const [userFullName, setUserFullName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [department, setDepartment] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [unavailableTimes, setUnavailableTimes] = useState([]);
    const router = useRouter();
    const formattedBookingDate = dayjs(formData.bookingDate).locale('th').format('D MMM YYYY');
    const formattedReturnDate = dayjs(formData.returnDate).locale('th').format('D MMM YYYY');

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

                        // ตั้งค่า userFullName ใน formData
                        setFormData((prev) => ({
                            ...prev,
                            userFullName: data.full_name || '',  // กำหนด userFullName ให้กับ formData
                            department: data.department || ''
                        }));
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
        console.log("Form Data:", formData); // ตรวจสอบค่าที่ส่งไป

        // ตรวจสอบว่ามีค่าครบถ้วนหรือไม่
        if (!formData.meeting_topic || !formData.department || !formData.attendee_count || !roomId) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
            return;
        }

        // ตรวจสอบและตั้งค่าให้กับ formData
        const bookingData = {
            roombooking_number: generateBookingNumber(),  // เพิ่มหมายเลขการจองที่สร้างเอง
            full_name: formData.userFullName || 'ไม่ได้ระบุ',
            room_id: roomId,
            booking_date: formData.bookingDate,
            return_date: formData.returnDate,
            meeting_topic: formData.meeting_topic || 'ไม่ได้ระบุ',
            attendee_count: formData.attendee_count ? parseInt(formData.attendee_count, 10) : 0,
            department: formData.department || 'ไม่ได้ระบุ',
            booking_times: formData.selectedTime.join(','),
            additional_equipment: formData.additionalEquipment || [],
            username: formData.userFullName || 'ไม่ได้ระบุ',
        };

        console.log("Sending Booking Data:", bookingData); // ตรวจสอบค่าที่จะส่งไป API

        // ส่งข้อมูลไปยัง API
        axios.post('http://localhost:5182/api/roombookings', bookingData)
            .then((response) => {
                console.log("API Response:", response); // ตรวจสอบข้อมูลที่ตอบกลับจาก API

                // ตรวจสอบว่า response สำเร็จหรือไม่
                if (response.status === 201 || response.status === 200) {
                    Modal.success({
                        title: 'การจองสำเร็จ!',
                        content: 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว',
                        onOk: () => {
                            // เมื่อกดปุ่ม OK ใน modal ให้ไปยังหน้าถัดไปโดยไม่ต้องส่งข้อมูลอะไรไป
                            router.push(`/user/home/meetingroom`);
                        },
                    });
                } else {
                    // ถ้า response ไม่ใช่ 201 หรือ 200
                    Modal.error({
                        title: 'การจองไม่สำเร็จ',
                        content: `โปรดลองอีกครั้ง (สถานะ API: ${response.status})`,
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

    // ฟังก์ชันสร้างหมายเลขการจอง
    const generateBookingNumber = () => {
        const timestamp = new Date().getTime(); // ใช้เวลาเป็นตัวแปร
        return `BN-${timestamp}`;  // รูปแบบการจองที่สร้างโดยใช้เวลาปัจจุบัน
    };


    if (loading) return <p>กำลังโหลดข้อมูล...</p>;
    if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

    const handleback = () => {
        router.push(`/user/home/meetingroom/complete`);
    };

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
                        <Title level={3} style={{ color: '#4D4D4D' }}>เลือกวันที่จองและคืน</Title>
                        <DatePicker.RangePicker
                            format="YYYY-MM-DD"
                            value={startDate && endDate ? [startDate, endDate] : null}
                            onChange={(dates) => {
                                setStartDate(dates?.[0] || null);
                                setEndDate(dates?.[1] || null);
                                setFormData((prev) => ({
                                    ...prev,
                                    bookingDate: dates?.[0]?.format("YYYY-MM-DD") || '',  // วันที่จอง
                                    returnDate: dates?.[1]?.format("YYYY-MM-DD") || ''   // วันที่คืน
                                }));
                            }}
                            placeholder={["วันที่ต้องการจอง", "วันที่สิ้นสุดการจอง"]}
                            style={{ width: '90%' }}
                            disabledDate={(current) => {
                                // Disable all dates before tomorrow
                                return current && current < dayjs().locale('th').tz("Asia/Bangkok").add(1, 'day').startOf('day');
                            }}
                            locale="th"  // ตั้งค่า locale เป็นไทย
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
                                margin: '20px 20px',
                            }}
                        >
                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>วันที่จองและคืน</label>
                                <p style={{ margin: '8px 0', fontSize: '14px', color: '#555' }}>
                                    {formattedBookingDate} ถึง {formattedReturnDate}
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
                                    name="meeting_topic"
                                    value={formData.meeting_topic}
                                    onChange={handleChange}
                                    style={{ fontSize: '14px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '14px' }}>จำนวนผู้เข้าร่วม</label>
                                <Input
                                    type="attendee_count"
                                    name="attendee_count"
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
                                onClick={handleback}  // เรียกใช้ handleback ฟังก์ชันโดยตรง
                                style={{
                                    backgroundColor: '#ffff',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    padding: '10px 24px',
                                    fontSize: '14px',
                                    border: '1px solid black',
                                    color: 'black',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                ย้อนกลับ
                            </Button>

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
                                        fontSize: '20px',
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
                            width={400}
                            style={{
                                borderRadius: '10px',
                                overflow: 'hidden',
                            }}
                            bodyStyle={{
                                padding: '16px',
                                fontFamily: 'var(--font-kanit)',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '14px',
                                    lineHeight: '1.6',
                                    color: '#4A4A4A',
                                }}
                            >
                                <Divider style={{ borderColor: '#E0E0E0', margin: '16px 0' }} />

                                {roomDetails && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid #E0E0E0',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            backgroundColor: '#FFFFFF',
                                            marginBottom: '16px',
                                            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        {/* รูปภาพรถ */}
                                        <img
                                            src={`http://localhost:5182${roomDetails.room_img}`}
                                            alt="Car"
                                            style={{
                                                width: '100px',
                                                height: '70px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                marginRight: '16px',
                                                border: '1px solid #E0E0E0',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                        {/* ข้อมูลรถ */}
                                        <div style={{ flex: 1 }}>
                                            <>
                                                <Text
                                                    style={{
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        color: '#2C3E50',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    {roomDetails.room_name}
                                                </Text>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#7F8C8D',
                                                        lineHeight: '1.6',
                                                    }}
                                                >
                                                    <p style={{ margin: 0 }}>อุปกรณ์ห้อง: {roomDetails.equipment}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {roomDetails.capacity} ที่นั่ง</p>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                )}
                                <Divider />

                                {[
                                    { label: 'ชื่อห้อง', value: roomDetails.room_name || '-' },
                                    { label: 'วันที่จอง', value: formData.bookingDate || '' },
                                    { label: 'วันที่คืน', value: formData.returnDate || '' },
                                    { label: 'ช่วงเวลาที่จอง', value: formData.selectedTime?.join(', ') || '-' },
                                    { label: 'หัวข้อการประชุม', value: formData.meeting_topic || '-' },
                                    { label: 'จำนวนผู้เข้าร่วม', value: formData.attendee_count || '-' },
                                    { label: 'อุปกรณ์เสริม', value: formData.additionalEquipment?.join(', ') || 'ไม่มี' },
                                    { label: 'ชื่อผู้จอง', value: userFullName || '-' },
                                    { label: 'แผนก', value: department || '-' },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            marginBottom: '12px',
                                            paddingBottom: '8px',
                                            borderBottom: index !== 5 ? '1px solid #E0E0E0' : 'none',
                                        }}
                                    >
                                        <p
                                            style={{
                                                margin: 0,
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '13px',
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
