import { useEffect, useState } from "react";

const loadingPhrases = [
  "Iniciando Motor .PKV...",
  "Carregando 1025 Pokémons...",
  "Preparando Arena de Batalha...",
  "Sincronizando MasterCoins...",
  "A JORNADA VAI COMEÇAR!",
];

export default function SplashScreen() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < loadingPhrases.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 animate-fade-out overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-energy-wave">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at center, #3b82f6 0%, transparent 70%)",
          }}
        ></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      </div>
      <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="relative z-10 flex flex-col items-center mt-[-40px]">
        <img
          src="/pokevicente_splashscreen.png"
          alt="PokéVicente Carregando"
          className="w-11/12 max-w-sm h-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-bounce-slow"
          style={{ animationDuration: "8s" }}
        />
        <span className="mt-4 bg-blue-600/80 border border-blue-400 text-white font-pokemon-gb text-[10px] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]">
          VERSÃO 2.5
        </span>
      </div>
      <div className="absolute bottom-8 flex flex-col items-center w-full px-12 z-10">
        <p className="text-yellow-400 font-pokemon-gb text-[9px] mb-4 text-center h-4 drop-shadow-md">
          {loadingPhrases[phraseIndex]}
        </p>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner mb-6 relative">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-400 rounded-full animate-progress-bar"
            style={{ animationDuration: "6s" }}
          ></div>
        </div>
        <div className="flex flex-col items-center opacity-80">
          <span className="text-slate-500 font-pokemon-gb text-[7px] mb-1.5 tracking-widest">
            SISTEMA DESENVOLVIDO POR
          </span>
          <span className="text-slate-300 font-pokemon-gb text-[10px] tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            DEVCHAVATTE
          </span>
        </div>
      </div>
    </div>
  );
}
