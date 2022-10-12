import mongoose from 'mongoose';
import { getTimeStamp } from '../../common';

const schema = new mongoose.Schema({
    postId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "posts",
    },
    reportedAt: {
        type: Number,
        required: true,
        default: getTimeStamp
    },
    reason: {
        type: String,
        required: true,
        validate: (v: string) => {
            return v.length > 0
        }
    },
    issuer: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true,
        default: getTimeStamp
    }
});

const ReportedPost = mongoose.model("reportedPosts", schema);

export { ReportedPost };