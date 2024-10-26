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
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleClick = () => {
      if (!audio) {
        const newAudio = new Audio("/warning-sound.mp3");
        setAudio(newAudio);
      }
      window.removeEventListener("click", handleClick);
    };

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [audio]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/warning")
        .then((response) => response.json())
        .then((data) => {
          if (data.warningStatus && !warning) {
            audio?.play().catch((error) => console.error("Audio play error:", error));
          }

          setWarning(data.warningStatus);
          setGasLevel(data.gasLevel);
          setTemperature(data.temperature);
          setHumidity(data.humidity);

          setHistory((prev) => [...prev.slice(-9), data.gasLevel]);
          setLabels((prev) => [...prev.slice(-9), new Date().toLocaleTimeString()]);
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
    maintainAspectRatio: false,
    aspectRatio: 2,
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
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Gas Monitoring Dashboard
      </h1>

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
        <div className="p-4 rounded-lg bg-blue-500 text-white shadow-md">
          <h3 className="font-semibold text-lg">Temperature</h3>
          <p className="text-3xl font-bold mt-2">{temperature}°C</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-500 text-white shadow-md">
          <h3 className="font-semibold text-lg">Humidity</h3>
          <p className="text-3xl font-bold mt-2">{humidity}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl flex justify-center items-center">
        <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}