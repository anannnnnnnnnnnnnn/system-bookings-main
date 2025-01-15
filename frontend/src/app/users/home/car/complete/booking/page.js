'use client'
import { useSearchParams, useRouter } from 'next/navigation';  // นำเข้า useRouter จาก next/navigation
import { useEffect, useState } from 'react';
import { Layout, Typography, Input, Radio, Button, Divider, Modal, Space } from 'antd';
import Navbar from '../../../navbar';
import Sidebar from '../../components/sidebar';
import Navigation from '../../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Text } = Typography;

const CarBookingComplete = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [carDetails, setCarDetails] = useState(null); 
    const [formData, setFormData] = useState({
        bookingNumber: '',
        bookingDate: '',
        username: '',
        purpose: '',
        destination: '',
        passengers: '',
        driverRequired: ''
    });
    const searchParams = useSearchParams();
    const carId = searchParams.get('carId'); 
    const startDate = searchParams.get('startDate'); 
    const endDate = searchParams.get('endDate'); 
    const startTime = searchParams.get('startTime'); 
    const endTime = searchParams.get('endTime'); 
    const router = useRouter();  // ใช้ useRouter

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    
    const [userFullName, setUserFullName] = useState(null); 
    const [department, setDepartment] = useState(null); 

    useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const storedFullName = localStorage.getItem("userFullName");
        const storedDepartment = localStorage.getItem("department");

        if (storedFullName) {
            setUserFullName(storedFullName); 
        }

        if (storedDepartment) {
            setDepartment(storedDepartment); 
        }
    }, []);

    useEffect(() => {
        if (carId) {
            // ใช้ carId เพื่อดึงข้อมูลของรถจาก API หรือฐานข้อมูล
            axios.get(`http://localhost:5182/api/cars/${carId}`)
                .then(response => {
                    setCarDetails(response.data); 
                })
                .catch(error => {
                    console.error('Error fetching car details:', error);
                });
        } else {
            console.error('carId is missing in the URL');
        }
    }, [carId]);

    const handleConfirm = () => {
        // ตรวจสอบว่ามีค่าที่จำเป็นครบหรือไม่
        if (!formData.purpose || !formData.destination || !startDate || !startTime || !endDate || !endTime || !carId) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน!');
            return;
        }
    
        // ตรวจสอบความถูกต้องของรูปแบบวันที่และเวลา
        const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);
        const isValidTime = (time) => /^\d{2}:\d{2}$/.test(time);
    
        if (!isValidDate(startDate) || !isValidTime(startTime) || !isValidDate(endDate) || !isValidTime(endTime)) {
            alert('รูปแบบวันที่หรือเวลาไม่ถูกต้อง!');
            return;
        }
    
        // ตรวจสอบว่าเวลาเริ่มต้นและเวลาสิ้นสุดถูกต้อง
        const startTimeValid = new Date(`${startDate}T${startTime}`);
        const endTimeValid = new Date(`${endDate}T${endTime}`);
    
        if (isNaN(startTimeValid.getTime()) || isNaN(endTimeValid.getTime()) || startTimeValid >= endTimeValid) {
            alert('กรุณาตรวจสอบวันที่และเวลาให้ถูกต้อง!');
            return;
        }

        const formatTimeSpan = (date) => {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        };
        const generateBookingNumber = () => {
            const now = new Date();
            return `BN${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        };
        
        // เตรียมข้อมูลสำหรับการส่ง API
        const bookingData = {
            booking_number: formData.bookingNumber || generateBookingNumber(),
            car_id: carId,
            full_name: userFullName || 'ไม่ได้ระบุ',
            booking_date: startDate,
            booking_time: formatTimeSpan(startTimeValid),
            return_date: endDate,
            return_time: formatTimeSpan(endTimeValid),
            purpose: formData.purpose,
            destination: formData.destination,
            passenger_count: formData.passengers ? parseInt(formData.passengers, 10) : null,
            department: formData.department || 'ไม่ได้ระบุ',
            driver_required: formData.driverRequired === 'yes' ? 1 : 0,
            status: 1,  
        };
    
        // ส่งข้อมูลไปยัง API
        axios.post('http://localhost:5182/api/bookings', bookingData)
            .then((response) => {
                if (response.status === 201) {
                    Modal.success({
                        title: 'การจองสำเร็จ!',
                        content: 'ข้อมูลการจองของคุณถูกบันทึกเรียบร้อยแล้ว',
                        onOk: () => {
                            // ส่งข้อมูลไปยังหน้าถัดไป
                            router.push(`/users/home/car/complete/approv?bookingData=${encodeURIComponent(JSON.stringify(bookingData))}&carId=${carId}`);                            
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
                Modal.error({
                    title: 'เกิดข้อผิดพลาด',
                    content: JSON.stringify(error.response?.data?.errors || error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้'),
                });
            });
    };
    
    return (
        <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {/* Navbar */}
            <Navbar />

            <Layout style={{ padding: '0px 50px', marginTop: '20px', backgroundColor: '#fff' }}>
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
                    <Navigation />
                    <Content
                        style={{
                            marginTop: '21px',
                            padding: '24px',
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff' }}>

                            <Title level={3} style={{ textAlign: 'left', marginBottom: '16px', color: 'black', fontSize: '20px' }}>
                                <FileTextOutlined style={{ marginRight: '8px', fontSize: '20px' }} />
                                รายละเอียดการจอง
                            </Title>
                            <Divider />
                            {/* Car Details Section */}
                            <div style={{ padding: '12px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #E0E0E0',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        backgroundColor: '#FFFFFF',
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
                            {/* Booking Form */}
                            <Title level={2} style={{ color: '#2C3E50', fontWeight: '600', marginBottom: '20px', fontSize: '24px' }}>
                                เลือกรถที่ต้องการจอง
                            </Title>
                            <div style={{ maxWidth: '700px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', justifyContent: 'center' }}>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการจอง</label>
                                    <Input value={`${startDate} ${startTime}`} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>วันที่-เวลาการคืน</label>
                                    <Input value={`${endDate} ${endTime}`} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                                    <Input value={userFullName} disabled />
                                </div>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>ตำแหน่ง/แผนก</label>
                                    <Input value={department} disabled />
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
                            <Divider />
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
                                    { label: 'วันที่-เวลาการจอง', value: `${startDate} ${startTime}` },
                                    { label: 'วันที่-เวลาการคืน', value: `${endDate} ${endTime}` },
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
};
export default CarBookingComplete;