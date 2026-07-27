import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to comment" }, { status: 401 });
  }

  const { postId } = await params;
  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!content) {
    return NextResponse.json({ error: "Comment cannot be empty" }, { status: 400 });
  }

  const post = await prisma.communityPost.findUnique({
    where: { id: postId },
    select: { id: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const comment = await prisma.communityComment.create({
    data: {
      postId,
      authorId: session.user.id,
      content,
    },
    include: {
      author: { select: { name: true, email: true, image: true } },
    },
  });

  const authorName = comment.author.name ?? comment.author.email;

  return NextResponse.json(
    {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      user: {
        name: authorName,
        avatar:
          comment.author.image ??
          `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`,
      },
    },
    { status: 201 }
  );
}
