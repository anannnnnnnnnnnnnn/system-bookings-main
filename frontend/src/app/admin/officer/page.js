'use client'
import { useState, useEffect } from "react";
import { Table, message, Layout, Typography, Button, Modal, Select, Card, Col, Row, Space } from "antd";

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
  };

  // กรองข้อมูลตาม filterStatus
  const filteredBookings = bookings.filter(booking => booking.booking_status === filterStatus);

  const columns = [
    { title: "วันที่จอง", dataIndex: "booking_date", key: "booking_date" },
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
          onClick={() => updateBookingStatus(record.confirmation_id)}
          disabled={record.booking_status !== 2}
        >
          คืนรถ
        </Button>
      ),
    }
  ];

  // ฟังก์ชันเปิด Modal และกำหนดข้อมูลแถวที่ถูกคลิก
  const handleRowClick = async (record) => {
    setSelectedBooking(record);  // เก็บข้อมูลการจองที่คลิก

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
          user: userData[0],  // เพิ่มข้อมูลผู้ใช้เข้าไปใน selectedBooking
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
    <Layout style={{ padding: "20px", backgroundColor: "#fff" }}>
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
        width={600}
        style={{ top: 20 }}
      >
        {selectedBooking && (
          <div>
            {/* ข้อมูลผู้ใช้ */}
            {selectedBooking.user && (
              <div style={{ marginBottom: '15px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Row gutter={16}>
                  {/* ข้อมูลภาพผู้ใช้ */}
                  <Col xs={24} sm={8} md={6}>
                    <img
                      src={`http://localhost:5182${selectedBooking.user.profile_picture}`}
                      alt="Profile"
                      style={{ width: '75%', height: 'auto', borderRadius: '50%' }}
                    />
                  </Col>
                  {/* ข้อมูลผู้ใช้ */}
                  <Col xs={24} sm={16} md={18}>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>อีเมล์: {selectedBooking.user.email}</Text>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>หมายเลขโทรศัพท์: {selectedBooking.user.phone_number}</Text>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>แผนก: {selectedBooking.user.department}</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* ข้อมูลรถที่จอง */}
            {selectedBooking.carDetails && (
              <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Row gutter={16}>
                  {/* ข้อมูลภาพรถ */}
                  <Col xs={24} sm={8} md={6}>
                    <img
                      src={`http://localhost:5182${selectedBooking.carDetails.image_url}`}
                      alt="Car"
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </Col>
                  {/* ข้อมูลรถ */}
                  <Col xs={24} sm={16} md={18}>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>รถที่จอง: {selectedBooking.carDetails.brand} {selectedBooking.carDetails.model}</Text>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>ทะเบียนรถ: {selectedBooking.carDetails.license_plate}</Text>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <Text strong style={{ fontSize: '14px' }}>ปีผลิต: {selectedBooking.carDetails.year}</Text>
                    </div>
                  </Col>
                </Row>
              </div>
            )}

            {/* ข้อมูลการจอง */}
            <div style={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ marginBottom: '10px' }}>
                <Text strong style={{ fontSize: '14px' }}>หมายเลขการจอง: {selectedBooking.confirmation_id}</Text>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Text strong style={{ fontSize: '14px' }}>ชื่อผู้จอง: {selectedBooking.full_name}</Text>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Text strong style={{ fontSize: '14px' }}>วันที่จอง: {selectedBooking.booking_date}</Text>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Text strong style={{ fontSize: '14px' }}>จุดหมาย: {selectedBooking.destination}</Text>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <Text strong style={{ fontSize: '14px' }}>สถานะ: {selectedBooking.booking_status === 2 ? "อนุมัติแล้ว" : "คืนรถแล้ว"}</Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default ApproveBookings;
