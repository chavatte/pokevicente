import { useState, useEffect } from "react";
import { fetchPokemonData } from "../services/pokeApi";
import { fetchEvolutionChain, type EvolutionNode } from "../services/pokeApi";
import type { Pokemon } from "../types/pokemon";

type Props = {
  id: number;
  onClose: () => void;
};

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-cyan-300",
  fighting: "bg-orange-600",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-yellow-700",
  ghost: "bg-indigo-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  fairy: "bg-pink-400",
};

export default function PokemonModal({ id, onClose }: Props) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [evolutions, setEvolutions] = useState<EvolutionNode[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchPokemonData(id), fetchEvolutionChain(id)])
      .then(([pokeData, evoData]) => {
        if (isMounted) {
          setPokemon(pokeData);
          setEvolutions(evoData);
        }
      })
      .catch(console.error);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (!pokemon) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
        <div className="text-yellow-400 font-pokemon-gb text-xs md:text-sm animate-pulse">
          Acessando Pokedex...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 w-full max-w-sm md:max-w-md lg:max-w-lg rounded-3xl border-4 border-slate-600 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 md:h-40 bg-slate-700 flex justify-center items-end rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 md:top-4 md:right-6 text-slate-400 hover:text-white font-pokemon-gb text-lg md:text-xl active:scale-90 transition-colors"
          >
            X
          </button>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-44 h-44 md:w-56 md:h-56 object-contain translate-y-12 md:translate-y-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
          />
        </div>
        <div className="pt-16 md:pt-24 pb-6 px-6 md:px-8 flex flex-col items-center max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar">
          <h3 className="text-3xl md:text-4xl text-yellow-400 font-pokemon-solid capitalize drop-shadow-md mb-3 md:mb-4">
            {pokemon.name}
          </h3>
          <div className="flex gap-2 md:gap-3 mb-6 md:mb-8">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`text-white text-[9px] md:text-[11px] font-pokemon-gb px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-md border border-white/20 uppercase ${typeColors[t.type.name] || "bg-slate-500"}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
          <div className="w-full space-y-4 md:space-y-5 px-2 md:px-4 mb-6 md:mb-8">
            {pokemon.stats.map((s) => {
              const statName = s.stat.name.replace("special-", "sp. ");
              const percentage = Math.min((s.base_stat / 150) * 100, 100);
              return (
                <div
                  key={s.stat.name}
                  className="flex items-center text-[9px] md:text-[11px] font-pokemon-gb"
                >
                  <span className="w-[70px] md:w-[90px] text-slate-400 uppercase truncate">
                    {statName}
                  </span>
                  <span className="w-8 md:w-10 text-right text-white mr-3 md:mr-4">
                    {s.base_stat}
                  </span>
                  <div className="flex-1 h-3 md:h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${
                        percentage > 60
                          ? "bg-green-500"
                          : percentage > 30
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          {evolutions.length > 1 && (
            <div className="w-full pt-4 md:pt-6 border-t-2 border-slate-700 border-dashed flex flex-col items-center">
              <span className="text-slate-400 font-pokemon-gb text-[8px] md:text-[10px] mb-4 md:mb-6">
                Evoluções
              </span>
              <div className="flex items-center justify-center gap-1 md:gap-3 w-full">
                {evolutions.map((evo, index) => (
                  <div key={evo.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                        alt={evo.name}
                        className={`w-14 h-14 md:w-20 md:h-20 object-contain transition-all ${evo.id === id ? "scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "opacity-50 grayscale hover:opacity-80 hover:grayscale-0"}`}
                      />
                      <span
                        className={`text-[7px] md:text-[9px] font-pokemon-gb mt-1 md:mt-2 capitalize ${evo.id === id ? "text-white" : "text-slate-500"}`}
                      >
                        {evo.name}
                      </span>
                    </div>
                    {index < evolutions.length - 1 && (
                      <span className="text-slate-600 text-[10px] md:text-[14px] mx-1 md:mx-2">
                        ▶
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
