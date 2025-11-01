// Fix: Defining the core types for the application.

export interface Booking {
    id: string;
    title: string;
    start: Date;
    end: Date;
    client?: Client;
    notes?: string;
}

export interface Client {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
}

export interface Availability {
    days: { [key: number]: boolean }; // 0 for Sunday, 1 for Monday, etc.
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
}
