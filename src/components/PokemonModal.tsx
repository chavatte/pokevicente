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
        <div className="text-yellow-400 font-pokemon-gb text-xs animate-pulse">
          Acessando Pokedex...
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 w-full max-w-sm rounded-3xl border-4 border-slate-600 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-32 bg-slate-700 flex justify-center items-end rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-slate-400 hover:text-white font-pokemon-gb text-lg active:scale-90"
          >
            X
          </button>
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="w-44 h-44 object-contain translate-y-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
          />
        </div>
        <div className="pt-16 pb-6 px-6 flex flex-col items-center max-h-[60vh] overflow-y-auto">
          <h3 className="text-3xl text-yellow-400 font-pokemon-solid capitalize drop-shadow-md mb-3">
            {pokemon.name}
          </h3>
          <div className="flex gap-2 mb-6">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`text-white text-[9px] font-pokemon-gb px-3 py-1.5 rounded-full shadow-md border border-white/20 uppercase ${typeColors[t.type.name] || "bg-slate-500"}`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
          <div className="w-full space-y-4 px-2 mb-6">
            {pokemon.stats.map((s) => {
              const statName = s.stat.name.replace("special-", "sp. ");
              const percentage = Math.min((s.base_stat / 150) * 100, 100);

              return (
                <div
                  key={s.stat.name}
                  className="flex items-center text-[9px] font-pokemon-gb"
                >
                  <span className="w-[70px] text-slate-400 uppercase truncate">
                    {statName}
                  </span>
                  <span className="w-8 text-right text-white mr-3">
                    {s.base_stat}
                  </span>
                  <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
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
            <div className="w-full pt-4 border-t-2 border-slate-700 border-dashed flex flex-col items-center">
              <span className="text-slate-400 font-pokemon-gb text-[8px] mb-4">
                Evoluções
              </span>
              <div className="flex items-center justify-center gap-1 w-full">
                {evolutions.map((evo, index) => (
                  <div key={evo.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                        alt={evo.name}
                        className={`w-14 h-14 object-contain transition-all ${evo.id === id ? "scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "opacity-50 grayscale"}`}
                      />
                      <span
                        className={`text-[7px] font-pokemon-gb mt-1 capitalize ${evo.id === id ? "text-white" : "text-slate-500"}`}
                      >
                        {evo.name}
                      </span>
                    </div>
                    {index < evolutions.length - 1 && (
                      <span className="text-slate-600 text-[10px] mx-1">▶</span>
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

// import { useState, useEffect } from "react";
// import { fetchPokemonData } from "../services/pokeApi";
// import type { Pokemon } from "../types/pokemon";

// type Props = {
//   id: number;
//   onClose: () => void;
// };

// const typeColors: Record<string, string> = {
//   normal: "bg-gray-400",
//   fire: "bg-red-500",
//   water: "bg-blue-500",
//   grass: "bg-green-500",
//   electric: "bg-yellow-400",
//   ice: "bg-cyan-300",
//   fighting: "bg-orange-600",
//   poison: "bg-purple-500",
//   ground: "bg-yellow-600",
//   flying: "bg-indigo-300",
//   psychic: "bg-pink-500",
//   bug: "bg-lime-500",
//   rock: "bg-yellow-700",
//   ghost: "bg-indigo-700",
//   dragon: "bg-indigo-600",
//   dark: "bg-gray-800",
//   steel: "bg-gray-500",
//   fairy: "bg-pink-400",
// };

// export default function PokemonModal({ id, onClose }: Props) {
//   const [pokemon, setPokemon] = useState<Pokemon | null>(null);

//   useEffect(() => {
//     fetchPokemonData(id).then(setPokemon).catch(console.error);
//   }, [id]);

//   if (!pokemon) {
//     return (
//       <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
//         <div className="text-yellow-400 font-pokemon-gb text-xs animate-pulse">
//           Carregando Dados...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4"
//       onClick={onClose}
//     >
//       <div
//         className="bg-slate-800 w-full max-w-sm rounded-3xl border-4 border-slate-600 shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden relative animate-fade-in-up"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative h-32 bg-slate-700 flex justify-center items-end rounded-t-2xl">
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-4 text-slate-400 hover:text-white font-pokemon-gb text-lg active:scale-90"
//           >
//             X
//           </button>
//           <img
//             src={pokemon.sprites.other["official-artwork"].front_default}
//             alt={pokemon.name}
//             className="w-44 h-44 object-contain translate-y-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
//           />
//         </div>
//         <div className="pt-16 pb-8 px-6 flex flex-col items-center">
//           <h3 className="text-3xl text-yellow-400 font-pokemon-solid capitalize drop-shadow-md mb-3">
//             {pokemon.name}
//           </h3>
//           <div className="flex gap-2 mb-8">
//             {pokemon.types.map((t) => (
//               <span
//                 key={t.type.name}
//                 className={`text-white text-[9px] font-pokemon-gb px-3 py-1.5 rounded-full shadow-md border border-white/20 uppercase ${typeColors[t.type.name] || "bg-slate-500"}`}
//               >
//                 {t.type.name}
//               </span>
//             ))}
//           </div>
//           <div className="w-full space-y-4 px-2">
//             {pokemon.stats.map((s) => {
//               const statName = s.stat.name.replace("special-", "sp. ");
//               const percentage = Math.min((s.base_stat / 150) * 100, 100);

//               return (
//                 <div
//                   key={s.stat.name}
//                   className="flex items-center text-[9px] font-pokemon-gb"
//                 >
//                   <span className="w-[70px] text-slate-400 uppercase truncate">
//                     {statName}
//                   </span>
//                   <span className="w-8 text-right text-white mr-3">
//                     {s.base_stat}
//                   </span>
//                   <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
//                     <div
//                       className={`h-full rounded-full transition-all duration-1000 ease-out ${
//                         percentage > 60
//                           ? "bg-green-500"
//                           : percentage > 30
//                             ? "bg-yellow-500"
//                             : "bg-red-500"
//                       }`}
//                       style={{ width: `${percentage}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
