import { Get, Injectable } from '@nestjs/common';
import { PokeResponse } from './Interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/Adapters/axios.adapter';


@Injectable()
export class SeedService {
  

  constructor(

    @InjectModel(Pokemon.name)
      private readonly pokemonModel: Model<Pokemon>,

      private readonly http: AxiosAdapter,

  ){}

  async executeSeed(){

    await this.pokemonModel.deleteMany({}); 

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=700');

    const pokemontoInsert: {name: string , nro: number} [] = []; 

    data.results.forEach( ({name,url} ) => {
      const segments = url.split('/');
      const nro = +segments[segments.length - 2 ];

      //const pokemon = await this.pokemonModel.create({name,nro});
      pokemontoInsert.push({ name, nro });

    })

    await this.pokemonModel.insertMany(pokemontoInsert);

    return 'Seed Executed';
  }
}
