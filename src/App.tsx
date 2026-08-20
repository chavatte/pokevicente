import { useState, useEffect } from "react";
import Portal from "./components/Portal";
import WhosThatPokemon from "./components/WhosThatPokemon";
import SuperTrunfo from "./components/SuperTrunfo";
import Pokedex from "./components/Pokedex";
import PokeWiki from "./components/PokeWiki";
import HelpCenter from "./components/HelpCenter";
import About from "./components/About";
import SplashScreen from "./components/SplashScreen";

type Screen =
  "portal" | "whosThat" | "superTrunfo" | "pokedex" | "wiki" | "help" | "about";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("portal");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case "portal":
        return <Portal onNavigate={setCurrentScreen} />;
      case "whosThat":
        return <WhosThatPokemon />;
      case "pokedex":
        return <Pokedex />;
      case "superTrunfo":
        return <SuperTrunfo />;
      case "wiki":
        return <PokeWiki />;
      case "help":
        return <HelpCenter onClose={() => setCurrentScreen("portal")} />;
      case "about":
        return <About onClose={() => setCurrentScreen("portal")} />;
      default:
        return <Portal onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex justify-center bg-pokemon-pattern">
      <main className="h-[100dvh] w-full max-w-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden shadow-2xl sm:border-x sm:border-slate-800">
        {showSplash ? (
          <SplashScreen />
        ) : (
          <>
            <div className="flex-1 flex flex-col items-center overflow-y-auto pb-20 animate-fade-in-up">
              {renderScreen()}
            </div>
            <nav className="absolute bottom-0 w-full bg-slate-800 border-t-4 border-slate-950 flex justify-around p-3 z-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => setCurrentScreen("portal")}
                className={`flex-1 mx-1 py-3 rounded-xl font-pokemon-gb text-[9px] flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  currentScreen === "portal"
                    ? "bg-yellow-500 text-yellow-950 border-b-4 border-yellow-700 shadow-inner"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                <span className="text-lg">🏠</span>
                PORTAL
              </button>
              <button
                onClick={() => setCurrentScreen("whosThat")}
                className={`flex-1 mx-1 py-3 rounded-xl font-pokemon-gb text-[9px] flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  currentScreen === "whosThat"
                    ? "bg-blue-600 text-white border-b-4 border-blue-800 shadow-inner"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                <span className="text-lg">🎮</span>
                JOGAR
              </button>
              <button
                onClick={() => setCurrentScreen("pokedex")}
                className={`flex-1 mx-1 py-3 rounded-xl font-pokemon-gb text-[9px] flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  currentScreen === "pokedex"
                    ? "bg-green-600 text-white border-b-4 border-green-800 shadow-inner"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                <span className="text-lg">🎒</span>
                MOCHILA
              </button>
              <button
                onClick={() => setCurrentScreen("wiki")}
                className={`flex-1 mx-1 py-3 rounded-xl font-pokemon-gb text-[9px] flex flex-col items-center gap-2 transition-all active:scale-95 ${
                  currentScreen === "wiki"
                    ? "bg-purple-600 text-white border-b-4 border-purple-800 shadow-inner"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                <span className="text-lg">📖</span>
                WIKI
              </button>
            </nav>
          </>
        )}
      </main>
    </div>
  );
}
