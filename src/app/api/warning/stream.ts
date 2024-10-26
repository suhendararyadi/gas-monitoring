import { NextRequest } from 'next/server';

let warningStatus = false;
let clients: any[] = [];

// Fungsi untuk mengirim pembaruan ke klien yang terhubung
function sendEventToAllClients() {
  clients.forEach((res) => {
    res.write(`data: ${JSON.stringify({ warningStatus })}\n\n`);
  });
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (message === "Gas leakage detected!") {
    warningStatus = true;
  } else {
    warningStatus = false;
  }

  sendEventToAllClients();

  return new Response(JSON.stringify({ status: 'Warning status updated', warningStatus }), { status: 200 });
}

export async function GET() {
  const headers = new Headers();
  headers.append('Content-Type', 'text/event-stream');
  headers.append('Cache-Control', 'no-cache');
  headers.append('Connection', 'keep-alive');

  const response = new Response(
    new ReadableStream({
      start(controller) {
        const send = (res: any) => {
          clients.push(controller);
          sendEventToAllClients();
          res.on('close', () => {
            clients = clients.filter((client) => client !== controller);
          });
        };
        send(controller);
      },
    }),
    { headers },
  );

  return response;
}