"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const common_1 = require("../common");
const feed_types_1 = require("./feed.types");
exports.FeedValidator = {
    validatePostCreate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield joi_1.default.object({
                    text: joi_1.default.string().min(1),
                    type: joi_1.default.any().valid(...feed_types_1.POST_TYPES).required(),
                    options: joi_1.default.array().items(joi_1.default.object({
                        text: joi_1.default.string().min(1).required()
                    }).required())
                }).validateAsync(req.body);
                next();
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, error.message);
            }
        });
    },
    validateCommentCreate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield joi_1.default.object({
                    postId: joi_1.default.string().alphanum().min(24).required(),
                    content: joi_1.default.string().min(1).required(),
                }).validateAsync(req.body);
                next();
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, error.message);
            }
        });
    },
    validatePostId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield joi_1.default.object({
                    postId: joi_1.default.string().alphanum().min(24).required(),
                }).validateAsync(req.params);
                next();
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, error.message);
            }
        });
    },
    validateCommentId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield joi_1.default.object({
                    commentId: joi_1.default.string().alphanum().min(24).required(),
                }).validateAsync(req.params);
                next();
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, error.message);
            }
        });
    },
    validateFollowStartup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield joi_1.default.object({
                    startupId: joi_1.default.string().alphanum().min(24).max(24).required(),
                }).validateAsync(req.params);
                next();
            }
            catch (error) {
                console.error(error);
                (0, common_1.sendErrorResponse)(res, common_1.HTTP.BAD_REQUEST, error.message);
            }
        });
    },
};
