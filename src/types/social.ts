export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  likes: number;
  commentCount: number;
  readTimeMinutes: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  readAt?: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}
