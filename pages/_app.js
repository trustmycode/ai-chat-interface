// pages/_app.js
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import { useEffect } from 'react'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    // Проверяем предпочтения пользователя по теме при загрузке
    useEffect(() => {
        // Проверяем сохраненные настройки
        const savedSettings = localStorage.getItem('user_settings');
        let theme = 'light';
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            theme = settings.theme;
        }
        
        // Применяем тему в зависимости от настроек
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
        } else if (theme === 'system') {
            // Проверяем системные настройки
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, []);
    
    return (
        <SessionProvider session={session}>
            <Component {...pageProps} />
        </SessionProvider>
    )
}