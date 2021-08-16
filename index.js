import express from 'express';
import cors from 'cors';
import pokeRouter from './routes/pokeRouter.js';
import gameRouter from './routes/gameRouter.js';
import authRouter from './routes/authRouter.js';
import 'dotenv/config.js';
import errorHandler from './middlewares/errorHandler.js';
import './db/mongooseClient.js';

const app=express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    const morgan = await import('morgan');
    app.use(morgan.default('dev'));
};

app.use(cors({origin: process.env.CORS_ORIGIN}));

app.use(express.json());
app.use('/pokemon',pokeRouter);
app.use('/game',gameRouter);
app.use('/auth',authRouter);
app.all('*',(req,res)=>res.status(404).json({error:'Not found'}));
app.use(errorHandler);
app.listen(port,()=>console.log(`Server is listening port ${port}`));
  