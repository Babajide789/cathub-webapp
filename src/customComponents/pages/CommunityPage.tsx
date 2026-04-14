"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Video, SmilePlus } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { getPosts, createPost } from "@/lib/api/posts";
import type { PostsResponse, Post } from "@/types/posts";
import { mapPostToPostCard } from "@/lib/adapters/postsAdapter";

export function CommunityPage() {
  const [page, setPage] = useState(1);
  const [content, setContent] = useState("");

  const queryClient = useQueryClient();

  // 🚀 Typed Query (FIXED)
  const { data, isLoading } = useQuery<PostsResponse>({
    queryKey: ["posts", page],
    queryFn: () => getPosts({ page }),
  });

  const posts: Post[] = data?.posts ?? [];
  const nextPage = data?.nextPage ?? null;

  // 🚀 Mutation
  const mutation = useMutation({
    mutationFn: (newPost: string) => createPost(newPost),
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handlePost = () => {
    if (!content.trim()) return;
    mutation.mutate(content);
  };

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
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://ui-avatars.com/api/?name=You" />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share something about your cat..."
                  className="mb-3 resize-none"
                  rows={3}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm">
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