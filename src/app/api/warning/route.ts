import { NextRequest, NextResponse } from 'next/server';

let sensorData = {
  warningStatus: false,
  gasLevel: 0,
  temperature: 0,
  humidity: 0,
};

export async function POST(req: NextRequest) {
  const { message, gasLevel, temperature, humidity } = await req.json();

  // Perbarui nilai gas level, suhu, dan kelembaban yang diterima
  sensorData.gasLevel = gasLevel;
  sensorData.temperature = temperature;
  sensorData.humidity = humidity;

  // Atur status warning berdasarkan pesan dari ESP32
  if (message === "Gas leakage detected!") {
    sensorData.warningStatus = true;
  } else {
    sensorData.warningStatus = false;
  }

  return NextResponse.json({ status: 'Sensor data updated', ...sensorData });
}

export async function GET() {
  // Ambil data sensor saat ini
  const currentStatus = sensorData.warningStatus;
  const currentGasLevel = sensorData.gasLevel;
  const currentTemperature = sensorData.temperature;
  const currentHumidity = sensorData.humidity;

  // Reset status warning hanya jika diperlukan berdasarkan kondisi polling
  // (Jika Anda ingin mempertahankan status setelah polling, hapus reset otomatis)
  sensorData.warningStatus = false;

  return NextResponse.json({
    warningStatus: currentStatus,
    gasLevel: currentGasLevel,
    temperature: currentTemperature,
    humidity: currentHumidity,
  });
}