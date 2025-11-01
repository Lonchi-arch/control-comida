import React from 'react';
import { SparklesIcon, CalendarDaysIcon, UsersGroupIcon, SettingsIcon } from './Icons';

interface DashboardProps {
    onNavigateToCalendar: () => void;
    onOpenBookingModal: () => void;
    onOpenClientsModal: () => void;
    onOpenSettingsModal: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    onNavigateToCalendar, 
    onOpenBookingModal, 
    onOpenClientsModal,
    onOpenSettingsModal
}) => {
    
    const navItems = [
        {
            title: "Agendar Cita con IA",
            description: "Usa tu voz o texto para crear una reserva nueva.",
            icon: <SparklesIcon className="h-10 w-10 text-white" />,
            action: onOpenBookingModal,
            bgColor: "from-primary-500 to-violet-500"
        },
        {
            title: "Ver Agenda",
            description: "Consulta tus citas en el calendario.",
            icon: <CalendarDaysIcon className="h-10 w-10 text-white" />,
            action: onNavigateToCalendar,
            bgColor: "from-green-500 to-teal-500"
        },
        {
            title: "Gestionar Clientes",
            description: "Añade, edita y consulta tu lista de clientes.",
            icon: <UsersGroupIcon className="h-10 w-10 text-white" />,
            action: onOpenClientsModal,
            bgColor: "from-sky-500 to-cyan-500"
        },
        {
            title: "Ajustes",
            description: "Configura tus días y horas de trabajo.",
            icon: <SettingsIcon className="h-10 w-10 text-white" />,
            action: onOpenSettingsModal,
            bgColor: "from-amber-500 to-orange-500"
        }
    ];

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white tracking-tight">
                    Bienvenido a tu Asistente de Citas
                </h1>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Gestiona tu tiempo y tus clientes de forma inteligente. ¿Qué te gustaría hacer hoy?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {navItems.map((item, index) => (
                    <button
                        key={item.title}
                        onClick={item.action}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`group relative p-8 rounded-2xl bg-gradient-to-br ${item.bgColor} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fade-in-up`}
                    >
                        <div className="absolute -top-5 -right-5 bg-white/20 rounded-full h-24 w-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex flex-col items-start h-full">
                            <div className="p-4 bg-white/30 rounded-xl mb-4">
                                {item.icon}
                            </div>
                            <h2 className="text-xl font-bold text-left">{item.title}</h2>
                            <p className="mt-2 text-sm text-left text-white/80 flex-grow">{item.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;