import mongoose from 'mongoose';
import { getTimeStamp } from '../../common';

const schema = new mongoose.Schema({
    commentId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "postComments",
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

const ReportedComment = mongoose.model("reportedComments", schema);

export { ReportedComment };