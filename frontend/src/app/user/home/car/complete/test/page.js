'use client';
import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Table } from 'antd';
import moment from 'moment';

const CarBookingTable = () => {
    const [unavailableTimes, setUnavailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);

    const timeSlots = [
        { times: ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'] },
        { times: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'] }
    ];

    // ดึง carId และ bookingDate จาก URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('carId');
        const bookingDate = urlParams.get('bookingDate');

        if (carId && bookingDate) {
            fetchUnavailableTimes(carId, bookingDate);
        }
    }, []);

    const fetchUnavailableTimes = async (carId, bookingDate) => {
        try {
            const formattedDate = moment(bookingDate).format('YYYY-MM-DD');
            const response = await fetch(`http://localhost:5182/api/bookings/unavailable-times?carId=${carId}&bookingDate=${formattedDate}`);
            const data = await response.json();
            console.log(data); // เช็คข้อมูลที่ได้รับจาก API

            setUnavailableTimes(data);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูลเวลาที่ไม่ว่าง:', error);
        }
    };

    const isTimeAvailable = (time) => {
        // เช็คว่าเวลานั้นๆ ถูกจองไปแล้วหรือไม่
        return !unavailableTimes.some((booking) => 
            moment(time, 'HH:mm').isBetween(booking.startTime, booking.endTime, null, '[)'));
    };

    const handleTimeSelect = (time) => {
        // เมื่อเลือกเวลา จะตั้งค่าที่เลือก
        setSelectedTime(time);
    };

    const columns = [
        {
            title: 'เวลาเริ่มต้น',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (text) => moment(text, 'HH:mm:ss').isValid() ? moment(text, 'HH:mm:ss').format('HH:mm') : 'ไม่ระบุ',
        },
        {
            title: 'เวลาคืน',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (text) => moment(text, 'HH:mm:ss').isValid() ? moment(text, 'HH:mm:ss').format('HH:mm') : 'ไม่ระบุ',
        },
    ];

    return (
        <div>
            <h3>ตารางเวลาที่ไม่ว่างสำหรับรถ วันที่ {window.location.search}</h3>

            {/* แสดงปุ่มเลือกเวลา */}
            {timeSlots.map((slot, index) => (
                <Row key={index} style={{ marginBottom: 20 }}>
                    {slot.times.map((time, idx) => (
                        <Col span={4} key={idx} style={{ marginBottom: 10 }}>
                            <Button
                                type={isTimeAvailable(time) ? 'primary' : 'default'} // ใช้ primary ถ้าสามารถเลือกได้
                                disabled={!isTimeAvailable(time)} // ปิดปุ่มถ้าไม่สามารถเลือกได้
                                onClick={() => handleTimeSelect(time)} // เลือกเวลาเมื่อคลิก
                                block
                                style={{
                                    backgroundColor: selectedTime === time ? '#1890ff' : '', // เปลี่ยนสีปุ่มที่เลือก
                                    color: selectedTime === time ? '#fff' : '', // เปลี่ยนสีข้อความเมื่อเลือก
                                    borderColor: selectedTime === time ? '#1890ff' : '', // เปลี่ยนกรอบสีเมื่อเลือก
                                }}
                            >
                                {time}
                            </Button>
                        </Col>
                    ))}
                </Row>
            ))}

            {/* ตารางเวลาที่จองแล้ว */}
            <Table
                dataSource={unavailableTimes}
                columns={columns}
                rowKey="startTime"
                pagination={false}
            />
        </div>
    );
};

export default CarBookingTable;
