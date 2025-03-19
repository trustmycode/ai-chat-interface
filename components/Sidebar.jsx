// components/Sidebar.jsx
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import Link from 'next/link';

export default function Sidebar({isOpen, onClose}) {
    const router = useRouter();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        // Здесь в реальном приложении будет загрузка истории чатов с сервера
        setChats([
            {id: 1, title: 'Бизнес-аналитика Q1 2023', updatedAt: '2023-04-02'},
            {id: 2, title: 'Прогноз продаж на лето', updatedAt: '2023-04-01'},
            {id: 3, title: 'Анализ конкурентов', updatedAt: '2023-03-28'},
        ]);
    }, []);

    const createNewChat = async () => {
        try {
            // В реальном приложении здесь будет API-запрос на создание нового чата
            const newChatId = 4; // В реальности получаем с сервера
            router.push(`/chat/${newChatId}`);
            onClose();
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
        }
    };

    return (
        <div
            className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 w-72 z-20 transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen`}
        >
            <div className="flex flex-col h-full p-4">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">История чатов</h2>

                <button
                    onClick={createNewChat}
                    className="flex items-center justify-center py-3 px-4 mb-4 text-blue-600 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20"
                         fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                              clipRule="evenodd"/>
                    </svg>
                    Новый чат
                </button>

                <div className="overflow-y-auto flex-1">
                    {chats.map((chat) => (
                        <Link
                            href={`/chat/${chat.id}`}
                            key={chat.id}
                            className={`block mb-2 p-3 rounded-lg ${
                                router.query.id === String(chat.id)
                                    ? 'bg-gray-100 text-gray-700 font-medium'
                                    : 'hover:bg-gray-50 text-gray-600'
                            }`}
                            onClick={onClose}
                        >
                            <div className="truncate">{chat.title}</div>
                            <div
                                className="text-xs text-gray-400 mt-1">{new Date(chat.updatedAt).toLocaleDateString()}</div>
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200">
                    <Link
                        href="/settings"
                        className="flex items-center p-3 text-gray-600 rounded-lg hover:bg-gray-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        Настройки
                    </Link>

                    <div className="flex items-center p-3 mt-2 text-gray-600">
                        <img
                            src="/avatar-placeholder.png"
                            alt="Аватар пользователя"
                            className="h-8 w-8 rounded-full mr-3"
                        />
                        <div className="truncate">user@example.com</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
