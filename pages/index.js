import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import ChatMessages from '../components/ChatMessages'
import SettingsModal from '../components/SettingsModal'
import { useChatStore } from '../store/chatStore'
import DeleteChatModal from '../components/DeleteChatModal'
import Head from 'next/head'
import MainLayout from '../layouts/MainLayout'
import ChatInput from '../components/ChatInput'

export default function Home() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [chatToDelete, setChatToDelete] = useState(null)
    const [isSending, setIsSending] = useState(false)
    const [inputValue, setInputValue] = useState('')

    const { 
        chats, 
        currentChatId, 
        messages, 
        isLoading, 
        error,
        fetchChats, 
        fetchMessages, 
        createChat, 
        sendMessage,
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
        if (!message.trim() || isSending) return
        
        try {
            setIsSending(true)
            setInputValue('')
            
            if (!currentChatId) {
                await createChat("Новый чат")
            }
            
            await sendMessage(message)
        } catch (error) {
            console.error("Ошибка при отправке сообщения:", error)
        } finally {
            setIsSending(false)
        }
    }

    // Обработчик выбора чата
    const handleSelectChat = (chatId) => {
        fetchMessages(chatId)
    }

    // Обработчик удаления чата
    const handleDeleteChat = async (chatId) => {
        setChatToDelete({ id: chatId });
        setDeleteModalOpen(true);
    }

    // Обработчик подтверждения удаления чата
    const confirmDeleteChat = async () => {
        if (chatToDelete && chatToDelete.id) {
            try {
                await deleteChat(chatToDelete.id);
                
                // Если удален текущий чат, ничего дополнительно делать не нужно
                // Хранилище useChatStore в функции deleteChat уже все обработает
                
                setDeleteModalOpen(false);
                setChatToDelete(null);
            } catch (error) {
                console.error("Ошибка при удалении чата:", error);
            }
        }
    }

    // Обработчик отмены удаления чата
    const cancelDeleteChat = () => {
        setDeleteModalOpen(false);
        setChatToDelete(null);
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
            <div className="flex h-screen items-center justify-center content-bg">
                <div className="animate-pulse text-xl text-gray-200">Загрузка...</div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Чат с ИИ</title>
                <meta name="description" content="Чат-интерфейс с искусственным интеллектом" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <MainLayout
                chats={chats}
                currentChatId={currentChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                onOpenSettings={openSettings}
            >
                <div className="relative flex flex-col h-full">
                    {error && (
                        <div role="alert" className="mx-4 mt-4 rounded-md border border-red-700 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                            {error}
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto p-4">
                        <ChatMessages messages={messages} loading={isLoading || isSending} />
                    </div>
                    
                    <div className="p-4 border-t border-gray-700">
                        <div className="input-bg rounded-lg">
                            <ChatInput 
                                value={inputValue}
                                onChange={setInputValue}
                                onSend={handleSendMessage}
                                disabled={isSending || isLoading}
                                isSending={isSending}
                            />
                        </div>
                    </div>
                </div>
            </MainLayout>
            
            <SettingsModal 
                isOpen={isSettingsOpen}
                onClose={closeSettings}
            />
            
            <DeleteChatModal
                isOpen={deleteModalOpen}
                onClose={cancelDeleteChat}
                onConfirm={confirmDeleteChat}
                chatTitle={chatToDelete?.title || "этот чат"}
            />
        </>
    )
}
