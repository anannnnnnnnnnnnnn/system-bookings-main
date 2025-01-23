'use client'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/sidebar';
import Navbar from '@/app/users/home/navbar';
import { Layout, Breadcrumb, Typography, Divider, Alert, Button } from 'antd';
import { HomeOutlined, CheckCircleOutlined, WarningOutlined, CheckOutlined, PrinterOutlined, QrcodeOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const confirmation_id = searchParams.get('confirmation_id');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!confirmation_id) return;

        axios
            .get(`http://localhost:5182/api/bookings/${confirmation_id}`)
            .then((response) => {
                const bookingData = response.data;
                const carId = bookingData.car_id;

                setBookingDetails(bookingData);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!bookingDetails) {
        return <div>ไม่พบข้อมูลการจอง</div>;
    }

    const { car, booking_number, booking_date, booking_time, return_date, return_time, purpose, destination, department, driver_required, isApproved } = bookingDetails;

    const formatDate = (date) => new Date(date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handlePrintPDF = async () => {
        console.log('handlePrintPDF called');
        const element = document.createElement('div');
        element.innerHTML = `
           <div style="padding: 30px; background-color: #fff; font-family: 'Arial', sans-serif; width: 600px; margin: 0 auto; border: 1px solid #ccc; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
        <img src="path_to_logo.png" alt="Logo" style="width: 100px; margin-bottom: 10px;">
        <h1 style="color: #333; font-size: 24px; font-weight: bold;">ใบจองรถ</h1>
        <hr style="border: 1px solid #ddd;">
    </div>
    <div>
        <h2 style="color: #555; font-size: 18px; margin-bottom: 10px;">ข้อมูลการจอง</h2>
        <p style="font-size: 16px; line-height: 1.6;">หมายเลขการจอง: <strong>${booking_number || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">วันที่จอง: <strong>${formatDate(booking_date)} ${booking_time || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">วันที่คืน: <strong>${formatDate(return_date)} ${return_time || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">สถานะ: <strong>${isApproved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</strong></p>
    </div>
    <div style="margin-top: 30px;">
        <h2 style="color: #555; font-size: 18px; margin-bottom: 10px;">ข้อมูลรถ</h2>
        <p style="font-size: 16px; line-height: 1.6;">ยี่ห้อ: <strong>${car?.brand || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">รุ่น: <strong>${car?.model || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">ทะเบียน: <strong>${car?.license_plate || 'N/A'}</strong></p>
        <p style="font-size: 16px; line-height: 1.6;">จำนวนที่นั่ง: <strong>${car?.seating_capacity || 'N/A'} ที่นั่ง</strong></p>
    </div>
    <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 14px; color: #777;">ขอบคุณที่ใช้บริการของเรา</p>
    </div>
</div>

        `;

        document.body.appendChild(element);

        try {
            const canvas = await html2canvas(element);
            console.log('Canvas generated:', canvas);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`booking-${booking_number || 'details'}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            document.body.removeChild(element);
        }
    };


    return (
        <Layout style={{ backgroundColor: '#fff' }}>
            <Navbar />

            <Layout style={{ padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                <Sidebar />

                <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            margin: '0 100px'
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "40px",
                                height: "40px",
                                backgroundColor: "#d9e8d2",
                                borderRadius: "50%",
                                marginRight: "10px",
                            }}
                        >
                            <HomeOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
                        </div>

                        <Breadcrumb separator=">">
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: "500", fontSize: "14px", color: "#666" }}>ระบบจองรถ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: "500", fontSize: "14px", color: "#666" }}>ค้นหารถ</span>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <span style={{ fontWeight: "500", fontSize: "14px", color: "#333" }}>กรอกรายละเอียด</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <Divider style={{ margin: '20px 0' }} />

                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
                        <Title level={4} style={{ color: '#333', fontWeight: '600', marginBottom: '16px' }}>รออนุมัติ</Title>

                        <Alert
                            message={`สถานะ: ${isApproved ? 'อนุมัติแล้ว' : 'รออนุมัติ'}`}
                            type={isApproved ? 'success' : 'warning'}
                            showIcon
                            icon={isApproved ? <CheckCircleOutlined /> : <WarningOutlined />}
                            style={{
                                borderRadius: '8px',
                                marginBottom: '16px',
                                backgroundColor: isApproved ? '#E6F7E6' : '#FFF7E6',
                            }}
                        />

                        {car ? (
                            <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
                                {/* Title */}
                                <div style={{ marginBottom: '16px' }}>
                                    <Title level={4} style={{ color: '#333', fontWeight: '600' }}>
                                        ข้อมูลการจอง
                                    </Title>
                                </div>

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
                                                    <Text

                                                        style={{
                                                            fontSize: '18px',
                                                            fontWeight: '600',
                                                            color: '#2C3E50',
                                                            marginBottom: '8px',
                                                        }}
                                                    >
                                                        {car.brand}
                                                    </Text>
                                                    <div
                                                        style={{
                                                            fontSize: '14px',
                                                            color: '#7F8C8D',
                                                            lineHeight: '1.6',
                                                        }}
                                                    >
                                                        <p style={{ margin: 0 }}>รถรุ่น: {car.model}</p>
                                                        <p style={{ margin: 0 }}>ป้ายทะเบียน: {car.license_plate}</p>
                                                        <p style={{ margin: 0 }}>จำนวนที่นั่ง: {car.seating_capacity} ที่นั่ง</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>กำลังโหลดข้อมูลรถ...</p>  // ข้อความระหว่างโหลดข้อมูล
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* ข้อมูลการจอง */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '30px', justifyContent: 'center' }}>
                                    {/* ฟอร์ม 1 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            หมายเลขการจอง:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {booking_number || 'N/A'}
                                        </span>
                                    </div>

                                    {/* ฟอร์ม 2 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            วันที่-เวลาการจอง:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {`${formatDate(booking_date)} ${booking_time}` || 'N/A'}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            วันที่-เวลาการคืน:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {`${formatDate(return_date)} ${return_time}` || 'N/A'}
                                        </span>
                                    </div>

                                    {/* ฟอร์ม 3 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            จุดประสงค์:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {purpose || 'ไม่ได้ระบุ'}
                                        </span>
                                    </div>

                                    {/* ฟอร์ม 4 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            ปลายทาง:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {destination || 'ไม่ได้ระบุ'}
                                        </span>
                                    </div>

                                    {/* ฟอร์ม 5 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            แผนก:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {department || 'ไม่ได้ระบุ'}
                                        </span>
                                    </div>

                                    {/* ฟอร์ม 7 */}
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center', width: '48%' }}>
                                        <label style={{ fontWeight: 'bold', color: '#333', fontSize: '14px', width: 'auto' }}>
                                            พนักงานขับรถ:
                                        </label>
                                        <span style={{ fontSize: '14px', color: '#666', flexGrow: 1 }}>
                                            {driver_required === 1 ? 'ต้องการ' : 'ไม่ต้องการ'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Text>กำลังโหลดข้อมูล...</Text>
                        )}
                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Button type="primary" onClick={handlePrintPDF}>
                                พิมพ์ใบจอง
                            </Button>
                            <Button type="default" icon={<QrcodeOutlined />} disabled={!isApproved}>สแกน QR Code</Button>
                        </div>
                    </div>
                </Layout>
            </Layout>
        </Layout>
    );
}