import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const activeGameSchema = new Schema({
    playerOne: {type:Schema.Types.ObjectId, ref:"User" },
    playerTwo: {type:Schema.Types.ObjectId, ref:"User" },
    pokemonOne: { type:Schema.Types.ObjectId, ref:"Pokemon" },
    pokemonTwo: { type:Schema.Types.ObjectId, ref:"Pokemon" },
    gameInProgress: { type:Boolean,default:false }, //No moves yet = false
    gameIsOver: { type:Boolean,default:false },
});

export default model('ActiveGame',activeGameSchema)