// store/chatStore.js (Zustand для управления состоянием)
import { create } from 'zustand';
import axios from 'axios';

export const useChatStore = create((set, get) => ({
    chats: [],
    currentChatId: null,
    messages: [],
    isLoading: false,
    selectedModel: 'gpt-4o', // Модель по умолчанию
    availableModels: [
        { id: 'gpt-4o', name: 'ChatGPT 4o', provider: 'openai' },
        { id: 'gpt-4o-mini', name: 'ChatGPT 4o mini', provider: 'openai' },
        { id: 'gpt-3.5-turbo', name: 'ChatGPT 3.5 Turbo', provider: 'openai' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3.5 Haiku', provider: 'anthropic' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3.7 Sonnet', provider: 'anthropic' }
    ],

    setCurrentChat: (chatId) => set({ currentChatId: chatId }),
    
    setSelectedModel: (modelId) => set({ selectedModel: modelId }),

    fetchChats: async () => {
        try {
            // В реальном приложении здесь будет API-запрос к серверу
            const response = await axios.get('/api/chat');
            set({ chats: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке чатов:', error);
            // Для демонстрации используем фиктивные данные при ошибке
            const fallbackChats = [
                { id: '1', title: 'Чат с GPT-4o', model: 'gpt-4o', updatedAt: new Date().toISOString() },
                { id: '2', title: 'Чат с Claude 3.5', model: 'claude-3-sonnet-20240229', updatedAt: new Date().toISOString() }
            ];
            set({ chats: fallbackChats });
        }
    },

    fetchMessages: async (chatId) => {
        if (!chatId) return;
        
        try {
            set({ isLoading: true });
            // В реальном приложении здесь будет API-запрос
            const response = await axios.get(`/api/chat/${chatId}`);
            set({ 
                messages: response.data.messages,
                selectedModel: response.data.model,
                currentChatId: chatId 
            });
        } catch (error) {
            console.error('Ошибка при загрузке сообщений:', error);
            // Фиктивные данные для демонстрации
            set({ 
                messages: [],
                currentChatId: chatId 
            });
        } finally {
            set({ isLoading: false });
        }
    },

    sendMessage: async (content) => {
        const { currentChatId, messages, selectedModel } = get();

        if (!content.trim()) return;

        const newUserMessage = {
            role: 'user',
            content,
            timestamp: new Date().toISOString()
        };

        set({
            messages: [...messages, newUserMessage],
            isLoading: true
        });

        try {
            // Отправляем запрос к API
            const response = await axios.post('/api/chat/message', {
                chatId: currentChatId,
                message: content,
                model: selectedModel
            });

            // Добавляем ответ от ИИ
            set((state) => ({
                messages: [...state.messages, {
                    role: 'assistant',
                    content: response.data.response,
                    timestamp: new Date().toISOString()
                }]
            }));

            // Обновляем список чатов, если это новый чат
            if (!currentChatId) {
                set({ currentChatId: response.data.chatId });
                get().fetchChats(); // Обновляем список чатов
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            // Показываем ошибку пользователю
            set((state) => ({
                messages: [...state.messages, {
                    role: 'assistant',
                    content: 'Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.',
                    timestamp: new Date().toISOString(),
                    isError: true
                }]
            }));
        } finally {
            set({ isLoading: false });
        }
    },

    createChat: async (title = 'Новый чат') => {
        try {
            const { selectedModel } = get();
            // В реальном приложении здесь будет API-запрос
            const response = await axios.post('/api/chat', {
                title,
                model: selectedModel
            });

            const newChat = response.data;

            set((state) => ({
                chats: [newChat, ...state.chats],
                currentChatId: newChat.id,
                messages: []
            }));

            return newChat.id;
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
            // Для демонстрации создаем локальный чат при ошибке
            const newChatId = Date.now().toString();
            const newChat = {
                id: newChatId,
                title: title,
                model: get().selectedModel,
                updatedAt: new Date().toISOString()
            };

            set((state) => ({
                chats: [newChat, ...state.chats],
                currentChatId: newChatId,
                messages: []
            }));

            return newChatId;
        }
    },

    deleteChat: async (chatId) => {
        if (!chatId) return;
        
        try {
            // Удаляем из локального состояния сразу для более быстрого UI
            set((state) => ({
                chats: state.chats.filter(chat => chat.id !== chatId),
                // Если удаляемый чат был текущим, сбрасываем текущий чат
                currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
                // Если удаляемый чат был текущим, очищаем сообщения
                messages: state.currentChatId === chatId ? [] : state.messages
            }));
            
            // Затем делаем API-запрос
            await axios.delete(`/api/chat/${chatId}`);
            
            // Если у нас не осталось выбранного чата, но есть другие чаты,
            // выбираем первый из списка
            const { chats, currentChatId } = get();
            if (!currentChatId && chats.length > 0) {
                get().fetchMessages(chats[0].id);
            }
        } catch (error) {
            console.error('Ошибка при удалении чата:', error);
            // В случае ошибки обновляем список чатов с сервера
            get().fetchChats();
        }
    }
}));
