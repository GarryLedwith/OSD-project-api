import { Request, Response } from "express";
import { collections } from "../database"
import { ObjectId } from "mongodb";
//import { Equipment, equipmentSchema } from "../models/bookings";

/*
Bookings endpoints:

POST /api/v1/bookings (student: request loan item for a data range ) 

GET /api/v1/bookings ( any: own bookings for student; all bookings for staff/admin; filter by status) 

PATCH /api/v1/bookings/:id/approve (staff: approve a pending booking)  

PATCH /api/v1/bookings/:id/deny (staff: deny a pending booking)  

PATCH /api/v1/bookings/:id/check-out (staff: mark an item as checked out) 

When item leaves inventory  

PATCH /api/v1/bookings/:id/check-in (staff: mark an item as checked in) 

Item is returned to inventory  


*/