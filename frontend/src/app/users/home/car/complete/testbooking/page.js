'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function BookingConfirmation() {
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');
    const startDate = urlParams.get('startDate');
    const endDate = urlParams.get('endDate');
    const startTime = urlParams.get('startTime');
    const endTime = urlParams.get('endTime');

    setQueryParams({ carId, startDate, endDate, startTime, endTime });
  }, []);

  if (!queryParams) return <div>Loading...</div>;

  return (
    <div>
      <h2>รายละเอียดการจอง</h2>
      <p>Car ID: {queryParams.carId}</p>
      <p>Start Date: {queryParams.startDate}</p>
      <p>End Date: {queryParams.endDate}</p>
      <p>Start Time: {queryParams.startTime}</p>
      <p>End Time: {queryParams.endTime}</p>
    </div>
  );
}

export default BookingConfirmation;
