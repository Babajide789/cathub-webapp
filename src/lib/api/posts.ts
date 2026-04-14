// src/lib/api/posts.ts

export interface GetPostsParams {
  page?: number;
}

import type { PostsResponse } from "@/types/posts";

export async function getPosts(params: { page: number }): Promise<PostsResponse> {
  const res = await fetch(`/api/posts?page=${params.page}`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

// (Optional for later)
export async function createPost(content: string) {
  const res = await fetch("/api/posts", {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  if (!res.ok) throw new Error("Failed to create post");

  return res.json();
}