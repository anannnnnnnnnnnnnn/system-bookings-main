// QRScanner.js
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      {scanResult && (
        <div>
          <h2>Scan Result:</h2>
          <p>{scanResult}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
