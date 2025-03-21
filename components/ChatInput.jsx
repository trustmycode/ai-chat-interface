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
      <div className="flex items-end border-0 rounded-lg bg-transparent shadow-none">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows="1"
          className="flex-1 px-4 py-3 bg-transparent border-0 resize-none focus:ring-0 focus:outline-none text-gray-100 placeholder-gray-400"
          placeholder="Введите сообщение..."
          style={{ minHeight: '56px', maxHeight: '200px' }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`px-4 py-2 mr-2 mb-2 rounded-md transition-colors ${
            disabled || !message.trim()
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-blue-400 hover:bg-blue-900/30'
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
} 