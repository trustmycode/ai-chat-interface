// pages/chat/[id].js
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import MainLayout from '../../layouts/MainLayout';
import ChatMessages from '../../components/ChatMessages';
import MessageInput from '../../components/MessageInput';

export default function ChatPage() {
    const router = useRouter();
    const {id} = router.query;

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            // В реальном приложении здесь будет загрузка сообщений с сервера
            setMessages([
                {
                    role: 'user',
                    content: 'Проведи анализ продаж нашей компании за последний квартал и дай рекомендации по улучшению.',
                    timestamp: new Date('2023-04-02T12:45:00')
                },
                {
                    role: 'assistant',
                    content: 'Анализ продаж за Q1 2023:\n\nНаблюдается рост продаж на 15% по сравнению с предыдущим кварталом. Основной прирост пришёлся на категорию "Электроника" (+28%).\n\nРекомендации:\n1. Увеличить маркетинговый бюджет для категории "Электроника"\n2. Рассмотреть расширение ассортимента в данном сегменте',
                    timestamp: new Date('2023-04-02T12:46:00')
                }
            ]);
        }
    }, [id]);

    const sendMessage = async (content) => {
        if (!content.trim()) return;

        const newUserMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            // В реальном приложении здесь будет отправка сообщения на сервер
            // и получение ответа от AI через WebSockets

            // Имитация задержки ответа от сервера
            await new Promise(resolve => setTimeout(resolve, 2000));

            const aiResponse = {
                role: 'assistant',
                content: 'Я получил ваше сообщение: "' + content + '".\n\nЭто имитация ответа от ИИ. В реальном приложении здесь будет ответ от выбранной модели искусственного интеллекта.',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            // Добавить обработку ошибок
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex flex-col h-full">
                <ChatMessages messages={messages}/>
                <MessageInput onSendMessage={sendMessage} isLoading={isLoading}/>
            </div>
        </MainLayout>
    );
}
