import { ObjectId } from "mongodb";
import { z } from "zod";

// Equipment model interface
export interface Equipment {
     _id?: ObjectId; // MongoDB unique identifier
     name: string; // equipment name
     condition: 'new' | 'good' | 'fair' | 'poor'; // equipment condition
     serialNumber: string; // unique serial number for the equipment
     checkoutDate: Date; // date when the equipment was checked out
     status: 'available' | 'checked-out' | 'reserved' | 'maintenance'; // current status of the equipment
     location: string; // physical location of the equipment
     dateAdded?: Date; // date the equipment was added to the inventory
     lastUpdated?: Date; // date of last update
}

// CREATE: strict schema for equipment creation
export const equipmentSchema = z.object({
     name: z.string().min(1),
     condition: z.enum(['new', 'good', 'fair', 'poor']),
     serialNumber: z.string().min(1),
     checkoutDate: z.coerce.date(), // date should be provided in ISO format (e.g., "YYYY-MM-DD")
     status: z.enum(['available', 'checked-out', 'reserved', 'maintenance']),
     location: z.string().min(1),
     dateAdded: z.coerce.date().optional(),
     lastUpdated: z.coerce.date().optional()
});

// UPDATE: partial schema for equipment updates
export const updateEquipmentSchema = equipmentSchema.partial();



