import { ImageIcon, Video, SmilePlus } from "lucide-react";
import { PostCard } from "../components/PostCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockPosts } from "../data/mockData";

export function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-8 md:py-12 border-b">
        <div className="container mx-auto px-4">
          <h1 className="mb-2">Community Feed</h1>
          <p className="text-muted-foreground">Share your cat moments with fellow cat lovers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Create Post */}
          <Card className="p-4">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
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
                  <Button>Post</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center py-6">
            <Button variant="outline">Load More Posts</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
