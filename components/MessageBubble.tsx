import React from 'react';
import { Message } from '../types';
import { Bot, Sparkles } from './Icons';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === 'ai';

  return (
    <div className={`flex gap-4 w-full max-w-3xl mx-auto animate-fade-in-up ${isAI ? 'py-6' : 'py-4'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isAI ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Sparkles size={16} className="text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600">
             <img src="https://picsum.photos/100/100?random=1" alt="User" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm mb-1 text-gray-800 dark:text-gray-200">
          {isAI ? 'Aura' : 'You'}
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          {/* Simple text rendering, in a real app use a markdown parser */}
          {message.content.split('\n').map((line, i) => (
            <p key={i} className="mb-2 last:mb-0">{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
};
