export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
};

export type Message = {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
  seen?: boolean;
};

export type SendMessagePayload = {
  conversationId: string;
  text: string;
};