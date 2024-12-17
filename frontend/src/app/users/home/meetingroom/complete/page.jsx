'use client'

import React, { useEffect, useState } from 'react';
import { Layout, Typography, Divider, Button, Radio, List, Card, Badge, DatePicker, Space } from 'antd';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import Navigation from '../components/navigation';
import { Content } from 'antd/lib/layout/layout';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography; 

function MeetingRoomBooking() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]); // State to store room data
  const [filter, setFilter] = useState('available');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showRooms, setShowRooms] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]); // State for selected room IDs

  const roomData = [
    { id: 1, roomNumber: 'ห้อง 101', name: 'ห้องประชุม A', capacity: 10, status: 'ว่าง', image: '/assets/pg1.jpg' },
    { id: 2, roomNumber: 'ห้อง 102', name: 'ห้องประชุม B', capacity: 20, status: 'ว่าง', image: '/assets/pg2.jpg' },
    { id: 3, roomNumber: 'ห้อง 103', name: 'ห้องประชุม C', capacity: 15, status: 'ไม่ว่าง', image: '/assets/pg3.jpg' },
    { id: 4, roomNumber: 'ห้อง 104', name: 'ห้องประชุม D', capacity: 8, status: 'ว่าง', image: '/assets/pg4.jpg' },
    { id: 5, roomNumber: 'ห้อง 105', name: 'ห้องประชุม E', capacity: 12, status: 'ไม่ว่าง', image: '/assets/pg5.jpg' },
    { id: 6, roomNumber: 'ห้อง 106', name: 'ห้องประชุม F', capacity: 25, status: 'ว่าง', image: '/assets/pg6.jpg' },
    { id: 7, roomNumber: 'ห้อง 107', name: 'ห้องประชุม G', capacity: 30, status: 'ไม่ว่าง', image: '/assets/pg7.jpg' },
    { id: 8, roomNumber: 'ห้อง 108', name: 'ห้องประชุม H', capacity: 5, status: 'ว่าง', image: '/assets/pg8.jpg' },
    { id: 9, roomNumber: 'ห้อง 109', name: 'ห้องประชุม I', capacity: 50, status: 'ว่าง', image: '/assets/pg9.jpg' },
    { id: 10, roomNumber: 'ห้อง 110', name: 'ห้องประชุม J', capacity: 40, status: 'ไม่ว่าง', image: '/assets/pg10.jpg' },
  ];

  useEffect(() => {
    setRooms(roomData);
  }, []);

  // Filter rooms based on availability
  const filteredRooms = rooms.filter((room) => {
    if (filter === 'available') return room.status === 'ว่าง';
    if (filter === 'unavailable') return room.status === 'ไม่ว่าง';
    return true;
  });

  // Handle room selection (Toggle select/deselect)
  const handleRoomSelect = (roomId) => {
    setSelectedRooms((prevSelected) => {
      if (prevSelected.includes(roomId)) {
        return prevSelected.filter((id) => id !== roomId); // Deselect room
      } else {
        return [...prevSelected, roomId]; // Select room
      }
    });
  };

  // Handle search functionality
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setRooms(roomData); // Simulate fetching data
      setShowRooms(true);
      setLoading(false);
    }, 1000);
  };

  // Handle "Next" button click
  const handleNext = () => {
    const selectedRoomDetails = rooms.filter((room) => selectedRooms.includes(room.id));
    sessionStorage.setItem('selectedRooms', JSON.stringify(selectedRoomDetails));
    router.push('/users/home/meetingroom/complete/booking');
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Navbar */}
      <Navbar />
      <Layout style={{ padding: '0px 49px', marginTop: '20px', backgroundColor: '#fff' }}>
        <Sidebar />
        <Layout style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
          <Navigation />
          <Content style={{
            marginTop: '21px',
            padding: '24px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fffff' }}>
              {/* Section: ค้นหาห้องประชุม */}
              <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ color: 'black', font: '24px', }}>ค้นหาห้องประชุม</Title>
                <Divider />
                <div style={{ marginLeft: '50px' }}>
                  <div style={{ flex: 1, minWidth: '100px' }}>
                    <Title level={4} style={{ fontWeight: 'bold' }}>ช่วงเวลาเดินทาง</Title>
                  </div>
                  <div style={{ display: 'flex',justifyContent:'space-between',  gap: '20px',}}>
                    <DatePicker.RangePicker
                      format="YYYY-MM-DD" // ฟอร์แมตรวมวันที่และเวลา
                      placeholder={["วันที่ต้องการจอง", "วันที่สิ้นสุดการจอง"]} // ข้อความ placeholder
                      style={{ width: '90%' }} // กำหนดขนาดของ RangePicker
                    />
                    <Button
                      type="primary"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#029B36', // สีพื้นฐาน
                        borderColor: '#FFFFFF', // สีของขอบ
                        height: '43px',
                        fontSize: '16px',
                        transition: 'background-color 0.3s ease, transform 0.2s ease',
                      }}
                      onClick={handleSearch}
                      loading={loading}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#03A84E') // สีเมื่อ Hover (อ่อนขึ้น)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '#029B36') // กลับสู่สีพื้นฐาน
                      }
                      onMouseDown={(e) =>
                        (e.currentTarget.style.backgroundColor = '#02802E') // สีเมื่อกด (เข้มขึ้นเล็กน้อย)
                      }
                      onMouseUp={(e) =>
                        (e.currentTarget.style.backgroundColor = '#03A84E') // กลับสู่สี Hover
                      }
                    >
                      ค้นหาห้องประชุม
                    </Button>
                  </div>
                </div>
              </div>

              {/* <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button
                  type="primary"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#029B36', // สีพื้นฐาน
                    borderColor: '#FFFFFF', // สีของขอบ
                    height: '43px',
                    fontSize: '16px',
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                  }}
                  onClick={handleSearch}
                  loading={loading}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#03A84E') // สีเมื่อ Hover (อ่อนขึ้น)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#029B36') // กลับสู่สีพื้นฐาน
                  }
                  onMouseDown={(e) =>
                    (e.currentTarget.style.backgroundColor = '#02802E') // สีเมื่อกด (เข้มขึ้นเล็กน้อย)
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.backgroundColor = '#03A84E') // กลับสู่สี Hover
                  }
                >
                  ค้นหาห้องประชุม
                </Button>
              </div> */}

              <Divider />
              {showRooms && (
                <>
                  <Title
                    level={2}
                    style={{
                      color: '#2C3E50',
                      fontWeight: '600',
                      marginBottom: '20px',
                      textAlign: 'start',
                      fontSize: '24px'
                    }}
                  >
                    เลือกห้องประชุม
                  </Title>
                  <Button.Group
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      gap: '12px',
                      margin: '20px 0px',
                    }}
                  >
                    <Button
                      type={filter === 'available' ? 'primary' : 'default'}
                      style={{
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontSize: '14px',
                        fontWeight: filter === 'available' ? '600' : '400',
                        backgroundColor: filter === 'available' ? '#4CAF50' : '#FFFFFF',
                        color: filter === 'available' ? '#FFFFFF' : '#2C3E50',
                        border: 'none',
                      }}
                      onClick={() => setFilter('available')}
                    >
                      ห้องที่ว่าง
                    </Button>
                    <Button
                      type={filter === 'unavailable' ? 'primary' : 'default'}
                      style={{
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontSize: '14px',
                        fontWeight: filter === 'unavailable' ? '600' : '400',
                        backgroundColor: filter === 'unavailable' ? '#FF7043' : '#FFFFFF',
                        color: filter === 'unavailable' ? '#FFFFFF' : '#2C3E50',
                        border: 'none',
                      }}
                      onClick={() => setFilter('unavailable')}
                    >
                      ห้องที่ไม่ว่าง
                    </Button>
                    <Button
                      type={filter === 'all' ? 'primary' : 'default'}
                      style={{
                        borderRadius: '6px',
                        padding: '8px 20px',
                        fontSize: '14px',
                        fontWeight: filter === 'all' ? '600' : '400',
                        backgroundColor: filter === 'all' ? '#2196F3' : '#FFFFFF',
                        color: filter === 'all' ? '#FFFFFF' : '#2C3E50',
                        border: 'none',
                      }}
                      onClick={() => setFilter('all')}
                    >
                      ทุกสถานะ
                    </Button>
                  </Button.Group>
                  <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={filteredRooms}
                    renderItem={(room) => (
                      <List.Item>
                        <Card
                          hoverable
                          style={{
                            borderRadius: '12px',
                            border: selectedRooms.includes(room.id) ? '2px solid #029B36' : '1px solid #ddd',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            overflow: 'hidden',
                          }}
                          cover={
                            <img
                              alt={room.name}
                              src={room.image}
                              style={{
                                height: '170px',
                                objectFit: 'cover',
                                borderTopLeftRadius: '12px',
                                borderTopRightRadius: '12px',
                              }}
                            />
                          }
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                          <div style={{ padding: '16px' }}>
                            <Title level={5} style={{ marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                              {room.name}
                            </Title>
                            <Text style={{ display: 'block', fontSize: '14px', color: '#666' }}>
                              ความจุ: {room.capacity} คน
                            </Text>
                            <Badge
                              status={room.status === 'ว่าง' ? 'success' : 'error'}
                              text={`สถานะ: ${room.status}`}
                              style={{
                                marginTop: '8px',
                                fontSize: '12px',
                                padding: '4px 8px',
                                borderRadius: '8px',
                                backgroundColor: room.status === 'ว่าง' ? '#e9f5ee' : '#f8e7e7',
                                color: room.status === 'ว่าง' ? '#029B36' : '#d9534f',
                              }}
                            />
                            <Button
                              type={selectedRooms.includes(room.id) ? 'default' : 'primary'}
                              onClick={() => handleRoomSelect(room.id)}
                              disabled={room.status !== 'ว่าง'}
                              style={{
                                marginTop: '16px',
                                width: '100%',
                                padding: '10px',
                                fontWeight: '500',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: selectedRooms.includes(room.id) ? '#ddd' : '#029B36',
                                color: selectedRooms.includes(room.id) ? '#666' : '#fff',
                                cursor: room.status === 'ว่าง' ? 'pointer' : 'not-allowed',
                              }}
                            >
                              {selectedRooms.includes(room.id) ? 'ยกเลิกการเลือก' : 'จองห้องนี้'}
                            </Button>
                          </div>
                        </Card>
                      </List.Item>
                    )}
                  />

                  {/* Next Button */}
                  <div style={{ textAlign: 'end', marginTop: '32px' }}>
                    <Button
                      type="primary"
                      onClick={handleNext}
                      disabled={selectedRooms.length === 0}
                      style={{
                        padding: '12px 32px',
                        fontSize: '16px',
                        fontWeight: '600',
                        borderRadius: '24px',
                        backgroundColor: '#029B36',
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      ถัดไป
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default MeetingRoomBooking;
