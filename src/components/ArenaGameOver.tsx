export default function ArenaGameOver({ state, actions }: any) {
  const { battleResult, coins } = state;
  const { resetArena } = actions;

  const isWin = battleResult === "WIN";

  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-fade-in px-6 relative overflow-hidden">
      <div
        className={`absolute inset-0 ${isWin ? "bg-gradient-to-t from-green-900/40 to-transparent" : "bg-gradient-to-t from-red-900/40 to-transparent"}`}
      ></div>
      <h2
        className={`text-4xl font-pokemon-solid text-center mb-4 z-10 ${isWin ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" : "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"}`}
      >
        {isWin ? "VITÓRIA!" : "DERROTA..."}
      </h2>
      <p className="text-white font-pokemon-gb text-[12px] text-center mb-10 z-10 opacity-80 leading-relaxed">
        A MISSÃO FOI ENCERRADA.
      </p>
      <div className="bg-slate-950 border-2 border-slate-700 rounded-2xl p-6 w-full max-w-[280px] flex flex-col items-center mb-12 z-10 shadow-2xl relative">
        <span className="absolute -top-8 text-6xl">{isWin ? "🏆" : "💀"}</span>
        <span className="text-slate-400 font-pokemon-gb text-[10px] mt-6 mb-4">
          {isWin ? "RECOMPENSA DE CRÉDITOS" : "PREJUÍZO FINANCEIRO"}
        </span>
        <div
          className={`bg-slate-800 border-2 px-5 py-3 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center font-pokemon-gb text-[14px] whitespace-nowrap mb-4 transition-all duration-500 ${isWin ? "border-green-500 text-green-400" : "border-red-500 text-red-500"}`}
        >
          💰 MasterCoins: {isWin ? "+100" : "-50"}
        </div>
        <span className="text-slate-300 font-pokemon-gb text-[10px] opacity-70">
          Saldo atual: <span className="text-yellow-400">{coins}</span>
        </span>
      </div>
      <button
        onClick={resetArena}
        className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-400 font-pokemon-gb text-[12px] py-5 rounded-xl border-2 border-cyan-900 shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all z-10"
      >
        RETORNAR À BASE
      </button>
    </div>
  );
}
