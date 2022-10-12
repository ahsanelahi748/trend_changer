import mongoose from 'mongoose';
import { getTimeStamp } from '../../common';

const schema = new mongoose.Schema({
    repliedTo: {
        type: mongoose.Types.ObjectId,
        ref: "postComments"
    },
    postId: {
        type: mongoose.Types.ObjectId,
        ref: "posts",
        required: true
    },
    text: {
        type: String,
        required: true,
        validate: (v: string) => {
            return v.length > 0
        }
    },
    issuer: {
        name: {
            type: String,
            required: true,
            validate: (v: string) => {
                return v.length >= 3
            }
        },
        logoPath: {
            type: String,
            required: true,
            default: "" // TODO: add a default image here
        },
        companyId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        creatorId: {
            type: mongoose.Types.ObjectId,
            required: true
        }
    },
    createdAt: {
        type: Number,
        required: true,
        default: getTimeStamp
    }
});

const PostComment = mongoose.model("postComments", schema);

export { PostComment };