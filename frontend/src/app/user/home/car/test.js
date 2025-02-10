'use client'
import { useState, useEffect } from "react";
import { Layout, Typography, Row, Col, Card, message, Spin, Image, Button, Tag, Modal, Form, Input, DatePicker, TimePicker, Breadcrumb, Select } from "antd";
import { CarOutlined, CalendarOutlined, EnvironmentOutlined, HomeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Navbar from "@/app/users/home/navbar";
import Sidebar from "./components/sidebar";
import { Content } from 'antd/lib/layout/layout';
import moment from "moment";

const { Title } = Typography;

const ApproveBookings = ({ onUserFullNameChange }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState(""); // เก็บชื่อผู้ใช้
  const [isModalVisible, setIsModalVisible] = useState(false); // สำหรับเปิด/ปิด Modal
  const [selectedBooking, setSelectedBooking] = useState(null); // สำหรับเก็บข้อมูลการจองที่เลือก
  const [form] = Form.useForm();

  useEffect(() => {
    const storedFullName = localStorage.getItem('userFullName');
    if (storedFullName) {
      setFullName(storedFullName);
    }
  }, []);

  useEffect(() => {
    if (!fullName) return;

    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:5182/api/bookings/active/${encodeURIComponent(fullName)}`);
        if (!response.ok) throw new Error(`Error ${response.status}: ไม่พบข้อมูลการจอง`);

        const data = await response.json();
        setBookings(data);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [fullName]);

  // Function to return status color and text
  const getStatusColor = (status) => {
    switch (status) {
      case 1:
        return { color: 'orange', text: 'รออนุมัติ' };
      case 2:
        return { color: 'green', text: 'อนุมัติแล้ว' };
      case 3:
        return { color: 'red', text: 'ไม่อนุมัติ' };
      case 4:
        return { color: 'orange', text: 'รถแล้ว' };
      case 5:
        return { color: 'gray', text: 'ยกเลิกการจอง' };
      default:
        return { color: 'gray', text: 'ไม่ระบุสถานะ' };
    }
  };

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);

    form.setFieldsValue({
      bookingDate: booking.booking_date ? moment(booking.booking_date) : null,
      bookingTime: booking.booking_time ? booking.booking_time : null, // ตั้งค่าตามเวลาที่เก็บ
      returnDate: booking.return_date ? moment(booking.return_date) : null,
      returnTime: booking.return_time ? booking.return_time : null, // ตั้งค่าตามเวลาที่เก็บ
      destination: booking.destination,
      purpose: booking.purpose,
      department: booking.department,
    });
  };


  const handleCancelModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  // Function for checking if the booking can be edited
  const canEditBooking = (status) => {
    return status === 1 || status === 4;
  };
  // ฟังก์ชันแปลงเวลา HH:mm เป็น TimeSpan
  const convertToTimeSpan = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes };
  };

  const handleEdit = async (values) => {
    try {
      const formattedValues = {
        full_name: fullName,
        booking_number: selectedBooking.booking_number,
        booking_date: values.bookingDate ? moment(values.bookingDate).format("YYYY-MM-DD") : null,
        booking_time: values.bookingTime ? moment(values.bookingTime, "HH:mm").format("HH:mm:ss") : null,
        return_date: values.returnDate ? moment(values.returnDate).format("YYYY-MM-DD") : null,
        return_time: values.returnTime ? moment(values.returnTime, "HH:mm").format("HH:mm:ss") : null,
        destination: values.destination,
        purpose: values.purpose,
        department: values.department,
      };
  
      console.log("Data Sent to API:", formattedValues);
  
      const response = await fetch(
        `http://localhost:5182/api/bookings/update-booking/${selectedBooking.confirmation_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedValues),
        }
      );
  
      const responseData = await response.json();
      console.log("API Response:", responseData);
  
      if (!response.ok) {
        console.error("API Error Details:", responseData);
        throw new Error(responseData.message || "Error updating booking");
      }
  
      console.log("Booking updated successfully!");
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const handleCancel = async (bookingId) => {
    Modal.confirm({
      content: 'คุณแน่ใจว่าต้องการยกเลิกการจองนี้หรือไม่?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      onOk: async () => {
        try {
          const response = await fetch(`http://localhost:5182/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
          });

          const data = await response.json();
          if (response.ok) {
            fetchBookings(); // Refresh bookings after cancel
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      },
      onCancel() {
        console.log('การยกเลิกถูกยกเลิก');
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#666' }}>ระบบจองรถ</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>เลือกการจอง</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>

          <Content style={{ background: '#ffffff', marginTop: '10px', marginLeft: '50px', padding: '20px', borderRadius: '8px' }}>
            <Title level={3} style={{ textAlign: "center" }}>รถที่คุณจองแล้ว</Title>

            {loading ? (
              <Spin tip="กำลังโหลด..." style={{ display: "block", textAlign: "center", marginTop: 20 }} />
            ) : (
              <Row gutter={[24, 24]} style={{ backgroundColor: '#ffffff', padding: '10px' }}>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <Col xs={24} sm={12} md={12} lg={12} xl={12} key={booking.confirmation_id}>
                      <Card hoverable style={{ marginBottom: 16, maxWidth: '100%' }}>
                        <Image alt="car" src={`http://localhost:5182${booking.car?.image_url}`} style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} />
                        <Title level={5}>{booking.booking_number}</Title>
                        <p>รถที่จอง: {booking.car.model}</p>
                        <p>วันที่จอง: {formatDate(booking.booking_date)} เวลา: {booking.booking_time}</p>
                        <p>วันที่จอง: {formatDate(booking.return_date)} เวลา: {booking.return_time}</p>
                        <p>จุดหมาย: {booking.destination}</p>

                        <Tag color={getStatusColor(booking.booking_status).color}>{getStatusColor(booking.booking_status).text}</Tag>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => canEditBooking(booking.booking_status) ? showModal(booking) : message.error("ไม่สามารถแก้ไขการจองได้")}
                            disabled={!canEditBooking(booking.booking_status)}
                          >
                            แก้ไข
                          </Button>
                          <Button
                            type="danger"
                            icon={<DeleteOutlined />}
                            onClick={() => handleCancel(booking.confirmation_id)}
                          >
                            ยกเลิก
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>ไม่มีข้อมูลการจอง</p>
                )}
              </Row>
            )}

            <Modal title="Edit Booking" visible={isModalVisible} onCancel={handleCancelModal} footer={null}>
              <Form form={form} onFinish={handleEdit}>
                <Form.Item label="Booking Date" name="bookingDate">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Booking Time" name="bookingTime">
                  <Select style={{ width: "100%" }} placeholder="Select booking time">
                    {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                      <Select.Option key={time} value={time}>
                        {time}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item label="Return Date" name="returnDate">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Return Time" name="returnTime">
                  <Select style={{ width: "100%" }} placeholder="Select return time">
                    {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                      <Select.Option key={time} value={time}>
                        {time}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Destination" name="destination">
                  <Input />
                </Form.Item>
                <Form.Item label="Purpose" name="purpose">
                  <Input />
                </Form.Item>
                <Form.Item label="Department" name="department">
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Save</Button>
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ApproveBookings;
