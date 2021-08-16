import { Router } from "express"
import {saveGameResults,getLeaderBoard,findActiveGames, createGame, joinGame,findMyGames,getMoves,makeMove,gameInfo} from '../controllers/gameController.js';
import verifyUser from "../middlewares/verifyUser.js";

const gameRouter = Router();

gameRouter.get('/my',verifyUser,findMyGames);
gameRouter.get('/find',verifyUser,findActiveGames);
gameRouter.post('/create',verifyUser,createGame);
gameRouter.post('/join/:gameId',verifyUser,joinGame);
gameRouter.get('/getmoves/:gameId',verifyUser,getMoves);
gameRouter.get('/makemove/:gameId',verifyUser,makeMove);
gameRouter.get('/leaderboard',getLeaderBoard);
gameRouter.post('/save',saveGameResults);
gameRouter.get('/info/:gameId',gameInfo);


export default gameRouter;