"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShowRouter = void 0;
const express_1 = __importDefault(require("express"));
const show_controller_1 = require("./show.controller");
const show_validator_1 = require("./show.validator");
const ShowRouter = express_1.default.Router();
exports.ShowRouter = ShowRouter;
ShowRouter.get("/", show_controller_1.getAllShows);
ShowRouter.get("/:id", show_validator_1.showValidator.validateGetShow, show_controller_1.getShowById);
