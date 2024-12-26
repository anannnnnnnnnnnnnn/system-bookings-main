// pages/users.js
'use client'
import { useEffect, useState } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("http://localhost:5094/api/users")
      .then(response => {
        console.log("API Response:", response.data);  // ตรวจสอบข้อมูลที่ได้จาก API
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching users", error);
        setLoading(false);
      });
  }, []);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.user_id}>
            <strong>{user.full_name}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
