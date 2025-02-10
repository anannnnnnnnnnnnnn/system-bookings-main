'use client'
import { useState, useEffect } from "react";
import { Table, Button, message, Layout, Typography, Row, Col, Modal, Input } from "antd";
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import Navbar from "@/app/users/home/navbar";

const { Title } = Typography;

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);



  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:5182/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch (error) {
      message.error("โหลดข้อมูลล้มเหลว");
    }
  };

  const approveBooking = async (id) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:5182/api/bookings/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 2 }),
      });

      message.success("อนุมัติเรียบร้อย!");
      setBookings((prev) => prev.filter((b) => b.confirmation_id !== id));

      window.dispatchEvent(new Event("bookingApproved"));
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }
    setLoading(false);
  };


  const handleRejectBooking = async () => {
    if (!rejectReason.trim()) {
      message.error("กรุณากรอกเหตุผลในการปฏิเสธ");
      return;
    }

    setLoading(true);
    try {
      await fetch(`http://localhost:5182/api/bookings/${selectedBookingId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectReason }),
      });

      message.success("ปฏิเสธการจองเรียบร้อย!");
      setBookings((prev) => prev.filter((b) => b.confirmation_id !== selectedBookingId));
    } catch (error) {
      message.error("เกิดข้อผิดพลาด");
    }

    setLoading(false);
    setIsRejectModalVisible(false);
    setRejectReason("");
  };

  const showRejectModal = (id) => {
    setSelectedBookingId(id);
    setIsRejectModalVisible(true); // Show the modal
  };
  

  const columns = [
    { title: "หมายเลขการจอง", dataIndex: "confirmation_id", key: "confirmation_id" },
    { title: "ชื่อผู้จอง", dataIndex: "full_name", key: "full_name" },
    { title: "วันที่จอง", dataIndex: "booking_date", key: "booking_date" },
    { title: "จุดหมาย", dataIndex: "destination", key: "destination" },
    {
      title: "สถานะการจอง",
      dataIndex: "booking_status",
      key: "booking_status",
      render: (status) => {
        switch (status) {
          case 1: return "รออนุมัติ";
          case 2: return "อนุมัติแล้ว";
          case 3: return "ปฏิเสธการจอง"; // เปลี่ยนจาก "คืนรถ" เป็น "ปฏิเสธการจอง"
          default: return "ไม่ทราบ";
        }
      }
    },
    {
      title: "เหตุผลปฏิเสธ",
      dataIndex: "reject_reason",
      key: "reject_reason",
      render: (reason) => reason || "-",
    },
    {
      title: "ดำเนินการ",
      key: "action",
      render: (_, record) => (
        record.booking_status === 1 ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              type="primary"
              onClick={() => approveBooking(record.confirmation_id)}
              loading={loading}
              style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
            >
              อนุมัติ
            </Button>
            <Button
              type="default"
              danger
              onClick={() => showRejectModal(record.confirmation_id)}
              loading={loading}
            >
              ปฏิเสธ
            </Button>

          </div>
        ) : (
          <span>ไม่สามารถดำเนินการ</span>
        )
      ),
    },
  ];

  return (
    <Layout style={{ backgroundColor: '#fff' }}>
      <Navbar />
      <Layout style={{ marginTop: '100px', backgroundColor: '#ffff', padding: '20px' }}>
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Title level={3} style={{ color: '#333', fontWeight: '600' }}>จัดการการจอง</Title>
          </Col>
        </Row>
        <Row justify="center" style={{ marginBottom: '20px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Button
              icon={<FileTextOutlined />}
              type="default"
              style={{
                marginBottom: '20px',
                borderColor: '#4CAF50',
                color: '#4CAF50',
                borderRadius: '8px',
                fontWeight: '500',
              }}
            >
              ดูรายงานการจองทั้งหมด
            </Button>
          </Col>
        </Row>
        <Table
          dataSource={bookings}
          columns={columns}
          rowKey="confirmation_id"
          bordered
          pagination={{ pageSize: 5 }}
          style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        />

        <Modal
          title="ปฏิเสธการจอง"
          visible={isRejectModalVisible}
          onOk={handleRejectBooking}
          onCancel={() => setIsRejectModalVisible(false)}
        >
          <Input.TextArea
            placeholder="กรุณากรอกเหตุผลในการปฏิเสธ"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />
        </Modal>

      </Layout>
    </Layout>
  );
};

export default ApproveBookings;
