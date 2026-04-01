import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ScrollArea } from "../components/ui/scroll-area";

const conversations = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
    lastMessage: "Is Luna still available for adoption?",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: "2",
    name: "Paws Rescue Center",
    avatar: "https://ui-avatars.com/api/?name=Paws+Rescue",
    lastMessage: "Thank you for your interest!",
    timestamp: "1h ago",
    unread: false,
  },
  {
    id: "3",
    name: "Mike Chen",
    avatar: "https://ui-avatars.com/api/?name=Mike+Chen",
    lastMessage: "He's very playful and friendly",
    timestamp: "3h ago",
    unread: false,
  },
];

const messages = [
  {
    id: "1",
    sender: "Sarah Johnson",
    text: "Hi! I saw Luna's profile and I'm very interested in adopting her.",
    timestamp: "10:30 AM",
    sent: false,
  },
  {
    id: "2",
    sender: "You",
    text: "Hello! That's wonderful. Luna is a sweet cat and would love a new home.",
    timestamp: "10:32 AM",
    sent: true,
  },
  {
    id: "3",
    sender: "Sarah Johnson",
    text: "That's great! Can you tell me more about her personality?",
    timestamp: "10:33 AM",
    sent: false,
  },
  {
    id: "4",
    sender: "You",
    text: "She's very gentle and loves to cuddle. She's also great with children and other pets.",
    timestamp: "10:35 AM",
    sent: true,
  },
  {
    id: "5",
    sender: "Sarah Johnson",
    text: "Is Luna still available for adoption?",
    timestamp: "10:38 AM",
    sent: false,
  },
];

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-64px)] bg-background">
      <div className="container mx-auto px-0 md:px-4 h-full py-0 md:py-4">
        <Card className="h-full flex overflow-hidden rounded-none md:rounded-xl">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r flex flex-col bg-white">
            <div className="p-4 border-b">
              <h2 className="mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search messages..." className="pl-10" />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation.id === conversation.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${conversation.unread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className="hidden md:flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                  <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedConversation.name}</p>
                  <p className="text-xs text-muted-foreground">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.sent ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          message.sent
                            ? "bg-primary text-primary-foreground"
                            : "bg-gray-100 text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-2">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && messageText.trim()) {
                      console.log("Send message:", messageText);
                      setMessageText("");
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (messageText.trim()) {
                      console.log("Send message:", messageText);
                      setMessageText("");
                    }
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Show message to select conversation */}
          <div className="md:hidden flex-1 flex items-center justify-center bg-gray-50">
            <p className="text-muted-foreground text-sm">Select a conversation to view messages</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
