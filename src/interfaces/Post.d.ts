export interface Post {
  id: string;
  authorId: string;
  content: string;
  createdAt: number;
  mediaUrls?: string[];
}