'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InputForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      let data = sessionStorage.getItem('allData');
      data = data ? JSON.parse(data) : [];
      data.push(formData); // เพิ่มข้อมูลใหม่เข้าไปใน array
      sessionStorage.setItem('allData', JSON.stringify(data));
    }
  };

  return (
    <div>
      <h1>Input Form</h1>
      <input
        type="text"
        placeholder="Enter your name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Enter your email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <textarea
        placeholder="Enter your message"
        name="message"
        value={formData.message}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Save to Session Storage</button>
      <button onClick={() => router.push('/test/test2')}>Back to Display</button>
    </div>
  );
}
