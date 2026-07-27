import type { PostComment } from "@/types/posts";

export interface PostCardProps {
  id: string;
  userName: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  recentComments?: PostComment[];
}
