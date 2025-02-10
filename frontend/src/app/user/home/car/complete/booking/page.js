'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb, Typography, DatePicker, Divider, Button, Input, Radio, Modal, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons'; // อย่าลืม import HomeOutlined
import Sidebar from '../../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation'; // Add this line
import axios from 'axios'; // Add this line at the top of the file
import moment from 'moment';


const { Option } = Select;
const { Content } = Layout; // เพิ่มการ import Content
const { Title } = Typography;
const { Text } = Typography; // ใช้ Text จาก Typography
const { TextArea } = Input;  // คำสั่งนี้จะแก้ไขการใช้งาน TextArea

export const CarBooking = () => {
    const searchParams = useSearchParams();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const carId = searchParams.get('carId'); // ดึง carId จาก query parameter
    const [carDetails, setCarDetails] = useState(null); // สำหรับเก็บข้อมูลรถ
    const [loading, setLoading] = useState(true); // สำหรับสถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // สำหรับเก็บข้อผิดพลาด
    const [formData, setFormData] = useState({
        selectedTime: [],
        bookingNumber: '',
        bookingDate: '',
        username: '',
        purpose: '',
        destination: '',
        passengers: '',
        driverRequired: '',
        booking_time: '',
        return_time: '',
    });

    const [userFullName, setUserFullName] = useState('');
    const [userPosition, setUserPosition] = useState('');
    const [department, setDepartment] = useState('');

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const router = useRouter();  // ใช้ useRouter

    const unavailableTimes = ['']; // ตัวอย่างเวลาไม่พร้อมใช้งาน

    const handleTimeSelect = (time) => {
        setFormData((prev) => {
            const selected = prev.selectedTime;
            if (selected.includes(time)) {
                // ลบเวลาออกหากเลือกซ้ำ
                return { ...prev, selectedTime: selected.filter((t) => t !== time) };
            } else if (selected.length < 2) {
                // เพิ่มเวลาหากยังไม่เกิน 2
                const newSelectedTime = [...selected, time];
                if (newSelectedTime.length === 1) {
                    // เมื่อเลือกเวลาแรกให้เป็น startTime
                    setStartTime(time);
                } else if (newSelectedTime.length === 2) {
                    // เมื่อเลือกเวลา 2 ให้เป็น endTime
                    setEndTime(time);
                }
                return { ...prev, selectedTime: newSelectedTime };
            }
            return prev;
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target || e;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    useEffect(() => {
        const fetchUserData = async () => {
            // ดึง userId จาก localStorage หรือจาก state ที่เก็บข้อมูล
            const userId = localStorage.getItem('userId');  // หรือใช้ sessionStorage หรือ state

            if (userId) {
                try {
                    const response = await fetch(`http://localhost:5182/api/users/${userId}`);  // ดึงข้อมูลจาก API โดยใช้ userId
                    if (response.ok) {
                        const data = await response.json();
                        setUserFullName(data.full_name || '');  // เก็บชื่อผู้ใช้
                        setDepartment(data.department || '');  // เก็บแผนก
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
        if (carId) {
            // ดึงข้อมูลจาก API โดยใช้ carId
            const fetchCarDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5182/api/cars/${carId}`);
                    if (!response.ok) {
                        throw new Error('ไม่สามารถดึงข้อมูลรถได้');
                    }
                    const data = await response.json();
                    setCarDetails(data); // เก็บข้อมูลรถ
                } catch (error) {
                    setError(error.message); // หากเกิดข้อผิดพลาด
                } finally {
                    setLoading(false); // ปิดสถานะการโหลด
                }
            };
            fetchCarDetails();
        }
    }, [carId]);
    const createDateTime = (date, time) => {
        if (!date || !time) return null;
        if (typeof date !== 'string') {
            date = date.toISOString().split('T')[0];
        }
        const [hours, minutes] = time.split(':');
        if (!hours || !minutes) return null;
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day, hours, minutes);
    };

    if (loading) return <p>กำลังโหลดข้อมูล...</p>;
    if (error) return <p>เกิดข้อผิดพลาด: {error}</p>;

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleDateString('th-TH') : ''; // ตรวจสอบว่า date มีค่าไหม
    };

    const handleConfirm = async () => {
        // เพิ่มการ log เพื่อตรวจสอบค่าของตัวแปรก่อน
        console.log(formData.purpose, formData.destination, startDate, formData.booking_time, endDate, formData.return_time, carId);

        const startTimeValid = createDateTime(startDate, formData.booking_time);
        const endTimeValid = createDateTime(endDate, formData.return_time);

        if (isNaN(startTimeValid.getTime()) || isNaN(endTimeValid.getTime()) || startTimeValid >= endTimeValid) {
            alert('กรุณาตรวจสอบวันที่และเวลาให้ถูกต้อง!');
            return;
        }

        const generateBookingNumber = () => {
            const now = new Date();
            return `BN${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        };

        const bookingData = {
            booking_number: generateBookingNumber(),
            car_id: carId,
            full_name: userFullName || 'ไม่ได้ระบุ',
            booking_date: startDate,
            booking_time: formData.booking_time ? formData.booking_time + ':00' : null,
            return_date: endDate,
            return_time: formData.return_time ? formData.return_time + ':00' : null,
            purpose: formData.purpose,
            destination: formData.destination,
            passenger_count: formData.passengers ? parseInt(formData.passengers, 10) : null,
            department: department || 'ไม่ได้ระบุ',
            driver_required: formData.driverRequired === 'yes' ? 1 : 0,
            booking_status: 1,
        };

        // ส่งข้อมูลไปยัง API
        axios.post('http://localhost:5182/api/bookings', bookingData)
            .then((response) => {
                if (response.status === 201) {
                    const confirmation_id = response.data.confirmation_id; // รับ confirmation_id จาก Response
                    console.log('Confirmation ID:', confirmation_id); // เพิ่ม log ที่นี่เพื่อดูค่า confirmation_id
                    Modal.success({
                        title: 'การจองสำเร็จ!',
                        content: 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว',
                        onOk: () => {
                            // ส่ง confirmation_id ไปยัง URL
                            console.log('Redirecting with confirmation_id:', confirmation_id); // เพิ่ม log ก่อน redirect
                            router.push(`/user/home/car/complete/approve?confirmation_id=${confirmation_id}`);
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
                console.error('Error booking car:', error.response?.data || error.message);
                const errorMessage = error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้';

                if (errorMessage === "Car is not available for booking.") {
                    Modal.error({
                        title: 'การจองไม่สำเร็จ',
                        content: 'ขออภัย, รถคันนี้ไม่สามารถจองได้ในเวลานี้',
                    });
                } else {
                    Modal.error({
                        title: 'เกิดข้อผิดพลาด',
                        content: errorMessage,
                    });
                }
            });
    };

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            {/* Navbar */}
            <Navbar />

            {/* Layout หลักของหน้า */}
            <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Layout ด้านขวาหลัก */}
                <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                    {/* Breadcrumb */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center', // จัดให้อยู่กลางแนวตั้ง
                            margin: '0 70px',
                        }}
                    >
                        {/* ไอคอนหลัก */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#d9e8d2', // สีพื้นหลังไอคอน
                                borderRadius: '50%', // รูปทรงกลม
                                marginRight: '10px', // ระยะห่างระหว่างไอคอนและข้อความ
                            }}
                        >
                            <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                        </div>

                        {/* Breadcrumb */}
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#666', // สีข้อความหลัก
                                    }}
                                >
                                    ระบบจองรถ
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#666', // สีข้อความรอง
                                    }}
                                >
                                    เลือกรถที่ต้องการจอง
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span
                                    style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#333', // สีข้อความรอง
                                    }}
                                >
                                    กรอกรายละเอียกการจอง
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {/* Content */}
                    <Content
                        style={{
                            background: '#ffffff', // พื้นหลังสีขาว
                            marginTop: '10px',
                            marginLeft: '50px',
                            padding: '20px',
                            borderRadius: '8px',
                        }}
                    >
                        {/* เนื้อหาที่คุณต้องการแสดง */}
                        <Title
                            level={2}
                            style={{
                                marginBottom: '24px',
                                color: '#666',
                            }}
                        >
                            กรอกข้อมูลการจอง
                        </Title>
                        <div style={{ padding: '12px' }}>
                            <div
                                style={{
                                    width: "800px",
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid #E0E0E0',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    backgroundColor: '#FFFFFF',
                                    margin: '0 auto',  // ทำให้กล่องอยู่ตรงกลาง
                                    marginBottom: '16px',
                                    transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <img
                                    src={carDetails?.image_url ? `http://localhost:5182${carDetails.image_url}` : null}
                                    alt="Car"
                                    style={{
                                        width: '200px',
                                        height: '100px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        marginRight: '16px',
                                        border: '1px solid #E0E0E0',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    {carDetails ? (
                                        <>
                                            <Text
                                                style={{
                                                    fontSize: '18px',
                                                    fontWeight: '600',
                                                    color: '#2C3E50',
                                                    marginBottom: '8px',
                                                }}
                                            >
                                                {carDetails.brand}
                                            </Text>
                                            <div
                                                style={{
                                                    fontSize: '14px',
                                                    color: '#7F8C8D',
                                                    lineHeight: '1.6',
                                                }}
                                            >
                                                <p style={{ margin: 0 }}>รถรุ่น: {carDetails.model}</p>
                                                <p style={{ margin: 0 }}>ป้ายทะเบียน: {carDetails.license_plate}</p>
                                                <p style={{ margin: 0 }}>จำนวนที่นั่ง: {carDetails.seating_capacity} ที่นั่ง</p>
                                            </div>
                                        </>
                                    ) : (
                                        <Text style={{ fontSize: '14px', color: '#BDC3C7' }}>ข้อมูลรถไม่พบ</Text>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* ส่วนการดึงรถมาแสดง */}

                        <Divider />
                        <div style={{ flex: 1, minWidth: '100px' }}>
                            <Title style={{
                                marginBottom: '16px',
                                fontWeight: 'bold',
                                fontSize: '20px',
                                color: '#4D4D4D'
                            }}>เวลาที่การจอง</Title>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', margin: '0 50px' }}>
                            <DatePicker.RangePicker
                                format="YYYY-MM-DD"
                                value={startDate && endDate ? [startDate, endDate] : null}
                                onChange={(dates) => {
                                    if (dates) {
                                        setStartDate(dates[0]);
                                        setEndDate(dates[1]);
                                    } else {
                                        setStartDate(null);
                                        setEndDate(null);
                                    }
                                }}
                                placeholder={["วันที่ต้องการจอง", "วันที่สิ้นสุดการจอง"]}
                                style={{ flexGrow: 1 }} // ใช้ flexGrow เพื่อให้มันขยายเต็มพื้นที่ที่เหลือ
                                disabledDate={(current) => current && current < moment().endOf('day')} // ไม่ให้เลือกวันก่อนวันนี้
                            />
                        </div>

                        {/* ในส่วนเลือกวันที่ */}
                        <div style={{ margin: '20px' }}>
                            <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-between' }}>
                                {/* Dropdown เลือกเวลาจอง */}
                                <Select
                                    style={{ flexGrow: 1 }} // ทำให้ dropdown นี้ขยายเต็มพื้นที่
                                    placeholder="เลือกเวลาจอง"
                                    onChange={(value) => {
                                        console.log("เลือกเวลาจอง:", value); // Debug
                                        setFormData((prev) => ({ ...prev, booking_time: value, return_time: null }));
                                    }}
                                    value={formData.booking_time || undefined}
                                >
                                    {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => (
                                        <Option key={time} value={time}>
                                            {time}
                                        </Option>
                                    ))}
                                </Select>

                                {/* Dropdown เลือกเวลาคืน */}
                                <Select
                                    style={{ flexGrow: 1 }} // ทำให้ dropdown นี้ขยายเต็มพื้นที่
                                    placeholder="เลือกเวลาคืน"
                                    onChange={(value) => setFormData({ ...formData, return_time: value })}
                                    value={formData.return_time || undefined}
                                    disabled={!formData.booking_time} // ปิดการใช้งานจนกว่าจะเลือกเวลาจองก่อน
                                >
                                    {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
                                        .filter((time) => !formData.booking_time || time > formData.booking_time) // แสดงเฉพาะเวลาที่มากกว่าเวลาจอง
                                        .map((time) => (
                                            <Option key={time} value={time}>
                                                {time}
                                            </Option>
                                        ))}
                                </Select>
                            </div>
                        </div>
                        {/* ส่วนเลือกเวลา */}

                        <Title level={2} style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '20px', fontSize: '24px' }}>
                            กรอกรายละเอียดการจอง
                        </Title>
                        <div style={{ maxWidth: '700px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', justifyContent: 'center', margin: '0 100px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการจอง</label>
                                <Input value={`${formatDate(startDate)} ${formData.booking_time || ''}`} disabled />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการคืน</label>
                                <Input value={`${formatDate(endDate)}  ${formData.return_time || ''}`} disabled />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                                <Input value={userFullName || ''} disabled />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>ตำแหน่ง/แผนก</label>
                                <Input value={department || ''} disabled />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>จุดประสงค์การใช้งาน</label>
                                <TextArea name="purpose" rows={2} placeholder="กรุณาระบุจุดประสงค์" onChange={handleChange} style={{ height: '30px' }} />
                            </div>
                            <div>
                                <label style={{ fontWeight: 'bold' }}>ปลายทาง</label>
                                <TextArea
                                    name="destination"
                                    placeholder="กรุณาระบุปลายทาง"
                                    onChange={handleChange}
                                    style={{ height: '30px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <label style={{ fontWeight: 'bold' }}>ต้องการพนักงานขับรถ</label>
                                <Radio.Group name="driverRequired" value={formData.driverRequired} onChange={handleChange} style={{ marginTop: '8px', margin: '8px 20px' }}>
                                    <Radio value="yes">ต้องการ</Radio>
                                    <Radio value="no">ไม่ต้องการ</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '24px' }}>
                            <Button
                                type="primary"
                                onClick={() => setIsModalVisible(true)}
                                style={{
                                    backgroundColor: '#28a745',
                                    borderColor: '#28a745',
                                    fontWeight: 'bold',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                }}
                            >
                                ถัดไป
                            </Button>
                        </div>
                        {/* Modal for booking confirmation */}
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

                                {carDetails && (
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
                                            src={`http://localhost:5182${carDetails.image_url}`}
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
                                                    {carDetails.brand}
                                                </Text>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#7F8C8D',
                                                        lineHeight: '1.6',
                                                    }}
                                                >
                                                    <p style={{ margin: 0 }}>รถรุ่น: {carDetails.model}</p>
                                                    <p style={{ margin: 0 }}>ป้ายทะเบียน: {carDetails.license_plate}</p>
                                                    <p style={{ margin: 0 }}>จำนวนที่นั่ง: {carDetails.seating_capacity} ที่นั่ง</p>
                                                </div>
                                            </>
                                        </div>
                                    </div>
                                )}
                                <Divider />
                                {[
                                    { label: 'วันที่-เวลาการจอง', value: `${formatDate(startDate)} ${formData.booking_time || ''}` },
                                    { label: 'วันที่-เวลาการคืน', value: `${formatDate(endDate)}  ${formData.return_time || ''}` },
                                    { label: 'ชื่อ-สกุล', value: userFullName },
                                    { label: 'ตำแหน่ง/แผนก', value: department },
                                    { label: 'จุดประสงค์การใช้งาน', value: formData.purpose },
                                    { label: 'ปลายทาง', value: formData.destination },
                                    { label: 'ต้องการพนักงานขับรถ', value: formData.driverRequired === 'yes' ? 'ต้องการ' : 'ไม่ต้องการ' },
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
        </Layout>
    );
}

export default CarBooking;
