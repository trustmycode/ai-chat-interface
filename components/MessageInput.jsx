// components/MessageInput.jsx
import {useState, useRef, useEffect} from 'react';

export default function MessageInput({onSendMessage, isLoading}) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [message]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim());
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
            <div className="border dark:border-gray-700 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                    className="w-full p-3 outline-none resize-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-200"
                    rows={3}
                    disabled={isLoading}
                />
                
                <div className="flex items-center justify-end px-3 py-2 border-t dark:border-gray-700">
                    <button
                        type="submit"
                        disabled={!message.trim() || isLoading}
                        className={`px-4 py-1.5 rounded-md text-white ${
                            !message.trim() || isLoading
                                ? 'bg-blue-300 dark:bg-blue-900/50 cursor-not-allowed'
                                : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                        } transition-colors duration-200`}
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Обработка...
                            </div>
                        ) : (
                            'Отправить'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
