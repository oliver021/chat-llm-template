import React from 'react';
import { Copy, Pencil, Trash2, RefreshCw } from './Icons';

interface MessageActionMenuProps {
  messageId: string;
  chatId: string;
  isAIMessage: boolean;
  onCopy: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete: (chatId: string, messageId: string) => void;
  onRegenerate: (chatId: string, messageId: string) => void;
}

export const MessageActionMenu: React.FC<MessageActionMenuProps> = ({
  messageId,
  chatId,
  isAIMessage,
  onCopy,
  onEdit,
  onDelete,
  onRegenerate,
}) => {
  return (
    <div className="absolute top-0 right-0 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Copy button */}
      <button
        onClick={() => onCopy(messageId)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        title="Copy message"
        type="button"
      >
        <Copy size={16} />
      </button>

      {/* Edit button (user messages only) */}
      {!isAIMessage && onEdit && (
        <button
          onClick={() => onEdit(messageId)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          title="Edit message"
          type="button"
        >
          <Pencil size={16} />
        </button>
      )}

      {/* Delete button */}
      <button
        onClick={() => onDelete(chatId, messageId)}
        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        title="Delete message"
        type="button"
      >
        <Trash2 size={16} />
      </button>

      {/* Regenerate button (AI messages only) */}
      {isAIMessage && (
        <button
          onClick={() => onRegenerate(chatId, messageId)}
          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Regenerate response"
          type="button"
        >
          <RefreshCw size={16} />
        </button>
      )}
    </div>
  );
};
