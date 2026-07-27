"use client";

import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostCardProps } from "@/types/ui";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/lib/api/posts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return timestamp;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PostCard({
  id,
  userName,
  userAvatar,
  image,
  caption,
  likes,
  comments,
  timestamp,
  recentComments = [],
}: PostCardProps) {
  const [comment, setComment] = useState("");
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => createComment({ postId: id, content: comment }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleComment = () => {
    if (!comment.trim() || mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">{formatTimestamp(timestamp)}</p>
        </div>
      </div>
      {image && (
        <div className="relative aspect-square bg-gray-50">
          <Image
            src={image}
            alt="Post"
            className="object-cover"
            fill
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm">
          <span className="font-medium mr-2">{userName}</span>
          {caption}
        </p>

        {recentComments.length > 0 && (
          <div className="mt-4 space-y-2 border-t pt-3">
            {recentComments.map((item) => (
              <p key={item.id} className="text-sm">
                <span className="font-medium mr-2">{item.user.name}</span>
                {item.content}
              </p>
            ))}
          </div>
        )}

        {session?.user && (
          <div className="mt-4 flex gap-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment();
              }}
            />
            <Button onClick={handleComment} disabled={mutation.isPending || !comment.trim()}>
              Reply
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
