import express from 'express';
import { authRouter } from './resources/auth/index.js'
import { carta_vidaRouter } from './resources/carta_vida/index.js'
import { encontristaRouter } from './resources/encontrista/index.js'
 
export const restRouter = express.Router();
restRouter.use('/auth', authRouter);
restRouter.use('/carta_vida', carta_vidaRouter);
restRouter.use('/encontrista', encontristaRouter);

