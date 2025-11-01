import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { CloseIcon } from './Icons';

interface ClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (client: Client) => void;
    clientToEdit: Client | null;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, onSave, clientToEdit }) => {
    
    const getInitialState = () => ({
        name: '',
        phone: '',
        email: '',
        notes: '',
    });

    const [clientData, setClientData] = useState(getInitialState());

    useEffect(() => {
        if (isOpen) {
            if (clientToEdit) {
                setClientData({
                    name: clientToEdit.name || '',
                    phone: clientToEdit.phone || '',
                    email: clientToEdit.email || '',
                    notes: clientToEdit.notes || '',
                });
            } else {
                setClientData(getInitialState());
            }
        }
    }, [isOpen, clientToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientData.name.trim()) return;

        const finalClient: Client = {
            id: clientToEdit?.id || `client_${Date.now()}`,
            name: clientData.name.trim(),
            phone: clientData.phone?.trim() || undefined,
            email: clientData.email?.trim() || undefined,
            notes: clientData.notes?.trim() || undefined,
        };
        
        onSave(finalClient);
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {clientToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
                    </h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={clientData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={clientData.phone}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={clientData.email}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={clientData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ClientModal;