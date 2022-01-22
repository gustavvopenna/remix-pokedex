import { LoaderFunction, useLoaderData } from "remix";
import { PokemonsApiResponse } from "~/interfaces/Pokemon";

export let loader: LoaderFunction = async () => {
  let baseUrl = 'https://pokeapi.co/api/v2'

  let response = await fetch(`${baseUrl}/pokemon/`)
  let data = await response.json()

  // Todo: Find how to type this "item" thing
  let pokemonsPromises = data.results.map(async item => {
    const pokemon = await fetch(`${item.url}`)
    return pokemon.json()
  })
  const fullPokemons = await Promise.all(pokemonsPromises)
  
  return { pokemons: [...fullPokemons] }
}

export default function Index() {
  const { pokemons } = useLoaderData<PokemonsApiResponse>()
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {
          pokemons.map(pokemon => (
            <div key={pokemon.id} className="relative col-span-1 bg-slate-100 rounded-md p-4 overflow-hidden">
              <p className="text-slate-700 font-bold text-xl capitalize">{pokemon?.name}</p>
              <p className="text-slate-600 text-sm">Height: {pokemon?.height}</p>
              <img
                src={pokemon?.sprites?.front_default}
                alt={pokemon.name}
                className="absolute opacity-25 top-0 -right-8"
              />
            </div>
          ))
        }
      </div>
    </div>
  );
}
