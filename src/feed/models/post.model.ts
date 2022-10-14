import mongoose from 'mongoose';
import validator from 'validator';
import { getTimeStamp } from '../../common';
import { POST_MEDIA_TYPE_ENUM, POST_TYPES } from '../feed.types';

const schema = new mongoose.Schema({
    content: {
        text: {
            type: String,
            default: ""
        },
        media: [{
            mediaType: {
                type: String,
                enum: POST_MEDIA_TYPE_ENUM
            },
            path: {
                type: String,
                validate: (v: string) => {
                    return v.length > 1;
                }
            }
        }]
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
        enum: POST_TYPES
    },
    likes: [{
        name: {
            type: String,
            required: true,
            validate: (v: string) => {
                return v.length >= 3
            }
        },
        userId: {
            type: mongoose.Types.ObjectId,
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
            default: getTimeStamp
        }
    },
    createdAt: {
        type: Number,
        required: true,
        default: getTimeStamp
    }
});

const Post = mongoose.model("posts", schema);

export { Post };