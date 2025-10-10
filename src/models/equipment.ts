import { ObjectId } from "mongodb";

// Equipment model interface
export interface Equipment {
     _id?: ObjectId;
     name: string;
     condition: 'new' | 'good' | 'fair' | 'poor';
     serialNumber: string;
     checkoutDate: Date;
     status: 'available' | 'checked-out' | 'reserved' | 'maintenance';
     location: string;
     dateAdded?: Date;
     lastUpdated?: Date;
}
