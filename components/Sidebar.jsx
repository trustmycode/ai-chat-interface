// components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DeleteChatModal from './DeleteChatModal';
import { 
    TrashIcon, 
    ChevronLeftIcon, 
    PlusIcon
} from '@heroicons/react/24/outline';

export default function Sidebar({ 
    chats = [], 
    currentChatId, 
    onSelectChat, 
    onNewChat, 
    onDeleteChat, 
    onOpenSettings,
    onCollapse
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/login' });
    };
    
    const handleDeleteClick = (e, chatId, chatTitle) => {
        e.stopPropagation();
        setChatToDelete({ id: chatId, title: chatTitle });
        setDeleteModalOpen(true);
    };
    
    const confirmDelete = () => {
        if (chatToDelete && chatToDelete.id) {
            onDeleteChat && onDeleteChat(chatToDelete.id);
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
            <div className="fixed inset-y-0 left-0 sidebar-bg border-r border-gray-800 z-40 w-64 h-screen">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-3 border-b border-gray-800">
                        <div className="text-gray-200 font-medium">Чаты</div>
                        
                        <div className="flex space-x-2">
                            <button
                                onClick={onCollapse}
                                className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                                title="Скрыть список чатов"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            
                            <button
                                onClick={onNewChat}
                                className="p-2 rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600"
                                title="Новый чат"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 p-2">
                        {chats.length === 0 ? (
                            <div className="text-center text-gray-400 mt-4 px-2 text-sm">
                                Нет активных чатов.<br />
                                Создайте новый чат, чтобы начать общение с ИИ.
                            </div>
                        ) : (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    className={`flex justify-between items-center mb-0.5 rounded-md ${
                                        currentChatId === chat.id
                                            ? 'bg-gray-700 text-gray-200 font-medium'
                                            : 'hover:bg-gray-700/50 text-gray-300'
                                    }`}
                                >
                                    <div 
                                        className="flex-1 cursor-pointer truncate py-2 px-2"
                                        onClick={() => onSelectChat(chat.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="truncate text-sm font-medium mr-1">{chat.title}</div>
                                            <span className="bg-gray-600 px-1.5 py-0.5 rounded text-[10px] text-gray-300 whitespace-nowrap">{chat.model.split('-')[0]}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, chat.id, chat.title)}
                                        className="ml-1 p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700"
                                        title="Удалить чат"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="pt-2 border-t border-gray-700 px-2 pb-2">
                        <button
                            onClick={onOpenSettings}
                            className="flex items-center w-full p-2 text-gray-300 rounded-md hover:bg-gray-700 text-sm"
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

