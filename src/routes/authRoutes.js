import express from 'express';
import { validateRequest } from '../middlewares/validateRequest.js';
import { signInSchema, signUpSchema } from '../utils/schema.js';
import { signIn, signUp } from '../controllers/authController.js';

const authRoutes = express.Router();

authRoutes.post("/sign-up", validateRequest(signUpSchema), signUp);
authRoutes.post("/sign-in", validateRequest(signInSchema), signIn);

export default authRoutes;