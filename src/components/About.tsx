type AboutProps = {
  onClose: () => void;
};

export default function About({ onClose }: AboutProps) {
  return (
    <div className="flex flex-col w-full max-w-md h-full pt-6 px-4 pb-24 overflow-y-auto scroll-smooth animate-fade-in-up">
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={onClose}
          className="absolute left-0 text-slate-400 hover:text-white font-pokemon-gb text-2xl active:scale-90 px-2"
        >
          &lt;
        </button>
        <h2 className="text-3xl text-yellow-400 font-pokemon-solid text-center drop-shadow-md">
          Sobre
        </h2>
      </div>
      <div className="flex flex-col items-center mb-6">
        <img
          src="/pokevicente_logo.png"
          alt="Logo PokéVicente"
          className="w-48 h-auto drop-shadow-md mb-3"
        />
        <span className="bg-purple-600 border-2 border-purple-400 text-white font-pokemon-gb text-[12px] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.4)] animate-pulse">
          VERSÃO 3.1
        </span>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-5 shadow-md">
          <p className="text-slate-300 font-pokemon-gb text-[13px] leading-relaxed text-center mb-4">
            Um projeto especial criado de pai para filho, unindo engenharia de
            software e diversão!
          </p>
          <p className="text-slate-400 font-pokemon-gb text-[10px] leading-relaxed text-center">
            O PokéVicente nasceu com a missão de ser um ambiente 100% offline,
            seguro e sem anúncios para explorar o universo Pokémon.
          </p>
        </div>
        <div className="bg-blue-900/50 border-2 border-blue-500 rounded-2xl p-5 shadow-md text-center">
          <h3 className="text-yellow-400 font-pokemon-solid text-xl mb-4">
            Novidades da v3.1
          </h3>
          <ul className="text-blue-100 font-pokemon-gb text-[10px] leading-relaxed space-y-4 text-left">
            <li className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">⚔️</span>
              <span>
                <span className="text-white">RPG DE TURNOS:</span> A Arena Super
                Trunfo foi reconstruída do zero! Agora você monta um deck com 3
                Pokémons e controla Ataques e Defesas em tempo real.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">💥</span>
              <span>
                <span className="text-white">TÁTICA E CRÍTICOS:</span>{" "}
                Matemática de combate avançada. Vantagens de Tipos (Água apaga
                Fogo) causam dano em dobro, e há 15% de chance de Acerto
                Crítico!
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">💸</span>
              <span>
                <span className="text-white">ALTO RISCO, ALTA RECOMPENSA:</span>{" "}
                O ingresso da Arena custa 50 MasterCoins. Vença a CPU para levar
                100 moedas, ou perca e sofra o prejuízo!
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">🖥️</span>
              <span>
                <span className="text-white">TERMINAL TÁTICO:</span> Novo painel
                de Log de Batalha cibernético com efeito typewriter e cartas que
                tremem fisicamente ao sofrer impacto.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">⚙️</span>
              <span>
                <span className="text-white">ARQUITETURA LIMPA:</span>{" "}
                Refatoração completa usando Custom Hooks e Separação de
                Responsabilidades para máxima performance no seu Cartucho .PKV.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center mt-8 pb-8 opacity-80">
          <span className="text-slate-500 font-pokemon-gb text-[10px] mb-3">
            Desenvolvido com ❤️ por
          </span>
          <span className="text-slate-300 font-pokemon-gb text-[14px]">
            DevChavatte
          </span>
        </div>
      </div>
    </div>
  );
}
