import type { Post } from "@/types";
import type { PostCardProps } from "@/types/ui";

/**
 * Converts API Post → UI PostCardProps
 */
export function mapPostToPostCard(post: Post): PostCardProps {
  return {
    userName: post.user.name,
    userAvatar: post.user.avatar,
    image: post.image ?? "",
    caption: post.content,
    likes: post.likes,
    comments: post.comments,
    timestamp: post.createdAt,
  };
}