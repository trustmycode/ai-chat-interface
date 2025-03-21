// components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import DeleteChatModal from './DeleteChatModal';
import { 
    TrashIcon, 
    ChevronLeftIcon, 
    PlusIcon,
    Cog6ToothIcon, 
    ArrowRightOnRectangleIcon
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
            <div className="fixed inset-y-0 left-0 sidebar-bg border-r border-gray-800 z-40 w-60 h-screen">
                <div className="flex flex-col h-full p-2">
                    <div className="flex items-center justify-between p-4 border-b border-gray-800">
                        <button
                            onClick={onCollapse}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                            title="Скрыть список чатов"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onNewChat}
                            className="p-1.5 rounded-md text-gray-200 bg-gray-700 hover:bg-gray-600"
                            title="Новый чат"
                        >
                            <PlusIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 mt-1">
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

                    <div className="mt-auto pt-2 border-t border-gray-700">
                        <button
                            onClick={onOpenSettings}
                            className="flex items-center w-full p-1.5 text-gray-300 rounded-lg hover:bg-gray-700 text-sm"
                        >
                            <Cog6ToothIcon className="h-4 w-4 mr-2" />
                            Настройки
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full p-1.5 text-red-400 rounded-lg hover:bg-red-900/20 text-sm"
                        >
                            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                            Выйти
                        </button>

                        <div className="flex items-center p-1.5 mt-1 text-gray-300">
                            <div className="h-5 w-5 rounded-full bg-indigo-800 text-indigo-300 flex items-center justify-center mr-2 text-xs">
                                {session?.user?.name?.[0] || session?.user?.email?.[0] || 'У'}
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

