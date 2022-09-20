import { Request, Response, NextFunction } from 'express';
import joi from "joi";
import { HTTP, sendErrorResponse } from './common';

export const showValidator = {
    validateGetShow: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await joi.object({
                showId: joi.string().alphanum().min(24).required()
            }).validateAsync({ showId: id });
            next();
        } catch (error: any) {
            sendErrorResponse(res, HTTP.BAD_REQUEST, error.message);
        }
    }
}