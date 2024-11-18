import express from 'express';
const router = express.Router();

import {sendEmail} from '../controllers/emailController.js'

router.post('/sendemail', sendEmail)

export default router