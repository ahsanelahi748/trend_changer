"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyFollower = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../common");
const schema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    companyId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Number,
        required: true,
        default: common_1.getTimeStamp
    }
});
const CompanyFollower = mongoose_1.default.model("companyFollowers", schema);
exports.CompanyFollower = CompanyFollower;
