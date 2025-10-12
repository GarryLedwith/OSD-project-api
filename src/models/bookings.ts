import { ObjectId } from "mongodb";
import { z } from "zod";

// Booking model interface
export interface Booking {
     _id?: ObjectId;
     userId: ObjectId; // Reference to User
     equipmentId: ObjectId; // Reference to Equipment
     bookingDate: Date; // date when the booking was made
     returnDate: Date; // date when the equipment is due to be returned
     status: 'active' | 'completed' | 'cancelled'; // current status of the booking
     dateCreated?: Date; // date the booking was created
     lastUpdated?: Date; // date of last update
}   

// CREATE: strict schema for booking creation
export const bookingSchema = z.object({
     userId: z.string().min(1), 
     equipmentId: z.string().min(1), 
     returnDate: z.coerce.date(), 
     status: z.enum(['active', 'completed', 'cancelled']),
     dateCreated: z.coerce.date().optional(),
     lastUpdated: z.coerce.date().optional()
});

// UPDATE: partial schema for booking updates
export const updateBookingSchema = bookingSchema.partial(); 