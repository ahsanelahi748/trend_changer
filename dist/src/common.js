"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeStamp = exports.sendErrorResponse = exports.sendResponse = exports.HTTP = exports.USER_IMAGE_PATH = void 0;
exports.USER_IMAGE_PATH = "/tmp/";
var HTTP;
(function (HTTP) {
    HTTP[HTTP["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP[HTTP["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTP[HTTP["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTP[HTTP["SERVER_ERROR"] = 500] = "SERVER_ERROR";
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 200] = "CREATED";
})(HTTP = exports.HTTP || (exports.HTTP = {}));
const sendResponse = (res, code, message, data) => {
    let _message = message;
    if (_message === "") {
        message = getMessageFromCode(code);
    }
    res.status(code).send({ data, message, error: false });
};
exports.sendResponse = sendResponse;
const sendErrorResponse = (res, code, message) => {
    let _message = message;
    if (_message === "") {
        message = getMessageFromCode(code);
    }
    res.status(code).send({ data: {}, message, error: true });
};
exports.sendErrorResponse = sendErrorResponse;
const getTimeStamp = () => {
    return Math.floor(new Date().getTime() / 1000.0);
};
exports.getTimeStamp = getTimeStamp;
const getMessageFromCode = (code) => {
    if (code === 200) {
        return "Success";
    }
    if (code === 400) {
        return "Bad request";
    }
    if (code === 500) {
        return "Internal server error";
    }
    return "unknown error";
};
