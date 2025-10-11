import { ObjectId } from "mongodb";
import { z } from "zod";

// User model interface
export interface User {
     _id?: ObjectId; // MongoDB unique identifier
     name: string; // full name
     phonenumber: string;  // Irish phone number format starting with 08
     email: string; // student email address
     dob: Date; // date of birth
     role: 'student' | 'staff' | 'admin'; // user role
     dateJoined?: Date; // date the user joined
     lastUpdated?: Date; // date of last update
}

// CREATE: strict schema for user creation
export const createUserSchema = z.object({
     name: z.string().min(1),
     phonenumber: z.string(),
     email: z.string(),
     dob: z.coerce.date(), // date should be provided in ISO format (e.g., "YYYY-MM-DD")
     role: z.enum(['student', 'staff', 'admin']),
     dateJoined: z.coerce.date().optional(),
     lastUpdated: z.coerce.date().optional()
});