import express from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { signUpSchema } from '../utils/schema.js';
import { signUp } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post("/sign-up", validateRequest(signUpSchema), signUp);

export default authRoutes;