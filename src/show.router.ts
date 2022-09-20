import express, { Router } from 'express';
import { getAllShows, getShowById } from './show.controller';
import { showValidator } from './show.validator';

const ShowRouter: Router = express.Router();

ShowRouter.get("/", getAllShows);

ShowRouter.get("/:id", showValidator.validateGetShow, getShowById);

export { ShowRouter };