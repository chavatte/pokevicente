import { useState, useEffect } from "react";
import { fetchGenerationList, GENERATIONS } from "../services/pokeApi";
import PokemonModal from "./PokemonModal";

const getLocalData = () => {
  const newSave = localStorage.getItem("vicente-save");
  if (newSave) return JSON.parse(newSave).pokedex;
  const oldSave = localStorage.getItem("vicente-pokedex");
  return oldSave ? JSON.parse(oldSave) : [];
};

export default function Pokedex() {
  const [activeTab, setActiveTab] = useState(GENERATIONS[0]);
  const [capturedIds] = useState<number[]>(getLocalData());
  const [allPokemon, setAllPokemon] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(
    null,
  );
  const caughtInActiveTab = capturedIds.filter(
    (id) => id >= activeTab.start && id <= activeTab.end,
  ).length;
  const isGenUnlocked = (genIndex: number) => {
    if (genIndex === 0) return true;
    const prevGen = GENERATIONS[genIndex - 1];
    const caughtInPrev = capturedIds.filter(
      (id) => id >= prevGen.start && id <= prevGen.end,
    ).length;
    return caughtInPrev === prevGen.total;
  };

  useEffect(() => {
    let isMounted = true;
    setAllPokemon([]);

    fetchGenerationList(activeTab.start, activeTab.total).then((list) => {
      if (isMounted) {
        const formatted = list.map((p, index) => ({
          id: activeTab.start + index,
          name: p.name,
        }));
        setAllPokemon(formatted);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const getImageUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <>
      <div className="w-full max-w-md flex flex-col h-full pt-6">
        <h2 className="text-3xl text-yellow-400 font-pokemon-solid text-center mb-2 drop-shadow-md shrink-0">
          Pokédex
        </h2>
        <div className="text-center text-green-400 font-pokemon-gb text-[10px] mb-4 tracking-widest shrink-0">
          CAPTURADOS: {caughtInActiveTab} / {activeTab.total}
        </div>
        <div
          className="flex overflow-x-auto gap-2 w-full px-4 mb-4 pb-2 shrink-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {GENERATIONS.map((gen, index) => {
            const unlocked = isGenUnlocked(index);
            const isActive = activeTab.id === gen.id;
            return (
              <button
                key={gen.id}
                onClick={() => unlocked && setActiveTab(gen)}
                className={`shrink-0 px-4 py-3 text-[9px] font-pokemon-gb rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-green-600 text-white shadow-md border-b-4 border-green-800"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                } ${!unlocked && "opacity-50 cursor-not-allowed"}`}
              >
                {!unlocked && <span className="text-sm">🔒</span>}{" "}
                {gen.name.toUpperCase()}
              </button>
            );
          })}
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3 overflow-y-auto pb-6 px-4 scroll-smooth">
          {allPokemon.length === 0 ? (
            <div className="col-span-3 text-center text-slate-500 font-pokemon-gb text-[10px] mt-10 animate-pulse">
              Abrindo mochila...
            </div>
          ) : (
            allPokemon.map((poke) => {
              const isCaptured = capturedIds.includes(poke.id);

              return (
                <div
                  key={poke.id}
                  onClick={() => isCaptured && setSelectedPokemonId(poke.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                    isCaptured
                      ? "bg-slate-700 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] cursor-pointer active:scale-95 hover:bg-slate-600"
                      : "bg-slate-800 border-slate-700 opacity-60 pointer-events-none"
                  }`}
                >
                  <span className="text-slate-400 font-pokemon-gb text-[8px] mb-2">
                    #{String(poke.id).padStart(3, "0")}
                  </span>
                  <img
                    src={getImageUrl(poke.id)}
                    alt={poke.name}
                    loading="lazy"
                    className={`w-16 h-16 object-contain drop-shadow-lg ${isCaptured ? "" : "brightness-0 opacity-40"}`}
                  />
                  <span
                    className={`text-[10px] font-bold capitalize mt-3 truncate w-full text-center ${isCaptured ? "text-white" : "text-slate-600"}`}
                  >
                    {isCaptured ? poke.name : "???"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
      {selectedPokemonId && (
        <PokemonModal
          id={selectedPokemonId}
          onClose={() => setSelectedPokemonId(null)}
        />
      )}
    </>
  );
}
