import React, { useState, useRef, useEffect } from 'react';
import { useChatActions } from '../context/ChatContext';
import { Send, Plus } from './Icons';

interface ChatInputProps {
  isCentered?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ isCentered = false }) => {
  const { handleSendMessage } = useChatActions();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      handleSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto transition-all duration-500 ease-in-out ${isCentered ? 'scale-105' : 'scale-100'}`}
    >
      <div className="relative flex items-end gap-2 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 rounded-3xl p-2 shadow-sm focus-within:shadow-md focus-within:border-blue-300 dark:focus-within:border-blue-500/50 transition-all">
        <button className="p-3 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
          <Plus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Aura..."
          className="w-full max-h-[200px] py-3 px-2 bg-transparent border-none focus:ring-0 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
          rows={1}
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${
            input.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md transform hover:scale-105'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
        </button>
      </div>
      <div className="text-center mt-3 text-xs text-gray-400 dark:text-gray-500">
        Aura can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
};
