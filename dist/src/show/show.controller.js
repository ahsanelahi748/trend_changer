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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShowById = exports.getAllShows = void 0;
const common_1 = require("../common");
const show_model_1 = require("./show.model");
const getAllShows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, onlyPastShows } = req.query;
        let _page;
        const limit = 10;
        let skip = 0;
        if (!page || Number(page) < 1) {
            _page = 1;
            skip = (_page - 1) * limit;
        }
        let query = {};
        if (onlyPastShows) {
            query = { "date.endDate": { $lt: (0, common_1.getTimeStamp)() } };
        }
        const shows = yield show_model_1.Show.find(query, {
            "participants.startUpId": 1, "participants.logoPath": 1,
            name: 1, date: 1, _id: 1, headerImgPath: 1
        }).skip(skip).limit(limit).lean();
        (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", shows);
    }
    catch (error) {
        console.error(error);
        (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
    }
});
exports.getAllShows = getAllShows;
const getShowById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const show = yield show_model_1.Show.findById(id, { participants: 1, jury: 1, faq: 1, _id: 1 }).lean();
        (0, common_1.sendResponse)(res, common_1.HTTP.OK, "", show);
    }
    catch (error) {
        console.error(error);
        (0, common_1.sendErrorResponse)(res, common_1.HTTP.SERVER_ERROR, "Internal server error");
    }
});
exports.getShowById = getShowById;
