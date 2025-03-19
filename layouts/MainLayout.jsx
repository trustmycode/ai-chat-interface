// layouts/MainLayout.jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    }, [isMobile]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <Head>
                <title>AI Бизнес-ассистент</title>
                <meta name="description" content="Бизнес-ассистент на базе искусственного интеллекта" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex h-screen bg-gray-50">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => isMobile && setSidebarOpen(false)}
                />

                <div className="flex flex-col flex-1 h-screen overflow-hidden">
                    <Header
                        onMenuClick={toggleSidebar}
                        showMenuButton={isMobile}
                    />

                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
