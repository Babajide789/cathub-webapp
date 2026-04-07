"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const initialConversations = [
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
  {
    id: "3",
    name: "Mike Chen",
    avatar: "https://ui-avatars.com/api/?name=Mike+Chen",
    lastMessage: "He’s very playful 😂",
    timestamp: "3h ago",
    unread: 1,
    online: true,
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState("1");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const [messages, setMessages] = useState({
    "1": [
      { id: "1", text: "Hi! I’m interested in Luna.", sender: "them", time: "10:30" },
      { id: "2", text: "She’s available 😊", sender: "me", time: "10:31", seen: true },
    ],
    "2": [],
    "3": [],
  });

  const activeChat = messages[selectedId] || [];
  const activeUser = conversations.find(c => c.id === selectedId);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedId, typing]);

  // Auto resize textarea
  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: message,
      sender: "me",
      time: "now",
      seen: false,
    };

    setMessages(prev => ({
      ...prev,
      [selectedId]: [...prev[selectedId], newMsg],
    }));

    // Clear unread
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedId ? { ...c, unread: 0 } : c
      )
    );

    setMessage("");

    // Simulate typing + reply
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      const reply = {
        id: Date.now().toString(),
        text: "Sounds good! Let me know 👍",
        sender: "them",
        time: "now",
      };

      setMessages(prev => ({
        ...prev,
        [selectedId]: [...prev[selectedId], reply],
      }));
    }, 2400);
  };

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen w-full flex overflow-hidden">
      <Card className="flex flex-row w-full h-full overflow-hidden">

        {/* SIDEBAR */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1">
            {filtered.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full flex gap-3 px-4 py-3 hover:bg-gray-50 ${
                  selectedId === c.id && "bg-gray-100"
                }`}
              >
                <Avatar>
                  <AvatarImage src={c.avatar} />
                  <AvatarFallback>{c.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{c.name}</p>
                    <span className="text-xs">{c.timestamp}</span>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-sm truncate text-muted-foreground">
                      {c.lastMessage}
                    </p>
                    {c.unread > 0 && (
                      <span className="text-xs bg-primary text-white px-2 rounded-full">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* CHAT */}
        <div className="flex-1 flex flex-col">

          {/* HEADER */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar>
              <AvatarImage src={activeUser?.avatar} />
              <AvatarFallback>{activeUser?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{activeUser?.name}</p>
              <p className="text-xs text-muted-foreground">
                {activeUser?.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* MESSAGES */}
          <ScrollArea className="flex-1 p-4 space-y-2">
            {activeChat.map((msg, i) => {
              const isLastFromSender =
                activeChat[i + 1]?.sender !== msg.sender;

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "me"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="flex items-end gap-2 max-w-[70%]">
                    {msg.sender === "them" && isLastFromSender && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={activeUser.avatar} />
                      </Avatar>
                    )}

                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl text-sm ${
                          msg.sender === "me"
                            ? "bg-primary text-white"
                            : "bg-gray-100"
                        }`}
                      >
                        {msg.text}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1 flex gap-1">
                        {msg.time}
                        {msg.sender === "me" && msg.seen && "✓✓"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing */}
            {typing && (
              <div className="flex gap-2 items-center">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={activeUser.avatar} />
                </Avatar>
                <div className="bg-gray-100 px-3 py-2 rounded-2xl text-sm">
                  typing...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* INPUT */}
          <div className="p-4 border-t flex items-end gap-2">
            <Button variant="ghost">
              <Paperclip size={18} />
            </Button>

            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={handleInput}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Type a message..."
            />

            <Button variant="ghost">
              <Smile size={18} />
            </Button>

            <Button onClick={sendMessage} disabled={!message.trim()}>
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}