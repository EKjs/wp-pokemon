import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import ActiveGame from '../models/ActiveGame.js';
//import { pokedex } from './pokeController.js';
import Pokemon from '../models/Pokemon.js';
import GameMove from '../models/GameMove.js';
import FinishedGame from '../models/FinishedGame.js';
import User from '../models/User.js';

export const saveGameResults = asyncHandler(async (req, res) => {
/*     console.log(pokedex.length);
    console.log('begin');
    pokedex.forEach(pok => {
        Pokemon.create({name:pok.name,type:pok.type,base:pok.base})
    });
    console.log('end'); */
});

export const getLeaderBoard = asyncHandler(async (req, res) => {
    //const leaders2 = await FinishedGame.find().populate('winner')
    const leaders = await FinishedGame.aggregate([

        { "$group": { 
            "_id": '$winner', 
            "totalWins": { "$sum": 1 }
        }},

        { "$sort": { "totalWins": -1 } },

]); //.populate('_id')
//const res2 = await FinishedGame.populate(leaders,{path:'winner'});


await User.populate(leaders, {path: "_id", select:'-email'});
res.status(200).json(leaders)
});

export const findActiveGames = asyncHandler(async (req, res) => {
    const {_id:playerId} = req.user;
    const activeGames = await ActiveGame.find({$and:[{playerTwo:{$exists:false}},{pokemonTwo:{$exists:false}},{playerOne:{$ne:playerId}}]}).populate('playerOne').populate('pokemonOne');
    console.log(activeGames);
    res.status(200).json(activeGames)
});

export const createGame = asyncHandler(async (req, res) => {
    const {_id:playerId} = req.user;
    const {pokemonId} = req.body;
    if (!pokemonId) throw new ErrorResponse('PokemonId is required!',400);
    const newGame = await ActiveGame.create({playerOne:playerId,pokemonOne:pokemonId})
    res.status(201).json(newGame)
});

export const joinGame = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    if (!gameId) throw new ErrorResponse('gameId is required!',400);
    const {_id:playerId} = req.user;
    const {pokemonId} = req.body;
    if (!pokemonId) throw new ErrorResponse('PokemonId is required!',400);
    const gameIsActive = await ActiveGame.findById(gameId);
    if (gameIsActive.playerTwo || gameIsActive.pokemonTwo)throw new ErrorResponse('Game is already in progress',400);
    const joinedGame = await ActiveGame.updateOne({_id:gameId},{playerTwo:playerId,pokemonTwo:pokemonId});
    res.status(200).json(joinedGame)
});

export const gameInfo = asyncHandler(async (req, res) => {
    const { gameId } = req.params;
    if (!gameId) throw new ErrorResponse('gameId is required!',400);
    const curGame = await ActiveGame.findById(gameId).populate('playerOne','name').populate('pokemonOne').populate('playerTwo','name').populate('pokemonTwo');
    if (!curGame)throw new ErrorResponse('Game not found',404);
    console.log(curGame);
    res.status(200).json(curGame)
});

export const findMyGames = asyncHandler(async (req, res) => {
    const {_id:playerId} = req.user;
    console.log('findmygames',playerId);
    const myGames = await ActiveGame.find({$or:[{playerTwo:playerId},{playerOne:playerId}]}).populate('playerOne').populate('pokemonOne').populate('playerTwo').populate('pokemonTwo');
    console.log('myGames',myGames);
    if (!myGames) throw new ErrorResponse('You have no active games!',400);
    res.status(200).json(myGames)
});



export const makeMove = asyncHandler(async (req,res)=>{
    const {_id } = req.user;
    const userRolledDice = rollTheDice();
    const { gameId } = req.params;
    if (!gameId) throw new ErrorResponse('gameId is required!',400);
    //const moves = await GameMove.find({gameId:gameId}).sort({ moveNumer : -1});
    const curGame = await ActiveGame.findById(gameId);

    if (curGame.gameIsOver) throw new ErrorResponse(`Game with ID ${gameId} is over.`,400);

    if (!curGame.gameInProgress){ //if first move
        console.log('first move');
        if (String(_id)===String(curGame.playerOne)){ //if user is the one who created game
            //create 1st move
            const resp= await GameMove.create({
                gameId:gameId,
                moveNumer: 0,
                playerId:_id,
                nextPlayer:curGame.playerTwo,
                points:userRolledDice,
            });
            const updateGame = await ActiveGame.updateOne({_id:gameId},{gameInProgress:true}); //set game in progress so moves will be counted
            //console.log('updated',updateGame);
            return res.status(200).json({nextMove:curGame.playerTwo,pointsOne:userRolledDice,pointsTwo:0,rolled:userRolledDice})
        }else throw new ErrorResponse(`It is turn of a player with ID ${curGame.playerOne}`,400);
    };
    //if it is not the first move
    console.log('not the first move');
    const lastMove = await GameMove.find({gameId:gameId}).sort({ moveNumer : -1}).limit(1); //get last move + sort desc
    console.log('nextPlayer (this player)',lastMove[0].nextPlayer)
    if (String(_id)!==String(lastMove[0].nextPlayer))throw new ErrorResponse(`It is turn of a player with ID ${lastMove[0].nextPlayer}`,400);

    const nextMove = lastMove[0].playerId;//===curGame.playerOne ? curGame.playerTwo : curGame.playerOne; //find next player's id
    const resp= await GameMove.create({ //create new move 
        gameId:gameId,
        moveNumer: lastMove[0].moveNumer+1,
        playerId:_id,
        nextPlayer:nextMove,
        points:userRolledDice,
    });
    const moves = await GameMove.find({gameId:gameId}).sort({ moveNumer : -1}); //get all moves + sort desc

    const pointsPlayerOne = moves.reduce((a,c)=>{
        if (String(c.playerId)===String(curGame.playerOne))return a+c.points
        return a
    },0);
    const pointsPlayerTwo = moves.reduce((a,c)=>{
        if (String(c.playerId)===String(curGame.playerTwo))return a+c.points
        return a
    },0);
    if (Math.abs(pointsPlayerOne-pointsPlayerTwo)>9){
        const updGame = await ActiveGame.updateOne({_id:gameId},{gameIsOver:true});
        const totalMoves = await GameMove.count({gameId:gameId})
        let gameResults;
        if (pointsPlayerOne>pointsPlayerTwo){
            gameResults={
                gameId:gameId,
                winner:curGame.playerOne,
                looser:curGame.playerTwo,
                winnerPokemon:curGame.pokemonOne,
                looserPokemon:curGame.pokemonTwo,
                winnerPoints:pointsPlayerOne,
                looserPoints:pointsPlayerTwo,
                totalMoves:totalMoves,
            }
        }else{
            gameResults={
                gameId:gameId,
                winner:curGame.playerTwo,
                looser:curGame.playerOne,
                winnerPokemon:curGame.pokemonTwo,
                looserPokemon:curGame.pokemonOne,
                looserPoints:pointsPlayerOne,
                winnerPoints:pointsPlayerTwo,
                totalMoves:totalMoves,
            }
        }
        //console.log('curGame.playerOne',curGame.playerOne,pointsPlayerOne,'curGame.playerTwo',curGame.playerTwo,pointsPlayerTwo);
        const newFinishedGame = await FinishedGame.create(gameResults);
        const gameInfo = await FinishedGame.find({gameId:gameId}).populate('winner').populate('looser').populate('winnerPokemon').populate('looserPokemon');
        return res.status(200).json(gameInfo)
        //return res.status(200).json(gameResults);
    }

    res.status(200).json({nextMove:nextMove,pointsOne:pointsPlayerOne,pointsTwo:pointsPlayerTwo,rolled:userRolledDice})
});

export const getMoves = asyncHandler(async (req,res)=>{
    const { gameId } = req.params;
    if (!gameId) throw new ErrorResponse('gameId is required!',400);
    //const moves = await GameMove.find({gameId:gameId}).sort({ moveNumer : -1});
    const curGame = await ActiveGame.findById(gameId);

    if (curGame.gameIsOver){ //if game is over
        const gameInfo = await FinishedGame.find({gameId:gameId}).populate('winner').populate('looser').populate('winnerPokemon').populate('looserPokemon');
        return res.status(200).json(gameInfo)
        //throw new ErrorResponse(`Game with ID ${gameId} is over.`,400);
    };

    if (!curGame.gameInProgress){ //if first move
        const resp = {
            nextMove:curGame.playerOne,
            pointsOne:0,
            pointsTwo:0,
            rolled:0};
        return res.status(200).json(resp)
    };
    //if it is not the first move
    console.log('not the first move');
    const moves = await GameMove.find({gameId:gameId}).sort({ moveNumer : -1}); //get all moves + sort desc

    const pointsPlayerOne = moves.reduce((a,c)=>{
        if (String(c.playerId)===String(curGame.playerOne))return a+c.points
        return a
    },0);
    const pointsPlayerTwo = moves.reduce((a,c)=>{
        if (String(c.playerId)===String(curGame.playerTwo))return a+c.points
        return a
    },0);
    const resp = {
        nextMove:moves[0].nextPlayer,//moves[0].playerId,
        pointsOne:pointsPlayerOne,
        pointsTwo:pointsPlayerTwo,
        rolled:moves[0].points};
    res.status(200).json(resp)
});

const rollTheDice = () => {
    return Math.floor(Math.random()*6+1)
}

