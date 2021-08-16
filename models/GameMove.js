import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const gameMoveSchema = new Schema({
    gameId: {type:Schema.Types.ObjectId,required:true},
    moveNumer: {type:Number,required:true},
    playerId: {type:Schema.Types.ObjectId, ref:"User" },
    nextPlayer: {type:Schema.Types.ObjectId, ref:"User" },
    points: {type:Number,required:true},
});

export default model('GameMove',gameMoveSchema)
