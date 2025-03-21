// layouts/MainLayout.jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function MainLayout({ 
    children, 
    chats = [], 
    currentChatId, 
    onSelectChat, 
    onNewChat, 
    onDeleteChat,
}) {
    const { data: session, status } = useSession();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    
    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <>
            <Head>
                <title>AI Бизнес-ассистент</title>
                <meta name="description" content="Бизнес-ассистент на базе искусственного интеллекта" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-screen overflow-hidden bg-gray-800 text-gray-200">
                {/* Кнопка разворачивания сайдбара (видна только когда сайдбар свернут) */}
                {sidebarCollapsed && (
                    <button 
                        onClick={toggleSidebar}
                        className="fixed top-4 left-4 z-50 p-2 bg-gray-700 rounded-md text-gray-200 hover:bg-gray-600"
                        title="Показать список чатов"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                )}

                {/* Сайдбар */}
                <div className={`h-full transition-all duration-300 ${sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-64'}`}>
                    <Sidebar
                        chats={chats}
                        currentChatId={currentChatId}
                        onSelectChat={onSelectChat}
                        onNewChat={onNewChat}
                        onDeleteChat={onDeleteChat}
                        onCollapse={toggleSidebar}
                        isCollapsed={sidebarCollapsed}
                    />
                </div>
                
                {/* Основной контент */}
                <div className="flex flex-col flex-1 h-full overflow-hidden content-bg">
                    <Header currentChatId={currentChatId} />
                    <div className="flex-1 overflow-y-auto content-bg">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
