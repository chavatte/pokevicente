import { useState, useEffect } from "react";
import {
  fetchPokemonData,
  fetchGenerationList,
  GENERATIONS,
} from "../services/pokeApi";
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

export default function WhosThatPokemon() {
  const [targetPokemon, setTargetPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState("Quem é esse Pokémon?");
  const [round, setRound] = useState(1);
  const [saveData, setSaveData] = useState(getLocalData());
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  const currentGen =
    GENERATIONS.find((gen) => {
      const caughtInGen = saveData.pokedex.filter(
        (id: number) => id >= gen.start && id <= gen.end,
      ).length;
      return caughtInGen < gen.total;
    }) || GENERATIONS[GENERATIONS.length - 1];

  const caughtInCurrentGen = saveData.pokedex.filter(
    (id: number) => id >= currentGen.start && id <= currentGen.end,
  ).length;

  useEffect(() => {
    let isMounted = true;
    const loadRound = async () => {
      setIsRevealed(false);
      setMessage("Quem é esse Pokémon?");
      setTargetPokemon(null);
      setAttempts(0);
      setDisabledOptions([]);

      try {
        const targetId =
          Math.floor(Math.random() * currentGen.total) + currentGen.start;
        const pokemonData = await fetchPokemonData(targetId);
        const list = await fetchGenerationList(
          currentGen.start,
          currentGen.total,
        );
        const wrongOptions = list
          .filter((p) => p.name !== pokemonData.name)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((p) => p.name);

        const allOptions = [...wrongOptions, pokemonData.name].sort(
          () => 0.5 - Math.random(),
        );

        if (isMounted) {
          setTargetPokemon(pokemonData);
          setOptions(allOptions);
        }
      } catch (error) {
        if (isMounted) {
          console.error(error);
          setMessage("Ops! Erro de conexão.");
        }
      }
    };

    loadRound();
    return () => {
      isMounted = false;
    };
  }, [round, currentGen.id]);

  const handleGuess = (guess: string) => {
    if (isRevealed || !targetPokemon || disabledOptions.includes(guess)) return;

    if (guess === targetPokemon.name) {
      playRetroSound("success");
      setIsRevealed(true);

      let newScore = saveData.score;
      let newPokedex = [...saveData.pokedex];

      if (attempts === 0) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        const comboBonus = (newStreak - 1) * 5;
        const totalPoints = 10 + comboBonus;
        newScore += totalPoints;

        if (newStreak > 1) {
          setMessage(
            `PERFEITO! Combo ${newStreak}x! (+${totalPoints} MasterCoins)`,
          );
        } else {
          setMessage(`Acertou de primeira! (+10 MasterCoins)`);
        }
      } else {
        setStreak(0);
        const points = attempts === 1 ? 5 : attempts === 2 ? 2 : 0;
        newScore += points;
        setMessage(`Acertou! (+${points} MasterCoins)`);
      }

      if (!newPokedex.includes(targetPokemon.id)) {
        newPokedex.push(targetPokemon.id);
      }

      const newSave = { pokedex: newPokedex, score: newScore };
      setSaveData(newSave);
      localStorage.setItem("vicente-save", JSON.stringify(newSave));
    } else {
      playRetroSound("error");
      setStreak(0);
      setAttempts((prev) => prev + 1);
      setDisabledOptions((prev) => [...prev, guess]);

      if (attempts >= 2) {
        const newScore = Math.max(0, saveData.score - 5);
        const newSave = { ...saveData, score: newScore };
        setSaveData(newSave);
        localStorage.setItem("vicente-save", JSON.stringify(newSave));
        setMessage("Errado! Você perdeu 5 MasterCoins...");
      } else {
        setMessage("Ops! Tente outro.");
      }
    }
  };

  const handleFlee = () => {
    if (isRevealed) return;
    playRetroSound("error");
    setStreak(0);
    setRound((prev) => prev + 1);
  };

  if (!targetPokemon) {
    return (
      <div className="text-white text-xl animate-pulse font-pokemon-gb mt-10">
        Procurando Pokémon...
      </div>
    );
  }

  const imageUrl =
    targetPokemon.sprites.other["official-artwork"].front_default;

  return (
    <div className="flex flex-col items-center w-full max-w-md pb-10">
      <div className="w-full flex justify-between items-center mb-6 px-6 bg-slate-800/80 rounded-2xl py-3 border border-slate-700 shadow-md font-pokemon-gb text-xs">
        <div className="flex flex-col">
          <div className="absolute top-3 left-3 bg-slate-800 border-2 border-yellow-500 text-yellow-400 px-3 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 flex items-center justify-center font-pokemon-gb text-[12px]">
            💰 MasterCoins: {saveData.score}
          </div>
          {streak > 1 && (
            <span className="text-orange-400 mt-1 animate-pulse">
              🔥 Combo {streak}x
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-400">Mochila {currentGen.name}</span>
          <span className="text-green-400 mt-1">
            🎒 {caughtInCurrentGen}/{currentGen.total}
          </span>
        </div>
      </div>
      <h2 className="text-xl text-yellow-400 font-pokemon-solid text-center mb-6 drop-shadow-md px-2">
        {message}
      </h2>
      <div className="relative w-64 h-64 bg-slate-800 rounded-full border-4 border-slate-700 flex items-center justify-center mb-8 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 to-transparent opacity-50"></div>
        <img
          src={imageUrl}
          alt="Pokémon Misterioso"
          className={`w-48 h-48 object-contain transition-all duration-700 ease-in-out z-10 
            ${isRevealed ? "brightness-100 scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" : "brightness-0 contrast-200"}`}
          draggable="false"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full px-4 mb-6">
        {options.map((option) => {
          const isDisabled = disabledOptions.includes(option);
          const isCorrect = isRevealed && option === targetPokemon.name;
          return (
            <button
              key={option}
              onClick={() => handleGuess(option)}
              disabled={isRevealed || isDisabled}
              className={`capitalize py-4 px-2 rounded-xl font-bold text-[15px] shadow-lg transition-all
                ${
                  isCorrect
                    ? "bg-green-500 text-white border-b-4 border-green-700"
                    : isDisabled
                      ? "bg-red-900/50 text-red-300 opacity-50 cursor-not-allowed border-b-4 border-red-950"
                      : isRevealed
                        ? "bg-slate-700 text-slate-500 opacity-50"
                        : "bg-blue-600 text-white hover:bg-blue-500 border-b-4 border-blue-800 active:scale-95"
                }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center w-full px-4">
        {!isRevealed ? (
          <button
            onClick={handleFlee}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-pokemon-gb text-[10px] px-6 py-4 rounded-xl shadow-lg active:scale-95 transition-transform border-b-4 border-slate-900 w-full justify-center"
          >
            <span className="text-xl">🏃‍♂️</span>
            FUGIR (Zera Combo)
          </button>
        ) : (
          <button
            onClick={() => setRound((prev) => prev + 1)}
            className="w-full bg-yellow-400 text-yellow-900 font-pokemon-gb text-xs px-8 py-5 rounded-full shadow-lg active:scale-95 transition-transform animate-bounce border-b-4 border-yellow-600"
          >
            PRÓXIMO POKÉMON!
          </button>
        )}
      </div>
    </div>
  );
}
