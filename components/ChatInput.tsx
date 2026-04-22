import React, { useState, useRef, useEffect } from 'react';
import { useChatActions } from '../context/ChatContext';
import { Send, Plus } from './Icons';

interface ChatInputProps {
  isCentered?: boolean;
  // Optional ref forwarded from App so the "/" shortcut can focus the input
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({ isCentered = false, inputRef }) => {
  const { handleSendMessage } = useChatActions();
  const [input, setInput] = useState('');

  // Use the forwarded ref if provided, otherwise create a local one
  const localRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (inputRef ?? localRef) as React.RefObject<HTMLTextAreaElement>;

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
    // Enter sends, Shift+Enter inserts a newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea up to 200px
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
        <button
          type="button"
          className="p-3 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          aria-label="Attach file"
        >
          <Plus size={20} />
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Aura…"
          rows={1}
          className="w-full max-h-[200px] py-3 px-2 bg-transparent border-none focus:ring-0 resize-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base leading-relaxed"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim()}
          aria-label="Send message"
          className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${
            input.trim()
              ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md transform hover:scale-105'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send size={18} className={input.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
        </button>
      </div>

      {/* Shortcut hint line */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Aura can make mistakes. Consider verifying important information.
        </span>
        <span className="text-xs text-gray-300 dark:text-gray-600 hidden sm:block">
          <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">⌘K</kbd> new chat
          &nbsp;·&nbsp;
          <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">/</kbd> focus
        </span>
      </div>
    </div>
  );
};
