import { useState } from "react";
import { fetchPokemonData, GENERATIONS } from "../services/pokeApi";
import type { Pokemon } from "../types/pokemon";
import { playRetroSound } from "../utils/audio";

export default function SuperTrunfo() {
  const [capturedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("vicente-pokedex");
    return saved ? JSON.parse(saved) : [];
  });

  const [step, setStep] = useState<"select" | "loading" | "battle">("select");
  const [playerPoke, setPlayerPoke] = useState<Pokemon | null>(null);
  const [cpuPoke, setCpuPoke] = useState<Pokemon | null>(null);
  const [chosenStat, setChosenStat] = useState<string | null>(null);
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const statNames: Record<string, string> = {
    hp: "Vida (HP)",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Atq. Especial",
    "special-defense": "Def. Especial",
    speed: "Velocidade",
  };

  const getImageUrl = (id: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  const handleSelectFighter = async (id: number) => {
    setStep("loading");
    setChosenStat(null);
    setResult(null);

    try {
      const p1 = await fetchPokemonData(id);
      const currentGen =
        GENERATIONS.find((gen) => {
          const caughtInGen = capturedIds.filter(
            (cid) => cid >= gen.start && cid <= gen.end,
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
    if (!playerPoke || !cpuPoke || isSpinning) return;

    setIsSpinning(true);
    playRetroSound("success");

    let spins = 0;
    const statsList = Object.keys(statNames);

    const interval = setInterval(() => {
      setChosenStat(statsList[Math.floor(Math.random() * statsList.length)]);
      spins++;

      if (spins > 10) {
        clearInterval(interval);

        const finalStat =
          statsList[Math.floor(Math.random() * statsList.length)];
        setChosenStat(finalStat);
        const pVal =
          playerPoke.stats.find((s) => s.stat.name === finalStat)?.base_stat ||
          0;
        const cVal =
          cpuPoke.stats.find((s) => s.stat.name === finalStat)?.base_stat || 0;

        if (pVal > cVal) {
          setResult("win");
          playRetroSound("success");
          if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else if (cVal > pVal) {
          setResult("lose");
          playRetroSound("error");
          if (navigator.vibrate) navigator.vibrate(200);
        } else {
          setResult("draw");
        }

        setIsSpinning(false);
      }
    }, 100);
  };

  const renderCard = (pokemon: Pokemon, isPlayer: boolean) => {
    const isWinner =
      (isPlayer && result === "win") || (!isPlayer && result === "lose");
    const statValue = chosenStat
      ? pokemon.stats.find((s) => s.stat.name === chosenStat)?.base_stat
      : "?";

    return (
      <div
        className={`relative flex items-center justify-between p-4 rounded-2xl border-4 transition-all duration-500 ${
          result
            ? isWinner
              ? "bg-green-700/80 border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)] scale-105 z-10"
              : "bg-slate-800 border-slate-700 opacity-50 grayscale"
            : isPlayer
              ? "bg-blue-800/80 border-blue-500"
              : "bg-red-800/80 border-red-500"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-white font-pokemon-gb text-[10px] mb-1">
            {isPlayer ? "SEU LUTADOR" : "RIVAL CPU"}
          </span>
          <span className="text-yellow-400 font-pokemon-solid text-xl capitalize drop-shadow-md">
            {pokemon.name}
          </span>

          <div className="mt-2 h-8">
            {chosenStat && !isSpinning && (
              <div className="bg-slate-900/50 px-3 py-1 rounded-lg border border-white/20 inline-block">
                <span className="text-white font-pokemon-gb text-[12px]">
                  {statValue}
                </span>
              </div>
            )}
          </div>
        </div>
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-24 h-24 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        />
      </div>
    );
  };

  if (capturedIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <span className="text-6xl mb-4">🪹</span>
        <h2 className="text-2xl text-yellow-400 font-pokemon-solid mb-4 drop-shadow-md">
          Mochila Vazia!
        </h2>
        <p className="text-white font-pokemon-gb text-[10px] leading-relaxed opacity-80">
          Você precisa capturar Pokémons no modo "Quem é esse Pokémon?" antes de
          vir batalhar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-md h-full px-4 pt-4 pb-6">
      <h2 className="text-3xl text-yellow-400 font-pokemon-solid text-center mb-4 drop-shadow-md">
        Super Trunfo
      </h2>
      {step === "select" && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <p className="text-green-400 font-pokemon-gb text-[10px] mb-4">
            Escolha seu lutador:
          </p>
          <div className="grid grid-cols-3 gap-3 w-full overflow-y-auto pb-20 max-h-[60vh] px-2">
            {capturedIds.map((id) => (
              <button
                key={id}
                onClick={() => handleSelectFighter(id)}
                className="bg-slate-800 border-2 border-slate-600 rounded-xl p-2 hover:bg-slate-700 hover:border-green-500 active:scale-95 transition-all shadow-md flex flex-col items-center justify-center h-24"
              >
                <img
                  src={getImageUrl(id)}
                  alt="Pokemon"
                  className="w-14 h-14 object-contain drop-shadow-md"
                />
                <span className="text-slate-400 font-pokemon-gb text-[8px] mt-2">
                  #{String(id).padStart(3, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {step === "loading" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white animate-pulse font-pokemon-gb text-xs">
            Preparando Arena...
          </div>
        </div>
      )}
      {step === "battle" && playerPoke && cpuPoke && (
        <div className="flex flex-col flex-1 justify-center gap-6 animate-fade-in-up">
          {renderCard(cpuPoke, false)}
          <div className="h-24 flex flex-col items-center justify-center relative">
            {!result ? (
              <button
                onClick={handleBattle}
                disabled={isSpinning}
                className={`bg-yellow-400 text-yellow-900 font-pokemon-gb text-[10px] px-6 py-4 rounded-full shadow-lg border-b-4 border-yellow-600 active:scale-95 transition-all z-20 ${
                  isSpinning
                    ? "animate-pulse scale-110 bg-white border-gray-300"
                    : "hover:bg-yellow-300 animate-bounce"
                }`}
              >
                {isSpinning
                  ? statNames[chosenStat || "hp"].toUpperCase()
                  : "SORTEAR ATRIBUTO!"}
              </button>
            ) : (
              <div className="flex flex-col items-center justify-center animate-fade-in-up z-20 bg-slate-900/95 p-4 rounded-2xl border-2 border-slate-700 w-full shadow-2xl">
                <span className="text-slate-400 font-pokemon-gb text-[8px] mb-2">
                  Atributo da Luta:
                </span>
                <span className="text-white font-pokemon-gb text-[12px] text-center mb-4 text-shadow-md">
                  {statNames[chosenStat!].toUpperCase()}
                </span>
                <button
                  onClick={() => setStep("select")}
                  className="bg-blue-600 text-white font-pokemon-gb text-[9px] px-6 py-3 rounded-xl shadow-lg border-b-4 border-blue-800 active:scale-95 hover:bg-blue-500"
                >
                  TROCAR LUTADOR
                </button>
              </div>
            )}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700 -z-10"></div>
          </div>
          {renderCard(playerPoke, true)}
        </div>
      )}
    </div>
  );
}
