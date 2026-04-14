import { NextResponse } from "next/server";
import { posts } from "@/lib/data";
import type { Post } from "@/types";

let allPosts: Post[] = [...posts];

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 5;

  const start = (page - 1) * pageSize;
  const end = page * pageSize;

  const paginated = allPosts.slice(start, end);

  const hasMore = end < allPosts.length;

  return NextResponse.json({
    posts: paginated,
    nextPage: hasMore ? page + 1 : null,
  });
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const newPost: Post = {
    id: Date.now().toString(),
    user: {
      name: "You",
      avatar: "https://ui-avatars.com/api/?name=You",
    },
    content: body.content,
    image: body.image ?? "",
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };

  allPosts = [newPost, ...allPosts];

  return NextResponse.json(newPost);
}