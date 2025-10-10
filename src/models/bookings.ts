import { ObjectId } from "mongodb";

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