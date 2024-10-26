"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource('/api/warning/stream');

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      setWarning(data.warningStatus);
    };

    eventSource.onerror = function () {
      console.error("EventSource failed.");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
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

  useEffect(() => {
    const eventSource = new EventSource('/api/warning/stream');
  
    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Received data:", data); // Tambahkan log ini
      setWarning(data.warningStatus);
    };
  
    eventSource.onerror = function () {
      console.error("EventSource failed.");
      eventSource.close();
    };
  
    return () => {
      eventSource.close();
    };
  }, []);
}