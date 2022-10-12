import { Request, Response } from 'express';
import { HTTP, sendErrorResponse, sendResponse, USER_IMAGE_PATH } from '../common';
import { MEDIA_TYPE, POST_MEDIA_TYPE_ENUM, POST_TYPES, POST_TYPE_ENUM } from './feed.types';
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
                options.forEach(poll => {
                    pollOptions.push({
                        text: poll.text,
                        votes: 0
                    });
                });
                post = { ...post, pollOptions };
            }
            console.log({ post });
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
    }

};