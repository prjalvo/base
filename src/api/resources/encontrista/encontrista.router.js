import express from 'express';
import encontristaController from './encontrista.controller.js';
import { localStrategy , jwtStrategy} from '../../../middleware/strategy.js';
import { sanitize } from '../../../middleware/sanitizer.js';
import { validateBody, schemas } from '../../../middleware/validator.js';

export const encontristaRouter = express.Router();
encontristaRouter.route('/register').post(encontristaController.addencontrista);
encontristaRouter.route('/getAllencontristaList').get(sanitize(),encontristaController.getAllencontrista);
encontristaRouter.route('/getAllencontristaListById').post(sanitize(), encontristaController.getAllencontristaListById);
encontristaRouter.route('/update').post(encontristaController.encontristaUpdate);
encontristaRouter.route('/delete').post(sanitize(), jwtStrategy, encontristaController.deleteencontristaList);
encontristaRouter.route('/getAllencontristaCount').get(sanitize(),encontristaController.listEncontristaWithCartas);
encontristaRouter.route('/CartasSum').get(sanitize(),encontristaController.CartasSum);
