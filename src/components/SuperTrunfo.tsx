import { useState } from "react";
import { fetchPokemonData, GENERATIONS } from "../services/pokeApi";
import type { Pokemon } from "../types/pokemon";
import { playRetroSound } from "../utils/audio";

const getLocalData = () => {
  const newSave = localStorage.getItem("vicente-save");
  if (newSave) return JSON.parse(newSave);
  const oldSave = localStorage.getItem("vicente-pokedex");
  const migrated = { pokedex: oldSave ? JSON.parse(oldSave) : [], score: 0 };
  localStorage.setItem("vicente-save", JSON.stringify(migrated));
  return migrated;
};

type StatName =
  "hp" | "attack" | "defense" | "special-attack" | "special-defense" | "speed";

export default function SuperTrunfo() {
  const [saveData, setSaveData] = useState(getLocalData());
  const [playerPoke, setPlayerPoke] = useState<Pokemon | null>(null);
  const [cpuPoke, setCpuPoke] = useState<Pokemon | null>(null);
  const [step, setStep] = useState<"select" | "loading" | "battle">("select");
  const [chosenStat, setChosenStat] = useState<StatName | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);

  const handleSelectFighter = async (id: number) => {
    if (saveData.score <= 0) return;

    setStep("loading");
    setChosenStat(null);
    setResult(null);

    try {
      const p1 = await fetchPokemonData(id);

      const currentGen =
        GENERATIONS.find((gen) => {
          const caughtInGen = saveData.pokedex.filter(
            (cid: number) => cid >= gen.start && cid <= gen.end,
          ).length;
          return caughtInGen < gen.total;
        }) || GENERATIONS[GENERATIONS.length - 1];

      const maxUnlockedId = currentGen.end;
      let cpuId = Math.floor(Math.random() * maxUnlockedId) + 1;
      while (cpuId === id) {
        cpuId = Math.floor(Math.random() * maxUnlockedId) + 1;
      }

      const p2 = await fetchPokemonData(cpuId);

      setPlayerPoke(p1);
      setCpuPoke(p2);
      setStep("battle");
    } catch (error) {
      console.error(error);
      setStep("select");
    }
  };

  const handleBattle = () => {
    if (!playerPoke || !cpuPoke) return;

    const stats: StatName[] = [
      "hp",
      "attack",
      "defense",
      "special-attack",
      "special-defense",
      "speed",
    ];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];
    setChosenStat(randomStat);
    const pVal =
      playerPoke.stats.find((s) => s.stat.name === randomStat)?.base_stat || 0;
    const cVal =
      cpuPoke.stats.find((s) => s.stat.name === randomStat)?.base_stat || 0;

    let newScore = saveData.score;

    if (pVal > cVal) {
      setResult("win");
      newScore += 20;
      playRetroSound("success");
    } else if (cVal > pVal) {
      setResult("lose");
      newScore = Math.max(0, newScore - 15);
      playRetroSound("error");
    } else {
      setResult("draw");
    }

    const newSave = { ...saveData, score: newScore };
    setSaveData(newSave);
    localStorage.setItem("vicente-save", JSON.stringify(newSave));
  };

  const getStatLabel = (stat: StatName) => {
    const labels: Record<StatName, string> = {
      hp: "Vida (HP)",
      attack: "Ataque",
      defense: "Defesa",
      "special-attack": "Atq. Especial",
      "special-defense": "Def. Especial",
      speed: "Velocidade",
    };
    return labels[stat];
  };

  if (step === "loading") {
    return (
      <div className="text-white text-xl animate-pulse font-pokemon-gb mt-10">
        Entrando na Arena...
      </div>
    );
  }

  if (step === "select") {
    return (
      <div className="flex flex-col items-center w-full max-w-md pt-6 px-4 pb-20 overflow-y-auto">
        <h2 className="text-3xl text-yellow-400 font-pokemon-solid text-center mb-2 drop-shadow-md">
          Super Trunfo
        </h2>
        <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl py-2 px-4 mb-4 shadow-md font-pokemon-gb text-[12px] text-yellow-400">
          💰 MasterCoins: {saveData.score}
        </div>
        <p className="text-white font-pokemon-gb text-[12px] mb-6 text-center leading-relaxed">
          {saveData.score > 0
            ? "Escolha um lutador da sua mochila!"
            : "Você está sem moedas para apostar!"}
        </p>
        <div className="grid grid-cols-3 gap-3 w-full">
          {saveData.pokedex.length === 0 ? (
            <div className="col-span-3 text-center text-slate-500 font-pokemon-gb text-[10px] mt-10">
              Mochila vazia. Capture antes de lutar!
            </div>
          ) : saveData.score <= 0 ? (
            <div className="col-span-3 flex flex-col items-center justify-center bg-red-900/40 border-2 border-red-600 rounded-2xl p-6 mt-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <span className="text-4xl mb-4 animate-bounce">💸</span>
              <p className="text-red-200 font-pokemon-gb text-[10px] leading-relaxed text-center">
                Suas MasterCoins acabaram! Vá jogar{" "}
                <strong className="text-yellow-400">"Quem é esse?"</strong> para
                conseguir ganhar mais moedas e voltar para a Arena.
              </p>
            </div>
          ) : (
            saveData.pokedex.map((id: number) => (
              <button
                key={id}
                onClick={() => handleSelectFighter(id)}
                className="bg-slate-800 border-2 border-slate-600 rounded-xl p-2 active:scale-95 transition-transform hover:border-red-500"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}
                  alt="Pokémon"
                  className="w-16 h-16 object-contain mx-auto drop-shadow-md"
                />
                <span className="text-slate-400 font-pokemon-gb text-[8px] mt-1 block">
                  #{String(id).padStart(3, "0")}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-md px-4">
      <div className="w-full flex justify-between items-center mb-6 mt-4">
        <h2 className="text-3xl text-red-500 font-pokemon-solid drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          ARENA
        </h2>
        <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl py-2 px-4 shadow-md font-pokemon-gb text-[12px] text-yellow-400">
          💰 MasterCoins: {saveData.score}
        </div>
      </div>
      <div className="w-full flex justify-between items-center bg-slate-800/80 rounded-3xl p-4 border-4 border-slate-700 shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 to-transparent"></div>
        <div className="flex flex-col items-center w-5/12 z-10">
          <span className="text-green-400 font-pokemon-gb text-[10px] mb-2">
            VOCÊ
          </span>
          <img
            src={playerPoke?.sprites.other["official-artwork"].front_default}
            alt="Player"
            className="w-24 h-24 drop-shadow-lg"
          />
          <span className="text-white font-bold capitalize text-xs mt-2 text-center">
            {playerPoke?.name}
          </span>
        </div>
        <span className="text-2xl font-pokemon-solid text-yellow-400 z-10 drop-shadow-md">
          VS
        </span>
        <div className="flex flex-col items-center w-5/12 z-10">
          <span className="text-red-400 font-pokemon-gb text-[10px] mb-2">
            CPU
          </span>
          <img
            src={cpuPoke?.sprites.other["official-artwork"].front_default}
            alt="CPU"
            className="w-24 h-24 drop-shadow-lg"
          />
          <span className="text-white font-bold capitalize text-xs mt-2 text-center">
            {cpuPoke?.name}
          </span>
        </div>
      </div>
      {!chosenStat ? (
        <button
          onClick={handleBattle}
          className="bg-red-600 text-white font-pokemon-gb text-xs px-8 py-5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] active:scale-95 transition-transform border-b-4 border-red-800 animate-pulse mt-4"
        >
          SORTEAR ATRIBUTO
        </button>
      ) : (
        <div className="w-full bg-slate-800 border-2 border-slate-600 rounded-2xl p-4 flex flex-col items-center shadow-lg mt-2">
          <span className="text-yellow-400 font-pokemon-gb text-[12px] mb-4 text-center">
            {getStatLabel(chosenStat)}
          </span>
          <div className="flex justify-between w-full px-6 mb-6">
            <span className="text-white font-pokemon-solid text-2xl drop-shadow-md">
              {
                playerPoke?.stats.find((s) => s.stat.name === chosenStat)
                  ?.base_stat
              }
            </span>
            <span className="text-white font-pokemon-solid text-2xl drop-shadow-md">
              {
                cpuPoke?.stats.find((s) => s.stat.name === chosenStat)
                  ?.base_stat
              }
            </span>
          </div>
          <div
            className={`text-xl font-pokemon-solid drop-shadow-md px-6 py-3 rounded-xl border-2 uppercase animate-bounce ${
              result === "win"
                ? "bg-green-600/30 border-green-500 text-green-400"
                : result === "lose"
                  ? "bg-red-600/30 border-red-500 text-red-400"
                  : "bg-yellow-600/30 border-yellow-500 text-yellow-400"
            }`}
          >
            {result === "win"
              ? "VOCÊ VENCEU! (+20 🪙)"
              : result === "lose"
                ? "CPU VENCEU! (-15 🪙)"
                : "EMPATE!"}
          </div>
          <button
            onClick={() => setStep("select")}
            className="mt-6 bg-slate-600 hover:bg-slate-500 text-white font-pokemon-gb text-[10px] px-6 py-3 rounded-full border-b-4 border-slate-800 active:scale-95 transition-all"
          >
            VOLTAR PRA MOCHILA
          </button>
        </div>
      )}
    </div>
  );
}
