import React from 'react';
import { HomeIcon, SparklesIcon } from './Icons';

interface HeaderProps {
    currentView: 'dashboard' | 'calendar';
    onNavigateToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigateToDashboard }) => {
    return (
        <header className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg sticky top-0 z-40 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-4">
                 {currentView !== 'dashboard' && (
                    <button 
                        onClick={onNavigateToDashboard}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                        aria-label="Volver al inicio"
                    >
                        <HomeIcon className="h-6 w-6" />
                    </button>
                )}
                <div className="flex items-center space-x-2">
                    <SparklesIcon className="h-7 w-7 text-primary-500" />
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Asistente de Citas
                    </h1>
                </div>
            </div>
        </header>
    );
};

export default Header;