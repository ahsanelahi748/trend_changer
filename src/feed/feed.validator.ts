import { Request, Response, NextFunction } from 'express';
import joi from "joi";
import { HTTP, sendErrorResponse } from '../common';
import { POST_TYPES } from './feed.types';

export const FeedValidator = {

    async validatePostCreate(req: Request, res: Response, next: NextFunction) {
        try {
            await joi.object({
                text: joi.string().min(1),
                type: joi.any().valid(...POST_TYPES).required(),
                options: joi.array().items(joi.object({
                    text: joi.string().min(1).required()
                }).required())
            }).validateAsync(req.body);
            next();
        } catch (error: any) {
            console.error(error);
            sendErrorResponse(res, HTTP.BAD_REQUEST, error.message);
        }
    },

    async validateCommentCreate(req: Request, res: Response, next: NextFunction) {
        try {
            await joi.object({
                postId: joi.string().alphanum().min(24).required(),
                content: joi.string().min(1).required(),
            }).validateAsync(req.body);
            next();
        } catch (error: any) {
            console.error(error);
            sendErrorResponse(res, HTTP.BAD_REQUEST, error.message);
        }
    },

    async validatePostId(req: Request, res: Response, next: NextFunction) {
        try {
            await joi.object({
                postId: joi.string().alphanum().min(24).required(),
            }).validateAsync(req.params);
            next();
        } catch (error: any) {
            console.error(error);
            sendErrorResponse(res, HTTP.BAD_REQUEST, error.message);
        }
    },

    async validateCommentId(req: Request, res: Response, next: NextFunction) {
        try {
            await joi.object({
                commentId: joi.string().alphanum().min(24).required(),
            }).validateAsync(req.params);
            next();
        } catch (error: any) {
            console.error(error);
            sendErrorResponse(res, HTTP.BAD_REQUEST, error.message);
        }
    }
};