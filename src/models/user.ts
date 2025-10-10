import { ObjectId } from "mongodb";

// User model interface
export interface User {
     _id?: ObjectId;
     name: string;
     phonenumber: string;
     email: string;
     dob: Date;
     role: 'student' | 'staff' | 'admin';
     dateJoined?: Date;
     lastUpdated?: Date;
}