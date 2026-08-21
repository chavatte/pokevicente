import { useState } from "react";

type PortalProps = {
  onNavigate: (
    screen: "whosThat" | "superTrunfo" | "pokedex" | "wiki" | "help" | "about",
  ) => void;
};

const getLocalData = () => {
  const newSave = localStorage.getItem("vicente-save");
  if (newSave) return JSON.parse(newSave);
  const oldSave = localStorage.getItem("vicente-pokedex");
  const migrated = { pokedex: oldSave ? JSON.parse(oldSave) : [], score: 0 };
  localStorage.setItem("vicente-save", JSON.stringify(migrated));
  return migrated;
};

export default function Portal({ onNavigate }: PortalProps) {
  const [saveData] = useState(getLocalData());

  const handleExportSave = () => {
    const rawSave = localStorage.getItem("vicente-save");

    if (!rawSave || saveData.pokedex.length === 0) {
      alert("Sua mochila ainda está vazia! Capture alguns Pokémons primeiro.");
      return;
    }

    const encodedData = btoa(rawSave);
    const blob = new Blob([encodedData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pokevicente_${new Date().toISOString().split("T")[0]}.pkv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSave = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const encoded = e.target?.result as string;
        const json = atob(encoded);
        const data = JSON.parse(json);

        if (data.pokedex && typeof data.score === "number") {
          localStorage.setItem("vicente-save", json);
          alert("Cartucho VIP carregado com sucesso! A página vai recarregar.");
          window.location.reload();
        } else {
          throw new Error("Invalid structure");
        }
      } catch (error) {
        alert(
          "Ops! Cartucho corrompido ou inválido. Use um arquivo .pkv original do jogo.",
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-start h-full w-full max-w-md px-5 pt-8 pb-24 overflow-y-auto scroll-smooth">
      <div className="flex flex-col items-center mb-6 relative w-full shrink-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 border-2 border-yellow-500 text-yellow-400 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] z-50 flex items-center justify-center font-pokemon-gb text-[16px] whitespace-nowrap">
          💰 MasterCoins: {saveData.score}
        </div>
        <button
          onClick={() => onNavigate("help")}
          className="absolute top-0 right-0 bg-slate-800 border-2 border-slate-500 text-slate-300 w-10 h-10 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-90 transition-all hover:bg-slate-700 hover:border-yellow-400 z-50 flex items-center justify-center group"
          title="Como Jogar"
        >
          <span className="font-pokemon-solid text-xl text-yellow-400 group-hover:scale-110 transition-transform">
            ?
          </span>
        </button>
        <div className="absolute top-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <img
          src="/vicente-trainer.png"
          alt="Mestre Vicente"
          className="w-40 h-auto mt-20 drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500 z-10"
        />
        <div className="flex flex-col items-center bg-slate-800/90 px-8 py-4 rounded-3xl border-4 border-slate-600 shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md -mt-20 z-20">
          <img
            src="/pokevicente_logo.png"
            alt="Logo PokéVicente"
            className="w-56 h-auto drop-shadow-md mb-1"
          />
          <p className="text-white font-pokemon-gb text-[12px] mt-2 tracking-widest opacity-90 text-center">
            CENTRAL DO TREINADOR
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full gap-4 shrink-0">
        <button
          onClick={() => onNavigate("whosThat")}
          className="relative bg-blue-600 border-b-8 border-blue-800 text-white p-5 rounded-2xl shadow-xl active:scale-95 transition-all overflow-hidden group flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="flex flex-col text-left">
            <span className="block font-pokemon-solid text-xl text-yellow-400 drop-shadow-md mb-2">
              Quem é esse?
            </span>
            <span className="font-pokemon-gb text-[10px] text-blue-200">
              Adivinhe a silhueta!
            </span>
          </div>
          <span className="text-3xl opacity-80 group-hover:scale-125 transition-transform">
            🔍
          </span>
        </button>
        <button
          onClick={() => onNavigate("superTrunfo")}
          className="relative bg-red-600 border-b-8 border-red-800 text-white p-5 rounded-2xl shadow-xl active:scale-95 transition-all overflow-hidden group flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="flex flex-col text-left">
            <span className="block font-pokemon-solid text-xl text-yellow-400 drop-shadow-md mb-2">
              Super Trunfo
            </span>
            <span className="font-pokemon-gb text-[10px] text-red-200">
              Batalha na Arena!
            </span>
          </div>
          <span className="text-3xl opacity-80 group-hover:scale-125 transition-transform">
            ⚔️
          </span>
        </button>
        <button
          onClick={() => onNavigate("wiki")}
          className="relative bg-purple-600 border-b-8 border-purple-800 text-white p-5 rounded-2xl shadow-xl active:scale-95 transition-all overflow-hidden group flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="flex flex-col text-left">
            <span className="block font-pokemon-solid text-xl text-yellow-400 drop-shadow-md mb-2">
              PokéWiki
            </span>
            <span className="font-pokemon-gb text-[10px] text-purple-200">
              Enciclopédia Completa
            </span>
          </div>
          <span className="text-3xl opacity-80 group-hover:scale-125 transition-transform">
            📖
          </span>
        </button>
      </div>
      <div className="mt-8 bg-slate-800/80 border-2 border-slate-600 rounded-2xl p-5 w-full shadow-md relative overflow-hidden shrink-0">
        <img
          src="/pokevicente_logo.png"
          alt="Cartucho"
          className="absolute -right-6 -bottom-6 w-32 h-auto opacity-10 rotate-[-15deg] pointer-events-none"
        />
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">💾</span>
          <h3 className="text-yellow-400 font-pokemon-solid text-xl text-center">
            Cartucho .PKV
          </h3>
        </div>
        <p className="text-slate-300 font-pokemon-gb text-[10px] text-center mb-5 leading-relaxed z-10 relative">
          Seus dados estão protegidos no formato exclusivo PokéVicente! Salve
          antes de trocar de celular.
        </p>
        <div className="flex gap-4 z-10 relative">
          <button
            onClick={handleExportSave}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-pokemon-gb text-[11px] py-4 rounded-xl border-b-4 border-blue-800 active:scale-95 transition-transform flex flex-col items-center gap-2 shadow-lg"
          >
            <span className="text-xl">📥</span>
            EXPORTAR
          </button>
          <label className="flex-1 bg-green-600 hover:bg-green-500 text-white font-pokemon-gb text-[11px] py-4 rounded-xl border-b-4 border-green-800 active:scale-95 transition-transform flex flex-col items-center gap-2 shadow-lg cursor-pointer">
            <span className="text-xl">📤</span>
            IMPORTAR
            <input
              type="file"
              accept=".pkv"
              className="hidden"
              onChange={handleImportSave}
            />
          </label>
        </div>
      </div>
      <button
        onClick={() => onNavigate("about")}
        className="mt-8 mb-4 px-6 py-3 bg-slate-800/80 border-2 border-slate-600 rounded-full text-slate-200 font-pokemon-gb text-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] backdrop-blur-md hover:bg-slate-700 hover:border-yellow-500 hover:text-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all active:scale-95 shrink-0"
      >
        PokéVicente v2.5 • Sobre o Projeto
      </button>
    </div>
  );
}
