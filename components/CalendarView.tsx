import React from 'react';
import { Calendar, momentLocalizer, Views, EventProps } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { Booking } from '../types';

moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarViewProps {
    bookings: Booking[];
    onSelectBooking: (booking: Booking) => void;
}

const EventComponent: React.FC<EventProps<Booking>> = ({ event }) => {
    return (
        <div>
            <strong>{event.title}</strong>
            {event.client && <p className="text-sm italic opacity-80">{event.client.name}</p>}
        </div>
    );
};

const CalendarView: React.FC<CalendarViewProps> = ({ bookings, onSelectBooking }) => {
    const events = bookings.map(b => ({
        ...b,
        start: new Date(b.start),
        end: new Date(b.end),
    }));

    const messages = {
      allDay: 'Todo el día',
      previous: 'Anterior',
      next: 'Siguiente',
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
      date: 'Fecha',
      time: 'Hora',
      event: 'Evento',
      noEventsInRange: 'No hay citas en este rango.',
      showMore: (total: number) => `+ Ver más (${total})`,
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg h-[calc(100vh-120px)] animate-fade-in-up">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                onSelectEvent={onSelectBooking}
                messages={messages}
                defaultView={Views.WEEK}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                components={{
                    event: EventComponent,
                }}
                eventPropGetter={() => ({
                    className: 'bg-primary-500 border-none text-white p-1 rounded-lg'
                })}
            />
        </div>
    );
};

export default CalendarView;