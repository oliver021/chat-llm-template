export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  isPinned: boolean;
  updatedAt: number;
  messages: Message[];
}

export type Theme = 'light' | 'dark';
