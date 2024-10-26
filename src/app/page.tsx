"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [warning, setWarning] = useState(false);
  const [gasLevel, setGasLevel] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const audio = typeof Audio !== "undefined" ? new Audio("/warning-sound.mp3") : null; // Pastikan Anda memiliki file audio di public folder

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/warning")
        .then((response) => response.json())
        .then((data) => {
          if (data.warningStatus && !warning) {
            audio?.play(); // Play sound only when switching to warning
          }

          setWarning(data.warningStatus);
          setGasLevel(data.gasLevel);

          // Update history data
          setHistory((prev) => [...prev.slice(-9), data.gasLevel]); // Keep last 10 readings
          setLabels((prev) => [
            ...prev.slice(-9),
            new Date().toLocaleTimeString(), // Add current time
          ]);
        })
        .catch((error) => console.error("Polling error:", error));
    }, 2000);

    return () => clearInterval(interval);
  }, [audio, warning]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Gas Level",
        data: history,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "PPM Level",
        },
      },
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      {/* Application Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Gas Monitoring Dashboard</h1>

      {/* Status and Gas Level Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-md">
        <div className="p-4 rounded-lg bg-blue-600 text-white shadow-md">
          <h3 className="font-semibold text-lg">Gas Level</h3>
          <p className="text-3xl font-bold mt-2">{gasLevel}</p>
          <span className="text-sm">PPM Level</span>
        </div>
        <div
          className={`p-4 rounded-lg text-white shadow-md ${
            warning ? "bg-red-600" : "bg-green-500"
          }`}
        >
          <h3 className="font-semibold text-lg">Status</h3>
          <p className="text-3xl font-bold mt-2">
            {warning ? "Warning" : "All Clear"}
          </p>
        </div>
      </div>

      {/* Analytics Card with Graph */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-800">Gas Monitoring Analytics</h3>
          <span className="text-gray-500 text-sm">Last 10 readings</span>
        </div>
        {/* Chart */}
        <Line data={data} options={options} />
      </div>
    </div>
  );
}