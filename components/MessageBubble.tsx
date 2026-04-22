import React from 'react';
import ReactMarkdown from 'react-markdown';
// Light build: only loads languages we explicitly register — prevents bundling
// every language (which inflates the bundle by ~500 kB)
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

// Register only the languages we want syntax highlighting for.
// Add more here as needed — each is a small async chunk.
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('css', css);
import { Message } from '../types';
import { formatTime } from '../utils/timeUtils';
import { useChatActions } from '../context/ChatContext';
import { MessageActionMenu } from './MessageActionMenu';
import { Sparkles } from './Icons';

interface MessageBubbleProps {
  message: Message;
  chatId: string;
}

/**
 * Custom markdown components wired to Tailwind classes.
 *
 * - Code blocks use Prism + oneDark theme — dark code blocks look good in both
 *   light and dark app themes (convention: VS Code, GitHub, etc.)
 * - Inline code uses a subtle pill style
 * - Tables, blockquotes, lists all get sensible spacing
 */
const markdownComponents: Components = {
  // ── Code ─────────────────────────────────────────────────────────────────
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? '');
    const isBlock = !!match;

    if (isBlock) {
      return (
        // Wrapper gives the code block a subtle border and rounded corners
        <div className="my-3 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 text-sm">
          {/* Language badge */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-gray-800 border-b border-gray-700">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              {match[1]}
            </span>
          </div>
          <SyntaxHighlighter
            style={oneDark}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              padding: '1rem',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 font-mono text-[0.85em]"
        {...props}
      >
        {children}
      </code>
    );
  },

  // ── Typography ────────────────────────────────────────────────────────────
  p({ children }) {
    return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
  },
  strong({ children }) {
    return <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>;
  },
  em({ children }) {
    return <em className="italic text-gray-700 dark:text-gray-300">{children}</em>;
  },

  // ── Headings ──────────────────────────────────────────────────────────────
  h1({ children }) {
    return <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-base font-semibold mt-3 mb-1.5 text-gray-900 dark:text-white">{children}</h3>;
  },

  // ── Lists ─────────────────────────────────────────────────────────────────
  ul({ children }) {
    return <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 pl-2">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700 dark:text-gray-300 pl-2">{children}</ol>;
  },
  li({ children }) {
    return <li className="leading-relaxed">{children}</li>;
  },

  // ── Blockquote ────────────────────────────────────────────────────────────
  blockquote({ children }) {
    return (
      <blockquote className="my-3 pl-4 border-l-4 border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 py-2 pr-3 rounded-r-lg text-gray-700 dark:text-gray-300 italic">
        {children}
      </blockquote>
    );
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  table({ children }) {
    return (
      <div className="my-3 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="px-4 py-2 text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 last:border-0">
        {children}
      </td>
    );
  },

  // ── Horizontal rule ───────────────────────────────────────────────────────
  hr() {
    return <hr className="my-4 border-gray-200 dark:border-gray-700" />;
  },
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, chatId }) => {
  const isAI = message.role === 'ai';
  const {
    handleCopyMessage,
    handleDeleteMessage,
    handleEditMessage,
    handleRegenerateMessage,
  } = useChatActions();

  return (
    <div
      className={`w-full flex ${isAI ? 'justify-start' : 'justify-end'} mb-4 animate-fade-in-up`}
    >
      <div className={`flex gap-2 ${isAI ? 'flex-row' : 'flex-row-reverse'} max-w-2xl group`}>
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

        {/* Message wrapper */}
        <div className="flex flex-col gap-1">
          {/* Content box */}
          <div className={`${isAI ? 'bg-gray-100 dark:bg-gray-800' : 'bg-blue-500 dark:bg-blue-600'} rounded-lg px-4 py-2 max-w-xl`}>
            {/* Header row: name + timestamp + edited badge */}
            <div className={`flex items-baseline gap-2 mb-1 text-xs ${isAI ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100 dark:text-blue-200'}`}>
              <span className={`font-semibold text-sm ${isAI ? 'text-gray-800 dark:text-gray-200' : 'text-white'}`}>
                {isAI ? 'Aura' : 'You'}
              </span>
              <span className={isAI ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100 dark:text-blue-200'}>
                {formatTime(message.timestamp)}
              </span>
              {message.isEdited && (
                <span className={`italic ${isAI ? 'text-gray-400 dark:text-gray-500' : 'text-blue-100 dark:text-blue-200'}`}>(edited)</span>
              )}
            </div>

            {/* Message body — markdown for AI, plain text for user */}
            <div className={`text-sm leading-relaxed ${isAI ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`}>
              {isAI ? (
                <ReactMarkdown components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                // User messages: preserve newlines, no markdown parsing
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>

            {/* Streaming cursor — blinking bar shown while the AI is still writing */}
            {message.isStreaming && (
              <span
                className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-middle animate-pulse"
                aria-label="AI is typing"
              />
            )}
          </div>

          {/* Action menu — below message, hidden while streaming */}
          {!message.isStreaming && (
            <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <MessageActionMenu
                messageId={message.id}
                chatId={chatId}
                isAIMessage={isAI}
                onCopy={handleCopyMessage}
                onDelete={handleDeleteMessage}
                onRegenerate={handleRegenerateMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
