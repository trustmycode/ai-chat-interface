// components/Header.jsx
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header({ currentChatId, onOpenSettings }) {
  const { data: session } = useSession();
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="bg-gray-700 border-b border-gray-800 px-4 py-3 flex justify-between items-center">
      <div className="flex-1 text-gray-200 font-medium">
        {currentChatId ? 'Текущий чат' : 'Новый чат'}
      </div>
      
      <div className="flex items-center space-x-3">
        {session && (
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="h-6 w-6 rounded-full bg-indigo-800 text-indigo-300 flex items-center justify-center mr-2 text-xs">
                {session.user.name?.[0] || session.user.email?.[0] || 'У'}
              </div>
              <span className="text-sm text-gray-300">
                {session.user.name || session.user.email}
              </span>
            </div>
            
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-md text-gray-300 hover:bg-gray-600"
              aria-label="Настройки"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleSignOut}
              className="p-2 text-red-400 rounded-md hover:bg-red-900/20"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
