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

// ===============================================

// REUSE: field validation schemas

// Name validation
/*
Overview:
This schema validates the name field to ensure it meets specific criteria for a valid personal name.
Implementation Details:
- Trim: Removes leading and trailing whitespace.
- Length Constraints: Ensures the name is neither empty or over 50 characters.
- Character Restrictions using regex: Allows only letters, spaces, apostrophes, and hyphens to accommodate common name formats.
*/
const PersonName = z
  .string()
  .trim()
  .min(1, { message: "Name cannot be empty" })
  .max(50, { message: "Name cannot exceed 50 characters" })
  .regex(/^[a-zA-Z\s'-]+$/, { message: "Name can only contain letters, spaces, apostrophes, and hyphens" });

// Irish phone number validation
/*
Overview:
This schema validates Irish phone numbers to ensure they conform to a specific format.
Implementation Details:
- StartsWith: Ensures the phone number begins with '08', which is standard for Irish mobile numbers.
- Length: Validates that the phone number is exactly 10 digits long.
- Regex: Ensures that the phone number contains only numeric digits, preventing any letters or special characters.
- TODO: Could be enhanced with more robust validation to include country code, spaces, etc.
*/
const IrishPhoneNumber = z    
  .string()
  .startsWith("08", { message: "Phone number must start with '08'" })
  .length(10, { message: "Phone number must be exactly 10 digits long" })
  .regex(/^\d+$/, { message: "Phone number must contain only digits" });

// email validation
/*
Overview:
This schema validates email addresses to ensure they conform to a basic email format.
Implementation Details:
- Basic Format: Ensures the email contains exactly one '@' symbol and a domain.
- Refine 
- Domain Validation: Checks that the domain is one of the allowed educational domains (e.g., @student.atu.ie, @staff.atu.ie, @admin.atu.ie).

*/

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
/*
Overview:
This schema validates the email field based on the user's role. 
Each role has a specific email format that must be followed (student, staff, admin).
Implementation Details:
Union schema is used to define different object shapes for each role.
Literal types enforcementensure that the role field matches exactly one of the specified values.
transform() is used to extract the email field from the matched object, instead of returning the entire object.
*/
const RoleBasedEmail = z.union([
  z.object({ role: z.literal('student'), email: StudentEmail }),
  z.object({ role: z.literal('staff'), email: StaffEmail }),
  z.object({ role: z.literal('admin'), email: AdminEmail })
]).transform(data => data.email);


// CREATE: strict schema for user creation
/*
Overview:
This schema defines the structure and validation rules for creating a new user.
Implementation Details:
- Each field is validated using the previously defined reusable schemas (PersonName, IrishPhoneNumber, RoleBasedEmail).
- Date fields (dob, dateJoined, lastUpdated) are coerced to Date objects to ensure proper date handling.
- Optional fields (dateJoined, lastUpdated) are marked as optional, allowing them to be omitted during user creation.
REFACTOR: 
- refine() method is used to implement custom validation logic that checks if the email format matches the specified role.
 - If the email does not conform to the role-based format, a validation error is returned with a descriptive message.
*/
export const createUserSchema = z.object({
     name: PersonName,
     phonenumber: IrishPhoneNumber,
     email: z.string().email(), // basic email format validation,
     dob: z.coerce.date(), // date should be provided in ISO format (e.g., "YYYY-MM-DD")
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



