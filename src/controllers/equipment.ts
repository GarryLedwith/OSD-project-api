
import { Request, Response } from "express";
import { collections } from "../database"
import { ObjectId } from "mongodb";
import { Equipment } from "../models/equipment";


// POST /api/v1/equipment  
export const addEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const newEquipment: Equipment = {
      ...data,
      bookings: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // insert the new equipment document into the database
    const result = await collections.equipment?.insertOne(newEquipment);

    if (result) {
      const created = await collections.equipment?.findOne({ _id: result.insertedId });
      res.status(201).json(created);
    } else {
      res.status(500).json({ message: "Failed to create a new equipment item." });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with creating equipment ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to create equipment`);
  }
  }

  // GET /api/v1/equipment (any, supports filters: category or status)
  export const getEquipment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, status, } = req.query; 
      const query: any = {}; // MongoDB query object

      // Filter by category and/or status if provided
      if (category) {
        query.category = category;
      }

      if (status) {
        query.status = status;
      }

      // Fetch equipment items from the database based on the query
      const equipmentItems = (await collections.equipment?.find(query).toArray()) as unknown as Equipment[];

      res.status(200).json(equipmentItems);
    } catch (error) {
      if (error instanceof Error) {
        console.log(`issue with getting equipment ${error.message}`);
      } else {
        console.log(`error with ${error}`);
      }
      res.status(500).send(`Unable to get equipment`);
    }
  };

// GET /api/v1/equipment/:id 
export const getEquipmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      res.status(400).send(`Invalid equipment ID: ${id}`);
      return;
    }

    // Fetch the equipment item by ID from the database
    const equipmentItem = await collections.equipment?.findOne({ _id: new ObjectId(id) }) as unknown as Equipment;

    if (equipmentItem) {
      res.status(200).json(equipmentItem);
    } else {
      res.status(404).send(`Equipment item with ID ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with getting equipment by id ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to get equipment by id`);
  }
};

// PATCH /api/v1/equipment/:id 
export const updateEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const updates = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      res.status(400).send(`Invalid equipment ID: ${id}`);
      return;
    }

    // Update the equipment item in the database
    const result = await collections.equipment?.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (result && result.matchedCount > 0) {
      const updatedItem = await collections.equipment?.findOne({ _id: new ObjectId(id) }) as unknown as Equipment;
      res.status(200).json(updatedItem);
    } else {
      res.status(404).send(`Equipment item with ID ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with updating equipment ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to update equipment`);
  }
};

// DELETE /api/v1/equipment/:id 
export const deleteEquipment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      res.status(400).send(`Invalid equipment ID: ${id}`);
      return;
    }

    // Delete the equipment item from the database
    const result = await collections.equipment?.deleteOne({ _id: new ObjectId(id) });

    if (result && result.deletedCount > 0) {
      res.status(200).send(`Equipment item with ID ${id} deleted successfully`);
    } else {
      res.status(404).send(`Equipment item with ID ${id} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with deleting equipment ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to delete equipment`);
  }
};  


// ============ Bookings Sub-route Controllers ============

// Booking status enum
enum BookingStatus {
  APPROVED = 'approved',
  DENIED = 'denied',
  CHECKED_OUT = 'checked_out',
  CHECKED_IN = 'checked_in'
}

// Helper function to update booking status
async function updateBookingStatus(
  req: Request,
  res: Response,
  status: BookingStatus,
  actionName: string
): Promise<void> {
  try {
    const equipmentId = String(req.params.id);
    const bookingId = String(req.params.bookingId);

    // Validate ObjectId
    if (!ObjectId.isValid(equipmentId) || !ObjectId.isValid(bookingId)) {
      res.status(400).send(`Invalid equipment ID: ${equipmentId} or booking ID: ${bookingId}`);
      return;
    }

    // Fetch the equipment item by ID from the database
    const equipmentItem = await collections.equipment?.findOne({ _id: new ObjectId(equipmentId) }) as unknown as Equipment;

    if (!equipmentItem) {
      res.status(404).send(`Equipment item with ID ${equipmentId} not found`);
      return;
    }

    // Find the booking by ID
    const booking = equipmentItem.bookings.find(booking => booking._id.toString() === bookingId);

    if (!booking) {
      res.status(404).send(`Booking with ID ${bookingId} not found`);
      return;
    }

    // Update the booking status
    booking.status = status;
    booking.updatedAt = new Date();

    const result = await collections.equipment?.updateOne(
      { _id: new ObjectId(equipmentId), 'bookings._id': new ObjectId(bookingId) },
      { $set: { 'bookings.$': booking, updatedAt: new Date() } } as any
    );

    if (result && result.matchedCount > 0) {
      res.status(200).json(booking);
    } else {
      res.status(404).send(`Equipment item with ID ${equipmentId} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with ${actionName} booking ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to ${actionName} booking`);
  }
}

// POST /api/v1/equipment/:id/bookings 
// Create a new booking request
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const equipmentId = String(req.params.id);
    const bookingData = req.body;
    const { startDate, endDate } = bookingData;

    // Validate ObjectId
    if (!ObjectId.isValid(equipmentId)) {
      res.status(400).send(`Invalid equipment ID: ${equipmentId}`);
      return;
    }


    // Validate startDate and endDate
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'startDate and endDate are required' });
      return;
    }

    // Create booking object
    const booking = {
      _id: new ObjectId(),
      userId: bookingData.userId,
      startDate: new Date(bookingData.startDate),
      endDate: new Date(bookingData.endDate),
      status: 'pending', // default status
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add booking to the equipment's bookings array
    const result = await collections.equipment?.updateOne(
      { _id: new ObjectId(equipmentId) },
      { $push: { bookings: booking }, $set: { updatedAt: new Date() } } as any
    );

    if (result && result.matchedCount > 0) {
      res.status(201).json(booking);
    } else {
      res.status(404).send(`Equipment item with ID ${equipmentId} not found`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with requesting booking ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to request booking`);
  }
};

// GET /api/v1/equipment/:id/bookings
// Get all bookings for a specific equipment item
export async function getBookings(req: Request, res: Response): Promise<void> {
  try {
    const equipmentId = String(req.params.id);
    const { status, userId } = req.query;

    // Validate ObjectId
    if (!ObjectId.isValid(equipmentId)) {
      res.status(400).send(`Invalid equipment ID: ${equipmentId}`);
      return;
    }

    // Fetch the equipment item by ID from the database
    const equipmentItem = await collections.equipment?.findOne({ _id: new ObjectId(equipmentId) }) as unknown as Equipment;

    if (!equipmentItem) {
      res.status(404).send(`Equipment item with ID ${equipmentId} not found`);
      return;
    }

    // Filter bookings based on query parameters
    let bookings: any[] = (equipmentItem.bookings ?? []) as any[];

    if (status && typeof status === 'string') {
      bookings = bookings.filter(booking => String(booking.status) === status);
    }

    if (userId && typeof userId === 'string') {
      bookings = bookings.filter(booking => String(booking.userId) === userId);
    }

    res.status(200).json(bookings);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with getting bookings ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to get bookings`);
  }
}
