import { ObjectId } from "mongodb";

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
