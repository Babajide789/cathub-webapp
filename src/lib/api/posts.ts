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

export async function createPost(input: { content: string; image?: string }) {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Failed to create post");
  }

  return res.json();
}

export async function createComment(input: { postId: string; content: string }) {
  const res = await fetch(`/api/posts/${input.postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: input.content }),
  });

  if (!res.ok) throw new Error("Failed to create comment");

  return res.json();
}
