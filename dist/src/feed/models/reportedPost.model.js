"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportedPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const schema = new mongoose_1.default.Schema({
    postId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "posts",
    },
    reportedAt: {
        type: Number,
        required: true,
        default: common_1.getTimeStamp
    },
    reason: {
        type: String,
        required: true,
        validate: (v) => {
            return v.length > 0;
        }
    },
    issuer: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true,
        default: common_1.getTimeStamp
    }
});
const ReportedPost = mongoose_1.default.model("reportedPosts", schema);
exports.ReportedPost = ReportedPost;
