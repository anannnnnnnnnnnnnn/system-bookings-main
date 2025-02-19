   <Modal
          title="รายละเอียดการจอง"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={600}
          style={{ top: 20 }}
        >
          {selectedBooking && (
            <div>
              {/* ข้อมูลผู้ใช้ */}
              {selectedBooking.user && (
                <div style={{ marginBottom: '15px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Row gutter={16}>
                    {/* ข้อมูลภาพผู้ใช้ */}
                    <Col xs={24} sm={8} md={6}>
                      <img
                        src={`http://localhost:5182${selectedBooking.user.profile_picture}`}
                        alt="Profile"
                        style={{ width: '75%', height: 'auto', borderRadius: '50%' }}
                      />
                    </Col>
                    {/* ข้อมูลผู้ใช้ */}
                    <Col xs={24} sm={16} md={18}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>อีเมล์: {selectedBooking.user.email}</Text>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>หมายเลขโทรศัพท์: {selectedBooking.user.phone_number}</Text>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>แผนก: {selectedBooking.user.department}</Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* ข้อมูลรถที่จอง */}
              {selectedBooking.carDetails && (
                <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Row gutter={16}>
                    {/* ข้อมูลภาพรถ */}
                    <Col xs={24} sm={8} md={6}>
                      <img
                        src={`http://localhost:5182${selectedBooking.carDetails.image_url}`}
                        alt="Car"
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </Col>
                    {/* ข้อมูลรถ */}
                    <Col xs={24} sm={16} md={18}>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>รถที่จอง: {selectedBooking.carDetails.brand} {selectedBooking.carDetails.model}</Text>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>ทะเบียนรถ: {selectedBooking.carDetails.license_plate}</Text>
                      </div>
                      <div style={{ marginBottom: '10px' }}>
                        <Text strong style={{ fontSize: '14px' }}>ปีผลิต: {selectedBooking.carDetails.year}</Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}

              {/* ข้อมูลการจอง */}
              <div style={{ padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong style={{ fontSize: '14px' }}>หมายเลขการจอง: {selectedBooking.confirmation_id}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong style={{ fontSize: '14px' }}>ชื่อผู้จอง: {selectedBooking.full_name}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong style={{ fontSize: '14px' }}>วันที่จอง: {selectedBooking.booking_date}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong style={{ fontSize: '14px' }}>จุดหมาย: {selectedBooking.destination}</Text>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <Text strong style={{ fontSize: '14px' }}>สถานะ: {selectedBooking.booking_status === 2 ? "อนุมัติแล้ว" : "คืนรถแล้ว"}</Text>
                </div>
              </div>
            </div>
          )}
        </Modal>