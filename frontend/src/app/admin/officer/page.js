'use client'
import { useState, useEffect } from "react";
import { Table, message, Layout, Typography, Button, Modal, Select, Card, Col, Row, Space, } from "antd";
import Navbar from "@/app/users/home/navbar";
import dayjs from 'dayjs';
import 'dayjs/locale/th'; // นำเข้า locale ภาษาไทย

dayjs.locale('th'); // ตั้งค่าให้ dayjs ใช้ภาษาไทย

const { Title, Text } = Typography;
const { Option } = Select;

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState(2); // ค่าเริ่มต้น = อนุมัติแล้ว

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5182/api/bookings`);
      const data = await res.json();

      // ดึงข้อมูลรถและรวมเข้าไปใน booking
      const bookingsWithCars = await Promise.all(
        data.map(async (booking) => {
          const carRes = await fetch(`http://localhost:5182/api/cars/${booking.car_id}`);
          const carData = await carRes.json();
          return { ...booking, carDetails: carData };
        })
      );

      setBookings(bookingsWithCars);
    } catch (error) {
      message.error("โหลดข้อมูลล้มเหลว");
    }
    setLoading(false);
  };

  const updateBookingStatus = async (confirmationId) => {
    Modal.confirm({
      title: "ยืนยันการคืนรถ",
      content: "คุณแน่ใจหรือไม่ว่าต้องการคืนรถ?",
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
      onOk: async () => {
        try {
          const res = await fetch(`http://localhost:5182/api/bookings/update-status/${confirmationId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
          });

          if (res.ok) {
            message.success("อัปเดตสถานะเรียบร้อยแล้ว");
            fetchBookings();
          } else {
            const errorData = await res.json();
            message.error(errorData.message);
          }
        } catch (error) {
          message.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
        }
      }
    });
  };

  // กรองข้อมูลตาม filterStatus
  const filteredBookings = bookings.filter(booking => booking.booking_status === filterStatus);

  const columns = [
    {
      title: "วันที่จองและคืน",
      key: "booking_dates",
      render: (text, record) => {
        const bookingDate = dayjs(record.booking_date).format("DD MMM YYYY");
        const returnDate = dayjs(record.return_date).format("DD MMM YYYY");
        return `${bookingDate} - ${returnDate}`;
      },
    },
    { title: "ชื่อผู้จอง", dataIndex: "full_name", key: "full_name" },
    { title: "หมายเลขการจอง", dataIndex: "confirmation_id", key: "confirmation_id" },
    { title: "จุดหมาย", dataIndex: "destination", key: "destination" },
    {
      title: "รถที่จอง",
      dataIndex: "carDetails",
      key: "car_brand",
      render: (carDetails) => carDetails ? carDetails.brand : "-",
    },
    {
      title: "สถานะ",
      dataIndex: "booking_status",
      key: "booking_status",
      render: (status) => {
        if (status === 2) return <span style={{ color: "#4CAF50" }}>อนุมัติแล้ว</span>;
        if (status === 4) return <span style={{ color: "#8A2BE2" }}>คืนรถแล้ว</span>;
        return null;
      },
    },
    {
      title: "ดำเนินการ",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: 'purple', borderColor: '#ffff' }}
          onClick={(e) => {
            e.stopPropagation(); // ป้องกัน Modal รายละเอียดขึ้นมา
            updateBookingStatus(record.confirmation_id);
          }}
          disabled={record.booking_status !== 2}
        >
          คืนรถ
        </Button>

      ),
    }
  ];

  // ฟังก์ชันเปิด Modal และกำหนดข้อมูลแถวที่ถูกคลิก
  const handleRowClick = async (record) => {
    if (!record) return;

    setSelectedBooking(record); // เก็บข้อมูลการจองที่คลิก

    try {
      const res = await fetch(`http://localhost:5182/api/users/by-name?full_name=${record.full_name}`);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
        return;
      }

      const userData = await res.json();

      if (userData && userData.length > 0) {
        setSelectedBooking((prev) => ({
          ...prev,
          user: userData[0], // เพิ่มข้อมูลผู้ใช้เข้าไปใน selectedBooking
        }));
      } else {
        message.error("ไม่พบข้อมูลผู้ใช้");
      }

    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
      console.error(error);
    }

    setIsModalOpen(true); // เปิด Modal หลังจากดึงข้อมูล
  };




  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      {/* Navbar */}
      <Navbar />

      <Layout style={{ padding: "30px", backgroundColor: "#fff", marginTop: '80px' }}>
        <Title level={4}>การอนุมัติการจอง</Title>

        {/* Dropdown Filter */}
        <div style={{ marginBottom: '20px' }}>
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
            style={{ width: 200 }}
          >
            <Option value={2}>อนุมัติแล้ว</Option>
            <Option value={4}>คืนรถแล้ว</Option>
          </Select>
        </div>

        {/* ตารางแสดงข้อมูล */}
        <Table
          dataSource={filteredBookings}
          columns={columns}
          rowKey="confirmation_id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />

        {/* Modal สำหรับแสดงรายละเอียด */}
        <Modal
          title="รายละเอียดการจอง"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={900}
          bodyStyle={{
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
          }}
        >
          {selectedBooking && (
            <Row gutter={16}>
              {/* ข้อมูลผู้จอง */}
              {selectedBooking.user && (
                <Col span={8}>
                  <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>ข้อมูลผู้จอง</Text>
                  <div
                    style={{
                      padding: '15px',
                      borderRadius: '8px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginBottom: '15px',
                    }}
                  >
                    <img
                      src={`http://localhost:5182${selectedBooking.user.profile_picture}`}
                      alt="Profile"
                      style={{
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        marginBottom: '10px',
                      }}
                    />
                    <Space direction="vertical" size={8} style={{ width: '100%', textAlign: 'center' }}>
                      <div><Text strong>ชื่อ:</Text> <Text>{selectedBooking.full_name}</Text></div>
                      <div><Text strong>อีเมล:</Text> <Text>{selectedBooking.user.email}</Text></div>
                      <div><Text strong>เบอร์โทร:</Text> <Text>{selectedBooking.user.phone_number}</Text></div>
                      <div><Text strong>แผนก:</Text> <Text>{selectedBooking.user.department}</Text></div>
                    </Space>
                  </div>
                </Col>
              )}

              {/* ข้อมูลการจอง */}
              <Col span={16}>
                <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>รายละเอียดการจอง</Text>
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    marginBottom: '15px',
                  }}
                >
                  {/* ข้อมูลรถ */}
                  {selectedBooking.carDetails && (
                    <Row gutter={[8, 8]}>
                      <Col span={8}>
                        <img
                          src={`http://localhost:5182${selectedBooking.carDetails.image_url}`}
                          alt="Car"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '120px', // ลดขนาดภาพ
                            borderRadius: '8px',
                            objectFit: 'cover',
                            marginBottom: '10px',
                            marginLeft: '20px'
                          }}
                        />
                      </Col>
                      <Col span={16}>
                        <Row gutter={12}>
                          <Col span={12}>
                            <div><Text strong>รหัสรถ:</Text> <Text>{selectedBooking.carDetails.car_id}</Text></div>
                            <div><Text strong>ยี่ห้อ:</Text> <Text>{selectedBooking.carDetails.brand}</Text></div>
                            <div><Text strong>รุ่น:</Text> <Text>{selectedBooking.carDetails.model}</Text></div>
                          </Col>
                          <Col span={12}>
                            <div><Text strong>ทะเบียนรถ:</Text> <Text>{selectedBooking.carDetails.license_plate}</Text></div>
                            <div><Text strong>ประเภทเชื้อเพลิง:</Text>
                              <Text>{selectedBooking.carDetails.fuel_type === 1 ? 'น้ำมัน' : selectedBooking.carDetails.fuel_type === 2 ? 'ไฟฟ้า' : 'แก๊ส'}</Text>
                            </div>
                            <div><Text strong>ความจุที่นั่ง:</Text> <Text>{selectedBooking.carDetails.seating_capacity}</Text></div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  )}
                </div>

                {/* รายละเอียดการจอง */}
                <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>ข้อมูลการจอง</Text>
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Row gutter={[16, 16]}>
                    {/* หมายเลขการจอง */}
                    <Col span={12}>
                      <div><Text strong>หมายเลขการจอง:</Text> <Text>{selectedBooking.booking_number}</Text></div>
                      <div><Text strong>วันที่จอง:</Text> <Text>{new Date(selectedBooking.booking_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></div>
                    </Col>

                    <Col span={12}>
                      <div><Text strong>วันที่คืนรถ:</Text> <Text>{new Date(selectedBooking.return_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          )}
        </Modal>
      </Layout>
    </Layout>
  );
};

export default ApproveBookings;
