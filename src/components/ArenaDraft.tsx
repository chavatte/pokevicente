import { useState } from "react";
import PokemonCardPreview from "./PokemonCardPreview";
import { GENERATIONS, fetchPokemonData } from "../services/pokeApi";
import type { PokemonPreviewData } from "../hooks/useArenaEngine";

const ALL_GENERATIONS = [
  { id: 0, name: "TODOS", start: 1, end: 1025, total: 1025 },
  ...GENERATIONS,
];

export default function ArenaDraft({ state, actions, onClose }: any) {
  const { coins, backpack, playerHand } = state;
  const { setPlayerHand, handleStartBattle } = actions;
  const [selectedGen, setSelectedGen] = useState<number>(0);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [previewData, setPreviewData] = useState<PokemonPreviewData | null>(
    null,
  );
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const handleOpenPreview = async (id: number) => {
    setPreviewId(id);
    setPreviewData(null);
    setIsLoadingPreview(true);
    try {
      const data = await fetchPokemonData(id);
      setPreviewData({
        id: data.id,
        name: data.name,
        hp: data.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0,
        attack:
          data.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0,
        defense:
          data.stats.find((s: any) => s.stat.name === "defense")?.base_stat ||
          0,
        types: data.types.map((t: any) => t.type.name),
      });
    } catch (error) {
      console.error("Erro ao carregar preview", error);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleToggleEquip = () => {
    if (!previewId) return;
    setPlayerHand((prev: number[]) => {
      if (prev.includes(previewId))
        return prev.filter((id) => id !== previewId);
      if (prev.length < 3) return [...prev, previewId];
      alert(
        "Sua equipe já está cheia! Remova um Pokémon antes de adicionar outro.",
      );
      return prev;
    });
    setPreviewId(null);
  };

  const handleRandomDeck = () => {
    if (backpack.length < 3) {
      alert("Você precisa de pelo menos 3 Pokémons na mochila!");
      return;
    }
    const shuffled = [...backpack].sort(() => 0.5 - Math.random());
    setPlayerHand(shuffled.slice(0, 3));
  };

  const filteredBackpack = backpack.filter((id: number) => {
    if (selectedGen === 0) return true;
    const gen = GENERATIONS.find((g) => g.id === selectedGen);
    return gen ? id >= gen.start && id <= gen.end : true;
  });

  return (
    <div className="flex flex-col items-center w-full max-w-md h-full pt-4 px-4 pb-24 overflow-y-hidden relative animate-fade-in-up">
      <div className="relative flex flex-col items-center justify-center w-full mb-4 shrink-0 pt-2">
        <button
          onClick={onClose}
          className="absolute left-0 top-0 text-slate-400 hover:text-white font-pokemon-gb text-2xl active:scale-90 px-2 z-50 cursor-pointer"
        >
          &lt;
        </button>
        <div className="bg-slate-800 border-2 border-yellow-500 text-yellow-400 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] z-40 flex items-center justify-center font-pokemon-gb text-[12px] whitespace-nowrap mb-4">
          💰 MasterCoins: {coins}
        </div>
        <h2 className="text-2xl text-yellow-400 font-pokemon-solid text-center drop-shadow-md">
          Montar Equipe
        </h2>
      </div>
      <p className="text-cyan-300 font-pokemon-gb text-[9px] text-center mb-4 opacity-80 shrink-0">
        Filtre e selecione seus combatentes
      </p>
      <div className="flex gap-3 mb-4 shrink-0">
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${playerHand[slot] ? "bg-cyan-900/50 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : "bg-slate-800 border-slate-600 border-dashed opacity-50"}`}
          >
            {playerHand[slot] ? (
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${playerHand[slot]}.png`}
                alt="Slot"
                className="w-14 h-14 object-contain animate-bounce-slow"
              />
            ) : (
              <span className="text-slate-500 font-pokemon-gb text-[10px]">
                ?
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex w-full gap-4 mb-4 shrink-0 px-2">
        <button
          onClick={handleRandomDeck}
          className="flex-1 bg-slate-800 border-2 border-purple-500 text-purple-300 font-pokemon-gb text-[9px] py-3 rounded-xl hover:bg-purple-900/50 transition-all active:scale-95 shadow-md"
        >
          🎲 ALEATÓRIO
        </button>
        <button
          onClick={() => setPlayerHand([])}
          className="flex-1 bg-slate-800 border-2 border-red-500 text-red-300 font-pokemon-gb text-[9px] py-3 rounded-xl hover:bg-red-900/50 transition-all active:scale-95 shadow-md"
        >
          🧹 LIMPAR
        </button>
      </div>
      <div className="w-full overflow-x-auto custom-scrollbar flex gap-2 pb-3 mb-2 shrink-0 px-1 snap-x">
        {ALL_GENERATIONS.map((gen) => (
          <button
            key={gen.id}
            onClick={() => setSelectedGen(gen.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-pokemon-gb text-[8px] snap-start transition-all ${selectedGen === gen.id ? "bg-yellow-500 text-black shadow-[0_0_10px_rgba(234,179,8,0.6)] uppercase" : "bg-slate-800 text-slate-400 border border-slate-600 hover:bg-slate-700 uppercase"}`}
          >
            {gen.name}
          </button>
        ))}
      </div>
      {filteredBackpack.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10 opacity-70">
          <span className="text-4xl mb-4">🎒</span>
          <p className="text-white font-pokemon-gb text-[10px] text-center leading-relaxed">
            Nenhum Pokémon
            <br />
            nesta geração.
          </p>
        </div>
      ) : (
        <div className="w-full flex-1 overflow-y-auto pr-1 pb-16 custom-scrollbar">
          <div className="grid grid-cols-4 gap-2 auto-rows-max">
            {filteredBackpack.map((id: number) => {
              const isSelected = playerHand.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => handleOpenPreview(id)}
                  className={`relative aspect-square w-full rounded-lg border-2 transition-all flex items-center justify-center bg-slate-800/80 overflow-hidden ${isSelected ? "border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" : "border-slate-600 hover:border-slate-400"}`}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                    alt={`Pokemon ${id}`}
                    className={`w-10/12 h-10/12 object-contain ${isSelected ? "opacity-100" : "opacity-60"}`}
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-cyan-500/20 pointer-events-none"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="absolute bottom-6 w-full px-4 left-0">
        <button
          onClick={handleStartBattle}
          disabled={playerHand.length !== 3}
          className={`w-full py-4 rounded-2xl font-pokemon-gb text-[11px] border-b-4 transition-all duration-300 shadow-xl ${
            playerHand.length === 3
              ? coins >= 50
                ? "bg-green-600 border-green-800 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95 hover:bg-green-500"
                : "bg-red-600 border-red-800 text-white opacity-90"
              : "bg-slate-700 border-slate-900 text-slate-500 cursor-not-allowed opacity-90"
          }`}
        >
          {playerHand.length !== 3
            ? `FALTAM ${3 - playerHand.length} POKÉMONS`
            : coins >= 50
              ? "PAGAR 50 🪙 E LUTAR ⚔️"
              : "MOEDAS INSUFICIENTES"}
        </button>
      </div>
      {previewId !== null && (
        <PokemonCardPreview
          data={previewData}
          isLoading={isLoadingPreview}
          onClose={() => setPreviewId(null)}
          actionLabel={
            playerHand.includes(previewId)
              ? "REMOVER DA EQUIPE"
              : playerHand.length >= 3
                ? "MÃO CHEIA"
                : "EQUIPAR CARTA"
          }
          onAction={handleToggleEquip}
          isActionDisabled={
            playerHand.length >= 3 && !playerHand.includes(previewId)
          }
          isDestructiveAction={playerHand.includes(previewId)}
        />
      )}
    </div>
  );
}
