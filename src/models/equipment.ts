import { ObjectId } from "mongodb";
import { z } from "zod";

// Equipment model interface
export interface Equipment {
     _id: ObjectId,
     name: String,                   
     category: String,
     description: String,
     status: String,
     location: String,
     model: String,

  bookings: [                     // embedded bookings array
    {
      _id: ObjectId,
      userId: ObjectId,           // ID of the user who made the booking
      startDate: Date,
      endDate: Date,
      status: String,             // default 'pending'
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt?: Date; 
  updatedAt?: Date; 
}

// =========== Zod schemas for validation =============

// Equipment status options
export const equipmentStatusEnum = z.enum(['available', 'unavailable', 'maintenance']);

// Booking status options
export const bookingStatusEnum = z.enum(['pending', 'approved', 'denied', 'checked_out', 'returned']);

// ISO date string schema
export const isoDateString = z.string().refine((dateStr) => {
     return !isNaN(Date.parse(dateStr));
}, {
     message: "Invalid ISO date string",
});

// Booking schema
export const bookingSchema = z.object({
     userId: z.string().refine((id) => ObjectId.isValid(id), { message: "Invalid user ID" }),
     startDate: isoDateString,
     endDate: isoDateString,
     status: bookingStatusEnum.default('pending'),
});

// Equipment with embedded bookings schema
export const equipmentSchema = z.object({
     name: z.string().min(1),
     category: z.string().min(1),
     description: z.string().optional(),
     status: equipmentStatusEnum.default('available'),
     location: z.string().optional(),
     model: z.string().optional(),
     bookings: z.array(bookingSchema).optional(),
     dateAdded: isoDateString.optional(),
     lastUpdated: isoDateString.optional(),
});

// UPDATE: partial schema for equipment updates
export const updateEquipmentSchema = equipmentSchema.partial();



