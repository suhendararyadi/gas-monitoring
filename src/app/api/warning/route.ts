import { NextRequest, NextResponse } from 'next/server';

let warningStatus = false;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  // Set status sesuai dengan pesan dari ESP32
  if (message === "Gas leakage detected!") {
    warningStatus = true;
  } else {
    warningStatus = false;
  }

  return NextResponse.json({ status: 'Warning status updated', warningStatus });
}

export async function GET() {
  // Ambil status saat ini, lalu reset ke false agar polling berikutnya tidak menunjukkan "Warning"
  const currentStatus = warningStatus;
  warningStatus = false; // Reset status setelah setiap polling

  return NextResponse.json({ warningStatus: currentStatus });
}