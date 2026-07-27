import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 5;

function mapPost(post: {
  id: string;
  content: string;
  image: string | null;
  likes: number;
  createdAt: Date;
  author: { name: string | null; email: string; image: string | null };
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string | null; email: string; image: string | null };
  }[];
  _count: { comments: number };
}) {
  const authorName = post.author.name ?? post.author.email;

  return {
    id: post.id,
    user: {
      name: authorName,
      avatar: post.author.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}`,
    },
    content: post.content,
    image: post.image ?? undefined,
    likes: post.likes,
    comments: post._count.comments,
    recentComments: post.comments.map((comment) => {
      const commentAuthor = comment.author.name ?? comment.author.email;
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        user: {
          name: commentAuthor,
          avatar:
            comment.author.image ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(commentAuthor)}`,
        },
      };
    }),
    createdAt: post.createdAt.toISOString(),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const posts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
    include: {
      author: { select: { name: true, email: true, image: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { author: { select: { name: true, email: true, image: true } } },
      },
      _count: { select: { comments: true } },
    },
  });

  const hasMore = posts.length > PAGE_SIZE;
  const pagePosts = posts.slice(0, PAGE_SIZE).map(mapPost);

  return NextResponse.json({
    posts: pagePosts,
    nextPage: hasMore ? page + 1 : null,
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to post" }, { status: 401 });
  }

  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";

  if (!content && !image) {
    return NextResponse.json({ error: "Add text or a picture to post" }, { status: 400 });
  }

  if (image && !URL.canParse(image)) {
    return NextResponse.json({ error: "Image must be a valid URL" }, { status: 400 });
  }

  const post = await prisma.communityPost.create({
    data: {
      authorId: session.user.id,
      content,
      image: image || null,
    },
    include: {
      author: { select: { name: true, email: true, image: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { author: { select: { name: true, email: true, image: true } } },
      },
      _count: { select: { comments: true } },
    },
  });

  if (image) {
    await prisma.savedPicture.create({
      data: {
        userId: session.user.id,
        image,
        caption: content || null,
        source: "community-post",
      },
    });
  }

  return NextResponse.json(mapPost(post), { status: 201 });
}
