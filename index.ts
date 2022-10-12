import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from "mongoose";
import morgan from 'morgan';
import dotenv from "dotenv";
import { FeedRouter } from './src/feed/feed.router';
import { ShowRouter } from './src/show/show.router';
import { sendErrorResponse } from './src/common';

// instantiate
const app: Application = express();
const port: Number = Number(process.env.PORT) || 3000;

// global middlwares
app.use(express.json());
app.use(morgan("dev")); // for logging

// route handlers
app.use("/api/shows", ShowRouter);
app.use("/api/feed", FeedRouter);

app.get('/', (_: Request, res: Response) => {
    res.send('Hello World!');
});

// global error handler
app.use((error: Error, req: Request, res: Response, _: NextFunction) => {
    try {
        if (error.message.includes("invalid file type")) {
            sendErrorResponse(res, 400, "Unsupported file type");
            return;
        }
        sendErrorResponse(res, 500, "Internal server error");
    } catch (error) {
        sendErrorResponse(res, 500, "Internal server error");
    }
});

// boot app
(async () => {
    try {
        dotenv.config();
        const url: string = process.env.DB_URL ?? "";
        await mongoose.connect(url);
        console.log("DB connected");
        app.listen(port, () => console.log(`Show service listening on port ${port}!`));
    } catch (error) {
        console.error(error);
        console.error("Could not connnect to show db");
    }
})();