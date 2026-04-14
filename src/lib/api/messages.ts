import type {
  Conversation,
  Message,
  SendMessagePayload,
} from "@/types/messages";

/* Conversations */
export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/messages/conversations");

  if (!res.ok) {
    throw new Error("Failed to fetch conversations");
  }

  return res.json();
}

/* Messages */
export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const res = await fetch(
    `/api/messages/${conversationId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch messages");
  }

  return res.json();
}

/* Send message */
export async function sendMessage(
  payload: SendMessagePayload
) {
  const res = await fetch("/api/messages/send", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}