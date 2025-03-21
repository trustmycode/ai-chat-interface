// components/Header.jsx
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Header({ currentChatId }) {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-700 border-b border-gray-800 px-4 py-3 flex justify-between items-center">
      <div className="flex-1"></div>
      
      <div className="flex items-center space-x-2">
        <Link href="/settings">
          <button
            className="p-2 rounded-full text-gray-300 hover:bg-gray-600"
            aria-label="Настройки"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </Link>
        
        {session && (
          <div className="flex items-center ml-2">
            <span className="text-sm text-gray-300 mr-3">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="px-3 py-1.5 text-sm bg-red-900/30 text-red-400 rounded hover:bg-red-800/40 transition-colors"
            >
              Выход
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
