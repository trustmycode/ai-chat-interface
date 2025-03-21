// components/ChatMessages.jsx
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessages({ messages = [], loading = false }) {
    const messageEndRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(0);
    
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    // Если сообщений нет, показываем приветственное сообщение
    if (messages.length === 0) {
        return (
            <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
                <div className="text-center space-y-6 max-w-2xl mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Добро пожаловать в AI Чат
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Начните разговор с искусственным интеллектом. Вы можете спросить о чем угодно!
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Простой вопрос</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                "Что такое квантовая физика?"
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Помощь с кодом</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                "Напиши функцию сортировки массива на JavaScript"
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Творческая задача</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                "Сочини стихотворение о природе"
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Перевод текста</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                                "Переведи на английский: Искусственный интеллект меняет мир"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[200px]">
            <div className="space-y-4">
                {messages.length === 0 && !loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block p-4 rounded-lg bg-gray-800 text-gray-200 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-sm font-medium">Начните новый разговор</p>
                        </div>
                        <p className="text-gray-300 text-sm">Введите сообщение ниже, чтобы начать общение с ИИ</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => (
                            <div key={message.id || index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-lg ${
                                    message.role === 'user' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-700 text-gray-100'
                                }`}>
                                    <ReactMarkdown 
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            pre: ({node, ...props}) => (
                                                <div className="overflow-auto my-2 bg-gray-800 p-2 rounded">
                                                    <pre {...props} />
                                                </div>
                                            ),
                                            code: ({node, inline, className, children, ...props}) => {
                                                if (inline) {
                                                    return <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-200" {...props}>{children}</code>
                                                }
                                                return (
                                                    <code className={`${className} block`} {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                                            li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                            a: ({node, ...props}) => <a className="text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-500 pl-3 my-2 text-gray-300" {...props} />,
                                            h1: ({node, ...props}) => <h1 className="text-xl font-bold my-2" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-md font-bold my-2" {...props} />,
                                            table: ({node, ...props}) => <div className="overflow-auto my-2"><table className="border-collapse" {...props} /></div>,
                                            th: ({node, ...props}) => <th className="border border-gray-600 px-2 py-1 bg-gray-800" {...props} />,
                                            td: ({node, ...props}) => <td className="border border-gray-600 px-2 py-1" {...props} />
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-lg bg-gray-700 text-gray-100">
                                    <div className="flex space-x-2 items-center">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <div ref={messageEndRef} />
        </div>
    );
}
