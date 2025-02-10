import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import { FlagOutlined, UserOutlined, SettingOutlined, LogoutOutlined, DownOutlined, } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({ onUserFullNameChange }) => {  // รับ prop จาก ApproveBookings
    const [userFullName, setUserFullName] = useState(null);

    useEffect(() => {
        const storedFullName = localStorage.getItem("userFullName");
        if (storedFullName) {
            setUserFullName(storedFullName);
            if (typeof onUserFullNameChange === 'function') {
                onUserFullNameChange(storedFullName);  // เรียกใช้ฟังก์ชันถ้ามี
            }
        }
    }, [onUserFullNameChange]);


    // ฟังก์ชันที่ใช้สำหรับออกจากระบบ
    const handleLogout = () => {
        console.log("ออกจากระบบ");
        localStorage.removeItem("userId");
        localStorage.removeItem("userFullName");
        window.location.href = "/";
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="profile">
                <UserOutlined style={{ marginRight: 8 }} />
                Profile
            </Menu.Item>
            <Menu.Item key="profile">
                <SettingOutlined style={{ marginRight: 8 }} />
                Setting
            </Menu.Item>
            <Menu.Item key="logout" onClick={handleLogout}>
                <LogoutOutlined style={{ marginRight: 8 }} />
                Sign Out
            </Menu.Item>
        </Menu>
    );

    // เมนูสำหรับเลือกภาษา
    const languageMenu = (
        <Menu>
            <Menu.Item key="thai">
                <img
                    src="/assets/thailand.png"  // ใช้ src เพื่อชี้ไปที่ไฟล์รูปภาพใน public/assets
                    alt="Language Flag"
                    style={{ width: "20px", height: "auto", marginRight: "8px" }}  // เพิ่มระยะห่างระหว่างภาพและข้อความ
                />
                ไทย
            </Menu.Item>
            <Menu.Item key="english">
                <img
                    src="/assets/england.png"  // ใช้ src เพื่อชี้ไปที่ไฟล์รูปภาพใน public/assets
                    alt="Language Flag"
                    style={{ width: "20px", height: "auto", marginRight: "8px" }}  // เพิ่มระยะห่างระหว่างภาพและข้อความ
                />
                อังกฤษ
            </Menu.Item>
        </Menu>
    );

    const menu = (
        <Menu>

            <Menu.Item key="profile">
                <SettingOutlined style={{ marginRight: 8 }} />
                Setting
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Header
                style={{
                    backgroundColor: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 30px",
                    height: "80px",
                    borderBottom: "1px solid #777676",
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1000,
                }}
            >
                {/* ชื่อสำนักงาน */}
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    ระบบการจองรถและห้องประชุม
                </div>

                {/* ส่วนขวา */}
                <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                    {/* ธงภาษา */}
                    <Dropdown overlay={languageMenu} trigger={["click"]}>
                        <Button
                            style={{
                                backgroundColor: "#fffff",
                                border: "none",
                                padding: 0,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <img
                                src="/assets/thailand.png"  // ใช้ src เพื่อชี้ไปที่ไฟล์รูปภาพใน public/assets
                                alt="Language Flag"
                                style={{ width: "20px", height: "auto" }}  // ปรับขนาดของภาพ
                            />
                            <DownOutlined />
                        </Button>
                    </Dropdown>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <SettingOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                        </Dropdown>
                    </div>

                    {/* ชื่อผู้ใช้งานและสถานะ */}
                    <Dropdown overlay={userMenu} trigger={["click"]}>
                        <div
                            style={{
                                display: "flex", // ใช้ flex เพื่อจัดวางทุกอย่างในบรรทัดเดียวกัน
                                alignItems: "center", // จัดแนวกลางในแนวตั้ง
                                padding: "10px",
                                lineHeight: "1",
                            }}
                        >
                            <img
                                src="/assets/profile.png"  // ใช้ src เพื่อชี้ไปที่ไฟล์รูปภาพใน public/assets
                                alt="Language Flag"
                                style={{ width: "30px", height: "auto" }}  // ปรับขนาดของภาพ
                            />

                            <div
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    marginLeft: "10px", // เพิ่มระยะห่างระหว่างไอคอนและชื่อ
                                    textAlign: "center",
                                    cursor: "pointer",
                                }}
                            >
                                {userFullName || "ผู้ใช้งาน"}
                            </div>
                            <DownOutlined style={{ cursor: "pointer", marginLeft: "10px" }} />
                        </div>
                    </Dropdown>
                </div>
            </Header>
        </Layout>
    );
};
export default Navbar;