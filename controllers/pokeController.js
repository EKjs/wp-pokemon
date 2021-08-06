import { pokedex } from '../data/pokedex.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';

export const getAllPokemons = asyncHandler(async (req,res) => {
    res.status(200).json(pokedex)
});

export const getPokemon = asyncHandler(async (req,res) => {
    const id = parseInt(req.params.id);
    if (!id || isNaN(id))throw new ErrorResponse('You should provide a correct ID',400);
    const reqPokemon = pokedex.find(v=>v.id===id);
    if (!reqPokemon)throw new ErrorResponse(`Pokemon with ID ${id} not found`,404);
    res.status(200).json(reqPokemon);
});

export const getPokemonInfo = asyncHandler(async (req,res) => {
    const id = parseInt(req.params.id);
    const {info} = req.params;
    if (!id || isNaN(id))throw new ErrorResponse('You should provide a correct ID',400);
    const reqPokemon = pokedex.find(v=>v.id===id);
    if (!reqPokemon.hasOwnProperty(info))throw new ErrorResponse('Incorrect info value',400);
    res.status(200).json(reqPokemon[info]);
});