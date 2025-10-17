/*
Equipment endpoints:

POST /api/v1/equipment (staff/admin: creates a new equipment item) 

GET /api/v1/equipment (any, supports filters: category or status) 

Example query params: category=Camera&status=available&q=Canon 

GET /api/v1/equipment/:id (any: get an equipment item by its id) 

PATCH /api/v1/equipment/:id (staff/admin: partial update on an equipment item, such as updating the equipment items location or status) 

Partial update of an item (change location or update status of item)  

DELETE /api/v1/equipment/:id (admin: delete an equipment item ) 


Bookings sub-routes (embedded)  

POST /api/v1/equipment/:id/bookings  (student: request loan item for a data range) 

GET /api/v1/equipment/:id/bookings (any: own bookings for student; all bookings for staff/admin; filter by status) 

Example query: status=pending | approved | denied |checked_out| returned 

PATCH /api/v1/equipment/:id/bookings/:bookingId/approve (staff: approve a pending booking) 

PATCH /api/v1/equipment/:id/bookings/:bookingId/deny (staff: deny a pending booking) 

PATCH /api/v1/equipment/:id/bookings/:bookingId/check-out (staff: mark an item as checked out) 

When item leaves inventory 

PATCH /api/v1/equipment/:id/bookings/:bookingId/check-in (staff: mark an item as checked in) 

Item is returned to inventory 

*/
import express, { Router } from "express";
import { addEquipment } from "../controllers/equipment";

const router: Router = express.Router();

router.post("/", addEquipment);
// Will add other routes here (GET, PATCH, DELETE)