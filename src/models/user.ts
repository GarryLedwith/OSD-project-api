import { ObjectId } from "mongodb";
import { z } from "zod";

// User model interface
export interface User {
     _id?: ObjectId; 
     name: string; 
     phone: string;  
     email: string; 
     dob: Date; 
     role: 'student' | 'staff' | 'admin'; 
     dateJoined?: Date; 
     lastUpdated?: Date; 
}

// ===============================================

// REUSE: field validation schemas

// Name validation
const PersonName = z
  .string()
  .trim()
  .min(1, { message: "Name cannot be empty" })
  .max(50, { message: "Name cannot exceed 50 characters" })
  .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, apostrophes, and hyphens" });

// Irish phone number validation
const IrishPhoneNumber = z    
  .string()
  .startsWith("08", { message: "Phone number must start with '08'" })
  .length(10, { message: "Phone number must be exactly 10 digits long" })
  .regex(/^\d+$/, { message: "Phone number must contain only digits" });

// email validation

// student email validation
const StudentEmail = z
  .string()
  .refine((email) => email.endsWith("@student.atu.ie"), { message: "Email must be a student email ending with @student.atu.ie" }); // using @student.atu.ie as an example and simplicity 

// staff email validation
const StaffEmail = z
  .string()
  .refine((email) => email.endsWith("@staff.atu.ie"), { message: "Email must be a staff email ending with @staff.atu.ie" }); // using @staff.atu.ie as an example

// admin email validation
const AdminEmail = z
  .string()
  .refine((email) => email.endsWith("@admin.atu.ie"), { message: "Email must be an admin email ending with @admin.atu.ie" }); // using @admin.atu.ie as an example

// Role-based email validation
const RoleBasedEmail = z.union([
  z.object({ role: z.literal('student'), email: StudentEmail }),
  z.object({ role: z.literal('staff'), email: StaffEmail }),
  z.object({ role: z.literal('admin'), email: AdminEmail })
]).transform(data => data.email);


// CREATE: strict schema for user creation

export const createUserSchema = z.object({
     name: PersonName,
     phone: IrishPhoneNumber,
     email: z.string().email(), 
     dob: z.coerce.date(), 
     role: z.enum(['student', 'staff', 'admin']),
     dateJoined: z.coerce.date().optional(),
     lastUpdated: z.coerce.date().optional()
}).refine((data) => {
    // Validate email based on role
    const emailValidation = RoleBasedEmail.safeParse({ role: data.role, email: data.email }); // safeParse to avoid throwing errors
    return emailValidation.success;
}, {
    message: "Email does not match the required format for the specified role"
});

// UPDATE: partial schema for user updates
export const updateUserSchema = createUserSchema.partial();



