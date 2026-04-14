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
};

export type PostsResponse = {
  posts: Post[];
  nextPage: number | null;
};