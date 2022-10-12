import { Request, Response } from 'express';
import { getTimeStamp, HTTP, sendErrorResponse, sendResponse } from '../common';
import { Show } from './show.model';

export const getAllShows = async (req: Request, res: Response) => {
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
            query = { "date.endDate": { $lt: getTimeStamp() } };
        }
        const shows = await Show.find(query, {
            "participants.startUpId": 1, "participants.logoPath": 1,
            name: 1, date: 1, _id: 1, headerImgPath: 1
        }).skip(skip).limit(limit).lean();
        sendResponse(res, HTTP.OK, "", shows);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
    }
}

export const getShowById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const show = await Show.findById(id, { participants: 1, jury: 1, faq: 1, _id: 1 }).lean();
        sendResponse(res, HTTP.OK, "", show);
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, HTTP.SERVER_ERROR, "Internal server error");
    }
}