import { NextResponse } from "next/server";

type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  seen?: boolean;
};

const messagesDB: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Hi! I’m interested in Luna.",
      sender: "them",
      time: "10:30",
    },
    {
      id: "2",
      text: "She’s available 😊",
      sender: "me",
      time: "10:31",
      seen: true,
    },
  ],
  "2": [],
};

// GET messages
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId") || "";

  return NextResponse.json(messagesDB[conversationId] || []);
}

// POST message
export async function POST(req: Request) {
  const body = await req.json();
  const { conversationId, text } = body;

  const newMsg: Message = {
    id: Date.now().toString(),
    text,
    sender: "me",
    time: "now",
    seen: false,
  };

  if (!messagesDB[conversationId]) {
    messagesDB[conversationId] = [];
  }

  messagesDB[conversationId].push(newMsg);

  return NextResponse.json(newMsg);
}