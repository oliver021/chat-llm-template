import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ChatSession, Message } from '../types';
import { MOCK_CHATS } from '../constants';
import { streamMockAiResponse } from '../services/mockAiService';
import { getStoredChats, setStoredChats, clearAllStorage } from '../utils/storage';

interface UseChatsResult {
  chats: ChatSession[];
  activeChatId: string | null;
  activeChat: ChatSession | null;
  // isTyping is kept for the TypingIndicator shown during the initial stream delay
  isTyping: boolean;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleTogglePin: (id: string) => void;
  handleSendMessage: (content: string) => void;
  handleCopyMessage: (messageId: string) => void;
  handleDeleteMessage: (chatId: string, messageId: string) => void;
  handleEditMessage: (chatId: string, messageId: string, newContent: string) => void;
  handleRegenerateMessage: (chatId: string, messageId: string) => void;
}

export function useChats(onMobileNavigate?: () => void): UseChatsResult {
  const [chats, setChats] = useState<ChatSession[]>(() => getStoredChats(MOCK_CHATS));
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // isTyping = true only during the initial delay before the first token arrives
  const [isTyping, setIsTyping] = useState(false);

  // cancelStream holds the abort function returned by streamMockAiResponse.
  // We call it if the user switches chat or the component unmounts mid-stream.
  const cancelStreamRef = useRef<(() => void) | null>(null);

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    setStoredChats(chats);
  }, [chats]);

  // Cancel any in-flight stream on unmount
  useEffect(() => {
    return () => {
      cancelStreamRef.current?.();
    };
  }, []);

  const handleNewChat = useCallback(() => {
    // Abort any running stream before switching
    cancelStreamRef.current?.();
    cancelStreamRef.current = null;
    setIsTyping(false);

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
      // Abort any running stream before switching chats
      cancelStreamRef.current?.();
      cancelStreamRef.current = null;
      setIsTyping(false);

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
      // Abort any previous stream
      cancelStreamRef.current?.();
      cancelStreamRef.current = null;

      let currentChatId = activeChatId;

      // If no active chat, create one and use its id
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

      // Update chat with user message and set title if still 'New Chat'
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== currentChatId) return chat;
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
        })
      );

      // ── Streaming response ──────────────────────────────────────────────────
      // 1. Show typing indicator while waiting for the first token
      setIsTyping(true);

      // 2. Create a placeholder AI message with isStreaming=true.
      //    Tokens will be appended to it as they arrive.
      const aiMessageId = `msg-ai-${Date.now()}`;

      // We add the placeholder after a brief delay that matches the stream start
      // delay so the typing indicator shows first, then seamlessly transitions.
      const placeholderDelay = setTimeout(() => {
        setIsTyping(false);

        const placeholderMessage: Message = {
          id: aiMessageId,
          role: 'ai',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        };

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, messages: [...chat.messages, placeholderMessage] }
              : chat
          )
        );
      }, 380); // just under the stream's startDelay so it appears before first token

      // 3. Start streaming tokens into the placeholder message
      const cancel = streamMockAiResponse(
        (token) => {
          clearTimeout(placeholderDelay); // already past this point
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== currentChatId) return chat;
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === aiMessageId
                    ? { ...msg, content: msg.content + token }
                    : msg
                ),
              };
            })
          );
        },
        () => {
          // Stream complete — mark message as done and persist
          setIsTyping(false);
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== currentChatId) return chat;
              return {
                ...chat,
                updatedAt: Date.now(),
                messages: chat.messages.map((msg) =>
                  msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
                ),
              };
            })
          );
          cancelStreamRef.current = null;
        }
      );

      cancelStreamRef.current = cancel;
    },
    [activeChatId]
  );

  // ── Message action handlers ───────────────────────────────────────────────

  const handleCopyMessage = useCallback(
    (messageId: string) => {
      const message = chats.flatMap((c) => c.messages).find((m) => m.id === messageId);
      if (!message) return;

      navigator.clipboard
        .writeText(message.content)
        .then(() => toast.success('Copied to clipboard'))
        .catch(() => toast.error('Could not access clipboard'));
    },
    [chats]
  );

  const handleDeleteMessage = useCallback((chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.filter((m) => m.id !== messageId),
              updatedAt: Date.now(),
            }
          : chat
      )
    );
    toast('Message deleted', { icon: '🗑️' });
  }, []);

  const handleEditMessage = useCallback(
    (chatId: string, messageId: string, newContent: string) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === messageId
                    ? { ...m, content: newContent, isEdited: true, editedAt: Date.now() }
                    : m
                ),
                updatedAt: Date.now(),
              }
            : chat
        )
      );
      toast.success('Message updated');
    },
    []
  );

  const handleRegenerateMessage = useCallback(
    (chatId: string, messageId: string) => {
      // Abort any current stream first
      cancelStreamRef.current?.();
      cancelStreamRef.current = null;

      // Remove the old AI message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: chat.messages.filter((m) => m.id !== messageId) }
            : chat
        )
      );

      const toastId = toast.loading('Regenerating response…');

      // Add a new streaming placeholder
      const newAiId = `msg-ai-${Date.now()}`;
      const placeholder: Message = {
        id: newAiId,
        role: 'ai',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, placeholder] }
            : chat
        )
      );

      const cancel = streamMockAiResponse(
        (token) => {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== chatId) return chat;
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === newAiId ? { ...msg, content: msg.content + token } : msg
                ),
              };
            })
          );
        },
        () => {
          setChats((prev) =>
            prev.map((chat) => {
              if (chat.id !== chatId) return chat;
              return {
                ...chat,
                updatedAt: Date.now(),
                messages: chat.messages.map((msg) =>
                  msg.id === newAiId ? { ...msg, isStreaming: false } : msg
                ),
              };
            })
          );
          toast.success('Response regenerated', { id: toastId });
          cancelStreamRef.current = null;
        }
      );

      cancelStreamRef.current = cancel;
    },
    []
  );

  const handleClearHistory = useCallback(() => {
    cancelStreamRef.current?.();
    cancelStreamRef.current = null;
    setChats([]);
    setActiveChatId(null);
    setIsTyping(false);
    clearAllStorage();
    toast.success('Chat history cleared');
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;

  return {
    chats,
    activeChatId,
    activeChat,
    isTyping,
    handleNewChat,
    handleSelectChat,
    handleTogglePin,
    handleSendMessage,
    handleCopyMessage,
    handleDeleteMessage,
    handleEditMessage,
    handleRegenerateMessage,
    handleClearHistory,
  };
}
