export interface BlogPost {
  id: string;
  restaurantId: string;
  restaurantName: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
  imageUrl?: string;
}
