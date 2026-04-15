import React, { createContext, useContext } from 'react';

interface ChatActionsContextValue {
  handleSendMessage: (content: string) => void;
  handleNewChat: () => void;
  handleSelectChat: (id: string) => void;
  handleTogglePin: (id: string) => void;
  openSettings: () => void;
}

const ChatActionsContext = createContext<ChatActionsContextValue | null>(null);

export const ChatActionsProvider = ChatActionsContext.Provider;

export function useChatActions(): ChatActionsContextValue {
  const ctx = useContext(ChatActionsContext);
  if (!ctx) throw new Error('useChatActions must be used within ChatActionsProvider');
  return ctx;
}
