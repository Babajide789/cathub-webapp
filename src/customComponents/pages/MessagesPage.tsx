"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "@/lib/api/messages";
import type {
  Conversation,
  Message,
} from "@/types/messages";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";


export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const queryClient = useQueryClient();

  /* ================= CONVERSATIONS ================= */
/* ================= CONVERSATIONS ================= */
const { data: conversations = [] } =
  useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

/* ================= MESSAGES ================= */
const {
  data: messages = [],
  isLoading,
} = useQuery<Message[]>({
  queryKey: ["messages", selectedId],
  queryFn: () => getMessages(selectedId),
  enabled: !!selectedId,
});

  const activeChat = messages;

  const activeUser = conversations.find(
    (c) => c.id === selectedId
  );

  /* ================= MUTATION ================= */
  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedId],
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;

    mutation.mutate({
      conversationId: selectedId,
      text: message,
    });

    setMessage("");
  };

  /* ================= SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= INPUT ================= */
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  /* ================= FILTER ================= */
  const filtered = conversations.filter((c) =>
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
            {filtered.map((c) => (
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
              <AvatarFallback>{activeUser?.name?.[0]}</AvatarFallback>
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
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : activeChat.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No messages yet
              </div>
            ) : (
              activeChat.map((msg, i) => {
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
                          <AvatarImage src={activeUser?.avatar} />
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
              })
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
                  handleSendMessage();
                }
              }}
              className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none"
              placeholder="Type a message..."
            />

            <Button variant="ghost">
              <Smile size={18} />
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || mutation.isPending}
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}