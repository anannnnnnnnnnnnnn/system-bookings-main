'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Typography, Divider, Alert, Modal } from 'antd';
import { HomeOutlined, CheckCircleOutlined, WarningOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // ใช้สำหรับการนำทางกลับไปยังหน้าจอง

const { Title, Text } = Typography;

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const confirmation_id = searchParams.get('confirmation_id');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rejectionReason, setRejectionReason] = useState(''); // สถานะเหตุผลการปฏิเสธ
    const router = useRouter();
    const { car, booking_number, booking_date, booking_time, return_date, return_time, purpose, destination, department, driver_required, booking_status } = bookingDetails || {};

    useEffect(() => {
        if (!confirmation_id) return;

        axios
            .get(`http://localhost:5182/api/bookings/${confirmation_id}`)
            .then((response) => {
                const bookingData = response.data;
                const carId = bookingData.car_id;

                setBookingDetails(bookingData);
                setRejectionReason(bookingData.rejection_reason || ''); // หากมีเหตุผลการปฏิเสธ

                return axios.get(`http://localhost:5182/api/cars/${carId}`);
            })
            .then((carResponse) => {
                setBookingDetails((prevDetails) => ({
                    ...prevDetails,
                    car: carResponse.data,
                }));
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error.message);
                setLoading(false);
            });
    }, [confirmation_id]);

    const handleBackToBooking = () => {
        router.push('/user/home/car'); // เปลี่ยนเส้นทางกลับไปยังหน้าจอง
    };

    const handleShowRejectionReason = () => {
        // ตรวจสอบว่า confirmation_id มีหรือไม่
        if (!confirmation_id) {
            Modal.error({
                title: 'เกิดข้อผิดพลาด',
                content: 'ไม่พบข้อมูลการจอง',
            });
            return;
        }

        // เรียก API เพื่อดึงข้อมูลเหตุผลการปฏิเสธจากฐานข้อมูล
        axios
            .get(`http://localhost:5182/api/bookings/${confirmation_id}`) // ใช้ confirmation_id ในการดึงข้อมูล
            .then((response) => {
                const rejectionReason = response.data.reject_reason || "ไม่มีเหตุผลในการปฏิเสธ"; // ตรวจสอบถ้ามีเหตุผลการปฏิเสธ
                Modal.info({
                    title: 'เหตุผลที่การจองถูกปฏิเสธ',
                    content: (
                        <div>
                            <p>{rejectionReason}</p>
                        </div>
                    ),
                    onOk() { },
                });
            })
            .catch((error) => {
                console.error('Error fetching rejection reason:', error.message);
                Modal.error({
                    title: 'เกิดข้อผิดพลาด',
                    content: 'ไม่สามารถดึงข้อมูลเหตุผลการปฏิเสธได้',
                });
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!bookingDetails) {
        return <div>ไม่พบข้อมูลการจอง</div>;
    }

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }); // Thai format
    };

    // Define isApproved based on the booking_status
    const isApproved = booking_status === 2;

    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />

            <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                <Sidebar />

                <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
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
                                backgroundColor: '#d9e8d2',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}
                        >
                            <HomeOutlined style={{ fontSize: '20px', color: '#4caf50' }} />
                        </div>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#666',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',
                                }}>
                                    ระบบจองรถ
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#666',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',

                                }}>
                                    หน้าเลือกรถที่ต้องการจอง
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#666',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',

                                }}>
                                    หน้ากรอกรายละเอียดการจจอง
                                </span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#333',
                                    padding: '6px 14px',
                                    borderRadius: '20px', /* เพิ่มความโค้งให้มากขึ้น */
                                    backgroundColor: '#f5f5f5',

                                }}>
                                    หน้ารออนุมัติ
                                </span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />

                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <Title level={4} style={{ color: '#333', fontWeight: '600', marginBottom: '16px' }}>สถานะการจอง</Title>
                        <Alert
                            message={`สถานะ: ${booking_status === 1 ? 'รออนุมัติ' : booking_status === 2 ? 'อนุมัติแล้ว' : booking_status === 3 ? 'ปฏิเสธการจอง' : 'ไม่ทราบสถานะ'}`}
                            type={booking_status === 1 ? 'warning' : booking_status === 2 ? 'success' : booking_status === 3 ? 'error' : 'default'}
                            showIcon
                            icon={booking_status === 1 ? <WarningOutlined /> : booking_status === 2 ? <CheckCircleOutlined /> : booking_status === 3 ? <CloseCircleOutlined /> : <HomeOutlined />}
                            style={{
                                borderRadius: '8px',
                                marginBottom: '16px',
                                backgroundColor: booking_status === 1 ? '#FFF7E6' : booking_status === 2 ? '#E6F7E6' : booking_status === 3 ? '#FFD6D6' : '#f4f4f4',
                            }}
                        />

                        {/* ข้อมูลการจอง */}
                        {car && (
                            <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
                                {/* ข้อมูลรถ */}
                                <div style={{
                                    borderRadius: '12px',
                                    padding: '16px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '20px',
                                }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        <img
                                            src={car?.image_url ? `http://localhost:5182${car.image_url}` : null}
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
                                        <div style={{ flexGrow: 1 }}>
                                            {car ? (
                                                <>
                                                    <Text style={{ fontSize: '18px', fontWeight: '600', color: '#2C3E50', marginBottom: '8px' }}>
                                                        {car.brand}
                                                    </Text>
                                                    <div style={{ fontSize: '14px', color: '#7F8C8D', lineHeight: '1.6' }}>
                                                        <p style={{ margin: 0 }}>รถรุ่น: {car.model}</p>
                                                        <p style={{ margin: 0 }}>ป้ายทะเบียน: {car.license_plate}</p>
                                                        <p style={{ margin: 0 }}>จำนวนที่นั่ง: {car.seating_capacity} ที่นั่ง</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>กำลังโหลดข้อมูลรถ...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ข้อมูลการจอง */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px', justifyContent: 'center' }}>
                                    {/* ฟอร์ม 1 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '100%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>หมายเลขการจอง:</label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>{booking_number || 'N/A'}</span>
                                    </div>

                                    {/* ฟอร์ม 2-7 */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
                                        {/* ฟอร์ม 2 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>วันที่-เวลาการจอง:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {`${formatDate(booking_date)} ${booking_time}` || 'N/A'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 3 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>วันที่-เวลาการคืน:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {`${formatDate(return_date)} ${return_time}` || 'N/A'}
                                            </span>
                                        </div>

                                        {/* ฟอร์ม 4 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>จุดประสงค์:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>{purpose || 'ไม่ได้ระบุ'}</span>
                                        </div>

                                        {/* ฟอร์ม 5 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>ปลายทาง:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>{destination || 'ไม่ได้ระบุ'}</span>
                                        </div>

                                        {/* ฟอร์ม 6 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>แผนก:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>{department || 'ไม่ได้ระบุ'}</span>
                                        </div>

                                        {/* ฟอร์ม 7 */}
                                        <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                            <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>ต้องการคนขับ:</label>
                                            <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                                {driver_required ? 'ต้องการ' : 'ไม่ต้องการ'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={handleBackToBooking} style={{
                                backgroundColor: '#4caf50', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                            }}>
                                ย้อนกลับไปหน้าจอง
                            </button>
                        </div>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    );
}
