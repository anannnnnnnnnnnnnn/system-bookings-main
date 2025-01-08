'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Input, Form, message } from 'antd';

const CarForm = () => {
    const [cars, setCars] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCarId, setEditingCarId] = useState(null);
    const [formValues, setFormValues] = useState({
        brand: '',
        model: '',
        license_plate: '',
        seating_capacity: '',
        fuel_type: '',
        status: '',
    });

    useEffect(() => {
        // ดึงข้อมูลจาก API
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await axios.get('http://localhost:5182/api/cars');
            setCars(response.data);
        } catch (error) {
            console.error('Error fetching cars', error);
            message.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
        }
    };

    const handleEdit = (car) => {
        setEditingCarId(car.car_id); // ใช้ car_id แทน id
        setFormValues({
            brand: car.brand,
            model: car.model,
            license_plate: car.license_plate,
            seating_capacity: car.seating_capacity,
            fuel_type: car.fuel_type,
            status: car.status,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (car_id) => { // ใช้ car_id แทน id
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await axios.delete(`http://localhost:5182/api/cars/${car_id}`);
                message.success('Car deleted successfully');
                fetchCars(); // รีเฟรชข้อมูลหลังจากลบ
            } catch (error) {
                console.error('Error during deletion', error);
                message.error('เกิดข้อผิดพลาดในการลบข้อมูล');
            }
        }
    };

    const handleModalOk = async () => {
        const { brand, model, license_plate, seating_capacity, fuel_type, status } = formValues;

        // ส่งข้อมูลในรูปแบบ JSON
        const data = {
            brand,
            model,
            license_plate,
            seating_capacity,
            fuel_type,
            status
        };

        try {
            if (editingCarId) {
                // ส่งข้อมูลไปยัง API โดยใช้ JSON
                await axios.put(`http://localhost:5182/api/cars/${editingCarId}`, data);
                message.success('Car updated successfully');
                setIsModalVisible(false);
                fetchCars(); // รีเฟรชข้อมูลหลังจากบันทึก
            }
        } catch (error) {
            console.error('Error during saving car', error);
            message.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    };


    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const columns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: 'License Plate',
            dataIndex: 'license_plate',
            key: 'license_plate',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.room_id)}>
                        ลบ
                    </Button>

                </span>
            ),
        },
    ];

    return (
        <div>
            <Table
                dataSource={cars}
                columns={columns}
                rowKey="car_id" // ใช้ car_id เป็น key แทน id
                pagination={false}
            />

            <Modal
                title="Edit Car"
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="Brand">
                        <Input
                            name="brand"
                            value={formValues.brand}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Model">
                        <Input
                            name="model"
                            value={formValues.model}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="License Plate">
                        <Input
                            name="license_plate"
                            value={formValues.license_plate}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Seating Capacity">
                        <Input
                            name="seating_capacity"
                            value={formValues.seating_capacity}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Fuel Type">
                        <Input
                            name="fuel_type"
                            value={formValues.fuel_type}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Status">
                        <Input
                            name="status"
                            value={formValues.status}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CarForm;
