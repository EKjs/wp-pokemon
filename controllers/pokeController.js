import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import { promises as fs } from 'fs';
import Pokemon from '../models/Pokemon.js';

/* const readPokeDexData = async () =>{
    const pokedex = await fs.readFile('./data/pokedex2.json','utf-8');
    const result = await JSON.parse(pokedex);
    return result
}
export const pokedex = await readPokeDexData(); */

export const getAllPokemons = asyncHandler(async (req,res) => {
    const pokedex = await Pokemon.find();
    res.status(200).json(pokedex)
});

export const getPokemon = asyncHandler(async (req,res) => {
    const id = req.params.id;
    if (!id)throw new ErrorResponse('You should provide an ID',400);
    const reqPokemon = await Pokemon.findById(id);
    if (!reqPokemon)throw new ErrorResponse(`Pokemon with ID ${id} not found`,404);
    res.status(200).json(reqPokemon);
});

export const getPokemonInfo = asyncHandler(async (req,res) => {
    const id = req.params.id;
    if (!id)throw new ErrorResponse('You should provide an ID',400);
    const {info} = req.params;
    const reqPokemon = await Pokemon.findById(id);
    if (!reqPokemon)throw new ErrorResponse(`Pokemon with ID ${id} not found`,404);
    //if (!reqPokemon.hasOwnProperty(info))throw new ErrorResponse('Incorrect info value',400);
    res.status(200).json(reqPokemon[info]);
});