import express, {Application, Request, Response} from "express" ;

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.get("/health", async (_req: Request, res: Response) => {
    res.json({
        message: "Server is up and running",
    });
});

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});



