import React from 'react';
import { Booking } from '../types';
import { CloseIcon } from './Icons';

interface NextAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    booking: Booking;
}

const NextAppointmentModal: React.FC<NextAppointmentModalProps> = ({ isOpen, onClose, onConfirm, booking }) => {
    if (!isOpen) return null;
    
    const { title, start } = booking;

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('es-ES', {
            dateStyle: 'full',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirmar Nueva Cita</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-md text-gray-600 dark:text-gray-300 mb-4">
                       La IA ha encontrado el siguiente hueco disponible. ¿Desea confirmar la reserva?
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="font-bold text-lg text-primary-600 dark:text-primary-400">{booking.client?.name}</p>
                        <p className="text-md text-gray-800 dark:text-gray-200 mt-1">
                           <strong>Servicio:</strong> {title}
                        </p>
                        <p className="text-md text-gray-800 dark:text-gray-200 mt-2">
                           <strong>Fecha:</strong> {formatDate(start)}
                        </p>
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
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NextAppointmentModal;