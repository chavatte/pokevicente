export type PokemonPreviewData = {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  types: string[];
};

type PokemonCardPreviewProps = {
  data: PokemonPreviewData | null;
  isLoading: boolean;
  onClose: () => void;
  actionLabel: string;
  onAction: () => void;
  isActionDisabled?: boolean;
  isDestructiveAction?: boolean;
};

const typeCardColors: Record<string, string> = {
  fire: "from-red-600 via-orange-500 to-yellow-500",
  water: "from-blue-600 via-cyan-500 to-blue-300",
  grass: "from-green-700 via-green-500 to-lime-400",
  electric: "from-yellow-600 via-yellow-400 to-yellow-200",
  psychic: "from-purple-600 via-pink-500 to-pink-300",
  ice: "from-cyan-400 via-cyan-200 to-white",
  dragon: "from-indigo-800 via-purple-600 to-indigo-400",
  dark: "from-slate-900 via-slate-700 to-slate-500",
  fairy: "from-pink-400 via-pink-300 to-white",
  normal: "from-gray-400 via-slate-200 to-gray-300",
  fighting: "from-orange-800 via-orange-600 to-orange-400",
  flying: "from-blue-400 via-sky-300 to-white",
  poison: "from-purple-800 via-purple-600 to-fuchsia-400",
  ground: "from-yellow-800 via-yellow-600 to-orange-300",
  rock: "from-yellow-900 via-stone-600 to-stone-400",
  bug: "from-lime-700 via-lime-500 to-green-300",
  ghost: "from-purple-900 via-indigo-900 to-purple-600",
  steel: "from-gray-600 via-slate-400 to-gray-300",
};

export default function PokemonCardPreview({
  data,
  isLoading,
  onClose,
  actionLabel,
  onAction,
  isActionDisabled = false,
  isDestructiveAction = false,
}: PokemonCardPreviewProps) {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-slate-800/80 border-2 border-slate-500 rounded-full text-white font-pokemon-gb text-xl md:text-2xl flex items-center justify-center shadow-lg active:scale-90 z-20 transition-all hover:bg-slate-700"
      >
        X
      </button>
      <div
        className={`relative z-10 w-full max-w-[300px] md:max-w-[380px] rounded-xl border-[6px] border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.4)] bg-gradient-to-br ${data ? typeCardColors[data.types[0]] || typeCardColors["normal"] : "from-slate-400 to-slate-200"} p-2 md:p-3 overflow-hidden flex flex-col`}
      >
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {isLoading || !data ? (
          <div className="flex flex-col items-center justify-center h-80 md:h-96 z-10">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-black font-pokemon-gb text-[8px] md:text-[10px] mt-4 md:mt-6">
              LENDO DADOS...
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-full z-10">
            <div className="flex justify-between items-center px-2 md:px-3 py-1 md:py-2 mb-1 md:mb-2 bg-white/30 rounded-t-lg border-b border-black/20">
              <h4 className="text-black font-pokemon-gb text-[12px] md:text-[16px] uppercase drop-shadow-sm truncate pr-2">
                {data.name}
              </h4>
              <span className="text-red-700 font-pokemon-gb text-[10px] md:text-[12px] whitespace-nowrap">
                {data.hp} HP
              </span>
            </div>
            <div className="w-full bg-gradient-to-b from-gray-200 to-gray-400 border-4 border-gray-400 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] rounded flex items-center justify-center h-40 md:h-56 mb-2 md:mb-3 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
                alt={data.name}
                className="w-32 h-32 md:w-44 md:h-44 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] hover:scale-110 transition-transform"
              />
            </div>
            <div className="flex gap-2 justify-center mb-3 md:mb-4">
              {data.types.map((type) => (
                <span
                  key={type}
                  className="bg-white/70 text-black font-pokemon-gb text-[7px] md:text-[9px] px-2 py-1 md:px-3 md:py-1.5 rounded shadow-sm uppercase tracking-widest border border-black/20"
                >
                  TIPO {type}
                </span>
              ))}
            </div>
            <div className="bg-white/80 rounded border-2 border-black/20 p-2 md:p-3 space-y-2 md:space-y-3 mb-4 md:mb-5 shadow-sm">
              <div className="flex justify-between items-center border-b border-black/10 pb-1 md:pb-2">
                <span className="text-black font-pokemon-gb text-[9px] md:text-[11px] flex items-center gap-1 md:gap-2">
                  <span className="text-red-600 text-sm md:text-base">⚔️</span>{" "}
                  Investida (ATK)
                </span>
                <span className="text-black font-pokemon-solid text-xl md:text-2xl">
                  {data.attack}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 md:pt-0">
                <span className="text-black font-pokemon-gb text-[9px] md:text-[11px] flex items-center gap-1 md:gap-2">
                  <span className="text-blue-600 text-sm md:text-base">🛡️</span>{" "}
                  Casco (DEF)
                </span>
                <span className="text-black font-pokemon-solid text-xl md:text-2xl">
                  {data.defense}
                </span>
              </div>
            </div>
            <button
              onClick={onAction}
              disabled={isActionDisabled && !isDestructiveAction}
              className={`w-full font-pokemon-gb text-[10px] md:text-[12px] py-3 md:py-4 rounded border-b-4 active:scale-95 transition-all shadow-md mt-auto ${
                isDestructiveAction
                  ? "bg-red-600 text-white border-red-800 hover:bg-red-500"
                  : isActionDisabled
                    ? "bg-slate-400 border-slate-500 text-slate-200 cursor-not-allowed"
                    : "bg-cyan-600 border-cyan-800 text-white hover:bg-cyan-500"
              }`}
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
