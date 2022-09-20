import mongoose from 'mongoose';
import validator from 'validator';
import { getTimeStamp } from './common';

const schema = new mongoose.Schema({
    // _id: String, not needed mongoose generates itself
    description: {
        type: String,
        required: true,
        default: ""
    },
    headerImgPath: {
        type: String,
        required: true,
        default: "" // add default path here
    },
    host: {
        name: {
            type: String,
            required: true,
            validate: (value: string) => {
                return value.length > 3;
            },
        },
        contact: {
            email: {
                type: String,
                required: false,
                validate: (value: string) => {
                    return validator.isEmail(value)
                },
            },
            phone: {
                type: String,
                required: true,
            }
        }
    },
    showLink: {
        type: String,
        required: true,
        validate: (value: string) => {
            return validator.isURL(value);
        },
    },
    location: {
        address: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true,
        },
        country: {
            type: String,
            required: true
        }
    },
    jury: [{
        name: {
            type: String,
            required: true,
            validate: (value: string) => {
                return value.length > 3;
            }
        },
        imgPath: {
            type: String,
            default: ""  // TODO: add default image url here
        },
        linkedin: {
            type: String,
            required: true,
            validate: (value: string) => {
                return validator.isURL(value);
            },
        },
        email: {
            type: String,
            required: false,
            validate: (value: string) => {
                return validator.isEmail(value);
            },
        },
        desc: {
            type: String,
            default: ""
        }
    }],
    faq: [{
        question: String,
        answer: String
    }],
    participants: [{
        startUpId: {
            type: String,
            ref: "startups model name here",
            required: true,
        },
        name: {
            type: String,
            required: true,
            validate: (value: string) => {
                return value.length > 3;
            }
        },
        desc: {
            type: String,
            required: true,
            default: ""
        },
        logoPath: {
            type: String,
            default: "", // put a default path here
            required: true
        }
    }],
    date: {
        startDate: {
            type: Number,
            required: true
        },
        endDate: {
            type: Number,
            required: true
        }
    },
    createdAt: {
        type: Number,
        default: getTimeStamp
    }
});

const Show = mongoose.model("shows", schema);

export { Show };