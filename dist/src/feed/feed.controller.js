"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../common");
const feed_types_1 = require("./feed.types");
const comment_model_1 = require("./models/comment.model");
const follower_model_1 = require("./models/follower.model");
const post_model_1 = require("./models/post.model");
const reportedComments_model_1 = require("./models/reportedComments.model");
const reportedPost_model_1 = require("./models/reportedPost.model");
exports.FeedController = {
    createPost(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, startupid } = req.headers;
                const { type, text, options } = req.body;
                let media = [];
                let post = {
                    issuer: {
                        name: name,
                        companyId: startupid,
                        logoPath: common_1.USER_IMAGE_PATH + id,
                        creatorId: id
                    },
                    content: {
                        text: text !== null && text !== void 0 ? text : "",
                        media
                    },
                    postType: type,
                    pollOptions: options !== null && options !== void 0 ? options : []
                };
                if (type === feed_types_1.POST_TYPE_ENUM.MEDIA) {
                    if (req.files) {
                        for (let i = 0; i < req.files.length; i++) {
                            let _i = String(i);
                            const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a[_i];
                            console.log(file);
                            const fileType = file.mimetype.split("/")[0];
                            const fileExt = file.mimetype.split("/")[1];
                            media.push({
                                mediaType: fileType === "image" ? feed_types_1.POST_MEDIA_TYPE_ENUM.IMAGE : feed_types_1.POST_MEDIA_TYPE_ENUM.VIDEO,
                                path: file.path + "." + fileExt
                            });
                        }
                        post = Object.assign(Object.assign({}, post), { content: Object.assign(Object.assign({}, post.content), { media }) });
                    }
                }
                else {
                    let pollOptions = [];
                    options.forEach((poll) => {
                        pollOptions.push({
                            text: poll.text,
                            votes: 0
                        });
                    });
                    post = Object.assign(Object.assign({}, post), { pollOptions });
                }
                // console.log({ post });
                const postDoc = yield new post_model_1.Post(post).save();
                (0, common_1.sendResponse)(res, common_1.HTTP.CREATED, "Post Created Successfully.", postDoc);
            }
            catch (error) {
                console.error(error.message);
                if ((_b = error === null || error === void 0 ? void 0 : error._message) === null || _b === void 0 ? void 0 : _b.includes("validation")) {
                    (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, "Bad Request.");
                    return;
                }
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error.");
            }
        });
    },
    getAllPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.headers;
            const { page } = req.query;
            let _page;
            const limit = 10;
            let skip = 0;
            if (!page || Number(page) < 1) {
                _page = 1;
                skip = (_page - 1) * limit;
            }
            const pipeline = [
                {
                    $match: {
                        userId: new mongoose_1.default.Types.ObjectId(String(id))
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "posts",
                        localField: "companyId",
                        foreignField: "issuer.companyId",
                        pipeline: [
                            {
                                $sort: {
                                    createdAt: -1
                                },
                            },
                            { $limit: 5 }
                        ],
                        as: "posts"
                    }
                },
                {
                    $unwind: {
                        path: "$posts"
                    }
                },
                { $group: { _id: null, posts: { $push: "$posts" } } },
                {
                    $project: {
                        posts: 1,
                    }
                }
            ];
            const posts = yield follower_model_1.CompanyFollower.aggregate(pipeline);
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", posts);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    postComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, name, startupid } = req.headers;
            const { postId, content } = req.body;
            let comment = {
                postId,
                text: content,
                issuer: {
                    name,
                    logoPath: common_1.USER_IMAGE_PATH + id,
                    companyId: startupid,
                    creatorId: id
                }
            };
            const commentDoc = yield new comment_model_1.PostComment(comment).save();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", commentDoc);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    deletePost(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.headers;
                const { postId } = req.params;
                const post = yield post_model_1.Post.findById(postId);
                if (!post) {
                    return (0, common_1.sendErrorResponse)(res, common_1.HTTP.NOT_FOUND, "Post does not exist.");
                }
                if (((_b = (_a = post === null || post === void 0 ? void 0 : post.issuer) === null || _a === void 0 ? void 0 : _a.creatorId) === null || _b === void 0 ? void 0 : _b.toString()) !== id) {
                    return (0, common_1.sendErrorResponse)(res, common_1.HTTP.FORBIDDEN, "Post cannot be deleted");
                }
                yield post.delete();
                (0, common_1.sendResponse)(res, common_1.HTTP.OK, "Post has been deleted", {});
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
            }
        });
    },
    getAllLikes: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { index } = req.query;
            const { postId } = req.params;
            let skip = 0;
            if (!index || Number(index) < 1) {
                skip = 0;
            }
            let query = { _id: postId };
            const post = yield post_model_1.Post.findOne(query, { likes: { $slice: [Number(index) - 1, 10] } }).lean().exec();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", { likes: (_a = post === null || post === void 0 ? void 0 : post.likes) !== null && _a !== void 0 ? _a : [] });
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    createLike: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, name } = req.headers;
            const { postId } = req.params;
            const query = {
                $and: [{ _id: postId }, {
                        'likes.userId': { $ne: id }
                    }]
            };
            const post = yield post_model_1.Post.findOneAndUpdate(query, {
                $push: {
                    likes: { name, userId: id }
                }
            }).exec();
            if (!post) {
                throw new Error("Error liking Post");
            }
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "Post liked successfully.", {});
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    deleteLike: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id, name } = req.headers;
            const { postId } = req.params;
            const post = yield post_model_1.Post.findByIdAndUpdate(postId, {
                $pull: {
                    likes: { name, userId: id }
                }
            }).exec();
            if (!post) {
                throw new Error("Error unliking Post");
            }
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "Post unliked successfully.", {});
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    getAllComments: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            let query = { postId: new mongoose_1.default.Types.ObjectId(postId) };
            const posts = yield comment_model_1.PostComment.find(query).skip(skip).limit(limit).lean();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", posts);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    deleteComment(req, res) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.headers;
                const { commentId } = req.params;
                const comment = yield comment_model_1.PostComment.findById(commentId);
                if (!comment) {
                    return (0, common_1.sendErrorResponse)(res, common_1.HTTP.NOT_FOUND, "Comment does not exist.");
                }
                if (((_b = (_a = comment === null || comment === void 0 ? void 0 : comment.issuer) === null || _a === void 0 ? void 0 : _a.creatorId) === null || _b === void 0 ? void 0 : _b.toString()) !== id) {
                    return (0, common_1.sendErrorResponse)(res, common_1.HTTP.FORBIDDEN, "Comment cannot be deleted");
                }
                yield comment.delete();
                (0, common_1.sendResponse)(res, common_1.HTTP.OK, "Comment has been deleted", {});
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
            }
        });
    },
    followStartup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.headers;
            const { startupId } = req.params;
            let followDto = {
                userId: id,
                companyId: startupId
            };
            const followDoc = yield new follower_model_1.CompanyFollower(followDto).save();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", followDoc);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    reportComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.headers;
            const { commentId } = req.params;
            const { reason } = req.body;
            if (!reason || (reason === null || reason === void 0 ? void 0 : reason.length) < 1) {
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, "reason is required with length >= 1.");
                return;
            }
            const postComment = yield comment_model_1.PostComment.findById(commentId);
            if (!postComment) {
                return (0, common_1.sendErrorResponse)(res, common_1.HTTP.NOT_FOUND, "Comment does not exist.");
            }
            let commentReportDto = {
                commentId,
                reason,
                issuer: id,
            };
            const postReportDoc = yield new reportedComments_model_1.ReportedComment(commentReportDto).save();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", postReportDoc);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    }),
    reportPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.headers;
            const { postId } = req.params;
            const { reason } = req.body;
            if (!reason || (reason === null || reason === void 0 ? void 0 : reason.length) < 1) {
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, "reason is required with length >= 1.");
                return;
            }
            const post = yield post_model_1.Post.findById(postId);
            if (!post) {
                return (0, common_1.sendErrorResponse)(res, common_1.HTTP.NOT_FOUND, "Post does not exist.");
            }
            let postReportDto = {
                postId,
                reason,
                issuer: id,
            };
            const postReportDoc = yield new reportedPost_model_1.ReportedPost(postReportDto).save();
            (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", postReportDoc);
        }
        catch (error) {
            console.error(error);
            (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
        }
    })
};
