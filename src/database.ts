import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "lab_equipment_loaner_project";
const client = new MongoClient(connectionString);

// export collections to be used in other files
export const collections: { users?: Collection, equipment?: Collection, bookings?: Collection } = {}

// check if connection string is empty
if (connectionString == "") {
     throw new Error("No connection string  in .env");
}

// reference to the database
let db: Db;

// connect to mongo db
export async function initDb(): Promise<void> {
 try {
     await client.connect();
     db = client.db(dbName);
     const usersCollection: Collection = db.collection('users')
     const equipmentCollection: Collection = db.collection('equipment')
     const bookingsCollection: Collection = db.collection('bookings')
     collections.users = usersCollection;
     collections.equipment = equipmentCollection;
     collections.bookings = bookingsCollection;
     console.log(`Successfully connected to database: ${db.databaseName} and collections: ${collections}`);
   }
   catch (error) {
     if (error instanceof Error) {
       console.log(`issue with db connection ${error.message}`);
 } else {
      console.log(`error with ${error}`);
      }
   }
}