'use client';
import React, { useState } from "react";
import { Layout, Table, Button, Select, Input, DatePicker, Space, Modal, Form } from "antd";
import Sidebar from "../component/sidebar";
import Navbar from "../component/navbar";

const { Content } = Layout;
const { Option } = Select;

function Approve() {
    const [data, setData] = useState([
        {
            key: "1",
            name: 'anan',
            contactNumber: '0987654321',
            department: 'โปรแกรมเมอร์',
            destination: 'ห้องประชุมจังหวัดพัทลุง',
            passengers: '10 คน',
            carType: 'Sedan',
            status: "รออนุมัติ",
            reservationNumber: "AAA0001",
            license: "กษ 9178",
            usageDate: "05 ก.พ. 67 - 05 ก.พ. 67",
            purpose: "เดินทางไปประชุมจังหวัด",
        },
        {
            key: "2",
            name: 'สมชาย ใจดี',
            contactNumber: '0891234567',
            department: 'ฝ่ายการตลาด',
            destination: 'สำนักงานสาขาเชียงใหม่',
            passengers: '3 คน',
            carType: 'SUV',
            status: "อนุมัติ",
            reservationNumber: "AAA0002",
            license: "ขส 1234",
            usageDate: "10 ก.พ. 67 - 12 ก.พ. 67",
            purpose: "สำรวจตลาดและพบลูกค้า",
        },
        {
            key: "3",
            name: 'จารุวรรณ แสนดี',
            contactNumber: '0812345678',
            department: 'ฝ่ายบัญชี',
            destination: 'ธนาคารกรุงเทพ สาขาสุราษฎร์ธานี',
            passengers: '1 คน',
            carType: 'Sedan',
            status: "รออนุมัติ",
            reservationNumber: "AAA0003",
            license: "ขก 5678",
            usageDate: "08 ก.พ. 67 - 08 ก.พ. 67",
            purpose: "ยื่นเอกสารทางการเงิน",
        },
        {
            key: "4",
            name: 'อารีย์ ดวงแก้ว',
            contactNumber: '0865432198',
            department: 'ฝ่ายทรัพยากรบุคคล',
            destination: 'โรงแรมในกรุงเทพ',
            passengers: '5 คน',
            carType: 'Van',
            status: "รออนุมัติ",
            reservationNumber: "AAA0004",
            license: "กม 8765",
            usageDate: "15 ก.พ. 67 - 17 ก.พ. 67",
            purpose: "จัดสัมมนาและอบรมพนักงาน",
        },
        {
            key: "5",
            name: 'วิชัย ทองสุก',
            contactNumber: '0853219876',
            department: 'ฝ่ายวิจัยและพัฒนา',
            destination: 'โรงงานผลิตที่ระยอง',
            passengers: '2 คน',
            carType: 'Pickup',
            status: "ไม่อนุมัติ",
            reservationNumber: "AAA0005",
            license: "บด 3456",
            usageDate: "20 ก.พ. 67 - 21 ก.พ. 67",
            purpose: "ตรวจสอบกระบวนการผลิต",
        },
    ]);

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isFailedReturnModalVisible, setIsFailedReturnModalVisible] = useState(false);
    const [failedReturnReason, setFailedReturnReason] = useState("");
    const [editFormData, setEditFormData] = useState(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);


    const handleEdit = (record) => {
        setEditFormData(record);
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === editFormData.key ? { ...item, ...editFormData } : item
            )
        );
        setIsEditModalVisible(false);
    };

    const handleRowClick = (record) => {
        setSelectedRow(record);
        setIsDetailModalVisible(true);
    };

    const handleApprove = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: "อนุมัติ" } : item
            )
        );
        // อย่าลืมปรับเงื่อนไขแสดงปุ่ม
    };

    const handleReject = (record) => {
        setSelectedRow(record);
        setIsRejectModalVisible(true);
        // ปรับเงื่อนไขแสดงปุ่ม
    };

    const handleRejectSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRow.key
                    ? { ...item, status: "ไม่อนุมัติ" }
                    : item
            )
        );
        setRejectReason("");
        setIsRejectModalVisible(false);
    };

    const handleConfirmReturn = (record) => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, status: "ส่งคืนเสร็จ" } : item
            )
        );
    };

    const handleFailedReturn = (record) => {
        setSelectedRow(record);
        setIsFailedReturnModalVisible(true);
    };

    const handleFailedReturnSubmit = () => {
        setData((prevData) =>
            prevData.map((item) =>
                item.key === selectedRow.key
                    ? { ...item, status: "ส่งคืนไม่สำเร็จ" }
                    : item
            )
        );
        setFailedReturnReason("");
        setIsFailedReturnModalVisible(false);
    };

    const columns = [
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            render: (text) => {
                const statusColors = {
                    "อนุมัติ": "#A5D6A7", // สีเขียวพาสเทลอ่อน (นุ่มนวล)
                    "รออนุมัติ": "#DCE775", // สีเขียวอ่อนพาสเทล (มินิมอล)
                    "ส่งคืนเสร็จ": "#81C784", // สีเขียวอ่อนเข้มขึ้น (ใกล้เคียงธรรมชาติ)
                    "ส่งคืนไม่สำเร็จ": "#C8E6C9", // สีเขียวอ่อนเบา (นุ่มนวล)
                    "ไม่อนุมัติ": "#A5D6A7" // สีเขียวอ่อนพาสเทล (ไม่แสบตา)
                };

                return (
                    <span
                        style={{
                            backgroundColor: statusColors[text] || "#4CAF50", // สีเขียวด้าน (matte) สำหรับกรณีอื่นๆ
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "12px", // มุมกลม
                            fontSize: "0.9rem",
                            display: "inline-block",
                            textAlign: "center",
                            minWidth: "90px", // ขยายให้พอดี
                            opacity: 0.9, // เพิ่มความด้าน
                        }}
                    >
                        {text}
                    </span>
                );
            },
        },

        {
            title: "เลขที่ใบจอง",
            dataIndex: "reservationNumber",
            key: "reservationNumber",
            render: (text) => <span style={{ fontWeight: "500" }}>{text}</span>,
        },
        {
            title: "ทะเบียน",
            dataIndex: "license",
            key: "license",
            render: (text) => <span style={{ fontWeight: "500" }}>{text}</span>,
        },
        {
            title: "วันที่ใช้งาน",
            dataIndex: "usageDate",
            key: "usageDate",
            render: (text) => (
                <span style={{ color: "#616161", fontSize: "0.9rem" }}>{text}</span>
            ),
        },
        {
            title: "การกระทำ",
            key: "action",
            render: (_, record) => (
              <Space size="small">
                {record.status === "รออนุมัติ" && (
                  <>
                    <Button
                      type="primary"
                      size="small"
                      style={{
                        backgroundColor: "#0a7e07", // สีเขียวสด (สำหรับอนุมัติ)
                        color: "#fff", // สีฟอนต์เป็นสีขาว
                        border: "none",
                        transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                        transform: "scale(1)", // ขนาดปกติ
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(record);
                      }}
                      className="action-button"
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                      }}
                    >
                      อนุมัติ
                    </Button>
                    <Button
                      size="small"
                      danger
                      style={{
                        backgroundColor: "#bf360c", // สีแดงอ่อน
                        color: "#fff", // สีฟอนต์เป็นสีขาว
                        border: "none",
                        transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                        transform: "scale(1)", // ขนาดปกติ
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(record);
                      }}
                      className="action-button"
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                      }}
                    >
                      ไม่อนุมัติ
                    </Button>
                  </>
                )}
          
                <Button
                  size="small"
                  style={{
                    backgroundColor: "#827717", // สีเหลือง
                    color: "#fff", // สีฟอนต์เป็นสีขาว
                    border: "none",
                    transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                    transform: "scale(1)", // ขนาดปกติ
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(record);
                  }}
                  className="action-button"
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                  }}
                >
                  แก้ไขข้อมูล
                </Button>
          
                {record.status === "ส่งคืนแล้ว" && (
                  <>
                    <Button
                      size="small"
                      style={{
                        backgroundColor: "#81C784", // สีเขียวอ่อนเข้ม
                        color: "#fff", // สีฟอนต์เป็นสีขาว
                        border: "none",
                        transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                        transform: "scale(1)", // ขนาดปกติ
                      }}
                      onClick={() => handleConfirmReturn(record)}
                      className="action-button"
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                      }}
                    >
                      ยืนยันส่งคืนเสร็จ
                    </Button>
                    <Button
                      size="small"
                      danger
                      style={{
                        backgroundColor: "#FFCDD2", // สีแดงอ่อนพาสเทล
                        color: "#fff", // สีฟอนต์เป็นสีขาว
                        border: "none",
                        transition: "all 0.3s ease", // เพิ่ม transition สำหรับการเปลี่ยนแปลง
                        transform: "scale(1)", // ขนาดปกติ
                      }}
                      onClick={() => handleFailedReturn(record)}
                      className="action-button"
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.1)"; // ขยายขนาดเมื่อเมาส์ไปวาง
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)"; // ย่อขนาดกลับเมื่อเมาส์ออก
                      }}
                    >
                      ส่งคืนไม่สำเร็จ
                    </Button>
                  </>
                )}
              </Space>
            ),
          }
                       
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Navbar />
            <Layout style={{ padding: "0px 20px", marginTop: "65px" }}>
                <Sidebar />
                <Layout style={{ padding: "0px 20px" }}>
                    <Content
                        style={{
                            padding: "24px",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div style={{ fontFamily: 'var(--font-kanit)', maxWidth: "900px", margin: "0 auto" }}>
                            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
                                <Select
                                    placeholder="==ทุกสถานะ=="
                                    style={{ width: "200px" }}
                                    allowClear
                                >
                                    <Option value="อนุมัติ">อนุมัติ</Option>
                                    <Option value="รออนุมัติ">รออนุมัติ</Option>
                                    <Option value="ส่งคืนแล้ว">ส่งคืนแล้ว</Option>
                                </Select>
                                <DatePicker placeholder="จากวันที่ใช้รถ" style={{ width: "200px" }} />
                                <DatePicker placeholder="ถึงวันที่" style={{ width: "200px" }} />
                                <Input
                                    placeholder="ค้นหา..."
                                    style={{ width: "200px" }}
                                />
                                <Button type="primary" style={{ background: '#029B36' }}>ค้นหา</Button>
                            </div>

                            <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                onRow={(record) => ({
                                    onClick: (e) => {
                                        if (!e.target.closest("button")) { // เช็คว่าไม่ใช่ปุ่ม
                                            handleRowClick(record);
                                        }
                                    },
                                })}
                                rowClassName="clickable-row"
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    </Content>
                </Layout>
            </Layout>

            {/* Modal Details */}
            <Modal
                title="รายละเอียดการจอง"
                visible={isDetailModalVisible}
                onCancel={() => setIsDetailModalVisible(false)}
                footer={null}
                bodyStyle={{
                    fontFamily: 'var(--font-kanit)', // ใช้ฟอนต์ Prompt สำหรับการอ่านง่าย

                    padding: "16px", // ลด padding ให้เล็กลง
                    color: "#333", // สีข้อความที่ดูเรียบง่าย
                    background: '#ffff'
                }}
                titleStyle={{
                    fontFamily: 'var(--font-kanit)',
                    fontSize: "16px", // ขนาดฟอนต์หัวข้อที่เล็กลง
                    fontWeight: "500", // น้ำหนักตัวอักษรหัวข้อที่ดูเรียบง่าย
                    color: "#4a90e2", // เปลี่ยนสีหัวข้อให้เข้ากับธีม

                }}
                width={500} // ปรับขนาดของ Modal ให้เล็กลง
            >
                <div style={{ padding: "12px", fontSize: "14px", lineHeight: "1.4" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr",
                            gap: "12px",
                            alignItems: "center",
                            marginBottom: "10px", // ลดระยะห่าง
                            background: '#ffff'
                        }}
                    >
                        <div style={{ fontWeight: "500" }}><strong>เลขที่ใบจอง:</strong></div>
                        <div>{selectedRow?.reservationNumber}</div>

                        <div style={{ fontWeight: "500" }}><strong>ชื่อ-สกุล:</strong></div>
                        <div>{selectedRow?.name}</div>

                        <div style={{ fontWeight: "500" }}><strong>ฝ่าย/แผนก:</strong></div>
                        <div>{selectedRow?.department}</div>

                        <div style={{ fontWeight: "500" }}><strong>เบอร์ติดต่อ:</strong></div>
                        <div>{selectedRow?.contactNumber}</div>

                        <div style={{ fontWeight: "500" }}><strong>วันที่ใช้งาน:</strong></div>
                        <div>{selectedRow?.usageDate}</div>

                        <div style={{ fontWeight: "500" }}><strong>ปลายทาง:</strong></div>
                        <div>{selectedRow?.destination}</div>

                        <div style={{ fontWeight: "500" }}><strong>จำนวนผู้โดยสาร:</strong></div>
                        <div>{selectedRow?.passengers}</div>

                        <div style={{ fontWeight: "500" }}><strong>จองใช้งานเพื่อ:</strong></div>
                        <div>{selectedRow?.purpose}</div>

                        <div style={{ fontWeight: "500" }}><strong>ประเภทรถ:</strong></div>
                        <div>{selectedRow?.carType}</div>

                        <div style={{ fontWeight: "500" }}><strong>ทะเบียน:</strong></div>
                        <div>{selectedRow?.license}</div>
                    </div>
                </div>
            </Modal>


            {/* Modal Reject */}
            <Modal
                title="เหตุผลที่ไม่อนุมัติ"
                visible={isRejectModalVisible}
                onCancel={() => setIsRejectModalVisible(false)}
                onOk={handleRejectSubmit}
            >
                <Input.TextArea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    placeholder="กรุณากรอกเหตุผล"
                />
            </Modal>

            {/* Modal Failed Return */}
            <Modal
                title="เหตุผลที่ส่งคืนไม่สำเร็จ"
                visible={isFailedReturnModalVisible}
                onCancel={() => setIsFailedReturnModalVisible(false)}
                onOk={handleFailedReturnSubmit}
            >
                <Input.TextArea
                    value={failedReturnReason}
                    onChange={(e) => setFailedReturnReason(e.target.value)}
                    rows={4}
                    placeholder="กรุณากรอกเหตุผล"
                />
            </Modal>
            <Modal
                title="แก้ไขข้อมูลการจอง"
                visible={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={handleEditSubmit}
            >
                <Form layout="vertical">
                    <Form.Item label="เลขที่ใบจอง">
                        <Input
                            value={editFormData?.reservationNumber}
                            onChange={(e) =>
                                setEditFormData((prev) => ({
                                    ...prev,
                                    reservationNumber: e.target.value,
                                }))
                            }
                        />
                    </Form.Item>
                    <Form.Item label="ทะเบียน">
                        <Input
                            value={editFormData?.license}
                            onChange={(e) =>
                                setEditFormData((prev) => ({
                                    ...prev,
                                    license: e.target.value,
                                }))
                            }
                        />
                    </Form.Item>
                    <Form.Item label="วันที่ใช้งาน">
                        <Input
                            value={editFormData?.usageDate}
                            onChange={(e) =>
                                setEditFormData((prev) => ({
                                    ...prev,
                                    usageDate: e.target.value,
                                }))
                            }
                        />
                    </Form.Item>
                    <Form.Item label="จองใช้งานเพื่อ">
                        <Input
                            value={editFormData?.purpose}
                            onChange={(e) =>
                                setEditFormData((prev) => ({
                                    ...prev,
                                    purpose: e.target.value,
                                }))
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
}

export default Approve;