import React from 'react';
import { Client } from '../types';
import { CloseIcon, PlusIcon } from './Icons';

interface ClientsListModalProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    onSelectClient: (client: Client) => void;
    onAddClient: () => void;
}

const ClientsListModal: React.FC<ClientsListModalProps> = ({ isOpen, onClose, clients, onSelectClient, onAddClient }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Clientes</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={onAddClient} className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900 transition-colors">
                            <PlusIcon className="h-6 w-6" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {clients.length > 0 ? (
                        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                            {clients.map(client => (
                                <li 
                                    key={client.id} 
                                    onClick={() => onSelectClient(client)}
                                    className="py-3 px-2 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
                                >
                                    <div>
                                        <p className="text-md font-medium text-gray-900 dark:text-white">{client.name}</p>
                                        {client.phone && <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay clientes guardados.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientsListModal;