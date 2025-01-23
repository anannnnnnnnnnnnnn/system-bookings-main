import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar } from "antd";
import { FlagOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {

    const [userFullName, setUserFullName] = useState(null); // สถานะสำหรับเก็บชื่อผู้ใช้

    useEffect(() => {
        const storedFullName = localStorage.getItem("userFullName");
        if (storedFullName) {
            setUserFullName(storedFullName); // ถ้ามีชื่อผู้ใช้ใน localStorage ก็ให้แสดง
        }
    }, []);

    // ฟังก์ชันที่ใช้สำหรับออกจากระบบ
    const handleLogout = () => {
        console.log("ออกจากระบบ");
        localStorage.removeItem("userId");
        localStorage.removeItem("userFullName");
        window.location.href = '/';
        // ที่นี่คุณสามารถเพิ่มฟังก์ชันสำหรับออกจากระบบ เช่น การลบ token หรือ redirect
    };

    return (
        <Layout>
            <Header
                style={{
                    backgroundColor: "#ffff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 30px", // เพิ่ม padding เพื่อให้มีพื้นที่มากขึ้น
                    height: "80px", // เพิ่มความสูงของ Navbar
                    borderBottom: "2px solid #ddd", // เพิ่มเส้นขอบที่ด้านล่าง
                    position: "fixed",  // ทำให้ Navbar ติดอยู่ที่ด้านบน
                    top: 0,              // ระบุตำแหน่งให้ชัดเจนว่าอยู่ที่ด้านบน
                    width: "100%",       // ให้ Navbar ขยายเต็มความกว้าง
                    zIndex: 1000,        // ให้มันอยู่เหนือองค์ประกอบอื่นๆ
                }}
            >
                {/* ชื่อสำนักงาน */}
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                    สำนักงาน ANAN
                </div>

                {/* ส่วนขวา */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {/* ธงภาษา */}
                    <div style={{}}>
                        <Menu
                            style={{ backgroundColor: "transparent", borderBottom: "none", display: 'flex', marginRight: '10px' }}
                        >
                            <Menu.Item key="thai">
                                <FlagOutlined /> ไทย
                            </Menu.Item>
                            <Menu.Item key="english" style={{ marginRight: '20px' }}>
                                <FlagOutlined /> อังกฤษ
                            </Menu.Item>
                        </Menu>
                    </div>

                    {/* ชื่อผู้ใช้งานและสถานะ */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "10px", lineHeight: "1" }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: "4px", textAlign: "center" }}>
                            {userFullName || 'ผู้ใช้งาน'} {/* ถ้ามีชื่อผู้ใช้ใน state ก็จะแสดงชื่อ */}
                        </div>
                        <div style={{ margin: 0, fontSize: "12px", color: "#478D00", lineHeight: "1", textAlign: "left" }}>
                            ล่าสุด 19/11/2024 11:30
                        </div>
                    </div>

                    {/* ไอคอนผู้ใช้งาน */}
                    <Avatar
                        size="large"
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: 'transparent',  // ลบสีพื้นหลัง
                            color: '#478D00',                 // ตัวอักษรสีเขียว
                        }}
                    />
                </div>
            </Header>
        </Layout>
    );
};

export default Navbar;
