"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Video, SmilePlus } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PostCard } from "../components/PostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { getPosts, createPost } from "@/lib/api/posts";
import type { PostsResponse, Post } from "@/types/posts";
import { mapPostToPostCard } from "@/lib/adapters/postsAdapter";

export function CommunityPage() {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const { data: session } = useSession();

  const queryClient = useQueryClient();

  // Typed Query (FIXED)
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts", page],
    queryFn: () => getPosts({ page }),
  });

  const posts: Post[] = data?.posts ?? [];
  const nextPage = data?.nextPage ?? null;

  // Mutation
  const mutation = useMutation({
    mutationFn: (newPost: { content: string; image?: string }) => createPost(newPost),
    onSuccess: () => {
      setContent("");
      setImage("");
      setShowImageInput(false);
      setPage(1);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handlePost = () => {
    if (!content.trim() && !image.trim()) return;
    mutation.mutate({ content, image: image.trim() || undefined });
  };

  const userName = session?.user?.name ?? session?.user?.email ?? "You";
  const userImage =
    session?.user?.image ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Community Feed</h1>
          <p className="text-muted-foreground">
            Share your cat moments with fellow cat lovers
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Create Post */}
          <Card className="p-4">
            {session?.user ? (
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={userImage} />
                  <AvatarFallback>{userName[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share something about your cat..."
                    className="mb-3 resize-none"
                    rows={3}
                  />

                  {showImageInput && (
                    <Input
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Paste an image URL"
                      className="mb-3"
                    />
                  )}

                  {mutation.isError && (
                    <p className="mb-3 text-sm text-destructive">
                      {mutation.error instanceof Error ? mutation.error.message : "Unable to post"}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowImageInput((value) => !value)}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Photo
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <Video className="w-4 h-4 mr-2" />
                        Video
                      </Button>
                      <Button variant="ghost" size="sm" disabled>
                        <SmilePlus className="w-4 h-4 mr-2" />
                        Feeling
                      </Button>
                    </div>

                    <Button onClick={handlePost} disabled={mutation.isPending}>
                      {mutation.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">Sign in to post pictures and join the conversation.</p>
                <Link href="/auth/signin">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Feed */}
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10">
              No posts yet 😿
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  {...mapPostToPostCard(post)}
                />
              ))}
            </div>
          )}

          {/* Load More */}
          {nextPage && (
            <div className="text-center py-6">
              <Button variant="outline" onClick={() => setPage(nextPage)}>
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
