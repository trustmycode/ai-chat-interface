// components/Header.jsx
import { useState, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';

export default function Header({ currentChatId, selectedModel, onModelChange }) {
    const [chatTitle, setChatTitle] = useState('Новый чат');
    const { chats } = useChatStore();
    
    // Находим заголовок текущего чата
    useEffect(() => {
        if (currentChatId && chats.length > 0) {
            const currentChat = chats.find(chat => chat.id === currentChatId);
            if (currentChat) {
                setChatTitle(currentChat.title);
            }
        } else {
            setChatTitle('Новый чат');
        }
    }, [currentChatId, chats]);
    
    return (
        <div className="flex items-center justify-between p-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 pl-5 md:pl-8">
            <h1 className="text-lg font-semibold truncate ml-2">{chatTitle}</h1>
            
            <div className="flex items-center ml-auto">
                <div className="mr-2 text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Модель:</div>
                <select 
                    value={selectedModel}
                    onChange={(e) => onModelChange(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                >
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o mini</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                    <option value="claude-3-opus-20240229">Claude 3 Opus</option>
                </select>
            </div>
        </div>
    );
}
