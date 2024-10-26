import { NextRequest, NextResponse } from 'next/server';

let warningStatus = false;
let gasLevel = 0; // Variabel untuk menyimpan nilai gas level terbaru

export async function POST(req: NextRequest) {
  const { message, level } = await req.json();

  // Simpan nilai gas level yang diterima
  gasLevel = level;

  // Set status sesuai dengan pesan dari ESP32
  if (message === "Gas leakage detected!") {
    warningStatus = true;
  } else {
    warningStatus = false;
  }

  return NextResponse.json({ status: 'Warning status updated', warningStatus, gasLevel });
}

export async function GET() {
  // Ambil status dan level gas saat ini
  const currentStatus = warningStatus;
  const currentGasLevel = gasLevel;

  // Reset status setelah setiap polling
  warningStatus = false; 

  return NextResponse.json({ warningStatus: currentStatus, gasLevel: currentGasLevel });
}