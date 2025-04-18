// Переименован из MessageInput.jsx в ChatInput.jsx
import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

export default function ChatInput({ value, onChange, onSend, disabled, isSending }) {
  const [message, setMessage] = useState(value || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 shadow-sm">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows="1"
          className="flex-1 px-4 py-3 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Введите сообщение..."
          style={{ minHeight: '56px', maxHeight: '200px' }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`px-4 py-2 mr-2 mb-2 rounded-md transition-colors ${
            disabled || !message.trim()
              ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30'
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
