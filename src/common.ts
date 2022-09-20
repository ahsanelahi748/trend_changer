import { Response } from 'express';

export enum HTTP {
    BAD_REQUEST = 400,
    SERVER_ERROR = 500,
    OK = 200
}

export const sendResponse = (res: Response, code: number, message: string, data: any) => {
    let _message = message;
    if (_message === "") {
        message = getMessageFromCode(code);
    }
    res.status(code).send({ data, message, error: false });
}

export const sendErrorResponse = (res: Response, code: number, message: string) => {
    let _message = message;
    if (_message === "") {
        message = getMessageFromCode(code);
    }
    res.status(code).send({ data: {}, message, error: true });
}

export const getTimeStamp = (): number => {
    return Math.floor(new Date().getTime() / 1000.0);
}

const getMessageFromCode = (code: number): string => {
    if (code === 200) {
        return "Success";
    }
    if (code === 400) {
        return "Bad request";
    }
    if (code === 500) {
        return "Internal server error";
    }
    return "unknown error"
}