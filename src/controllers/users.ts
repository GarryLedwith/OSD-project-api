import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import { ObjectId } from 'mongodb';

/*
Users endpoints:

POST /api/v1/users (admin: creates a new user account)

GET /api/v1/users (admin: lists all the users)  

GET /api/v1/users/:id (admin: gets an individual user)  

GET /api/v1/users/role/:role (admin: gets users by role)

PUT /api/v1/users/:id (admin: update individual user- full update ) 

PATCH /api/v1/users/:id (admin: update individual user – partial update) 

DELETE /api/v1/users/:id (admin: deletes a user account)   

*/

// Define allowed user roles
const ALLOWED_ROLES = new Set<User['role']>(['admin', 'staff', 'student']); 

// create a new user in the database
// POST /api/v1/users (admin: creates a new user account)
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: User = {
      ...req.body,
      dateJoined: new Date(),
      lastUpdated: new Date(),
    }

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

// get all users from the database 
// GET /api/v1/users (admin: lists all the users)  
export const getUsers = async (req: Request, res: Response) => {
  try {
    // fetch all users from the database
    const users = (await collections.users?.find({}).toArray()) as unknown as User[];

    // return the list of users
    return res.status(200).send(users);

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with getting users ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to get users`);
  }
};

// get a single user by ID from the database
// GET /api/v1/users/:id (admin: gets an individual user)  
export const getUserById = async (req: Request, res: Response) => {
   try {
      // Extract user ID from request parameters
      const id:string = req.params.id; 

      // validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send(`Invalid user ID: ${id}`);
      }

      // fetch the user by id from the database
      const user = await collections.users?.findOne({ _id: new ObjectId(id) }) as unknown as User;

      // return the user data
     return  res.status(200).send(user);

   } catch (error) {
      if (error instanceof Error) {
        console.log(`issue with getting user by id ${error.message}`);
      } else {
        console.log(`error with ${error}`);
      }
      res.status(500).send(`Unable to get user by id`);
    }
};

// get users by role from the database
// GET /api/v1/users/role/:role (admin: gets users by role)
export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    // Extract role from request parameters
    const roleParam = req.params.role as User['role'];

    // Validate the role
    if (!ALLOWED_ROLES.has(roleParam)) {
      return res.status(400).send(`Invalid role: ${roleParam}`);
    }

    // Query the database for users with the specified role
    const usersCursor = collections.users?.find({ role: roleParam });
    const usersByRole = usersCursor ? (await usersCursor.toArray()) as unknown as User[] : [];

    // handle case where no users are found
    if (usersByRole.length === 0) {
      return res.status(404).send(`No users found with role: ${roleParam}`);
    } else {
      return res.status(200).send(usersByRole);
    }

  } catch (error) {
    if (error instanceof Error) {
      console.log(`issue with getting users by role ${error.message}`);
    } else {
      console.log(`error with ${error}`);
    }
    res.status(500).send(`Unable to get users by role`);
  }
};


// update a user in the database
// PUT /api/v1/users/:id (admin: update individual user- full update )
export const updateUser = async (req: Request, res: Response) => {
    try {
      // Extract user ID from request parameters
      const id:string = req.params.id;

      // validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send(`Invalid user ID: ${id}`);
      }

      // create updated user object
      const updatedUser: User = {
        ...req.body,
        lastUpdated: new Date(),
      };

      // update the user in the database
      const result = await collections.users?.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedUser }
      );

      // return response based on the update result
      if (result && result.modifiedCount > 0) {
        return res.status(200).json({ message: `User with ID ${id} updated successfully` });
      } else if (result && result.matchedCount > 0) {
        return res.status(200).json({ message: `User with ID ${id} was already up to date` });
      } else {
        return res.status(404).json({ message: `User with ID ${id} not found` });
      }

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
      
      // TODO: Implement partial update logic here
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
    try {

      const id:string = req.params.id; // Extract user ID from request parameters

      // validate ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid user ID: ${id}` });
      }

      // delete the user from the database by using the user ID to find the user
      const result = await collections.users?.deleteOne({ _id: new ObjectId(id) });

      // return response based on the delete result
      if (result && result.deletedCount > 0) {
        return res.status(200).json({ message: `User with ID ${id} deleted successfully` });
      } else {
        return res.status(404).json({ message: `User with ID ${id} not found` });
      }

    } catch (error) {
      if (error instanceof Error)
    {
      console.log(`issue with deleting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).json({ message: `Unable to delete user` });
  }
};