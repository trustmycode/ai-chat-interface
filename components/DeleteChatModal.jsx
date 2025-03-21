export default function DeleteChatModal({ isOpen, onClose, onConfirm, chatTitle }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadein modal-overlay">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Подтверждение удаления</h2>
                </div>
                
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        Вы уверены, что хотите удалить чат <span className="font-medium">{chatTitle || 'без названия'}</span>?
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Это действие нельзя будет отменить.
                    </p>
                </div>
                
                <div className="flex justify-end space-x-3 p-4 border-t dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 focus:outline-none"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
} 