'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DisplayData() {
    const router = useRouter();
    const [allData, setAllData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEditIndex, setCurrentEditIndex] = useState(null);


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const data = sessionStorage.getItem('allData');
            if (data) {
                setAllData(JSON.parse(data)); // แปลงข้อมูลจาก JSON กลับเป็น array
            }
        }
    }, []);

    const handleEdit = (index) => {
        const dataToEdit = allData[index];
        setFormData({ name: dataToEdit.name, email: dataToEdit.email, message: dataToEdit.message });
        setCurrentEditIndex(index); // เก็บ index ของข้อมูลที่จะแก้ไข
        setIsModalOpen(true); // เปิด Modal
    };

    const handleDelete = (index) => {
        if (typeof window !== 'undefined') {
            const updatedData = allData.filter((_, i) => i !== index); // ลบข้อมูลที่ index นั้นออก
            sessionStorage.setItem('allData', JSON.stringify(updatedData));
            setAllData(updatedData); // อัปเดต state
            alert('Data deleted successfully!');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSaveChanges = () => {
        if (typeof window !== 'undefined') {
            let updatedData = [...allData];
            updatedData[currentEditIndex] = formData; // อัปเดตข้อมูลที่ index ที่เลือก
            sessionStorage.setItem('allData', JSON.stringify(updatedData));
            setAllData(updatedData); // อัปเดต state
            setIsModalOpen(false); // ปิด Modal
            alert('Data updated successfully!');
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false); // ปิด Modal หากผู้ใช้คลิก Cancel
    };

    return (
        <div>
            <h1>Display All Data</h1>
            {allData.length === 0 ? (
                <p>No data found</p>
            ) : (
                <ul>
                    {allData.map((item, index) => (
                        <li key={index}>
                            <p><strong>Name:</strong> {item.name}</p>
                            <p><strong>Email:</strong> {item.email}</p>
                            <p><strong>Message:</strong> {item.message}</p>
                            <button onClick={() => handleEdit(index)}>Edit</button>
                            <button onClick={() => handleDelete(index)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={() => router.push('/test')}>Add New Data</button>

            {/* Modal สำหรับแก้ไขข้อมูล */}
            {isModalOpen && (
                <div style={modalStyles}>
                    <div style={modalContentStyles}>
                        <h2>Edit Data</h2>
                        <input
                            type="text"
                            placeholder="Enter name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder="Enter email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <textarea
                            placeholder="Enter message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                        />
                        <div>
                            <button onClick={handleSaveChanges}>Save Changes</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Styles สำหรับ Modal
const modalStyles = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
};

const modalContentStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '300px'
};
