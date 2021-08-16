import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const FinishedGame = new Schema({
    gameId: {type:Schema.Types.ObjectId, ref:"ActiveGame"},
    winner: {type:Schema.Types.ObjectId, ref:"User" },
    looser: {type:Schema.Types.ObjectId, ref:"User" },
    winnerPokemon: { type:Schema.Types.ObjectId, ref:"Pokemon" },
    looserPokemon: { type:Schema.Types.ObjectId, ref:"Pokemon" },
    winnerPoints: {type:Number},
    looserPoints: {type:Number},
    totalMoves: {type:Number},
    date: {type:Date,default:Date.now}
});

export default model('FinishedGame',FinishedGame)