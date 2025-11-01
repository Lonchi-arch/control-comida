
import { Booking, Availability } from '../types';

/**
 * Finds the next available time slot for a new booking.
 * @param startDate The date to start searching from.
 * @param bookings An array of existing bookings.
 * @param availability The user's work schedule.
 * @param duration The duration of the new booking in minutes.
 * @returns An object with start and end Date objects for the slot, or null if no slot is found.
 */
export const findAvailableSlot = (
    startDate: Date,
    bookings: Booking[],
    availability: Availability,
    duration: number
): { start: Date; end: Date } | null => {

    const searchLimit = new Date(startDate);
    searchLimit.setDate(searchLimit.getDate() + 30); // Search up to 30 days in the future

    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= searchLimit) {
        const dayOfWeek = currentDate.getDay();
        if (availability.days[dayOfWeek]) {
            const [startHour, startMinute] = availability.startTime.split(':').map(Number);
            const [endHour, endMinute] = availability.endTime.split(':').map(Number);

            let nextAvailableStart = new Date(currentDate);
            nextAvailableStart.setHours(startHour, startMinute, 0, 0);
            
            // If searching for today, don't suggest slots in the past
            if (isSameDay(currentDate, new Date())) {
                const now = new Date();
                if (nextAvailableStart < now) {
                    nextAvailableStart = now;
                    // Round up to the next 15-minute interval for cleanliness
                    const minutes = nextAvailableStart.getMinutes();
                    const roundedMinutes = Math.ceil(minutes / 15) * 15;
                    nextAvailableStart.setMinutes(roundedMinutes, 0, 0);
                }
            }


            const dayEnd = new Date(currentDate);
            dayEnd.setHours(endHour, endMinute, 0, 0);

            const todaysBookings = bookings
                .filter(b => isSameDay(b.start, currentDate))
                .sort((a, b) => a.start.getTime() - b.start.getTime());

            for (const booking of todaysBookings) {
                const potentialEnd = new Date(nextAvailableStart.getTime() + duration * 60000);
                
                // Check if there's a gap before the next booking
                if (potentialEnd <= booking.start) {
                    if (potentialEnd <= dayEnd) {
                        return { start: nextAvailableStart, end: potentialEnd };
                    }
                }
                
                // Move the search start to after the current booking
                if (nextAvailableStart < booking.end) {
                    nextAvailableStart = booking.end;
                }
            }
            
            // Check for a slot after the last booking of the day
            const finalPotentialEnd = new Date(nextAvailableStart.getTime() + duration * 60000);
            if (finalPotentialEnd <= dayEnd) {
                 return { start: nextAvailableStart, end: finalPotentialEnd };
            }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return null; // No slot found within the search limit
};

const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
