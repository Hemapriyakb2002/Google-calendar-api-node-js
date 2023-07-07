import express from 'express';
import {createEvent} from '../controllers/calendar.js'; // Corrected import path
import {authUrl} from '../controllers/calendar.js';
import {auth2} from '../controllers/calendar.js';

const router = express.Router();

router.get('/google',authUrl)
router.get('/google/redirect',auth2)
router.get('/google/calendar', createEvent);

export default router;
