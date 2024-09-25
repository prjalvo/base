import express from 'express';
import carta_vidaController from './carta_vida.controller.js';
import { sanitize } from '../../../middleware/sanitizer.js';
import { jwtStrategy } from '../../../middleware/strategy.js';
import { validateBody, schemas } from '../../../middleware/validator.js';


export const carta_vidaRouter = express.Router();
carta_vidaRouter.route('/create').post(carta_vidaController.index);
carta_vidaRouter.route('/delete').delete(sanitize(),jwtStrategy,carta_vidaController.getcartaDelete);
carta_vidaRouter.route('/update').post(jwtStrategy,carta_vidaController.getcartaUpdate);
carta_vidaRouter.route('/updateall').post(jwtStrategy,carta_vidaController.getcartaUpdateAll);
carta_vidaRouter.route('/getCartaById').get(carta_vidaController.getCartaListById);
carta_vidaRouter.route('/list').get(carta_vidaController.List);
