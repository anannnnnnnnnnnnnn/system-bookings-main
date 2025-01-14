'use client'
import React, { useState } from 'react';
import { Button } from 'antd';

const TimeSelector = () => {
  const [formData, setFormData] = useState({
    selectedTime: [], // เก็บเวลาที่เลือก
  });
  const unavailableTimes = []; // เวลาที่ไม่สามารถเลือกได้

  const handleTimeSelect = (time) => {
    const selectedTimes = [...formData.selectedTime];

    if (selectedTimes.includes(time)) {
      // หากเลือกปุ่มที่ถูกเลือกอยู่แล้ว ให้ยกเลิกการเลือก
      setFormData({
        ...formData,
        selectedTime: selectedTimes.filter(item => item !== time),
      });
    } else if (selectedTimes.length < 2) {
      // หากยังเลือกไม่ถึง 2 ปุ่ม ให้เลือก
      selectedTimes.push(time);
      setFormData({
        ...formData,
        selectedTime: selectedTimes,
      });
    }
  };

  return (
    <div style={{ margin: '0px' }}>
      <h2
        style={{
          marginBottom: '16px',
          fontWeight: 'bold',
          fontSize: '20px',
          color: '#4D4D4D',
        }}
      >
        เลือกเวลาที่ต้องการจอง
      </h2>

      {[
        { label: 'ก่อนเที่ยง', times: ['07:00-08:00', '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'] },
        { label: 'หลังเที่ยง', times: ['12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'] }
      ].map((section, sectionIndex) => (
        <div key={sectionIndex} style={{ marginBottom: '20px' }}>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '16px',
              marginBottom: '12px',
              color: '#4D4D4D',
              fontFamily: 'Arial, sans-serif',
              textTransform: 'uppercase',
              margin: '20px 50px'
            }}
          >
            {section.label}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: '0 50px' }}>
            {section.times.map((time, index) => {
              const isSelected = formData.selectedTime.includes(time);
              const selectedIndex = formData.selectedTime.indexOf(time);
              
              // ปุ่มที่เลือกครบ 2 ปุ่มแล้วจะไม่สามารถเลือกได้
              const isDisabled = formData.selectedTime.length >= 2 && !isSelected;

              // กำหนดสีตามการเลือก (ปุ่มแรกสีเขียว, ปุ่มที่สองสีแดง)
              let buttonStyle = {
                borderRadius: '10px',
                width: '100px',
                height: '30px',
                fontWeight: 'bold',
                padding: '8px 18px',
                border: isSelected ? '2px solid' : '2px solid #ccc',
                backgroundColor: isSelected
                  ? selectedIndex === 0
                    ? '#478D00' // สีเขียวสำหรับปุ่มแรก
                    : '#FF4D4F'  // สีแดงสำหรับปุ่มที่สอง
                  : isDisabled ? '#f5f5f5' : '#ffffff', // สีเทาสำหรับปุ่มที่ไม่สามารถเลือกได้
                color: isSelected ? '#fff' : isDisabled ? '#a9a9a9' : '#333',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
              };

              return (
                <Button
                  key={index}
                  type={isSelected ? 'primary' : 'default'}
                  disabled={unavailableTimes.includes(time) || isDisabled}
                  style={buttonStyle}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSelector;
