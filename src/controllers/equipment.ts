
import { Request, Response } from "express";
import { collections } from "../database"
import { ObjectId } from "mongodb";
import { Equipment, equipmentSchema } from "../models/equipment";

/*
Equipment endpoints:

POST /api/v1/equipment (staff/admin: creates a new equipment item) 

GET /api/v1/equipment (any, supports filters: category or status) 

Example query params: category=Camera&status=available&q=Canon 

GET /api/v1/equipment/:id (any: get an equipment item by its id) 

PATCH /api/v1/equipment/:id (staff/admin: partial update on an equipment item, such as updating the equipment items location or status) 

Partial update of an item (change location or update status of item)  

DELETE /api/v1/equipment/:id (admin: delete an equipment item ) 

*/

// add new equipment to the database
export const addEquipment = async (req: Request, res: Response) => {
  try {
    const newEquipment: Equipment = req.body;

    const result = await collections.equipment?.insertOne(newEquipment);

    if (result) {
      res
        .status(201)
        .location(`${result.insertedId}`)
        .json({
          message: `Created a new equipment item with id ${result.insertedId}`,
        });
    } else {
      res.status(500).send("Failed to create a new equipment item.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with inserting ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(400).send(`Unable to create equipment item`);
  }
}