"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    // Mengambil status dari endpoint setiap 2 detik
    const interval = setInterval(() => {
      fetch('/api/warning')
        .then((response) => response.json())
        .then((data) => {
          setWarning(data.warningStatus);
        })
        .catch((error) => console.error("Polling error:", error));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Gas Leakage Monitoring System</h1>
      {warning ? (
        <div style={{ color: 'red', fontSize: '24px' }}>
          🚨 Warning: Gas Leakage Detected! 🚨
        </div>
      ) : (
        <div style={{ color: 'green', fontSize: '24px' }}>
          ✅ All Clear
        </div>
      )}
    </div>
  );
}