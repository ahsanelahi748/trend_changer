"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const schema = new mongoose_1.default.Schema({
    repliedTo: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "postComments"
    },
    postId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "posts",
        required: true
    },
    text: {
        type: String,
        required: true,
        validate: (v) => {
            return v.length > 0;
        }
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
    createdAt: {
        type: Number,
        required: true,
        default: common_1.getTimeStamp
    }
});
const PostComment = mongoose_1.default.model("postComments", schema);
exports.PostComment = PostComment;
