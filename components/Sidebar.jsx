// components/Sidebar.jsx
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import DeleteChatModal from './DeleteChatModal';

export default function Sidebar({ chats = [], currentChatId, onSelectChat, onNewChat, onDeleteChat, onOpenSettings }) {
    const { data: session } = useSession();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' });
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };
    
    const toggleSidebar = () => {
        setSidebarCollapsed(!isSidebarCollapsed);
    };
    
    const handleDeleteClick = (chatId, chatTitle) => {
        setChatToDelete({ id: chatId, title: chatTitle });
        setDeleteModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (chatToDelete && chatToDelete.id) {
            onDeleteChat(chatToDelete.id);
            setDeleteModalOpen(false);
            setChatToDelete(null);
        }
    };
    
    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setChatToDelete(null);
    };

    return (
        <>
            {/* Мобильный оверлей */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-30 md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Кнопка открытия сайдбара на мобильных устройствах */}
            <button
                className="fixed left-4 top-4 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 z-20 md:hidden"
                onClick={() => setIsMobileSidebarOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            
            {/* Кнопка скрытия/отображения сайдбара */}
            <button
                className={`hidden md:flex fixed top-4 p-1.5 rounded-full z-30 transition-all ${
                    isSidebarCollapsed 
                    ? 'left-4 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700' 
                    : 'left-56 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                }`}
                onClick={toggleSidebar}
                title={isSidebarCollapsed ? "Показать меню" : "Скрыть меню"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <div
                className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 transform ${
                    isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen ${
                    isSidebarCollapsed ? 'md:w-0 md:overflow-hidden' : 'md:w-60'
                }`}
            >
                <div className="flex flex-col h-full p-2">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1 px-1">AI Чат</h2>

                    <button
                        onClick={onNewChat}
                        className="flex items-center justify-center py-1.5 px-2 mb-1 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors duration-200 text-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Новый чат
                    </button>

                    <div className="overflow-y-auto flex-1 mt-1">
                        {chats.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 mt-4 px-2 text-sm">
                                Нет активных чатов.<br />
                                Создайте новый чат, чтобы начать общение с ИИ.
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`flex justify-between items-center mb-0.5 rounded-md ${
                                        currentChatId === chat.id
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                                    }`}
                                >
                                    <div 
                                        className="flex-1 cursor-pointer truncate py-2 px-2"
                                        onClick={() => {
                                            onSelectChat(chat.id);
                                            closeMobileSidebar();
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="truncate text-sm font-medium mr-1">{chat.title}</div>
                                            <span className="bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-[10px] text-gray-600 dark:text-gray-300 whitespace-nowrap">{chat.model.split('-')[0]}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(chat.id, chat.title);
                                        }}
                                        className="ml-1 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        title="Удалить чат"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onOpenSettings}
                            className="flex items-center w-full p-1.5 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Настройки
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full p-1.5 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                            </svg>
                            Выйти
                        </button>

                        <div className="flex items-center p-1.5 mt-1 text-gray-600 dark:text-gray-300">
                            <div className="h-5 w-5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-500 dark:text-indigo-300 flex items-center justify-center mr-2 text-xs">
                                {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
                            </div>
                            <div className="truncate text-sm">
                                {session?.user?.name || session?.user?.email || 'Пользователь'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Модальное окно подтверждения удаления */}
            <DeleteChatModal 
                isOpen={deleteModalOpen}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                chatTitle={chatToDelete?.title}
            />
        </>
    );
}

