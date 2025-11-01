import React, { useState, useEffect } from 'react';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import { MicrophoneIcon, CloseIcon, SparklesIcon } from './Icons';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddBooking: (request: string) => void;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onAddBooking, isLoading, error, clearError }) => {
    const [request, setRequest] = useState('');

    const handleSpeechEnd = (transcript: string) => {
        if (transcript) {
            setRequest(transcript);
        }
    };
    
    const { isListening, transcript, toggleListening, hasRecognitionSupport } = useSpeechRecognition(handleSpeechEnd);

    useEffect(() => {
        if (isListening) {
            setRequest(transcript);
        }
    }, [transcript, isListening]);
    
    useEffect(() => {
        if (!isOpen) {
            setRequest('');
            clearError();
        }
    }, [isOpen, clearError]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (request.trim()) {
            onAddBooking(request.trim());
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Agendar Nueva Cita</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Describe la cita que deseas agendar. Puedes escribir o usar tu voz.
                            <br />
                            <span className="font-semibold">Ej:</span> "Agendar a Juan Pérez para una consulta de 1 hora mañana por la tarde."
                        </p>
                        <div className="relative">
                            <textarea
                                value={request}
                                onChange={(e) => {
                                    setRequest(e.target.value);
                                    if(error) clearError();
                                }}
                                placeholder={isListening ? 'Escuchando...' : 'Escribe o usa el micrófono...'}
                                className="w-full h-32 p-4 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition resize-none"
                                rows={4}
                                disabled={isLoading}
                            />
                            {hasRecognitionSupport && (
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300'}`}
                                    aria-label={isListening ? 'Dejar de escuchar' : 'Empezar a escuchar'}
                                >
                                    <MicrophoneIcon className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
                    </div>
                    
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !request.trim()}
                            className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center transition-all transform hover:scale-105"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Agendando...
                                </>
                            ) : (
                                <>
                                 <SparklesIcon className="h-5 w-5 mr-2" />
                                 Agendar con IA
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;