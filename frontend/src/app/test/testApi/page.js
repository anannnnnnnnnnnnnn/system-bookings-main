'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert } from 'antd';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลผู้ใช้จาก API
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5182/api/users");
        setUsers(response.data); // เก็บข้อมูลผู้ใช้ใน state
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers(); // เรียกใช้งานฟังก์ชันดึงข้อมูล

  }, []); // ทำงานเมื่อ component ถูกโหลดขึ้น

  if (loading) return <Spin tip="Loading..." size="large" style={{ display: 'block', marginTop: 50, textAlign: 'center' }} />; // แสดงการโหลดข้อมูล
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 20 }} />; // แสดงข้อความข้อผิดพลาด

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (role === 1 ? "Admin" : "User"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>User List</h1>
      {users.length === 0 ? (
        <Alert message="No users found" type="info" showIcon style={{ marginTop: 20 }} />
      ) : (
        <Table 
          dataSource={users} 
          columns={columns} 
          rowKey="id" 
          style={{ marginTop: 20 }} 
        />
      )}
    </div>
  );
};

export default UserListPage;
