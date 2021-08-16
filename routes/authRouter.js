import { Router } from "express";
import {signIn,signUp,showUserInfo} from '../controllers/auth.js';
import verifyUser from "../middlewares/verifyUser.js";
const authRouter = Router();

authRouter.post('/signin',signIn);
authRouter.post('/signup',signUp);
authRouter.get('/user',verifyUser,showUserInfo);

export default authRouter