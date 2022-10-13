import express, { Router } from 'express';
import { FeedController } from './feed.controller';
import { FeedMiddlewares } from './feed.middlewares';
import { FeedValidator } from './feed.validator';

const FeedRouter: Router = express.Router();

FeedRouter.post("/", FeedMiddlewares.validateRequestOrigin,
    FeedMiddlewares.getFileParser(/\.(JPG|JPEG|jpg|jpeg|PNG|png)$/, 3).any(),
    FeedValidator.validatePostCreate,
    FeedController.createPost);

FeedRouter.get("/", FeedMiddlewares.validateRequestOrigin, FeedController.getAllPosts);

FeedRouter.post("/comment", FeedMiddlewares.validateRequestOrigin, FeedValidator.validateCommentCreate
    , FeedController.postComment);

export { FeedRouter };