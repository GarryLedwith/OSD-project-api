import express, {Application, Request, Response} from "express" ;
import userRoutes from './routes/users';
import equipmentRoutes from './routes/equipment';   
import morgan from "morgan";
import cors from "cors";
import dotenv from 'dotenv';
import { initDb } from "./database";


dotenv.config();

const PORT = process.env.PORT || 3000;

export const app: Application = express();

initDb(); // Initialize database connection

app.use(morgan("tiny")); 

app.use(cors()); // CORS middleware

app.use(express.json());

// register routes for users 
app.use('/api/v1/users', userRoutes)

// register routes for equipment
app.use('/api/v1/equipment', equipmentRoutes);

app.get("/health", async (_req: Request, res: Response) => {
    res.json({
        message: "Server is up and running",
    });
});

app.get("/ping", async (_req : Request, res: Response) => {
  res.json({
 message: "Welcome to the Lab Equipment Loaner Project API",
 });
});




