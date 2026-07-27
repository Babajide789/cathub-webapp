import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatMessageTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to view messages" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get("conversationId");

  if (!conversationId) {
    return NextResponse.json({ error: "Conversation is required" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ initiatorId: session.user.id }, { recipientId: session.user.id }],
    },
    select: { id: true },
  });

  if (!conversation) {
    return NextResponse.json([]);
  }

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      senderId: true,
      text: true,
      readAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    messages.map((message) => ({
      id: message.id,
      text: message.text,
      sender: message.senderId === session.user.id ? "me" : "them",
      time: formatMessageTime(message.createdAt),
      seen: Boolean(message.readAt),
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to send messages" }, { status: 401 });
  }

  const body = await req.json();
  const conversationId =
    typeof body.conversationId === "string" ? body.conversationId.trim() : "";
  const text = typeof body.text === "string" ? body.text.trim() : "";
  const recipientName =
    typeof body.recipientName === "string" ? body.recipientName.trim() : "";
  const recipientAvatar =
    typeof body.recipientAvatar === "string" ? body.recipientAvatar.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";

  if (!conversationId || !text) {
    return NextResponse.json({ error: "Conversation and message are required" }, { status: 400 });
  }

  let conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      initiatorId: true,
      recipientId: true,
    },
  });

  if (
    conversation &&
    conversation.initiatorId !== session.user.id &&
    conversation.recipientId !== session.user.id
  ) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        id: conversationId,
        initiatorId: session.user.id,
        externalRecipientName: recipientName || null,
        externalRecipientAvatar: recipientAvatar || null,
        subject: subject || null,
      },
      select: {
        id: true,
        initiatorId: true,
        recipientId: true,
      },
    });
  } else if (recipientName || recipientAvatar || subject) {
    conversation = await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        ...(recipientName ? { externalRecipientName: recipientName } : {}),
        ...(recipientAvatar ? { externalRecipientAvatar: recipientAvatar } : {}),
        ...(subject ? { subject } : {}),
      },
      select: {
        id: true,
        initiatorId: true,
        recipientId: true,
      },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      text,
    },
    select: {
      id: true,
      text: true,
      createdAt: true,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(
    {
      id: message.id,
      text: message.text,
      sender: "me",
      time: formatMessageTime(message.createdAt),
      seen: false,
    },
    { status: 201 }
  );
}
