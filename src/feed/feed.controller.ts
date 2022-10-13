import { Request, Response } from 'express';
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
                        media.push({
                            mediaType: file.mimetype.includes("image") ? POST_MEDIA_TYPE_ENUM.IMAGE : POST_MEDIA_TYPE_ENUM.VIDEO,
                            path: file.path
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
            const { postId, content, replyCommentId } = req.body;
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
            if (replyCommentId) comment = { ...comment, repliedTo: replyCommentId }
            const commentDoc = await new PostComment(comment).save();
            sendResponse(res, HTTP.OK, "", commentDoc);
        } catch (error) {
            console.error(error);
            sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
        }
    }

};

