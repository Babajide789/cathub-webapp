import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostCardProps } from "@/types/ui";
import Image from "next/image";


export function PostCard({ userName, userAvatar, image, caption, likes, comments, timestamp }: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-medium">{userName}</p>
          <p className="text-sm text-muted-foreground">{timestamp}</p>
        </div>
      </div>
      <div className="aspect-square bg-gray-50">
        <Image
          src={image}
          alt="Post"
          className="w-full h-full object-cover"
        />
      </div>
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
      </div>
    </Card>
  );
}
