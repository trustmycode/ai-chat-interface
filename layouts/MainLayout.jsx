// layouts/MainLayout.jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function MainLayout({ 
    children, 
    chats = [], 
    currentChatId, 
    onSelectChat, 
    onNewChat, 
    onDeleteChat,
}) {
    const { data: session, status } = useSession();

    return (
        <>
            <Head>
                <title>AI Бизнес-ассистент</title>
                <meta name="description" content="Бизнес-ассистент на базе искусственного интеллекта" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-screen overflow-hidden">
                <div className="w-64 h-full flex-shrink-0">
                    <Sidebar
                        chats={chats}
                        currentChatId={currentChatId}
                        onSelectChat={onSelectChat}
                        onNewChat={onNewChat}
                        onDeleteChat={onDeleteChat}
                    />
                </div>
                
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
