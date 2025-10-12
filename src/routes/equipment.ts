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
import express, { Router } from "express";
import { addEquipment } from "../controllers/equipment";

const router: Router = express.Router();

router.post("/", addEquipment);
// Will add other routes here (GET, PATCH, DELETE)