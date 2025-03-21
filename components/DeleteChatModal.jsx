export default function DeleteChatModal({ isOpen, onClose, onConfirm, chatTitle }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn modal-overlay">
            <div className="bg-gray-700 rounded-lg shadow-xl max-w-md w-full">
                <div className="p-4 border-b border-gray-600">
                    <h2 className="text-lg font-semibold text-gray-200">Подтверждение удаления</h2>
                </div>
                
                <div className="p-4">
                    <p className="text-gray-300">
                        Вы уверены, что хотите удалить чат <span className="font-medium text-white">{chatTitle || 'без названия'}</span>?
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Это действие нельзя будет отменить.
                    </p>
                </div>
                
                <div className="flex justify-end space-x-3 p-4 border-t border-gray-600">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
} 