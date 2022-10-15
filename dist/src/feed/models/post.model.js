"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const feed_types_1 = require("../feed.types");
const schema = new mongoose_1.default.Schema({
    content: {
        text: {
            type: String,
            default: ""
        },
        media: [{
                mediaType: {
                    type: String,
                    enum: feed_types_1.POST_MEDIA_TYPE_ENUM
                },
                path: {
                    type: String,
                    validate: (v) => {
                        return v.length > 1;
                    }
                }
            }]
    },
    issuer: {
        name: {
            type: String,
            required: true,
            validate: (v) => {
                return v.length >= 3;
            }
        },
        logoPath: {
            type: String,
            required: true,
            default: "" // TODO: add a default image here
        },
        companyId: {
            type: mongoose_1.default.Types.ObjectId,
            required: true
        },
        creatorId: {
            type: mongoose_1.default.Types.ObjectId,
            required: true
        }
    },
    pollOptions: [
        {
            text: {
                type: String,
            },
            votes: {
                type: Number,
            }
        }
    ],
    postType: {
        type: String,
        required: true,
        enum: feed_types_1.POST_TYPES
    },
    likes: [{
            name: {
                type: String,
                required: true,
                validate: (v) => {
                    return v.length >= 3;
                }
            },
            userId: {
                type: mongoose_1.default.Types.ObjectId,
                required: true
            }
        }],
    investorOnly: {
        type: Boolean,
        required: true,
        default: false
    },
    edited: {
        status: {
            type: Boolean,
            required: true,
            default: false
        },
        editedAt: {
            type: Number,
            default: common_1.getTimeStamp
        }
    },
    createdAt: {
        type: Number,
        required: true,
        default: common_1.getTimeStamp
    }
});
const Post = mongoose_1.default.model("posts", schema);
exports.Post = Post;
