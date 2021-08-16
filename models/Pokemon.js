import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const pokemonSchema = new Schema({
    name: {
        english:{type:String},
        japanese:{type:String},
        chinese:{type:String},
        french:{type:String},
    },
    type: [{type:String}],
    base: {
        "HP":{type:Number},
        "Attack":{type:Number},
        "Defense":{type:Number},
        "SpAttack":{type:Number},
        "SpDefense":{type:Number},
        "Speed":{type:Number},
    }
});

pokemonSchema.virtual('nameEng').get(function () {
    return this.name.english;
  })


export default model('Pokemon',pokemonSchema)
