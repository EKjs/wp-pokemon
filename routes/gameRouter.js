import { Router } from "express"
import {saveGameResults,getLeaderBoard} from '../controllers/gameController.js';

const gameRouter = Router();

gameRouter.get('/leaderboard',getLeaderBoard);
gameRouter.post('/save',saveGameResults);

export default gameRouter;