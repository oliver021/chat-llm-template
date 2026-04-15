import { useState, useCallback } from 'react';
import { ChatSession, Message } from '../types';
import { MOCK_CHATS } from '../constants';
import { getMockAiResponse } from '../services/mockAiService';

interface UseChatsResult {
  chats: ChatSession[];
  activeChatId: string | null;
  activeChat: ChatSession | null;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleTogglePin: (id: string) => void;
  handleSendMessage: (content: string) => void;
}

export function useChats(onMobileNavigate?: () => void): UseChatsResult {
  const [chats, setChats] = useState<ChatSession[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const handleNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      isPinned: false,
      updatedAt: Date.now(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    if (window.innerWidth < 768) onMobileNavigate?.();
  }, [onMobileNavigate]);

  const handleSelectChat = useCallback(
    (id: string) => {
      setActiveChatId(id);
      if (window.innerWidth < 768) onMobileNavigate?.();
    },
    [onMobileNavigate]
  );

  const handleTogglePin = useCallback((id: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat))
    );
  }, []);

  const handleSendMessage = useCallback(
    (content: string) => {
      let currentChatId = activeChatId;

      // If no active chat, create one first
      if (!currentChatId) {
        const newChat: ChatSession = {
          id: `chat-${Date.now()}`,
          title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
          isPinned: false,
          updatedAt: Date.now(),
          messages: [],
        };
        setChats((prev) => [newChat, ...prev]);
        currentChatId = newChat.id;
        setActiveChatId(currentChatId);
      }

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      // Update chat with user message and update title if it was 'New Chat'
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            const newTitle =
              chat.title === 'New Chat' && chat.messages.length === 0
                ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                : chat.title;
            return {
              ...chat,
              title: newTitle,
              updatedAt: Date.now(),
              messages: [...chat.messages, userMessage],
            };
          }
          return chat;
        })
      );

      // Mock AI response
      getMockAiResponse().then((content) => {
        const aiMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          role: 'ai',
          content,
          timestamp: Date.now(),
        };

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === currentChatId) {
              return {
                ...chat,
                updatedAt: Date.now(),
                messages: [...chat.messages, aiMessage],
              };
            }
            return chat;
          })
        );
      });
    },
    [activeChatId]
  );

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  return {
    chats,
    activeChatId,
    activeChat,
    handleNewChat,
    handleSelectChat,
    handleTogglePin,
    handleSendMessage,
  };
}
