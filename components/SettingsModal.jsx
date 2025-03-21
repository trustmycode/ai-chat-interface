import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useChatStore } from '../store/chatStore';

export default function SettingsModal({ isOpen, onClose }) {
    const { data: session } = useSession();
    const { fetchChats } = useChatStore();
    const [settings, setSettings] = useState({
        theme: 'light',
        language: 'russian',
        fontSize: 'medium',
        autoSave: true,
        notifications: true,
    });

    useEffect(() => {
        // Загружаем настройки из локального хранилища при открытии
        if (isOpen) {
            const savedSettings = localStorage.getItem('user_settings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
            
            // Обновляем список чатов
            fetchChats();
        }
    }, [isOpen, fetchChats]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setSettings({
            ...settings,
            [name]: newValue
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Сохраняем настройки в локальное хранилище
        localStorage.setItem('user_settings', JSON.stringify(settings));
        
        // Применяем настройки темы
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Настройки</h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="space-y-4">
                        {/* Тема */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Тема
                            </label>
                            <select
                                name="theme"
                                value={settings.theme}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                <option value="light">Светлая</option>
                                <option value="dark">Темная</option>
                                <option value="system">Системная</option>
                            </select>
                        </div>
                        
                        {/* Язык */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Язык интерфейса
                            </label>
                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                <option value="russian">Русский</option>
                                <option value="english">English</option>
                            </select>
                        </div>
                        
                        {/* Размер шрифта */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Размер шрифта
                            </label>
                            <select
                                name="fontSize"
                                value={settings.fontSize}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                            >
                                <option value="small">Маленький</option>
                                <option value="medium">Средний</option>
                                <option value="large">Большой</option>
                            </select>
                        </div>
                        
                        {/* Автосохранение чатов */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Автосохранение чатов
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="autoSave"
                                    checked={settings.autoSave}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        {/* Уведомления */}
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Уведомления
                            </label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="notifications"
                                    checked={settings.notifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        
                        {/* Информация о пользователе */}
                        <div className="mt-4 pt-3 border-t dark:border-gray-700">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Информация об аккаунте</h3>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                <p>Email: {session?.user?.email || 'Не указан'}</p>
                                <p>Имя: {session?.user?.name || 'Не указано'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-5 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 