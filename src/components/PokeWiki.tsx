import { useState, useEffect, useMemo } from "react";
import PokemonModal from "./PokemonModal";

type BasicPokemon = { name: string; url: string; id: number };

export default function PokeWiki() {
  const [allPokemon, setAllPokemon] = useState<BasicPokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1025")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const formatted = data.results.map(
            (p: { name: string; url: string }) => {
              const urlParts = p.url.split("/");
              const id = parseInt(urlParts[urlParts.length - 2], 10);
              return { name: p.name, url: p.url, id };
            },
          );
          setAllPokemon(formatted);
          setIsLoading(false);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return allPokemon.slice(0, 50);
    return allPokemon
      .filter(
        (p) =>
          p.name.includes(searchTerm.toLowerCase()) ||
          p.id.toString() === searchTerm,
      )
      .slice(0, 50);
  }, [searchTerm, allPokemon]);

  const getImageUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <div className="flex flex-col w-full max-w-md h-full pt-6 px-4 pb-20">
      <h2 className="text-3xl text-yellow-400 font-pokemon-solid text-center mb-6 drop-shadow-md">
        PokéWiki
      </h2>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Busque por nome ou número..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800 text-white font-pokemon-gb text-[10px] p-4 pr-10 rounded-2xl border-2 border-slate-600 focus:border-blue-500 focus:outline-none shadow-inner placeholder:text-slate-500 transition-all"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold"
          >
            X
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-white font-pokemon-gb text-[10px] animate-pulse mt-10">
          Carregando banco de dados...
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-1 scroll-smooth">
          {filteredPokemon.length === 0 ? (
            <div className="col-span-2 text-center text-slate-500 font-pokemon-gb text-[10px] mt-10">
              Nenhum Pokémon encontrado.
            </div>
          ) : (
            filteredPokemon.map((poke) => (
              <button
                key={poke.id}
                onClick={() => setSelectedPokemonId(poke.id)}
                className="bg-slate-800 border-2 border-slate-700 rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-transform hover:border-blue-500 group"
              >
                <span className="text-slate-500 font-pokemon-gb text-[8px] w-full text-left mb-1">
                  #{String(poke.id).padStart(3, "0")}
                </span>
                <img
                  src={getImageUrl(poke.id)}
                  alt={poke.name}
                  loading="lazy"
                  className="w-20 h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-white font-bold capitalize text-xs mt-2 truncate w-full text-center">
                  {poke.name}
                </span>
              </button>
            ))
          )}
        </div>
      )}
      {selectedPokemonId && (
        <PokemonModal
          id={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </div>
  );
}
