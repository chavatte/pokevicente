import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [loadingText, setLoadingText] = useState("Carregando");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Carregando...") return "Carregando";
        return prev + ".";
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-4 animate-fade-out overflow-hidden">
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
      <div className="absolute w-72 h-72 bg-yellow-500/10 rounded-full blur-[100px] animate-pulse"></div>
      <img
        src="/pokevicente_splashscreen.png"
        alt="PokéVicente Carregando"
        className="w-11/12 max-w-sm h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] animate-bounce-slow z-10"
        style={{ animationDuration: "15s" }}
      />
      <p className="text-slate-500 font-pokemon-gb text-[20px] mt-2 tracking-widest z-10 text-center">
        A JORNADA VAI COMEÇAR!
      </p>
      <div className="absolute bottom-16 flex flex-col items-center w-full px-12 z-10">
        <p className="text-white font-pokemon-gb text-[8px] mb-3">
          {loadingText}
        </p>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div className="h-full bg-yellow-400 rounded-full animate-progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
