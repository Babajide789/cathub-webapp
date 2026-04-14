import { NextResponse } from "next/server";

type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
    lastMessage: "Is Luna still available?",
    timestamp: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Paws Rescue",
    avatar: "https://ui-avatars.com/api/?name=Paws+Rescue",
    lastMessage: "Thanks for reaching out!",
    timestamp: "1h ago",
    unread: 0,
    online: false,
  },
];

export async function GET() {
  return NextResponse.json(conversations);
}