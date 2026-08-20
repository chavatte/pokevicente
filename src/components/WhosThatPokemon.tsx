import { useState, useEffect } from "react";
import {
  fetchPokemonData,
  fetchGenerationList,
  GENERATIONS,
} from "../services/pokeApi";
import type { Pokemon } from "../types/pokemon";
import { playRetroSound } from "../utils/audio";

export default function WhosThatPokemon() {
  const [targetPokemon, setTargetPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [message, setMessage] = useState("Quem é esse Pokémon?");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const [capturedIds, setCapturedIds] = useState<number[]>(() => {
    const savedPokedex = localStorage.getItem("vicente-pokedex");
    return savedPokedex ? JSON.parse(savedPokedex) : [];
  });
  const currentGen =
    GENERATIONS.find((gen) => {
      const caughtInGen = capturedIds.filter(
        (id) => id >= gen.start && id <= gen.end,
      ).length;
      return caughtInGen < gen.total;
    }) || GENERATIONS[GENERATIONS.length - 1];

  const caughtInCurrentGen = capturedIds.filter(
    (id) => id >= currentGen.start && id <= currentGen.end,
  ).length;

  useEffect(() => {
    let isMounted = true;

    const loadRound = async () => {
      setIsRevealed(false);
      setMessage("Quem é esse Pokémon?");
      setTargetPokemon(null);

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
    if (isRevealed || !targetPokemon) return;

    if (guess === targetPokemon.name) {
      playRetroSound("success");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      setMessage(`Acertou! É o ${targetPokemon.name.toUpperCase()}!`);
      setIsRevealed(true);

      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore((prev) => prev + 10 + newStreak * 5);

      if (!capturedIds.includes(targetPokemon.id)) {
        const newCaptured = [...capturedIds, targetPokemon.id];
        setCapturedIds(newCaptured);
        localStorage.setItem("vicente-pokedex", JSON.stringify(newCaptured));
      }
    } else {
      playRetroSound("error");
      if (navigator.vibrate) navigator.vibrate(200);
      setMessage("Tente de novo!");
      setStreak(0);
    }
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
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="w-full flex justify-between items-center mb-6 px-6 bg-slate-800/80 rounded-2xl py-3 border border-slate-700 shadow-md font-pokemon-gb text-xs">
        <div className="flex flex-col">
          <span className="text-slate-400">
            Score: <span className="text-white">{score}</span>
          </span>
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
      <div className="grid grid-cols-2 gap-4 w-full px-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleGuess(option)}
            disabled={isRevealed}
            className={`capitalize py-4 px-2 rounded-xl font-bold text-[15px] shadow-lg active:scale-95 transition-all
              ${isRevealed && option === targetPokemon.name ? "bg-green-500 text-white border-b-4 border-green-700" : isRevealed ? "bg-slate-700 text-slate-500 opacity-50" : "bg-blue-600 text-white hover:bg-blue-500 border-b-4 border-blue-800"}`}
          >
            {option}
          </button>
        ))}
      </div>
      {isRevealed && (
        <button
          onClick={() => setRound((prev) => prev + 1)}
          className="mt-8 bg-yellow-400 text-yellow-900 font-pokemon-gb text-xs px-8 py-5 rounded-full shadow-lg active:scale-95 transition-transform animate-bounce border-b-4 border-yellow-600"
        >
          PRÓXIMO POKÉMON!
        </button>
      )}
    </div>
  );
}
