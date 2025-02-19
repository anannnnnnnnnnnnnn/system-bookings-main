'use client'
import { useState, useEffect } from "react";
import { Table, Button, message, Layout, Typography, Row, Col, Modal, Input, Breadcrumb, Select, Dropdown, Menu, Space, Card } from "antd";
import { HomeOutlined, HourglassOutlined, DownOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Navbar from "@/app/users/home/navbar";
import Sidebar from "../components/sidebar";
import dayjs from "dayjs";
import "dayjs/locale/th"; // ใช้ภาษาไทย
import customParseFormat from "dayjs/plugin/customParseFormat";
const { Title, Text } = Typography;
const { Option } = Select;

dayjs.locale("th");
dayjs.extend(customParseFormat);

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(1);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [activeStatus, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5182/api/roombookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      message.error("โหลดข้อมูลล้มเหลว");
    }
    setLoading(false);
  };

  const filterBookings = () => {
    const filtered = bookings.filter((booking) => booking.booking_status === activeStatus);
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (id, status, reason = "") => {
    setLoading(true);
    try {
      // ตรวจสอบว่า id ถูกต้องหรือไม่
      if (!id) {
        throw new Error("ID การจองไม่ถูกต้อง");
      }

      // ส่งคำขอไปที่ API
      const res = await fetch(`http://localhost:5182/api/roombookings/${id}/${status === 2 ? "approve" : "reject"}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status === 2 ? { status } : { rejectReason: reason }),
      });

      // ตรวจสอบสถานะการตอบกลับจาก API
      if (!res.ok) {
        throw new Error("ไม่สามารถอัปเดตสถานะการจองได้");
      }

      const updatedBooking = await res.json(); // ดึงข้อมูลที่อัปเดตจาก API

      // อัปเดตสถานะใน state ของ bookings
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.confirmation_id === id
            ? { ...booking, booking_status: status, reject_reason: status === 3 ? reason : booking.reject_reason }
            : booking
        )
      );

      message.success(status === 2 ? "อนุมัติเรียบร้อย!" : "ปฏิเสธการจองเรียบร้อย!");

    } catch (error) {
      message.error("เกิดข้อผิดพลาด: " + error.message);
    }
    setLoading(false);
  };

  const showRejectModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsRejectModalVisible(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      message.error("กรุณากรอกเหตุผลการปฏิเสธ");
      return;
    }

    // อัปเดตสถานะการจองเป็นไม่อนุมัติ (3)
    updateBookingStatus(selectedBookingId, 3, rejectReason)
      .then(() => {
        // รีเฟรชหน้าเว็บหลังจากปฏิเสธสำเร็จ
        window.location.reload();
      })
      .catch((error) => {
        message.error("เกิดข้อผิดพลาดในการปฏิเสธการจอง");
      });

    // ปิด Modal และล้างค่าที่กรอก
    setIsRejectModalVisible(false);
    setRejectReason("");
  };


  const showBookingDetails = async (booking) => {
    try {
      const resUser = await fetch(`http://localhost:5182/api/users/by-name?full_name=${booking.full_name}`);
      const userData = await resUser.json();

      // ดึงข้อมูลห้องประชุมแทนการดึงข้อมูลรถ
      const roomRes = await fetch(`http://localhost:5182/api/rooms/${booking.room_id}`); // ใช้ meeting_room_id แทน car_id
      const roomData = await roomRes.json();

      setSelectedBookingDetails({
        ...booking,
        user: userData[0] || null,
        roomDetails: roomData || null // เก็บข้อมูลห้องประชุมใน state
      });
    } catch (error) {
      message.error("โหลดข้อมูลผู้ใช้หรือห้องประชุมล้มเหลว");
      setSelectedBookingDetails(booking); // ถ้าไม่สามารถโหลดข้อมูลได้ก็ให้แสดงข้อมูลเดิม
    }
  };


  // เมนู Dropdown สำหรับการดำเนินการ
  const actionMenu = (record) => {
    const handleAction = (status) => {
      if (status === 2) {
        // แก้ไขการเรียกใช้ด้วย `confirmation_id`
        updateBookingStatus(record.roombooking_id, 2)
          .then(() => {
            // รีเฟรชหน้าหลังจากสถานะถูกอัปเดตเป็น 2 (อนุมัติ)
            window.location.reload();
          })
          .catch((error) => {
            message.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ");
          });
      } else if (status === 3) {
        showRejectModal(record.roombooking_id)
          .then(() => {
            // รีเฟรชหน้าหลังจากดำเนินการไม่อนุมัติเสร็จสิ้น
            window.location.reload();
          })
          .catch((error) => {
            message.error("เกิดข้อผิดพลาดในการปฏิเสธการจอง");
          });
      }
    };

    return (
      <Menu>
        {record.booking_status === 1 && (
          <>
            <Menu.Item key="approve" onClick={() => handleAction(2)}>
              <CheckCircleOutlined style={{ fontSize: '16px', marginRight: '8px', color: '#4CAF50' }} />
              อนุมัติ
            </Menu.Item>
            <Menu.Item key="reject" onClick={() => handleAction(3)}>
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
      title: "วันที่จองและคืน",
      key: "booking_dates",
      render: (text, record) => {
        const bookingDate = dayjs(record.booking_date).format("DD MMM YYYY");
        const returnDate = dayjs(record.return_date).format("DD MMM YYYY");
        return `${bookingDate} - ${returnDate}`;
      },
    },
    {
      title: "เวลา",
      dataIndex: "booking_times",
      key: "booking_times",
      width: 120,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>
    },
    {
      title: "ผู้จอง",
      dataIndex: "full_name",
      key: "full_name",
      width: 100,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>
    },
    {
      title: "หมายเลขการจอง",
      dataIndex: "roombooking_number",
      key: "roombooking_number",
      width: 100,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>
    },

    {
      title: "เหตุผลปฏิเสธ",
      dataIndex: "roomreject_reason",
      key: "roomreject_reason",
      width: 120,
      ellipsis: true,
      render: (text) => <span style={{ whiteSpace: "nowrap" }}>{text}</span>
    },
    {
      title: "สถานะ",
      key: "action",
      width: 120,
      ellipsis: true,
      render: (_, record) => (
        <Dropdown overlay={actionMenu(record)} trigger={["click"]}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
            onClick={(e) => e.stopPropagation()} // เพิ่มการหยุดการกระจายเหตุการณ์
          >
            {record.booking_status === 2 ? (
              <CheckCircleOutlined style={{ fontSize: "16px", color: "#4CAF50" }} />
            ) : record.booking_status === 3 ? (
              <CloseCircleOutlined style={{ fontSize: "16px", color: "#f44336" }} />
            ) : (
              <HourglassOutlined style={{ fontSize: "16px", color: "#FFA500" }} />
            )}
            <span style={{ marginLeft: "8px" }}>
              {record.booking_status === 2
                ? "อนุมัติ"
                : record.booking_status === 3
                  ? "ไม่อนุมัติ"
                  : "รออนุมัติ"}
            </span>
          </div>
        </Dropdown>
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
              dataSource={[...filteredBookings].sort((a, b) => b.roombooking_id - a.roombooking_id)}
              columns={columns}
              rowKey="roombooking_id"
              bordered
              pagination={{ pageSize: 5 }}
              scroll={{ x: "max-content" }}  // ป้องกันหัวตารางขึ้นสองแถว
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                width: "910px",
                margin: "auto",
                fontSize: "12px"
              }}
              onRow={(record) => ({
                onClick: () => showBookingDetails(record),
              })}
            />

          </div>

        </Layout>
      </Layout>

      <Modal
        title="รายละเอียดการจอง"
        visible={selectedBookingDetails !== null}
        onCancel={() => setSelectedBookingDetails(null)}
        footer={null}
        width={900}
        bodyStyle={{
          padding: '10px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
        }}
      >
        {selectedBookingDetails && (
          <Row gutter={16}>
            {/* ข้อมูลผู้จอง */}
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

            {/* ข้อมูลห้องประชุมและการจอง */}
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
                <Row gutter={[8, 8]}>
                  {/* ภาพห้องประชุมและรายละเอียด */}
                  {selectedBookingDetails.roomDetails && (
                    <Col span={24}>
                      <Row gutter={[8, 8]}>
                        <Col xs={24} sm={8} style={{ paddingRight: '10px' }}>
                          <img
                            src={`http://localhost:5182${selectedBookingDetails.roomDetails.room_img}`} // แสดงภาพห้องประชุม
                            alt="Meeting Room"
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

                              <div><Text strong>ชื่อห้องประชุม:</Text> <Text>{selectedBookingDetails.roomDetails.room_name}</Text></div>
                              <div><Text strong>อุปกรณ์ที่มีในห้อง:</Text> <Text>{selectedBookingDetails.roomDetails.equipment}</Text></div>
                            </Col>
                            <Col span={12}>
                              <div><Text strong>ที่อยู่:</Text> <Text>{selectedBookingDetails.roomDetails.location}</Text></div>
                              <div><Text strong>ความจุสูงสุด:</Text> <Text>{selectedBookingDetails.roomDetails.capacity}</Text></div>
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
                <Row gutter={[16, 16]} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* หมายเลขการจอง */}
                  <Col span={24}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>หมายเลขการจอง:</Text>
                      <Text style={{ fontSize: '16px', color: '#555' }}>{selectedBookingDetails.roombooking_number}</Text>
                    </div>
                  </Col>

                  {/* ข้อมูลอื่นๆ */}
                  <Col xs={24} sm={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <Text style={{ fontWeight: 'bold' }}>วันที่จอง:</Text>
                      <Text>{new Date(selectedBookingDetails.booking_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text style={{ fontWeight: 'bold' }}>เวลาเริ่ม:</Text>
                      <Text>{selectedBookingDetails.booking_times}</Text>
                    </div>
                  </Col>

                  <Col xs={24} sm={12}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <Text style={{ fontWeight: 'bold' }}>เวลาสิ้นสุด:</Text>
                      <Text>{new Date(selectedBookingDetails.return_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text style={{ fontWeight: 'bold' }}>สถานะการจอง:</Text>
                      <Text
                        style={{
                          color:
                            selectedBookingDetails?.booking_status === 2
                              ? '#4CAF50'
                              : selectedBookingDetails?.booking_status === 3
                                ? '#f44336'
                                : '#FFA500',
                        }}
                      >
                        {selectedBookingDetails?.booking_status &&
                          ['รออนุมัติ', 'อนุมัติแล้ว', 'ปฏิเสธการจอง'][selectedBookingDetails.booking_status - 1]}
                      </Text>

                      <Dropdown overlay={actionMenu(selectedBookingDetails)} trigger={['click']}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
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

      {/* Modal สำหรับเหตุผลการปฏิเสธ */}
      <Modal
        title="เหตุผลในการปฏิเสธ"
        visible={isRejectModalVisible}
        onCancel={() => setIsRejectModalVisible(false)}
        onOk={handleRejectSubmit}
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="กรุณากรอกเหตุผลในการปฏิเสธ"
        />
      </Modal>
    </Layout>
  );
};

export default ApproveBookings;
