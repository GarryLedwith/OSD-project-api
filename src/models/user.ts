import { ObjectId } from "mongodb";

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