import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function timeAgo(date: Date) {
  const diffSeconds = Math.max(1, Math.floor((Date.now() - date.getTime()) / 1000));
  if (diffSeconds < 60) return "now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to view messages" }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ initiatorId: session.user.id }, { recipientId: session.user.id }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      initiator: { select: { id: true, name: true, email: true, image: true } },
      recipient: { select: { id: true, name: true, email: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { text: true, createdAt: true },
      },
      _count: {
        select: {
          messages: {
            where: {
              senderId: { not: session.user.id },
              readAt: null,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(
    conversations.map((conversation) => {
      const otherUser =
        conversation.recipientId === session.user.id
          ? conversation.initiator
          : conversation.recipient;
      const name =
        otherUser?.name ??
        otherUser?.email ??
        conversation.externalRecipientName ??
        "CatHub contact";
      const lastMessage = conversation.messages[0];

      return {
        id: conversation.id,
        name,
        avatar:
          otherUser?.image ??
          conversation.externalRecipientAvatar ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        lastMessage: lastMessage?.text ?? conversation.subject ?? "New conversation",
        timestamp: timeAgo(lastMessage?.createdAt ?? conversation.updatedAt),
        unread: conversation._count.messages,
        online: false,
      };
    })
  );
}
