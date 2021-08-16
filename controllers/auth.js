import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from '../utils/ErrorResponse.js';

const generateToken = (data, secret) => jwt.sign(data, secret, { expiresIn: '1800s' });

export const signUp = asyncHandler(async (req,res)=>{
    const {name,email,password} = req.body;
    if (!name || !email || !password) throw new ErrorResponse('Name, email and password are required!',400);
    const userExists = await User.findOne({email});
    if (userExists) throw new ErrorResponse('User already exists',403);
    const pwdHash = await bcrypt.hash(password,10);
    const {_id:newUserId} = await User.create({name,email,password:pwdHash});
    const token = generateToken({userId:newUserId},process.env.JWT_SECRET);
    res.status(200).json({token})
});

export const signIn = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    if (!email || !password) throw new ErrorResponse('Email and password are required!',400);
    const userExists = await User.findOne({email}).select('+password');
    if (!userExists) throw new ErrorResponse('User does not exist', 404);
    const pwdHashesMatch = await bcrypt.compare(password,userExists.password);
    if (!pwdHashesMatch) throw new ErrorResponse('Password is not correct', 401);
    const token = generateToken({ userId: userExists._id }, process.env.JWT_SECRET);
    res.status(200).json({ token,userName:userExists.name,userId:userExists._id });
});

export const showUserInfo = asyncHandler(async (req,res)=>{
    res.status(200).json(req.user)
});