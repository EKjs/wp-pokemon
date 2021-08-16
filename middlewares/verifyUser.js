import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";

const verifyUser = asyncHandler(async (req,res,next)=>{
    const {authorization} = req.headers;
    if (!authorization)throw new ErrorResponse('Not authorized',401);
    if (!authorization.startsWith('Bearer ')) throw new ErrorResponse('No Bearer token is present', 400);
    const token = authorization.substring(7, authorization.length);
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const userExists = await User.findById(userId);
    if (!userExists) throw new ErrorResponse('User does not exist', 404);
    req.user = userExists;
    next();
});

export default verifyUser