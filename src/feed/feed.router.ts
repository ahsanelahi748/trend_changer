import express, { Router } from 'express';
import { FeedController } from './feed.controller';
import { FeedMiddlewares } from './feed.middlewares';
import { FeedValidator } from './feed.validator';

const FeedRouter: Router = express.Router();

FeedRouter.post("/post", FeedMiddlewares.validateRequestOrigin,
    FeedMiddlewares.getFileParser(/\.(JPG|JPEG|jpg|jpeg|PNG|png)$/, 3).any(),
    FeedValidator.validatePostCreate,
    FeedController.createPost);

FeedRouter.get("/posts", FeedMiddlewares.validateRequestOrigin, FeedController.getAllPosts);

FeedRouter.delete("/post/:postId", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validatePostId, FeedController.deletePost);

FeedRouter.post("/post/:postId/like", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validatePostId, FeedController.createLike);

FeedRouter.get("/post/:postId/likes", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validatePostId, FeedController.getAllLikes);

FeedRouter.delete("/post/:postId/like", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validatePostId, FeedController.deleteLike);

FeedRouter.post("/post/comment", FeedMiddlewares.validateRequestOrigin, FeedValidator.validateCommentCreate
    , FeedController.postComment);

FeedRouter.get("/post/:postId/comments", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validatePostId, FeedController.getAllComments);

FeedRouter.delete("/post/comment/:commentId", FeedMiddlewares.validateRequestOrigin,
    FeedValidator.validateCommentId, FeedController.deleteComment);
export { FeedRouter };