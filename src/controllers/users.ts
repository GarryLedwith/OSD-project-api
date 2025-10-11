import { Request, Response } from 'express';
import { collections } from '../database';
import { User } from '../models/user';
import { createUserSchema } from '../models/user';
import router from '../routes/users';

// get all users from the database
export const getUsers = async (req: Request, res: Response) => {
  try {

   const users = (await collections.users?.find({}).toArray()) as unknown as User[];

  } catch (error) {
   res.status(500).send("oppss");
  }
};

// get a single  user by ID from the database
export const getUserById = (req: Request, res: Response) => {
   let id:string = req.params.id;
 res.json({"message": `get a user ${id} received`})
};

// create a new user in the database
export const createUser = async (req: Request, res: Response) => {
  //router.post('/', validate(createUserSchema), createUser);
  try {
      console.log(req.body); //for now still log the data

      const { name, phonenumber, email, dob } = req.body; // Destructure the incoming data

      const newUser: User = { 
        name: name, 
        phonenumber: phonenumber, 
        email: email, 
        dob: new Date(dob), 
        dateJoined: new Date(), 
        lastUpdated: new Date(),
        role: req.body.role 
      };

   const result = await collections.users?.insertOne(newUser)

   if (result) {
    res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` })
    }
    else {
     res.status(500).send("Failed to create a new user.");
    }
  } catch (error) {
      if (error instanceof Error)
    {
      console.log(`issue with inserting ${error.message}`);
    }
    else{
      console.log(`error with ${error}`)
    }
    res.status(400).send(`Unable to create user`);
  }
};

// update a user in the database
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



// delete a user from the database
export const deleteUser = (req: Request, res: Response) => {


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