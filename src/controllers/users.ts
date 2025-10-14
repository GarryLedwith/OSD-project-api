import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import { createUserSchema } from '../models/user';
import router from '../routes/users';
import { ObjectId } from 'mongodb';

/*
Users endpoints:

GET /api/v1/users (admin: lists all the users)  

GET /api/v1/users/:id (admin: gets an individual user)  

POST /api/v1/users (admin: creates a new user account)

PUT /api/v1/users/:id (admin: update individual user- full update ) 

PATCH /api/v1/users/:id (admin: update individual user – partial update) 

DELETE /api/v1/users/:id (admin: deletes a user account)   

*/


// get all users from the database 
// GET /api/v1/users (admin: lists all the users)  <--- This is the endpoint
export const getUsers = async (req: Request, res: Response) => {
  // how can I use createUserSchema to validate the data from the database?
  try {
    const users = (await collections.users?.find({}).toArray()) as unknown as User[];
    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with getting users ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to get users`);
  }
};

// get a single  user by ID from the database
// GET /api/v1/users/:id (admin: gets an individual user)  <--- This is the endpoint
export const getUserById = (req: Request, res: Response) => {
   let id:string = req.params.id;
 res.json({"message": `get a user ${id} received`})
};


// POST /api/v1/users (admin: creates a new user account)
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: User = req.body;

    const result = await collections.users?.insertOne(newUser); 

    if (result) {
      res.status(201).send(result);
    } else {
      res.status(500).send(`Unable to create user`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with creating user ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to create user`);
  }
};

// update a user in the database
// PUT /api/v1/users/:id (admin: update individual user- full update ) 
export const updateUser = (req: Request, res: Response) => {
    
    try {
      console.log(req.body); 
      res.json({"message": `update user ${req.params.id} with data from the post message`})
    } catch (error) {
      if (error instanceof Error)
    {
      console.log(`issue with updating ${error.message}`);
    }
    else{ 
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to update user`);
  }
};

// update a user in the database (partial update)
// PATCH /api/v1/users/:id (admin: update individual user – partial update) 
export const patchUser = (req: Request, res: Response) => {
    try {
      console.log(req.body); 
      res.json({"message": `patch user ${req.params.id} with data from the post message`})
    } catch (error) {
      if (error instanceof Error)
    {
      console.log(`issue with patching ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to patch user`);
  }
};

// delete a user from the database
// DELETE /api/v1/users/:id (admin: deletes a user account)
export const deleteUser = async (req: Request, res: Response) => {
  const id:string = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await collections.users?.deleteOne(query);

    try {
      console.log(req.body); 
     res.json({"message": `delete user ${req.params.id} from the database`});
    } catch (error) {
      if (error instanceof Error)
    {
      console.log(`issue with deleting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to delete user`);
  }
};