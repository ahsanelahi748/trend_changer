import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { HTTP, sendErrorResponse, sendResponse, USER_IMAGE_PATH } from '../common';
import { MEDIA_TYPE, POST_MEDIA_TYPE_ENUM, POST_TYPES, POST_TYPE_ENUM } from './feed.types';
import { PostComment } from './models/comment.model';
import { Post } from './models/post.model';

export const FeedController = {

    async createPost(req: Request, res: Response) {
        try {
            const { id, name, startupid } = req.headers;
            const { type, text, options } = req.body;
            let media: Array<MEDIA_TYPE> = [];
            let post = {
                issuer: {
                    name: name,
                    companyId: startupid,
                    logoPath: USER_IMAGE_PATH + id,
                    creatorId: id
                },
                content: {
                    text: text ?? "",
                    media
                },
                postType: type,
                pollOptions: options ?? []
            };
            if (type === POST_TYPE_ENUM.MEDIA) {
                if (req.files) {
                    for (let i: any = 0; i < req.files.length; i++) {
                        let _i = String(i);
                        const file = req.files?.[_i];
                        console.log(file);
                        const fileType = file.mimetype.split("/")[0];
                        const fileExt = file.mimetype.split("/")[1];
                        media.push({
                            mediaType: fileType === "image" ? POST_MEDIA_TYPE_ENUM.IMAGE : POST_MEDIA_TYPE_ENUM.VIDEO,
                            path: file.path + "." + fileExt
                        });
                    }
                    post = { ...post, content: { ...post.content, media } };
                }
            } else {
                let pollOptions: any = [];
                options.forEach((poll: any) => {
                    pollOptions.push({
                        text: poll.text,
                        votes: 0
                    });
                });
                post = { ...post, pollOptions };
            }
            // console.log({ post });
            const postDoc = await new Post(post).save();
            sendResponse(res, HTTP.CREATED, "Post Created Successfully.",
                postDoc);
        } catch (error: any) {
            console.error(error.message);
            if (error?._message?.includes("validation")) {
                sendErrorResponse(res, HTTP.BAD_REQUEST, "Bad Request.");
                return;
            }
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error.");
        }
    },

    getAllPosts: async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            let _page;
            const limit = 10;
            let skip = 0;
            if (!page || Number(page) < 1) {
                _page = 1;
                skip = (_page - 1) * limit;
            }
            let query = {};
            const posts = await Post.find(query).skip(skip).limit(limit).lean();
            sendResponse(res, HTTP.OK, "", posts);
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    postComment: async (req: Request, res: Response) => {
        try {
            const { id, name, startupid } = req.headers;
            const { postId, content } = req.body;
            let comment = {
                postId,
                text: content,
                issuer: {
                    name,
                    logoPath: USER_IMAGE_PATH + id,
                    companyId: startupid,
                    creatorId: id
                }
            };
            const commentDoc = await new PostComment(comment).save();
            sendResponse(res, HTTP.OK, "", commentDoc);
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    async deletePost(req: Request, res: Response) {
        try {
            const { id } = req.headers;
            const { postId } = req.params;
            const post = await Post.findById(postId);
            if (!post) {
                return sendErrorResponse(res, HTTP.NOT_FOUND, "Post does not exist.");
            }
            if (post?.issuer?.creatorId?.toString() !== id) {
                return sendErrorResponse(res, HTTP.FORBIDDEN, "Post cannot be deleted");
            }
            await post.delete();
            sendResponse(res, HTTP.OK, "Post has been deleted", {});
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },


    getAllLikes: async (req: Request, res: Response) => {
        try {
            const { index } = req.query;
            const { postId } = req.params;
            let skip = 0;
            if (!index || Number(index) < 1) {
                skip = 0;
            }
            let query = { _id: postId };
            const post = await Post.findOne(query, { likes: { $slice: [Number(index) - 1, 10] } }).lean().exec();
            sendResponse(res, HTTP.OK, "", { likes: post?.likes ?? [] });
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    createLike: async (req: Request, res: Response) => {
        try {
            const { id, name } = req.headers;
            const { postId } = req.params;
            const post = await Post.findByIdAndUpdate(postId, {
                $push: {
                    likes: { name, userId: id }
                }
            }).exec();
            if (!post) {
                throw new Error("Error liking Post");
            }
            sendResponse(res, HTTP.OK, "Post liked successfully.", {});
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    deleteLike: async (req: Request, res: Response) => {
        try {
            const { id, name } = req.headers;
            const { postId } = req.params;
            const post = await Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: { name, userId: id }
                }
            }).exec();
            if (!post) {
                throw new Error("Error unliking Post");
            }
            sendResponse(res, HTTP.OK, "Post unliked successfully.", {});
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    getAllComments: async (req: Request, res: Response) => {
        try {
            const { page } = req.query;
            const { postId } = req.params;
            let _page;
            const limit = 10;
            let skip = 0;
            if (!page || Number(page) < 1) {
                _page = 1;
                skip = (_page - 1) * limit;
            }
            let query = { postId: new mongoose.Types.ObjectId(postId) };
            const posts = await PostComment.find(query).skip(skip).limit(limit).lean();
            sendResponse(res, HTTP.OK, "", posts);
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },

    async deleteComment(req: Request, res: Response) {
        try {
            const { id } = req.headers;
            const { commentId } = req.params;
            const comment = await PostComment.findById(commentId);
            if (!comment) {
                return sendErrorResponse(res, HTTP.NOT_FOUND, "Comment does not exist.");
            }
            if (comment?.issuer?.creatorId?.toString() !== id) {
                return sendErrorResponse(res, HTTP.FORBIDDEN, "Comment cannot be deleted");
            }
            await comment.delete();
            sendResponse(res, HTTP.OK, "Comment has been deleted", {});
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    },
};

