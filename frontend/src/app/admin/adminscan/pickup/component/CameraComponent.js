'use client'; 
import React, { useRef, useEffect } from 'react';

const CameraComponent = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        // ใช้ getUserMedia เพื่อเข้าถึงกล้อง
        const startCamera = async () => {
            try {
                // ขอสิทธิ์เข้าถึงกล้อง
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                
                // หากสำเร็จ ให้แสดงใน video element
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error accessing the camera:', err);
            }
        };

        startCamera();

        // เมื่อคอมโพเนนต์ถูก unmount ให้ปิดการใช้งานกล้อง
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop()); // ปิดการใช้งานกล้อง
            }
        };
    }, []);

    return (
        <div style={{ textAlign: 'center' }}>
            <video
                ref={videoRef} 
                autoPlay
                style={{ width: '100%', maxWidth: '600px', border: '1px solid #ccc' }}
            />
            <p>กล้องเปิดอยู่ที่นี่</p>
        </div>
    );
};

export default CameraComponent;
