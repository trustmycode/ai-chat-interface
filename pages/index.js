import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Sidebar from '../components/Sidebar'
import ChatMessages from '../components/ChatMessages'
import MessageInput from '../components/MessageInput'
import Header from '../components/Header'
import SettingsModal from '../components/SettingsModal'
import { useChatStore } from '../store/chatStore'
import DeleteChatModal from '../components/DeleteChatModal'

export default function Home() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [chatToDelete, setChatToDelete] = useState(null)

    const { 
        chats, 
        currentChatId, 
        messages, 
        isLoading, 
        fetchChats, 
        fetchMessages, 
        createChat, 
        sendMessage,
        selectedModel,
        setSelectedModel,
        deleteChat
    } = useChatStore()

    // Перенаправление на страницу входа, если пользователь не аутентифицирован
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    // Загрузка чатов при входе
    useEffect(() => {
        if (session) {
            fetchChats()
        }
    }, [session, fetchChats])

    // Обработчик для создания нового чата
    const handleNewChat = async () => {
        await createChat()
    }

    // Обработчик отправки сообщения
    const handleSendMessage = async (message) => {
        await sendMessage(message)
    }

    // Обработчик выбора чата
    const handleSelectChat = (chatId) => {
        fetchMessages(chatId)
    }

    // Обработчик удаления чата
    const handleDeleteChat = (chatId) => {
        const chat = chats.find(c => c.id === chatId)
        setChatToDelete({ id: chatId, title: chat?.title || 'Этот чат' })
        setDeleteModalOpen(true)
    }

    // Подтверждение удаления чата
    const confirmDeleteChat = () => {
        if (chatToDelete && chatToDelete.id) {
            deleteChat(chatToDelete.id)
            setDeleteModalOpen(false)
            setChatToDelete(null)
            
            // Перезагружаем чаты после удаления
            setTimeout(() => {
                fetchChats()
            }, 300)
        }
    }

    // Отмена удаления чата
    const cancelDeleteChat = () => {
        setDeleteModalOpen(false)
        setChatToDelete(null)
    }

    // Обработчик изменения модели
    const handleModelChange = (modelId) => {
        setSelectedModel(modelId)
    }

    // Обработчики для модального окна настроек
    const openSettings = () => {
        // Перезагружаем чаты при открытии настроек
        fetchChats()
        setIsSettingsOpen(true)
    }
    
    const closeSettings = () => {
        setIsSettingsOpen(false)
        // Перезагружаем чаты после закрытия настроек
        fetchChats()
    }

    // Показываем состояние загрузки или страницу входа
    if (status === 'loading' || status === 'unauthenticated') {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
                <div className="animate-pulse text-xl text-gray-800 dark:text-gray-200">Загрузка...</div>
            </div>
        )
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <Sidebar 
                chats={chats} 
                currentChatId={currentChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onOpenSettings={openSettings}
            />
            
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                <Header 
                    currentChatId={currentChatId}
                    selectedModel={selectedModel}
                    onModelChange={handleModelChange}
                />
                
                <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <ChatMessages 
                        messages={messages} 
                        isLoading={isLoading} 
                    />
                </div>
                
                <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
                    <MessageInput 
                        onSendMessage={handleSendMessage} 
                        isLoading={isLoading} 
                    />
                </div>
            </div>
            
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={closeSettings}
            />
            
            <DeleteChatModal
                isOpen={deleteModalOpen}
                onClose={cancelDeleteChat}
                onConfirm={confirmDeleteChat}
                chatTitle={chatToDelete?.title}
            />
        </div>
    )
}