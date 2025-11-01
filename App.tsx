import React, { useState } from 'react';
import Header from './components/Header';
import CalendarView from './components/CalendarView';
import Dashboard from './components/Dashboard';
import BookingModal from './components/BookingModal';
import SettingsModal from './components/SettingsModal';
import ClientsListModal from './components/ClientsListModal';
import ClientModal from './components/ClientModal';
import NextAppointmentModal from './components/NextAppointmentModal';
import { processBookingRequest } from './services/geminiService';
import { Booking, Availability, Client } from './types';

// Mock data for initial state
const MOCK_CLIENTS: Client[] = [
    { id: 'client_1', name: 'Juan Pérez', phone: '555-1234', email: 'juan.perez@email.com' },
    { id: 'client_2', name: 'María García', phone: '555-5678' },
];

const MOCK_BOOKINGS: Booking[] = [
    { id: 'booking_1', title: 'Consulta', start: new Date(new Date().setHours(10, 0, 0, 0)), end: new Date(new Date().setHours(11, 0, 0, 0)), client: MOCK_CLIENTS[0] },
    { id: 'booking_2', title: 'Revisión', start: new Date(new Date().setHours(14, 30, 0, 0)), end: new Date(new Date().setHours(15, 0, 0, 0)), client: MOCK_CLIENTS[1] },
];


function App() {
    const [currentView, setCurrentView] = useState<'dashboard' | 'calendar'>('dashboard');
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
    const [availability, setAvailability] = useState<Availability>({
        days: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 0: false }, // Mon-Fri
        startTime: '09:00',
        endTime: '18:00',
    });
    
    // Modal states
    const [isBookingModalOpen, setBookingModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isClientsListModalOpen, setClientsListModalOpen] = useState(false);
    const [isClientModalOpen, setClientModalOpen] = useState(false);
    const [isNextAppointmentModalOpen, setNextAppointmentModalOpen] = useState(false);
    
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [nextAppointment, setNextAppointment] = useState<{ booking: Booking, client: Client } | null>(null);

    // Loading and error states for AI booking
    const [isBookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);

    const handleAddBooking = async (request: string) => {
        setBookingLoading(true);
        setBookingError(null);
        try {
            const result = await processBookingRequest(request, bookings, availability, clients);
            if (result) {
                setNextAppointment(result);
                setBookingModalOpen(false);
                setNextAppointmentModalOpen(true);
            } else {
                setBookingError("No se encontraron huecos disponibles con los criterios especificados. Intente con otra fecha o duración.");
            }
        } catch (error) {
            setBookingError((error as Error).message);
        } finally {
            setBookingLoading(false);
        }
    };

    const confirmBooking = () => {
        if (nextAppointment) {
            const existingClient = clients.find(c => c.id === nextAppointment.client.id);
            if (!existingClient) {
                 setClients(prev => [...prev, nextAppointment.client]);
            }
            setBookings(prev => [...prev, nextAppointment.booking].sort((a,b) => a.start.getTime() - b.start.getTime()));
            setNextAppointment(null);
            setNextAppointmentModalOpen(false);
        }
    };

    const handleSaveClient = (client: Client) => {
        setClients(prevClients => {
            const existingIndex = prevClients.findIndex(c => c.id === client.id);
            if (existingIndex > -1) {
                const newClients = [...prevClients];
                newClients[existingIndex] = client;
                return newClients;
            }
            return [...prevClients, client];
        });
        setClientModalOpen(false);
        setClientToEdit(null);
        setClientsListModalOpen(true);
    };
    
    const handleOpenClientModal = (client: Client | null) => {
        setClientToEdit(client);
        setClientModalOpen(true);
        setClientsListModalOpen(false);
    }
    
    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100 font-sans">
            <Header 
                currentView={currentView}
                onNavigateToDashboard={() => setCurrentView('dashboard')}
            />
            <main className="p-4 sm:p-6 lg:p-8">
                {currentView === 'dashboard' && (
                    <Dashboard 
                        onNavigateToCalendar={() => setCurrentView('calendar')}
                        onOpenBookingModal={() => setBookingModalOpen(true)}
                        onOpenClientsModal={() => setClientsListModalOpen(true)}
                        onOpenSettingsModal={() => setSettingsModalOpen(true)}
                    />
                )}
                {currentView === 'calendar' && (
                     <CalendarView bookings={bookings} onSelectBooking={(b) => console.log(b)} />
                )}
            </main>

            <BookingModal 
                isOpen={isBookingModalOpen}
                onClose={() => setBookingModalOpen(false)}
                onAddBooking={handleAddBooking}
                isLoading={isBookingLoading}
                error={bookingError}
                clearError={() => setBookingError(null)}
            />
            
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setSettingsModalOpen(false)}
                availability={availability}
                onSave={setAvailability}
            />

            <ClientsListModal
                isOpen={isClientsListModalOpen}
                onClose={() => setClientsListModalOpen(false)}
                clients={clients}
                onSelectClient={(c) => handleOpenClientModal(c)}
                onAddClient={() => handleOpenClientModal(null)}
            />
            
            <ClientModal
                isOpen={isClientModalOpen}
                onClose={() => { setClientModalOpen(false); setClientToEdit(null); }}
                onSave={handleSaveClient}
                clientToEdit={clientToEdit}
            />
            
            {nextAppointment && (
                <NextAppointmentModal
                    isOpen={isNextAppointmentModalOpen}
                    onClose={() => { setNextAppointmentModalOpen(false); setNextAppointment(null); }}
                    onConfirm={confirmBooking}
                    booking={nextAppointment.booking}
                />
            )}
        </div>
    );
}

export default App;