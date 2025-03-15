'use client';
import { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Card, message, Spin, Image, Tag, Button, Modal, Form, Input, DatePicker, Breadcrumb } from "antd";
import { EditOutlined, DeleteOutlined, HomeOutlined } from "@ant-design/icons";
import Navbar from "@/app/users/home/navbar";
import Sidebar from "./components/sidebar";
import { Content } from "antd/lib/layout/layout";
import moment from "moment";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // เพิ่ม plugin สำหรับ utc
import timezone from "dayjs/plugin/timezone"; // เพิ่ม plugin สำหรับ timezone
import "dayjs/locale/th"; // ภาษาไทย

dayjs.extend(utc); // เพิ่มการใช้ plugin UTC
dayjs.extend(timezone); // เพิ่มการใช้ plugin Timezone
dayjs.locale("th"); // ตั้งค่า locale เป็นไทย

const { Title } = Typography;

const ShowRoom = () => {
    const [loading, setLoading] = useState(true);
    const [roomBookings, setRoomBookings] = useState([]);
    const [fullName, setFullName] = useState("");
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        selectedTime: [], // สถานะการเลือกเวลา
    });
    const [bookedTimes, setBookedTimes] = useState([]);  // สถานะเก็บเวลาที่จองแล้ว

    useEffect(() => {
        const storedFullName = localStorage.getItem('userFullName');
        if (storedFullName) {
            setFullName(storedFullName);
        }
    }, []);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (!fullName) return;

        const fetchRoomBookings = async () => {
            try {
                const response = await fetch(`http://localhost:5182/api/roombookings/active/${fullName}`);
                const data = await response.json();
                setRoomBookings(data);
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomBookings();
    }, [fullName, reload]);

    const formatDate = (date) => moment(date).format("DD/MM/YYYY");

    const canEditBooking = (status) => status === 1;

    const handleCancel = async (bookingId) => {
        Modal.confirm({
            content: 'คุณแน่ใจว่าต้องการยกเลิกการจองนี้หรือไม่?',
            okText: 'ยืนยัน',
            cancelText: 'ยกเลิก',
            onOk: async () => {
                try {
                    const response = await fetch(`http://localhost:5182/api/roombookings/${bookingId}/cancel`, {
                        method: 'PUT',
                    });

                    const data = await response.json();
                    if (response.ok) {
                        fetchRoomBookings(); // Refresh bookings after cancel
                    } else {
                        alert(data.message);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            },
        });
    };
    const handleEdit = async (values) => {
        if (currentBooking && canEditBooking(currentBooking.booking_status)) {
            const formattedValues = {
                full_name: fullName,
                booking_date: values.booking_date ? values.booking_date.format("YYYY-MM-DD") : null,
                return_date: values.return_date ? values.return_date.format("YYYY-MM-DD") : null,
                // ✅ รีเซ็ตเวลาเก่า ส่งเฉพาะเวลาที่เลือกใหม่
                booking_times: values.booking_times && Array.isArray(values.booking_times)
                    ? values.booking_times.join(",")
                    : null,
                meeting_topic: values.meeting_topic,
                attendee_count: values.attendee_count,
                roombooking_number: currentBooking.roombooking_number,
            };
            console.log("ค่าที่ส่งไป API:", formattedValues);
            try {
                const response = await fetch(`http://localhost:5182/api/roombookings/roomupdate-booking/${currentBooking.roombooking_id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formattedValues),
                });

                if (response.ok) {
                    message.success("การจองถูกแก้ไขเรียบร้อยแล้ว");
                    setEditModalVisible(false);
                    fetchRoomBookings();
                } else {
                    const responseData = await response.json();
                    message.error(responseData.message || "เกิดข้อผิดพลาด");
                }
            } catch (error) {
                message.error(error.message || "Error updating booking");
            }
        } else {
            message.error("ไม่สามารถแก้ไขการจองได้เนื่องจากสถานะไม่อนุญาต");
        }
    };

    const handleTimeSelect = (time) => {
        setFormData((prev) => {
            let newSelectedTime = [...prev.selectedTime];

            if (newSelectedTime.includes(time)) {
                // 🔹 ถ้ากดซ้ำ -> ให้ลบช่วงเวลานั้นออก
                newSelectedTime = newSelectedTime.filter(t => t !== time);
            } else {
                // 🔹 ถ้าเลือกใหม่ -> ให้เพิ่มเข้าไปโดยไม่ล้างค่าก่อนหน้า
                newSelectedTime.push(time);
            }

            // ✅ อัปเดตฟอร์มให้เก็บค่าที่เลือกไว้ทั้งหมด
            form.setFieldsValue({
                booking_times: newSelectedTime,
            });

            return { ...prev, selectedTime: newSelectedTime };
        });
    };

    // เมื่อเปิด Modal หรืออัปเดตฟอร์ม ต้องมั่นใจว่า `selectedTime` ได้รับการตั้งค่าที่ถูกต้อง
    const openEditModal = (booking) => {
        setCurrentBooking(booking);

        // ✅ ล้างช่วงเวลาที่มีอยู่แล้ว
        setFormData((prev) => ({
            ...prev,
            selectedTime: [], // เคลียร์เวลาที่มีอยู่ก่อน
        }));

        // ✅ ตั้งค่าฟอร์มใหม่ (ยกเว้น booking_times)
        form.setFieldsValue({
            booking_date: moment(booking.booking_date),
            return_date: moment(booking.return_date),
            booking_times: [], // ตั้งค่าเป็นว่าง เพื่อให้เลือกใหม่
            meeting_topic: booking.meeting_topic,
            attendee_count: booking.attendee_count,
        });

        setEditModalVisible(true);
    };

    // การแสดงปุ่มเวลา
    const renderTimeButtons = () => {
        const timeSlots = [
            ['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'],
            ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00']
        ];

        return timeSlots.map((times, sectionIndex) => (
            <div key={sectionIndex} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {times.map((time, index) => {
                        const isSelected = formData.selectedTime.includes(time);
                        const isBooked = bookedTimes.some(bookedTime => bookedTime === time.split("-")[0]);

                        let buttonStyle = {
                            borderRadius: '6px',    // ลดขนาดมุม
                            width: '80px',          // ปรับขนาดความกว้าง
                            height: '25px',         // ปรับขนาดความสูง
                            fontWeight: 'bold',
                            fontSize: '12px',       // ลดขนาดตัวอักษร
                            border: isSelected || isBooked ? '2px solid' : '2px solid #ccc',
                            backgroundColor: isSelected ? '#478D00' : isBooked ? '#4CAF50' : '#ffffff',
                            color: isSelected || isBooked ? '#fff' : '#333',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                        };

                        return (
                            <Button
                                key={index}
                                type={isSelected ? 'primary' : 'default'}
                                style={buttonStyle}
                                onClick={() => !isBooked && handleTimeSelect(time)}
                                disabled={isBooked}
                            >
                                {time}
                            </Button>
                        );
                    })}
                </div>
            </div>
        ));
    };
    const formatDateInThai = (dateString) => {
        const months = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543;  // ปีพุทธศักราช

        return `${day} ${month} ${year}`;
    };


    return (
        <main>
            <Layout style={{ backgroundColor: '#fff' }}>
                <Navbar />
                <Layout style={{ minHeight: "100%", padding: '0px 40px', marginTop: '110px', backgroundColor: '#fff' }}>
                    <Sidebar />
                    <Layout style={{ marginTop: '20px', backgroundColor: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0 70px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#d9e8d2',
                                borderRadius: '50%',
                                marginRight: '10px',
                            }}>
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
                                        ระบบจองห้องประชุม
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
                                        หน้าหลักห้องประชุม
                                    </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>


                        <Content style={{ background: '#ffffff', marginTop: '10px', marginLeft: '50px', padding: '20px', borderRadius: '8px' }}>
                            <Title level={2} style={{
                                marginBottom: '24px',
                                color: '#666',
                            }}>เลือกห้องประชุมที่ต้องการจอง</Title>
                            {loading ? (
                                <Spin tip="กำลังโหลด..." style={{ display: "block", textAlign: "center", marginTop: 20 }} />
                            ) : (
                                <Row gutter={[16, 16]} justify="start">
                                    {roomBookings.length > 0 ? (
                                        roomBookings.map((booking, index) => (
                                            <Col xs={24} sm={12} md={12} lg={12} xl={12} key={`room-${index}`}>
                                                <Card
                                                    hoverable
                                                    style={{
                                                        marginBottom: 16,
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                        padding: '15px',
                                                        width: '100%',
                                                    }}
                                                >
                                                    <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px', marginBottom: '12px' }}>
                                                        <Image
                                                            alt="room"
                                                            src={`http://localhost:5182${booking.room?.room_img}`}
                                                            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>

                                                    <Title level={5} style={{ fontWeight: '600', color: '#333', fontSize: '16px', marginBottom: '8px' }}>
                                                        รหัสการจอง {booking.roombooking_number}
                                                    </Title>

                                                    <p style={{ marginBottom: '8px', fontSize: '14px', color: '#555' }}>
                                                        ห้องประชุม: <strong>{booking.room?.room_name}</strong>
                                                    </p>

                                                    <Row gutter={[16, 16]}>
                                                        <Col xs={24} sm={12}>
                                                            <p style={{ marginBottom: '6px', fontSize: '14px', color: '#555' }}>
                                                                วันที่จอง: <span style={{ fontWeight: '500' }}>{formatDateInThai(booking.booking_date)}</span>
                                                            </p>
                                                            <p style={{ marginBottom: '6px', fontSize: '14px', color: '#555' }}>
                                                                วันที่คืน: <span style={{ fontWeight: '500' }}>{formatDateInThai(booking.return_date)}</span>
                                                            </p>
                                                            <p style={{ marginBottom: '6px', fontSize: '14px', color: '#555' }}>
                                                                เวลา: <span style={{ fontWeight: '500' }}>{booking.booking_times}</span>
                                                            </p>
                                                        </Col>

                                                        <Col xs={24} sm={12}>
                                                            <p style={{ marginBottom: '6px', fontSize: '14px', color: '#555' }}>
                                                                หัวข้อประชุม: <span style={{ fontWeight: '500' }}>{booking.meeting_topic}</span>
                                                            </p>
                                                            <p style={{ marginBottom: '6px', fontSize: '14px', color: '#555' }}>
                                                                ผู้เข้าร่วม: <span style={{ fontWeight: '500' }}>{booking.attendee_count}</span>
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                    <Tag
                                                        color={
                                                            booking.booking_status === 1 ? "orange" :
                                                                booking.booking_status === 2 ? "green" :
                                                                    "red"
                                                        }
                                                        style={{ marginBottom: '12px', fontSize: '12px' }}
                                                    >
                                                        {booking.booking_status === 1 ? "รออนุมัติ" :
                                                            booking.booking_status === 2 ? "อนุมัติแล้ว" :
                                                                "ไม่อนุมัติ"}
                                                    </Tag>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                                                        <Button
                                                            type="primary"
                                                            icon={<EditOutlined />}
                                                            onClick={() => canEditBooking(booking.booking_status) ? openEditModal(booking) : message.error("ไม่สามารถแก้ไขการจองได้")}
                                                            disabled={!canEditBooking(booking.booking_status)}
                                                            size="small"
                                                            style={{ background: '#236927', color: '#ffff' }}
                                                        >
                                                            แก้ไข
                                                        </Button>

                                                        <Button
                                                            type="primary"
                                                            danger
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleCancel(booking.roombooking_id)}
                                                            size="small"
                                                        >
                                                            ยกเลิก
                                                        </Button>
                                                    </div>
                                                </Card>

                                            </Col>
                                        ))
                                    ) : (
                                        <p style={{ textAlign: "center", fontSize: '16px', color: '#888' }}>ไม่มีข้อมูลการจอง</p>
                                    )}
                                </Row>
                            )}
                            {/* Modal สำหรับการแก้ไขการจอง */}
                            <Modal
                                visible={editModalVisible}
                                title={<h3 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 0 }}>แก้ไขการจอง</h3>}
                                onCancel={() => setEditModalVisible(false)}
                                footer={null}
                                width={600}
                                style={{ borderRadius: "10px", padding: "15px" }}
                                bodyStyle={{
                                    maxHeight: "500px",
                                    overflowY: "auto",
                                }}
                            >
                                <Form
                                    form={form}
                                    onFinish={handleEdit}
                                    layout="vertical"
                                    style={{ padding: "5px 10px" }}
                                >
                                    <Form.Item
                                        label="วันที่จอง"
                                        name="booking_date"
                                        rules={[{ required: true, message: "กรุณาเลือกวันที่จอง!" }]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%", borderRadius: "6px", padding: "6px" }}
                                            disabledDate={(current) => current && current < dayjs().tz("Asia/Bangkok", true).startOf('day')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="วันที่คืน"
                                        name="return_date"
                                        rules={[{ required: true, message: "กรุณาเลือกวันที่คืน!" }]}
                                    >
                                        <DatePicker
                                            style={{ width: "100%", borderRadius: "6px", padding: "6px" }}
                                            disabledDate={(current) => current && current < dayjs().tz("Asia/Bangkok", true).startOf('day')}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="เวลา"
                                        name="booking_times"
                                        rules={[{ required: true, message: "กรุณาเลือกเวลา!" }]}
                                    >
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", justifyContent: "center" }}>
                                            {renderTimeButtons()}
                                        </div>
                                    </Form.Item>

                                    <Form.Item
                                        label="หัวข้อประชุม"
                                        name="meeting_topic"
                                    >
                                        <Input
                                            placeholder="ระบุหัวข้อ"
                                            style={{ width: "100%", borderRadius: "6px", padding: "6px" }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="จำนวนผู้เข้าร่วม"
                                        name="attendee_count"
                                    >
                                        <Input
                                            type="number"
                                            min={1}
                                            style={{ width: "100%", borderRadius: "6px", padding: "6px" }}
                                        />
                                    </Form.Item>

                                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{
                                                backgroundColor: "#478D00",
                                                borderColor: "#478D00",
                                                fontSize: "14px",
                                                fontWeight: "bold",
                                                padding: "8px 20px",
                                                borderRadius: "6px",
                                            }}
                                        >
                                             บันทึกการแก้ไข
                                        </Button>
                                    </div>
                                </Form>
                            </Modal>


                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </main>
    );
}

export default ShowRoom;
