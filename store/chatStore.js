// store/chatStore.js (Zustand для управления состоянием)
import { create } from 'zustand';
import axios from 'axios';

export const useChatStore = create((set, get) => ({
    chats: [],
    currentChatId: null,
    messages: [],
    isLoading: false,
    error: null,
    selectedModel: 'gpt-4o-mini',
    availableModels: [
        { id: 'gpt-4o', name: 'ChatGPT 4o', provider: 'OpenAI' },
        { id: 'gpt-4o-mini', name: 'ChatGPT 4o mini', provider: 'OpenAI' },
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'Anthropic' }
    ],

    setCurrentChat: (chatId) => set({ currentChatId: chatId }),
    
    setSelectedModel: (modelId) => set({ selectedModel: modelId }),

    fetchChats: async () => {
        try {
            set({ error: null });
            const response = await axios.get('/api/chat');
            set({ chats: response.data });
        } catch (error) {
            console.error('Ошибка при загрузке чатов:', error);
            set({ chats: [], error: 'Не удалось загрузить список чатов.' });
        }
    },

    fetchMessages: async (chatId) => {
        if (!chatId) return;
        
        try {
            set({ isLoading: true });
            set({ error: null });
            const response = await axios.get(`/api/chat/${chatId}`);
            set({ 
                messages: response.data.messages,
                selectedModel: response.data.model,
                currentChatId: chatId 
            });
        } catch (error) {
            console.error('Ошибка при загрузке сообщений:', error);
            set({ 
                messages: [],
                error: 'Не удалось загрузить сообщения.'
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
            set({ error: null });
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
            set({ error: null });
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
            set({ error: 'Не удалось создать чат.' });
            return null;
        }
    },

    deleteChat: async (chatId) => {
        if (!chatId) return;

        try {
            set({ error: null });
            await axios.delete(`/api/chat/${chatId}`);
            
            // Получаем текущее состояние
            const state = get();
            const updatedChats = state.chats.filter(chat => chat.id !== chatId);
            
            // Обновляем состояние
            set({
                chats: updatedChats,
                // Если удаляем текущий чат
                ...(state.currentChatId === chatId 
                    ? { 
                        currentChatId: updatedChats.length > 0 ? updatedChats[0].id : null,
                        messages: updatedChats.length > 0 ? [] : []
                      } 
                    : {})
            });
            
            // Если был удален текущий чат и есть другие чаты, загружаем сообщения нового текущего чата
            const { currentChatId } = get();
            if (currentChatId && state.currentChatId === chatId) {
                get().fetchMessages(currentChatId);
            }
            
        } catch (error) {
            console.error('Ошибка при удалении чата:', error);
            set({ error: 'Не удалось удалить чат.' });
        }
    }
}));
