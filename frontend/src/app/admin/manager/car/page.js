'use client'
import { useState, useEffect } from "react";
import { Table, Button, message, Layout, Typography, Row, Col, Modal, Input, Breadcrumb, Select, Dropdown, Menu, Space, Card } from "antd";
import { HomeOutlined, HourglassOutlined, DownOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Navbar from "@/app/users/home/navbar";
import Sidebar from "../components/sidebar";

const { Title, Text } = Typography;
const { Option } = Select;

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(1); // ใช้เก็บสถานะที่เลือก
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null); // สำหรับเก็บข้อมูลการจองที่คลิก
  const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);



  useEffect(() => {
    fetchBookings();
  }, []); // ดึงข้อมูลครั้งเดียว

  useEffect(() => {
    filterBookings(); // กรองข้อมูลตามสถานะที่เลือก
  }, [activeStatus, bookings]); // ทุกครั้งที่มีการเปลี่ยนแปลง activeStatus หรือ bookings

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5182/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      message.error("โหลดข้อมูลล้มเหลว");
    }
    setLoading(false);
  };

  const filterBookings = () => {
    const filtered = bookings
      .filter((booking) => booking.booking_status === activeStatus)
      .sort((a, b) => b.confirmation_id - a.confirmation_id); // เรียงจากใหม่ไปเก่า
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (id, status, reason = "") => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5182/api/bookings/${id}/${status === 2 ? "approve" : "reject"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status === 2 ? { status } : { rejectReason: reason }),
      });

      // Optimistically update the UI without waiting for API response
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.confirmation_id === id
            ? { ...booking, booking_status: status, reject_reason: status === 3 ? reason : booking.reject_reason }
            : booking
        )
      );

      message.success(status === 2 ? "อนุมัติเรียบร้อย!" : "ปฏิเสธการจองเรียบร้อย!");
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };

  const showRejectModal = (id) => {
    setSelectedBookingId(id);
    setIsRejectModalVisible(true);
  };

  const showBookingDetails = async (booking) => {
    try {
      const [resUser, carRes] = await Promise.all([
        fetch(`http://localhost:5182/api/users/by-name?full_name=${booking.full_name}`),
        fetch(`http://localhost:5182/api/cars/${booking.car_id}`)
      ]);

      const userData = resUser.ok ? await resUser.json() : null;
      const carData = carRes.ok ? await carRes.json() : null;

      setSelectedBookingDetails({
        ...booking,
        user: userData?.[0] || null,
        carDetails: carData || null
      });
    } catch (error) {
      message.error("โหลดข้อมูลล้มเหลว");
      setSelectedBookingDetails(booking); // แสดงข้อมูลเฉพาะที่มีอยู่
    }
  };

  // เมนู Dropdown สำหรับการดำเนินการ
  const actionMenu = (record) => {
    const handleAction = (status) => {
      if (status === 2) {
        setIsApproveModalVisible(true); // เปิด Modal อนุมัติสำเร็จ
        updateBookingStatus(record.confirmation_id, 2);
      } else if (status === 3) {
        setSelectedBookingId(record.confirmation_id); // เก็บ ID การจอง
        setIsRejectModalVisible(true); // เปิด Modal ปฏิเสธการจอง
      }
    };
  
    return (
      <Menu>
        {record.booking_status === 1 && (
          <>
            <Menu.Item key="approve" onClick={(e) => { e.domEvent.stopPropagation(); handleAction(2); }}>
              <CheckCircleOutlined style={{ fontSize: '16px', marginRight: '8px', color: '#4CAF50' }} />
              อนุมัติ
            </Menu.Item>
            <Menu.Item key="reject" onClick={(e) => { e.domEvent.stopPropagation(); handleAction(3); }}>
              <CloseCircleOutlined style={{ fontSize: '16px', marginRight: '8px', color: '#f44336' }} />
              ไม่อนุมัติ
            </Menu.Item>
          </>
        )}
      </Menu>
    );
  };
  
  const columns = [
    {
      title: "วันที่จอง",
      dataIndex: "booking_date",
      key: "booking_date",
      render: (date) => {
        const formattedDate = new Date(date);
        return new Intl.DateTimeFormat('th-TH', {
          day: '2-digit',
          month: 'short',  // เปลี่ยนเป็นคำย่อของเดือน
          year: 'numeric'
        }).format(formattedDate);
      }
    },
    { title: "เวลาจอง", dataIndex: "booking_time", key: "booking_time" },
    { title: "ชื่อผู้จอง", dataIndex: "full_name", key: "full_name" },
    { title: "จุดหมาย", dataIndex: "destination", key: "destination" },
    { title: "หมายเลขการจอง", dataIndex: "confirmation_id", key: "confirmation_id" },
    {
      title: "เหตุผลปฏิเสธ",
      dataIndex: "reject_reason",
      key: "reject_reason",
      render: (reason, record) => record.booking_status === 3 ? (reason || "-") : "-",
    },
    {
      title: "สถานะ",
      key: "action",
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', cursor: record.booking_status === 1 ? 'pointer' : 'not-allowed' }}>
          {record.booking_status === 2 ? (
            // แสดงไอคอนอนุมัติแล้ว
            <>
              <CheckCircleOutlined style={{ fontSize: '20px', color: '#4CAF50' }} />
              <span style={{ marginLeft: '8px', color: '#4CAF50' }}>อนุมัติแล้ว</span>
            </>
          ) : record.booking_status === 3 ? (
            // แสดงไอคอนปฏิเสธ
            <>
              <CloseCircleOutlined style={{ fontSize: '20px', color: '#f44336' }} />
              <span style={{ marginLeft: '8px', color: '#f44336' }}>ไม่อนุมัติ</span>
            </>
          ) : (
            // สถานะ รออนุมัติ ที่มี Dropdown
            <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
              <div
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation(); // หยุด event ไม่ให้ไป trigger การเปิด Modal
                  if (record.booking_status === 1) {
                    // ทำ action ที่ต้องการ
                  }
                }}
              >
                <HourglassOutlined style={{ fontSize: '20px', color: '#FFA500' }} />
                <span style={{ marginLeft: '8px', color: '#FFA500' }}>รออนุมัติ</span>
                <DownOutlined style={{ fontSize: '12px', marginLeft: '5px', color: '#FFA500' }} />
              </div>
            </Dropdown>
          )}
        </div>
      ),
    }
  ];

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
          <div style={{ display: "flex", alignItems: "center", margin: "0 100px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: "#d9e8d2", borderRadius: "50%", marginRight: "10px" }}>
              <HomeOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
            </div>
            <Breadcrumb separator=">">
              {["Admin", "หน้าผู้จัดการ"].map((item, index) => (
                <Breadcrumb.Item key={index}>
                  <span style={{ fontWeight: "500", fontSize: "14px", color: index === 3 ? "#333" : "#666" }}>{item}</span>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
            <Title level={4} style={{ color: '#333', fontWeight: '600', marginBottom: '16px' }}>ผู้จัดการ</Title>

            {/* ฟิวเตอร์ด้วย Select */}
            <div style={{ marginBottom: '20px' }}>
              <Select defaultValue={1} onChange={(value) => setActiveStatus(value)} style={{ width: 200 }}>
                <Option value={1}>รออนุมัติ</Option>
                <Option value={2}>อนุมัติแล้ว</Option>
                <Option value={3}>ไม่อนุมัติ</Option>
              </Select>
            </div>

            <Table
              dataSource={[...filteredBookings].sort((a, b) => b.confirmation_id - a.confirmation_id)}
              columns={columns}
              rowKey="confirmation_id"
              bordered
              pagination={{ pageSize: 5 }}
              style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
              onRow={(record) => ({
                onClick: () => showBookingDetails(record),
              })}
            />

            <Modal
              title="รายละเอียดการจอง"
              open={!!selectedBookingDetails} // เปลี่ยนจาก `visible` เป็น `open`
              onCancel={() => setSelectedBookingDetails(null)}
              footer={null}
              width={750} // ลดขนาดให้พอดีกับข้อมูล
              bodyStyle={{ padding: '20px', backgroundColor: '#fff' }}
            >

              {selectedBookingDetails && (
                <Row gutter={16}>
                  {/* ข้อมูลผู้ใช้ */}
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
                        marginBottom: '15px', // ลด margin
                      }}
                    >
                      <img
                        src={`http://localhost:5182${selectedBookingDetails.user.profile_picture}`}
                        alt="Profile"
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '50%',
                          marginBottom: '10px',
                        }}
                      />
                      <Space direction="vertical" size={8} style={{ width: '100%', textAlign: 'center' }}>
                        <div><Text strong>ชื่อ:</Text> <Text>{selectedBookingDetails.full_name}</Text></div>
                        <div><Text strong>อีเมล:</Text> <Text>{selectedBookingDetails.user.email}</Text></div>
                        <div><Text strong>เบอร์โทร:</Text> <Text>{selectedBookingDetails.user.phone_number}</Text></div>
                        <div><Text strong>แผนก:</Text> <Text>{selectedBookingDetails.user.department}</Text></div>
                      </Space>
                    </div>
                  </Col>

                  {/* ข้อมูลรถและการจอง */}
                  <Col span={16}>
                    <Text strong style={{ fontSize: '16px', marginBottom: '8px' }}>รายละเอียดการจอง</Text>
                    <div
                      style={{
                        backgroundColor: '#fff',
                        padding: '12px', // ลด padding
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        marginBottom: '15px', // ลด margin
                      }}
                    >
                      <Row gutter={[8, 8]}>
                        {/* ภาพรถและรายละเอียด */}
                        {selectedBookingDetails.carDetails && (
                          <Col span={24}>
                            <Row gutter={[8, 8]}>
                              <Col xs={24} sm={8} style={{ paddingRight: '10px' }}>
                                <img
                                  src={`http://localhost:5182${selectedBookingDetails.carDetails.image_url}`}
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
                                    <div><Text strong>รหัสรถ:</Text> <Text>{selectedBookingDetails.carDetails.car_id}</Text></div>
                                    <div><Text strong>ยี่ห้อ:</Text> <Text>{selectedBookingDetails.carDetails.brand}</Text></div>
                                    <div><Text strong>รุ่น:</Text> <Text>{selectedBookingDetails.carDetails.model}</Text></div>
                                  </Col>
                                  <Col span={12}>
                                    <div><Text strong>ทะเบียนรถ:</Text> <Text>{selectedBookingDetails.carDetails.license_plate}</Text></div>
                                    <div><Text strong>ประเภทเชื้อเพลิง:</Text>
                                      <Text>{selectedBookingDetails.carDetails.fuel_type === 1 ? 'น้ำมัน' : selectedBookingDetails.carDetails.fuel_type === 2 ? 'ไฟฟ้า' : 'แก๊ส'}</Text>
                                    </div>
                                    <div><Text strong>ความจุที่นั่ง:</Text> <Text>{selectedBookingDetails.carDetails.seating_capacity}</Text></div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        )}
                      </Row>
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
                        <Col span={12}>
                          <div><Text strong>หมายเลขการจอง:</Text> <Text>{selectedBookingDetails.booking_number}</Text></div>
                          <div><Text strong>วันที่จอง:</Text> <Text>{new Date(selectedBookingDetails.booking_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></div>
                        </Col>

                        <Col span={12}>
                          <div><Text strong>วันที่คืนรถ:</Text> <Text>{new Date(selectedBookingDetails.return_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text></div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text strong>สถานะการจอง:</Text>
                            <Text
                              style={{
                                color:
                                  selectedBookingDetails.booking_status === 2
                                    ? '#4CAF50'
                                    : selectedBookingDetails.booking_status === 3
                                      ? '#f44336'
                                      : '#FFA500',
                                fontWeight: 'bold',
                              }}
                            >
                              {['รออนุมัติ', 'อนุมัติแล้ว', 'ปฏิเสธการจอง'][selectedBookingDetails.booking_status - 1]}
                            </Text>
                            <Dropdown overlay={actionMenu(selectedBookingDetails)} trigger={['click']}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  backgroundColor: '#fff',
                                }}
                              >
                                {selectedBookingDetails?.booking_status === 2 ? (
                                  <CheckCircleOutlined style={{ fontSize: '16px', color: '#4CAF50' }} />
                                ) : selectedBookingDetails?.booking_status === 3 ? (
                                  <CloseCircleOutlined style={{ fontSize: '16px', color: '#f44336' }} />
                                ) : (
                                  <DownOutlined style={{ fontSize: '16px', color: '#FFA500' }} />
                                )}
                              </div>
                            </Dropdown>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              )}
            </Modal>
            <Modal
              title="อนุมัติสำเร็จ"
              open={isApproveModalVisible}
              onOk={() => setIsApproveModalVisible(false)}
              onCancel={() => setIsApproveModalVisible(false)}
            >
              <p>การจองได้รับการอนุมัติเรียบร้อยแล้ว</p>
            </Modal>


            <Modal
              title="ปฏิเสธการจอง"
              open={isRejectModalVisible}
              onOk={() => {
                updateBookingStatus(selectedBookingId, 3, rejectReason);
                setIsRejectModalVisible(false);
              }}
              onCancel={() => setIsRejectModalVisible(false)}
            >
              <Input.TextArea
                placeholder="กรุณากรอกเหตุผลในการปฏิเสธ"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </Modal>

          </div>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ApproveBookings;
