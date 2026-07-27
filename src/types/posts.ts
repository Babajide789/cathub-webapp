export type Post = {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  recentComments?: PostComment[];
};

export type PostsResponse = {
  posts: Post[];
  nextPage: number | null;
};

export type PostComment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
};
