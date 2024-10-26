import { NextRequest, NextResponse } from 'next/server';

let warningStatus = false;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (message === "Gas leakage detected!") {
    warningStatus = true;
  } else {
    warningStatus = false;
  }

  return NextResponse.json({ status: 'Warning status updated', warningStatus });
}

export async function GET() {
  return NextResponse.json({ warningStatus });
}