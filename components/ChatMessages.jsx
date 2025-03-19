// components/ChatMessages.jsx
import {useRef, useEffect} from 'react';

export default function ChatMessages({messages}) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!messages || messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">Начните новый разговор</h3>
                <p className="text-gray-500 max-w-md">
                    Задайте вопрос, запросите аналитику или получите помощь в решении бизнес-задач
                </p>
            </div>
        );
    }

    return (
        <div className="py-6 px-4 md:px-8 flex-1 overflow-y-auto">
            {messages.map((message, index) => (
                <div key={index} className={`mb-6 ${message.role === 'user' ? 'ml-auto' : 'mr-auto'} max-w-3xl`}>
                    <div
                        className={`p-4 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-50 border border-blue-200 text-blue-900'
                                : 'bg-gray-50 border border-gray-200 text-gray-800'
                        }`}
                    >
                        {message.role === 'assistant' && (
                            <div className="flex items-center mb-2">
                                <div
                                    className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-2">
                                    AI
                                </div>
                                <span className="font-medium text-gray-700">Ассистент</span>
                            </div>
                        )}
                        <div className="prose max-w-none">
                            {message.content.split('\n').map((part, i) => (
                                <p key={i} className={`${i > 0 ? 'mt-2' : ''}`}>
                                    {part}
                                </p>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 mt-2 text-right">
                            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef}/>
        </div>
    );
}
