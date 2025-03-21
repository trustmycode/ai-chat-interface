// components/ChatMessages.jsx
import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessages({ messages = [], isLoading }) {
    const messagesEndRef = useRef(null);

    // Автоматическая прокрутка вниз при добавлении сообщений
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Форматирование даты сообщения
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Если нет сообщений, показываем приветственное сообщение
    if (messages.length === 0) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Начните новую беседу с искусственным интеллектом
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Задайте вопрос или начните разговор, и ИИ поможет вам в решении задач
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Примеры запросов:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                                <li>Напиши короткое стихотворение о звездах</li>
                                <li>Как приготовить борщ?</li>
                                <li>Что такое квантовая механика?</li>
                            </ul>
                        </div>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Возможности:</p>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                                <li>Отвечает на вопросы</li>
                                <li>Помогает с текстами</li>
                                <li>Объясняет сложные темы</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 ${
                            message.role === 'user'
                                ? 'bg-blue-500 dark:bg-blue-600 text-white rounded-tr-none'
                                : message.isError
                                ? 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-tl-none border border-red-100 dark:border-red-900/50'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
                        }`}
                    >
                        <div className="flex items-start">
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0 mr-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 01-.659 1.591L9.5 14.5m3.25-11.396c.386.198.824.307 1.25.307M12 3.75h.006a2.25 2.25 0 012.244 2.077L14.5 14.5m-6-11.25C7.635 2.806 7.25 2.55 7 2.25c-.25.3-.635.556-1.5 1"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    {formatMessageTime(message.timestamp)}
                                </div>
                            </div>
                            {message.role === 'user' && (
                                <div className="flex-shrink-0 ml-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex justify-start">
                    <div className="max-w-[75%] bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-3 text-gray-800 dark:text-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-pulse delay-150"></div>
                        </div>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
