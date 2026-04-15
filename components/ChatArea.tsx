import React, { useEffect, useRef } from 'react';
import { ChatSession } from '../types';
import { SUGGESTED_PROMPTS } from '../constants';
import { useChatActions } from '../context/ChatContext';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { Sparkles, ColorfulIcon } from './Icons';

interface ChatAreaProps {
  chat: ChatSession | null;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ chat }) => {
  const { handleSendMessage } = useChatActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNewChat = !chat || chat.messages.length === 0;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  return (
    <div className="flex-1 flex flex-col h-full relative bg-white dark:bg-gray-950">
      {isNewChat ? (
        // New Chat View - Centered
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in-up">
          <div className="w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-inner">
            <ColorfulIcon icon={Sparkles} colorClass="text-blue-500 dark:text-blue-400" size={40} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            How can I help you today?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-12 max-w-md">
            I'm Aura, your creative and helpful AI assistant. Ask me anything.
          </p>

          <div className="w-full max-w-3xl">
            <ChatInput isCentered={true} />
          </div>

          {/* Suggested Prompts */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl w-full px-4">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="text-left p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-sm text-gray-600 dark:text-gray-300"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Existing Chat View - Standard Layout
        <>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
            <div className="max-w-4xl mx-auto flex flex-col gap-2 pb-4">
              {chat.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Input Area */}
          <div className="p-4 bg-gradient-to-t from-white via-white to-transparent dark:from-gray-950 dark:via-gray-950 pt-8">
            <ChatInput />
          </div>
        </>
      )}
    </div>
  );
};
