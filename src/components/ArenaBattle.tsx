export default function ArenaBattle({ state, actions }: any) {
  const {
    isArenaReady,
    cpuDeck,
    activeCpuIdx,
    cpuAnim,
    playerDeck,
    activePlayerIdx,
    playerAnim,
    logSpeaker,
    displayedLog,
    isProcessingTurn,
  } = state;
  const { handleCombatTurn, resetArena } = actions;

  const getHpPercentage = (current: number, max: number) => {
    if (!max) return 0;
    const perc = (current / max) * 100;
    return Math.max(0, Math.min(100, perc));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md md:max-w-full h-full pt-6 px-4 md:px-8 animate-fade-in pb-6">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px) rotate(-5deg); filter: brightness(1.5) sepia(1) hue-rotate(-50deg) saturate(5); }
          50% { transform: translateX(8px) rotate(5deg); }
          75% { transform: translateX(-8px) rotate(-5deg); filter: brightness(1.5) sepia(1) hue-rotate(-50deg) saturate(5); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes attackUp {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); filter: brightness(1.2); }
        }
        .animate-attack-up { animation: attackUp 0.3s ease-out; }
        @keyframes attackDown {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(30px) scale(1.1); filter: brightness(1.2); }
        }
        .animate-attack-down { animation: attackDown 0.3s ease-out; }
      `}</style>
      {!isArenaReady ? (
        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]"></div>
          <p className="text-cyan-400 font-pokemon-gb text-[12px] animate-pulse drop-shadow-md text-center leading-loose">
            INICIALIZANDO
            <br />
            PROTOCOLO DE COMBATE...
          </p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 w-full relative">
          <div className="flex flex-col flex-1 w-full relative bg-slate-900 rounded-3xl border-[4px] border-slate-700/80 overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] mb-4 pt-6 pb-2 md:flex-row md:items-center md:justify-between md:px-6 md:py-8">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-slate-900/50 to-cyan-900/20 pointer-events-none"></div>
            <div
              className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent border-t border-cyan-500/20 pointer-events-none"
              style={{
                transform: "perspective(500px) rotateX(60deg)",
                transformOrigin: "bottom",
              }}
            ></div>
            <div className="relative z-10 flex flex-col items-center w-full mb-2 md:mb-0 md:w-[30%]">
              <div className="flex justify-between items-center w-full px-4 mb-2">
                <span className="text-red-500 font-pokemon-gb text-[12px] drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                  INIMIGO
                </span>
                <div className="flex gap-1">
                  {cpuDeck.map((_: any, i: number) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm border border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)] ${i >= activeCpuIdx ? "bg-red-500" : "bg-transparent opacity-30"}`}
                    ></div>
                  ))}
                </div>
              </div>
              {cpuDeck[activeCpuIdx] && (
                <div
                  className={`w-full max-w-[260px] bg-slate-950/80 border-l-4 border-red-600 rounded-r-xl p-3 flex items-center shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-sm transition-all duration-300 ${cpuDeck[activeCpuIdx].hp <= 0 ? "opacity-20 grayscale" : "opacity-100"} ${cpuAnim}`}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${cpuDeck[activeCpuIdx].id}.png`}
                    alt="CPU"
                    className="w-24 h-24 object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
                  />
                  <div className="flex-1 ml-3">
                    <h4 className="text-slate-200 font-pokemon-gb text-[11px] mb-2 drop-shadow-sm">
                      {cpuDeck[activeCpuIdx].name}
                    </h4>
                    <div className="w-full bg-black rounded-sm h-3 mb-1 border border-slate-700 overflow-hidden">
                      <div
                        className="bg-red-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        style={{
                          width: `${getHpPercentage(cpuDeck[activeCpuIdx].hp, cpuDeck[activeCpuIdx].maxHp!)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-red-400 font-pokemon-gb text-[9px]">
                      {Math.floor(cpuDeck[activeCpuIdx].hp)} /{" "}
                      {cpuDeck[activeCpuIdx].maxHp} HP
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center my-1 px-4 md:w-[40%] md:mx-4">
              <div
                className={`w-full bg-slate-950/90 border-l-4 rounded-r-md p-4 relative overflow-hidden flex items-center shadow-lg transition-colors duration-300 ${
                  logSpeaker === "PLAYER"
                    ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                    : logSpeaker === "CPU"
                      ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                      : "border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                }`}
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>
                <p
                  className={`font-pokemon-gb text-[11px] md:text-[13px] leading-loose relative z-10 w-full text-left break-words min-h-[48px] md:min-h-[80px] ${
                    logSpeaker === "PLAYER"
                      ? "text-cyan-400"
                      : logSpeaker === "CPU"
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {displayedLog}
                  <span className="animate-pulse opacity-70 ml-1 font-bold">
                    _
                  </span>
                </p>
              </div>
            </div>
            <div className="relative z-10 flex flex-col items-center w-full mt-2 mb-4 md:mt-0 md:mb-0 md:w-[30%]">
              {playerDeck[activePlayerIdx] && (
                <div
                  className={`w-full max-w-[260px] bg-slate-950/80 border-r-4 border-cyan-500 rounded-l-xl p-3 flex flex-row-reverse items-center shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-sm mb-2 transition-all duration-300 ${playerDeck[activePlayerIdx].hp <= 0 ? "opacity-20 grayscale" : "opacity-100"} ${playerAnim}`}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${playerDeck[activePlayerIdx].id}.png`}
                    alt="Você"
                    className="w-28 h-28 object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
                  />
                  <div className="flex-1 mr-3 text-right">
                    <h4 className="text-slate-200 font-pokemon-gb text-[11px] mb-2 drop-shadow-sm">
                      {playerDeck[activePlayerIdx].name}
                    </h4>
                    <div className="w-full bg-black rounded-sm h-3 mb-1 border border-slate-700 flex justify-end overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                        style={{
                          width: `${getHpPercentage(playerDeck[activePlayerIdx].hp, playerDeck[activePlayerIdx].maxHp!)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-cyan-300 font-pokemon-gb text-[9px]">
                      {Math.floor(playerDeck[activePlayerIdx].hp)} /{" "}
                      {playerDeck[activePlayerIdx].maxHp} HP
                    </span>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center w-full px-4">
                <div className="flex gap-1">
                  {playerDeck.map((_: any, i: number) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm border border-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)] ${i >= activePlayerIdx ? "bg-cyan-500" : "bg-transparent opacity-30"}`}
                    ></div>
                  ))}
                </div>
                <span className="text-cyan-500 font-pokemon-gb text-[12px] drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
                  PLAYER_1
                </span>
              </div>
            </div>
          </div>
          <div className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl mt-auto z-20 relative overflow-hidden md:w-1/2 md:mx-auto">
            <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <button
                onClick={() => handleCombatTurn("ATTACK")}
                disabled={isProcessingTurn}
                className="relative overflow-hidden bg-slate-950 border-2 border-red-500/50 hover:border-red-400 text-red-400 font-pokemon-gb text-[10px] py-6 rounded-sm active:scale-95 shadow-[inset_0_0_15px_rgba(239,68,68,0.1)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-red-500/20 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
                <span className="relative z-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] tracking-widest">
                  ATACAR [{playerDeck[activePlayerIdx]?.attack}]
                </span>
              </button>
              <button
                onClick={() => handleCombatTurn("DEFEND")}
                disabled={isProcessingTurn}
                className="relative overflow-hidden bg-slate-950 border-2 border-cyan-500/50 hover:border-cyan-400 text-cyan-400 font-pokemon-gb text-[10px] py-6 rounded-sm active:scale-95 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-cyan-500/20 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
                <span className="relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] tracking-widest">
                  DEFENDER [{playerDeck[activePlayerIdx]?.defense}]
                </span>
              </button>
            </div>
            <button
              onClick={resetArena}
              className="w-full mt-5 text-slate-500 font-pokemon-gb text-[9px] py-3 underline hover:text-red-400 transition-colors relative z-10"
            >
              Abortar Missão (Perder Moedas)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
