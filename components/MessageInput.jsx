// components/MessageInput.jsx
import {useState, useRef, useEffect} from 'react';

export default function MessageInput({onSendMessage, isLoading}) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
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
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:px-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className="relative">
          <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите сообщение..."
              className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg pr-12 py-3 resize-none max-h-32 shadow-sm"
              rows={1}
              disabled={isLoading}
          />
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className={`absolute right-2 bottom-2 p-2 rounded-full ${
                            !message.trim() || isLoading
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                        } transition-colors duration-200`}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        )}
                    </button>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                    Нажмите Enter для отправки, Shift+Enter для переноса строки
                </div>
            </form>
        </div>
    );
}
