'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spin, Alert, Button, Modal, Form, Input, message, Popconfirm } from 'antd';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // ผู้ใช้ที่กำลังแก้ไข
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5182/api/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user); // กำหนดผู้ใช้ที่ต้องการแก้ไข
    setIsModalOpen(true); // เปิด Modal
  };

  const handleCancel = () => {
    setIsModalOpen(false); // ปิด Modal
    setEditingUser(null); // รีเซ็ตข้อมูลผู้ใช้
  };

  const handleSave = async (values) => {
    try {
      // ส่งคำขอไปอัปเดตข้อมูล
      await axios.put(`http://localhost:5182/api/users/${editingUser.id}`, values);
      message.success("User updated successfully!");

      // อัปเดตข้อมูลในตาราง
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...values } : user
        )
      );

      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      message.error("Failed to update user.");
    }
  };

  const handleDelete = async (userId) => {
    try {
      // ส่งคำขอไปลบข้อมูล
      await axios.delete(`http://localhost:5182/api/users/${userId}`);
      message.success("User deleted successfully!");

      // ลบข้อมูลใน state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      message.error("Failed to delete user.");
    }
  };

  if (loading) return <Spin tip="Loading..." size="large" style={{ display: 'block', marginTop: 50, textAlign: 'center' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon style={{ marginTop: 20 }} />;

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
    {
      title: 'Action',
      key: 'action',
      render: (_, user) => (
        <>
          <Button type="link" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(user.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>User List</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />
      <Modal
        title="Edit User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {editingUser && (
          <Form
            layout="vertical"
            initialValues={editingUser}
            onFinish={handleSave}
          >
            <Form.Item
              name="full_name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter full name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phone_number" label="Phone Number">
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please enter role' }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default UserListPage;
