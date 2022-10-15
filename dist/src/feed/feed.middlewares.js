"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedMiddlewares = void 0;
const multer_1 = __importDefault(require("multer"));
const common_1 = require("../common");
const getFileParser = (regexFileFilter, fileSizeInMb) => {
    return (0, multer_1.default)({
        storage: multer_1.default.diskStorage({
            destination: "/tmp/posts/"
        }),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(regexFileFilter)) {
                cb(new Error("invalid file type!"));
                return;
            }
            cb(null, true);
        },
        limits: { fileSize: fileSizeInMb * 1000000 },
    });
};
const validateRequestOrigin = (req, res, next) => {
    try {
        const { id, name } = req.headers;
        if (!id || !name) {
            throw new Error("Request not authenticated by gateway");
        }
        next();
    }
    catch (error) {
        console.error(error);
        (0, common_1.sendErrorResponse)(res, 422, "Invalid Request");
    }
};
exports.FeedMiddlewares = {
    getFileParser,
    validateRequestOrigin
};
