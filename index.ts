import express, { Application, Request, Response } from 'express';
import mongoose from "mongoose";
import { ShowRouter } from './src/show.router';

// instantiate
const app: Application = express();
const port: Number = Number(process.env.PORT) || 3000;

// route handlers
app.use("/shows", ShowRouter);

app.get('/', (_: Request, res: Response) => {
    res.send('Hello World!');
});


// boot app
(async () => {
    try {
        const url: string = process.env.DB_URL ?? "";
        await mongoose.connect(url);
        app.listen(port, () => console.log(`Show service listening on port ${port}!`));
    } catch (error) {
        console.error("Could not connnect to show db");
    }
})();