"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  Clock3,
  MoreHorizontal,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Video,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "@/lib/api/messages";
import type { Conversation, Message } from "@/types/messages";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const starterPrompts = [
  "Is this cat still available?",
  "Can we schedule a meet-and-greet?",
  "Do you have recent health records?",
];

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [selectedId, setSelectedId] = useState(searchParams.get("conversationId") || "1");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(searchParams.get("draft") || "");
  const [showChatOnMobile, setShowChatOnMobile] = useState(Boolean(searchParams.get("conversationId")));

  const recipientName = searchParams.get("recipient");
  const recipientAvatar = searchParams.get("avatar");

  const { data: conversations = [], isLoading: isConversationsLoading } =
    useQuery<Conversation[]>({
      queryKey: ["conversations"],
      queryFn: getConversations,
    });

  const enrichedConversations = useMemo(() => {
    if (!recipientName) return conversations;

    const exists = conversations.some((conversation) => conversation.id === selectedId);
    if (exists) return conversations;

    return [
      {
        id: selectedId,
        name: recipientName,
        avatar: recipientAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipientName)}`,
        lastMessage: message || "New adoption inquiry",
        timestamp: "now",
        unread: 0,
        online: true,
      },
      ...conversations,
    ];
  }, [conversations, message, recipientAvatar, recipientName, selectedId]);

  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<Message[]>({
    queryKey: ["messages", selectedId],
    queryFn: () => getMessages(selectedId),
    enabled: Boolean(selectedId),
  });

  const activeUser = enrichedConversations.find((conversation) => conversation.id === selectedId);

  const filteredConversations = enrichedConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(search.toLowerCase())
  );

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedId],
      });
    },
  });

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setShowChatOnMobile(true);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    mutation.mutate({
      conversationId: selectedId,
      text: message.trim(),
    });

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.min(event.target.scrollHeight, 144)}px`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-[calc(100dvh-7.5rem)] bg-slate-50 px-3 py-3 sm:px-4 lg:min-h-[calc(100dvh-4rem)] lg:p-6">
      <div className="mx-auto flex h-[calc(100dvh-9rem)] max-w-7xl overflow-hidden rounded-lg border bg-white shadow-sm lg:h-[calc(100dvh-7rem)]">
        <aside
          className={`w-full flex-col border-r bg-white lg:flex lg:w-[360px] ${
            showChatOnMobile ? "hidden" : "flex"
          }`}
        >
          <div className="border-b p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inbox</p>
                <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
              </div>
              <Button variant="outline" size="icon" aria-label="Message options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search people or shelters"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 bg-slate-50 pl-10"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {isConversationsLoading ? (
                <div className="space-y-2 p-2">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-20 animate-pulse rounded-lg bg-slate-100" />
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No conversations match your search.
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition ${
                      selectedId === conversation.id
                        ? "bg-slate-900 text-white shadow-sm"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 ${
                            conversation.online
                              ? "border-white bg-emerald-500"
                              : "border-white bg-slate-300"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <p className="truncate font-medium">{conversation.name}</p>
                          <span
                            className={`shrink-0 text-xs ${
                              selectedId === conversation.id
                                ? "text-white/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {conversation.timestamp}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={`truncate text-sm ${
                              selectedId === conversation.id
                                ? "text-white/75"
                                : "text-muted-foreground"
                            }`}
                          >
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </aside>

        <section
          className={`min-w-0 flex-1 flex-col bg-slate-50 lg:flex ${
            showChatOnMobile ? "flex" : "hidden"
          }`}
        >
          <div className="border-b bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setShowChatOnMobile(false)}
                  aria-label="Back to inbox"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeUser?.avatar} />
                  <AvatarFallback>{activeUser?.name?.[0] || "C"}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{activeUser?.name || "Conversation"}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{activeUser?.online ? "Online now" : "Usually replies within a day"}</span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" aria-label="Start call">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Start video">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="More options">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-b bg-white px-4 py-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                Verified profile
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">
                <CalendarDays className="h-4 w-4 shrink-0" />
                Meet-and-greet ready
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <Clock3 className="h-4 w-4 shrink-0" />
                Fast responses
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4 sm:p-6">
              {isMessagesLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-12 animate-pulse rounded-2xl bg-slate-200 ${
                        index % 2 === 0 ? "mr-16" : "ml-16"
                      }`}
                    />
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="mx-auto max-w-md rounded-lg border bg-white p-6 text-center shadow-sm">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-primary" />
                  <h2 className="mb-2 text-lg font-semibold">Start a helpful conversation</h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Ask about availability, personality, health records, or schedule a visit.
                  </p>
                  <div className="flex flex-col gap-2">
                    {starterPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        className="justify-start whitespace-normal text-left"
                        onClick={() => setMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMe = msg.sender === "me";
                  const previous = messages[index - 1];
                  const next = messages[index + 1];
                  const startsGroup = previous?.sender !== msg.sender;
                  const endsGroup = next?.sender !== msg.sender;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex max-w-[88%] items-end gap-2 sm:max-w-[72%] ${
                          isMe ? "flex-row-reverse" : ""
                        }`}
                      >
                        {!isMe && endsGroup ? (
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={activeUser?.avatar} />
                            <AvatarFallback>{activeUser?.name?.[0] || "C"}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-7 w-7 shrink-0" />
                        )}

                        <div>
                          {!isMe && startsGroup && (
                            <p className="mb-1 px-1 text-xs font-medium text-muted-foreground">
                              {activeUser?.name}
                            </p>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                              isMe
                                ? "rounded-br-md bg-slate-900 text-white"
                                : "rounded-bl-md border bg-white text-slate-900"
                            }`}
                          >
                            {msg.text}
                          </div>
                          {endsGroup && (
                            <div
                              className={`mt-1 flex items-center gap-1 px-1 text-xs text-muted-foreground ${
                                isMe ? "justify-end" : ""
                              }`}
                            >
                              <span>{msg.time}</span>
                              {isMe && msg.seen && <CheckCheck className="h-3.5 w-3.5 text-blue-600" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="border-t bg-white p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-lg border bg-slate-50 p-2">
              <Button variant="ghost" size="icon" aria-label="Attach file">
                <Paperclip className="h-4 w-4" />
              </Button>

              <textarea
                ref={textareaRef}
                rows={1}
                value={message}
                onChange={handleInput}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="max-h-36 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none"
                placeholder={`Message ${activeUser?.name || "contact"}...`}
              />

              <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Add emoji">
                <Smile className="h-4 w-4" />
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || mutation.isPending}
                size="icon"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
