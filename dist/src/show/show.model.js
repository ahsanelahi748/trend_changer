"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Show = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const common_1 = require("../common");
const schema = new mongoose_1.default.Schema({
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
            validate: (value) => {
                return value.length > 3;
            },
        },
        contact: {
            email: {
                type: String,
                required: false,
                validate: (value) => {
                    return validator_1.default.isEmail(value);
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
        validate: (value) => {
            return validator_1.default.isURL(value);
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
                validate: (value) => {
                    return value.length > 3;
                }
            },
            imgPath: {
                type: String,
                default: "" // TODO: add default image url here
            },
            linkedin: {
                type: String,
                required: true,
                validate: (value) => {
                    return validator_1.default.isURL(value);
                },
            },
            email: {
                type: String,
                required: false,
                validate: (value) => {
                    return validator_1.default.isEmail(value);
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
                validate: (value) => {
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
                default: "",
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
        default: common_1.getTimeStamp
    }
});
const Show = mongoose_1.default.model("shows", schema);
exports.Show = Show;
