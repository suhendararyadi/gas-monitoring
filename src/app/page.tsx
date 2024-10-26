"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [warning, setWarning] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);

  useEffect(() => {
    // Polling setiap 2 detik untuk cek status
    const interval = setInterval(() => {
      fetch("/api/warning")
        .then((response) => response.json())
        .then((data) => {
          setWarning(data.warningStatus);
          setGasLevel(data.gasLevel);
        })
        .catch((error) => console.error("Polling error:", error));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm mb-6">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Profile</div>
          <div className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center text-white font-bold">
            {warning ? "!" : "✓"}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="rounded-full bg-gray-200 w-16 h-16"></div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold">Gas Monitoring</h2>
            <p className="text-gray-500">Sensor Status</p>
          </div>
        </div>
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <div>Normal</div>
          <div>Warning</div>
          <div>Alarm</div>
        </div>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="p-4 rounded-lg bg-gradient-to-r from-pink-300 to-orange-300 shadow-md">
          <h3 className="font-semibold text-lg">Gas Level</h3>
          <p className="text-3xl font-bold mt-2">{gasLevel}</p>
          <span className="text-sm text-gray-700">PPM Level</span>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-300 to-teal-300 shadow-md">
          <h3 className="font-semibold text-lg">Status</h3>
          <p className="text-3xl font-bold mt-2">
            {warning ? "Warning" : "All Clear"}
          </p>
        </div>
      </div>

      {/* Focusing Analytics Card */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Gas Monitoring Analytics</h3>
          <span className="text-gray-600 text-sm">Range: Last month</span>
        </div>
        {/* Placeholder for Graph */}
        <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          (Graph Placeholder)
        </div>
        <div className="flex justify-between text-gray-600 text-sm mt-4">
          <div>Minimum</div>
          <div>Maximum</div>
          <div>Average</div>
        </div>
      </div>
    </div>
  );
}