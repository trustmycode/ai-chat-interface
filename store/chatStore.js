// store/chatStore.js (Zustand для управления состоянием)
import create from 'zustand';

export const useChatStore = create((set) => ({
    chats: [],
    currentChatId: null,
    messages: [],
    isLoading: false,

    setCurrentChat: (chatId) => set({currentChatId: chatId}),

    fetchChats: async () => {
        try {
            // В реальном приложении здесь будет API-запрос
            const chats = [
                {id: 1, title: 'Бизнес-аналитика Q1 2023', updatedAt: '2023-04-02'},
                {id: 2, title: 'Прогноз продаж на лето', updatedAt: '2023-04-01'},
                {id: 3, title: 'Анализ конкурентов', updatedAt: '2023-03-28'},
            ];
            set({chats});
        } catch (error) {
            console.error('Ошибка при загрузке чатов:', error);
        }
    },

    fetchMessages: async (chatId) => {
        try {
            set({isLoading: true});
            // В реальном приложении здесь будет API-запрос
            await new Promise(resolve => setTimeout(resolve, 500));

            const messages = [
                {
                    role: 'user',
                    content: 'Проведи анализ продаж нашей компании за последний квартал.',
                    timestamp: new Date('2023-04-02T12:45:00')
                },
                {
                    role: 'assistant',
                    content: 'Анализ продаж за Q1 2023...',
                    timestamp: new Date('2023-04-02T12:46:00')
                }
            ];

            set({messages, currentChatId: chatId});
        } catch (error) {
            console.error('Ошибка при загрузке сообщений:', error);
        } finally {
            set({isLoading: false});
        }
    },

    sendMessage: async (content) => {
        const {currentChatId, messages} = useChatStore.getState();

        if (!currentChatId || !content.trim()) return;

        const newUserMessage = {
            role: 'user',
            content,
            timestamp: new Date()
        };

        set({
            messages: [...messages, newUserMessage],
            isLoading: true
        });

        try {
            // В реальном приложении здесь будет API-запрос
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse = {
                role: 'assistant',
                content: 'Ответ на ваше сообщение: ' + content,
                timestamp: new Date()
            };

            set((state) => ({
                messages: [...state.messages, aiResponse]
            }));
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
        } finally {
            set({isLoading: false});
        }
    },

    createChat: async () => {
        try {
            // В реальном приложении здесь будет API-запрос
            const newChatId = Date.now(); // В реальности получаем с сервера
            const newChat = {
                id: newChatId,
                title: 'Новый чат',
                updatedAt: new Date().toISOString()
            };

            set((state) => ({
                chats: [newChat, ...state.chats],
                currentChatId: newChatId,
                messages: []
            }));

            return newChatId;
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
        }
    }
}));
