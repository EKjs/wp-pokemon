import { Router } from "express";
import {getAllPokemons,getPokemon,getPokemonInfo} from '../controllers/pokeController.js';
const pokeRouter = Router();

pokeRouter.get('/',getAllPokemons);
pokeRouter.get('/:id',getPokemon);
pokeRouter.get('/:id/:info',getPokemonInfo);

export default pokeRouter;