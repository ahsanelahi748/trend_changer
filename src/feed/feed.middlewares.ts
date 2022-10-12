import multer from "multer";
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from "../common";

const getFileParser = (regexFileFilter: RegExp, fileSizeInMb: number) => {
    return multer({
        storage: multer.diskStorage({
            destination: "/tmp/posts/"
        }),
        fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
            if (!file.originalname.match(regexFileFilter)) {
                cb(new Error("invalid file type!"));
                return;
            }
            cb(null, true);
        },
        limits: { fileSize: fileSizeInMb * 1000000 },
    })
}

const validateRequestOrigin = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, name } = req.headers;
        if (!id || !name) {
            throw new Error("Request not authenticated by gateway");
        }
        next();
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 422, "Invalid Request");
    }
}

export const FeedMiddlewares = {
    getFileParser,
    validateRequestOrigin
}