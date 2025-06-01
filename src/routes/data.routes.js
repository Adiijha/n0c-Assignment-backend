import express from 'express';
import {Router} from 'express';
import { getAverageData } from '../controllers/data.controller.js';

const router = Router();

router.get('/average', getAverageData);

export default router;
