'use client'
import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const CustomBreadcrumb = () => {
  return (
        <div
        style={{
            display: "flex",
            alignItems: "center", // จัดให้อยู่กลางแนวตั้ง
            padding: "10px 20px", // เพิ่มระยะห่าง
            backgroundColor: "#f8f9fa", // สีพื้นหลังใกล้เคียง
            borderRadius: "20px", // มุมโค้งของ container
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // เพิ่มเงาเล็กน้อย
        }}
        >
        {/* ไอคอนหลัก */}
        <div
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "#d9e8d2", // สีพื้นหลังไอคอน
            borderRadius: "50%", // รูปทรงกลม
            marginRight: "10px", // ระยะห่างระหว่างไอคอนและข้อความ
            }}
        >
            <HomeOutlined style={{ fontSize: "20px", color: "#4caf50" }} />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb separator=">">
            <Breadcrumb.Item>
            <span
                style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#333", // สีข้อความหลัก
                }}
            >
                ระบบบริหารงานสัปบุรุษ
            </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <span
                style={{
                fontWeight: "500",
                fontSize: "14px",
                color: "#666", // สีข้อความรอง
                }}
            >
                Dashboard
            </span>
            </Breadcrumb.Item>
        </Breadcrumb>
        </div>
  );
};

export default CustomBreadcrumb;
