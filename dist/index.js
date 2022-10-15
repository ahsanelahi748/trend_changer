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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const feed_router_1 = require("./src/feed/feed.router");
const show_router_1 = require("./src/show/show.router");
const common_1 = require("./src/common");
// instantiate
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
// global middlwares
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev")); // for logging
// route handlers
app.use("/api/shows", show_router_1.ShowRouter);
app.use("/api/feed", feed_router_1.FeedRouter);
app.get('/', (_, res) => {
    res.send('Hello World!');
});
// global error handler
app.use((error, req, res, _) => {
    try {
        if (error.message.includes("invalid file type")) {
            (0, common_1.sendErrorResponse)(res, 400, "Unsupported file type");
            return;
        }
        (0, common_1.sendErrorResponse)(res, 500, "Internal server error");
    }
    catch (error) {
        (0, common_1.sendErrorResponse)(res, 500, "Internal server error");
    }
});
// boot app
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        dotenv_1.default.config();
        const url = (_a = process.env.DB_URL) !== null && _a !== void 0 ? _a : "";
        yield mongoose_1.default.connect(url);
        console.log("DB connected");
        app.listen(port, () => console.log(`Show service listening on port ${port}!`));
    }
    catch (error) {
        console.error(error);
        console.error("Could not connnect to show db");
    }
}))();
