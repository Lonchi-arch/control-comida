import React, { useState } from 'react';
import { Availability } from '../types';
import { CloseIcon } from './Icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    availability: Availability;
    onSave: (newAvailability: Availability) => void;
}

const WEEK_DAYS = [
    { id: '1', name: 'Lunes' },
    { id: '2', name: 'Martes' },
    { id: '3', name: 'Miércoles' },
    { id: '4', name: 'Jueves' },
    { id: '5', name: 'Viernes' },
    { id: '6', name: 'Sábado' },
    { id: '0', name: 'Domingo' },
];

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, availability, onSave }) => {
    const [currentAvailability, setCurrentAvailability] = useState(availability);

    const handleDayToggle = (dayId: string) => {
        setCurrentAvailability(prev => ({
            ...prev,
            days: {
                ...prev.days,
                [dayId]: !prev.days[dayId],
            },
        }));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentAvailability(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSave = () => {
        onSave(currentAvailability);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Configurar Disponibilidad</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Días Laborales</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {WEEK_DAYS.map(day => (
                                <button
                                    key={day.id}
                                    onClick={() => handleDayToggle(day.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border-2 ${currentAvailability.days[day.id] 
                                        ? 'bg-primary-600 text-white border-primary-600' 
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:border-primary-500'}`}
                                >
                                    {day.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Horario Laboral</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <label htmlFor="startTime" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Inicio</label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={currentAvailability.startTime}
                                    onChange={handleTimeChange}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="endTime" className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Fin</label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={currentAvailability.endTime}
                                    onChange={handleTimeChange}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;