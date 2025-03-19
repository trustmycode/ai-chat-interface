// pages/settings.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../layouts/MainLayout';

export default function SettingsPage() {
    const router = useRouter();

    const [settings, setSettings] = useState({
        theme: 'light',
        language: 'ru',
        fontSize: 'medium',
        autoSave: true,
        notificationsEnabled: true,
        defaultModel: 'ChatGPT-4',
        modelSettings: {
            temperature: 0.7,
            maxTokens: 4000,
        }
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        // В реальном приложении здесь будет загрузка настроек с сервера
        // Имитация задержки загрузки настроек
        const timer = setTimeout(() => {
            setSettings({
                theme: 'light',
                language: 'ru',
                fontSize: 'medium',
                autoSave: true,
                notificationsEnabled: true,
                defaultModel: 'ChatGPT-4',
                modelSettings: {
                    temperature: 0.7,
                    maxTokens: 4000,
                }
            });
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleModelSettingChange = (e) => {
        const { name, value, type } = e.target;
        const parsedValue = type === 'range' ? parseFloat(value) : parseInt(value);

        setSettings(prev => ({
            ...prev,
            modelSettings: {
                ...prev.modelSettings,
                [name]: parsedValue
            }
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // В реальном приложении здесь будет API-запрос для сохранения настроек
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Ошибка при сохранении настроек:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Настройки</h1>

                <form onSubmit={handleSave}>
                    <div className="space-y-8">
                        {/* Общие настройки */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Общие настройки</h2>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                                            Тема интерфейса
                                        </label>
                                        <select
                                            id="theme"
                                            name="theme"
                                            value={settings.theme}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="light">Светлая</option>
                                            <option value="dark">Тёмная</option>
                                            <option value="system">Системная</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                                            Язык интерфейса
                                        </label>
                                        <select
                                            id="language"
                                            name="language"
                                            value={settings.language}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="ru">Русский</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-1">
                                            Размер шрифта
                                        </label>
                                        <select
                                            id="fontSize"
                                            name="fontSize"
                                            value={settings.fontSize}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="small">Маленький</option>
                                            <option value="medium">Средний</option>
                                            <option value="large">Большой</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center h-full pt-5">
                                        <div className="flex items-center">
                                            <input
                                                id="autoSave"
                                                name="autoSave"
                                                type="checkbox"
                                                checked={settings.autoSave}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-700">
                                                Автосохранение чатов
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex items-center h-full">
                                        <div className="flex items-center">
                                            <input
                                                id="notificationsEnabled"
                                                name="notificationsEnabled"
                                                type="checkbox"
                                                checked={settings.notificationsEnabled}
                                                onChange={handleChange}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700">
                                                Включить уведомления
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Настройки AI моделей */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Настройки AI моделей</h2>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="defaultModel" className="block text-sm font-medium text-gray-700 mb-1">
                                            Модель по умолчанию
                                        </label>
                                        <select
                                            id="defaultModel"
                                            name="defaultModel"
                                            value={settings.defaultModel}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        >
                                            <option value="ChatGPT-4">ChatGPT-4</option>
                                            <option value="Claude-3.5">Claude-3.5</option>
                                            <option value="Gemini-Ultra">Gemini Ultra</option>
                                        </select>
                                    </div>

                                    <div> {/* Пустая ячейка для выравнивания сетки */} </div>

                                    <div>
                                        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
                                            Температура (креативность): {settings.modelSettings.temperature}
                                        </label>
                                        <input
                                            id="temperature"
                                            name="temperature"
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={settings.modelSettings.temperature}
                                            onChange={handleModelSettingChange}
                                            className="block w-full rounded-md focus:outline-none focus:ring-blue-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Точный</span>
                                            <span>Креативный</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 mb-1">
                                            Максимальная длина ответа: {settings.modelSettings.maxTokens} токенов
                                        </label>
                                        <input
                                            id="maxTokens"
                                            name="maxTokens"
                                            type="range"
                                            min="1000"
                                            max="8000"
                                            step="1000"
                                            value={settings.modelSettings.maxTokens}
                                            onChange={handleModelSettingChange}
                                            className="block w-full rounded-md focus:outline-none focus:ring-blue-500"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Короче</span>
                                            <span>Длиннее</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Управление аккаунтом */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Управление аккаунтом</h2>

                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700">Email</h3>
                                        <p className="text-sm text-gray-500">user@example.com</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Изменить
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700">Пароль</h3>
                                        <p className="text-sm text-gray-500">Последнее изменение: 2 месяца назад</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Изменить
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700">Удаление аккаунта</h3>
                                        <p className="text-sm text-gray-500">Удаление всех данных без возможности восстановления</p>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-sm font-medium text-red-600 hover:text-red-500"
                                    >
                                        Удалить аккаунт
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                                isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isSaving ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Сохранение...
                                </>
                            ) : 'Сохранить настройки'}
                        </button>
                    </div>

                    {saveSuccess && (
                        <div className="mt-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">
                                        Настройки успешно сохранены!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </MainLayout>
    );
}