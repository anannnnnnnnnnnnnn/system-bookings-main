'use client'
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';

const UserInfo = () => {
    const [userFullName, setUserFullName] = useState(null); // สถานะสำหรับเก็บชื่อผู้ใช้
    const [department, setDepartment] = useState(null); // สถานะสำหรับเก็บ department

    useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const storedFullName = localStorage.getItem("userFullName");
        const storedDepartment = localStorage.getItem("department");

        console.log("Full Name from LocalStorage:", storedFullName); // ตรวจสอบค่าจาก localStorage
        console.log("Department from LocalStorage:", storedDepartment); // ตรวจสอบค่าจาก localStorage

        // ถ้ามีข้อมูลใน localStorage ก็ให้ตั้งค่าใน state
        setUserFullName(storedFullName || "ไม่ได้ระบุ");
        setDepartment(storedDepartment || "ไม่ได้ระบุ");
    }, []); // ทำงานแค่ครั้งแรกเมื่อคอมโพเนนต์โหลด

    return (
        <div>
            <div>
                <label style={{ fontWeight: 'bold' }}>ชื่อ-สกุล</label>
                <Input value={userFullName} disabled />
            </div>
            <div>
                <label style={{ fontWeight: 'bold' }}>ตำแหน่ง/แผนก</label>
                <Input value={department} disabled />
            </div>
        </div>
    );
};

export default UserInfo;
