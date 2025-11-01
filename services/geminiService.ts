// Fix: Implementing the Gemini API service to process booking requests.
import { GoogleGenAI, Type } from "@google/genai";
import { Availability, Booking, Client } from "../types";
import { findAvailableSlot } from "../utils/scheduler";

// Fix: Initialize the GoogleGenAI client as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        clientName: {
            type: Type.STRING,
            description: "Nombre del cliente para la cita."
        },
        duration: {
            type: Type.NUMBER,
            description: "Duración de la cita en minutos."
        },
        task: {
            type: Type.STRING,
            description: "Descripción de la tarea o motivo de la cita (ej. 'consulta', 'corte de pelo')."
        },
        date: {
            type: Type.STRING,
            description: "Fecha preferida para la cita en formato YYYY-MM-DD. Si se menciona un día relativo como 'mañana', calcular la fecha. Si no se especifica, dejar vacío."
        },
        timePreference: {
            type: Type.STRING,
            description: "Preferencia de hora (ej. 'mañana', 'tarde', 'noche', '10am'). Si no se especifica, dejar vacío."
        }
    },
    required: ["clientName", "duration", "task"]
};


export const processBookingRequest = async (
    request: string,
    bookings: Booking[],
    availability: Availability,
    clients: Client[],
): Promise<{ booking: Booking, client: Client } | null> => {
    
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;


    const systemInstruction = `
        Eres un asistente de agendamiento inteligente. Tu tarea es analizar la petición del usuario y extraer la información para crear una nueva reserva.
        La fecha y hora actual es ${formattedDate} a las ${formattedTime}.
        La disponibilidad del profesional es:
        - Días: ${Object.entries(availability.days).filter(([,v]) => v).map(([k]) => ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][parseInt(k)]).join(', ')}.
        - Horario: de ${availability.startTime} a ${availability.endTime}.

        Analiza la siguiente petición y extrae el nombre del cliente, la duración de la cita en minutos, y la descripción de la tarea.
        Interpreta fechas relativas como "mañana", "pasado mañana", "el lunes", etc., basándote en la fecha actual.
        Interpreta preferencias de tiempo como "por la mañana" (después de las ${availability.startTime}), "por la tarde" (después de las 12:00), o "a última hora" (cerca de las ${availability.endTime}).
        Devuelve la respuesta únicamente en formato JSON, siguiendo el esquema proporcionado.
    `;

    try {
        // Fix: Using generateContent with JSON response schema as per Gemini API guidelines.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Petición: "${request}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema,
            }
        });

        const jsonString = response.text.trim();
        const parsedData = JSON.parse(jsonString);

        if (!parsedData.clientName || !parsedData.duration || !parsedData.task) {
            throw new Error("La IA no pudo extraer toda la información necesaria.");
        }
        
        let searchStartDate = new Date();
        if(parsedData.date) {
            const dateParts = parsedData.date.split('-').map(Number);
            if (dateParts.length === 3) {
                 const [year, month, day] = dateParts;
                 // new Date month is 0-indexed
                searchStartDate = new Date(year, month - 1, day);
            }
        }

        if (parsedData.timePreference) {
             const timePref = parsedData.timePreference.toLowerCase();
             if (timePref.includes('tarde')) {
                if (searchStartDate.getHours() < 14) searchStartDate.setHours(14, 0, 0, 0);
            } else if (timePref.includes('mañana')) {
                const [startHour, startMinute] = availability.startTime.split(':').map(Number);
                if (searchStartDate.getHours() < startHour) searchStartDate.setHours(startHour, startMinute, 0, 0);
            }
        }

        const slot = findAvailableSlot(searchStartDate, bookings, availability, parsedData.duration);

        if (!slot) {
            return null;
        }
        
        let client = clients.find(c => c.name.toLowerCase() === parsedData.clientName.toLowerCase());
        if (!client) {
            client = {
                id: `client_${Date.now()}`,
                name: parsedData.clientName,
            };
        }

        const newBooking: Booking = {
            id: `booking_${Date.now()}`,
            title: parsedData.task,
            start: slot.start,
            end: slot.end,
            client: client,
            notes: `Cita agendada por IA desde la petición: "${request}"`
        };

        return { booking: newBooking, client };

    } catch (e) {
        console.error("Error processing booking request with Gemini:", e);
        throw new Error("No se pudo procesar la solicitud con IA. Inténtelo de nuevo con más detalles o verifique su API Key.");
    }
};