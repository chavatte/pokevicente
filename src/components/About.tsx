type AboutProps = {
  onClose: () => void;
};

export default function About({ onClose }: AboutProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-md md:max-w-2xl lg:max-w-3xl h-full pt-6 px-4 pb-24 overflow-y-auto scroll-smooth animate-fade-in-up mx-auto">
      <div className="relative flex items-center justify-center mb-6 w-full">
        <button
          onClick={onClose}
          className="absolute left-0 text-slate-400 hover:text-white font-pokemon-gb text-2xl active:scale-90 px-2"
        >
          &lt;
        </button>
        <h2 className="text-3xl md:text-5xl text-yellow-400 font-pokemon-solid text-center drop-shadow-md">
          Sobre
        </h2>
      </div>
      <div className="flex flex-col items-center mb-6 md:mb-10">
        <img
          src="/pokevicente_logo.png"
          alt="Logo PokéVicente"
          className="w-48 md:w-64 h-auto drop-shadow-md mb-3 md:mb-5"
        />
        <span className="bg-purple-600 border-2 border-purple-400 text-white font-pokemon-gb text-[12px] md:text-[14px] px-4 md:px-6 py-2 md:py-3 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.4)] animate-pulse">
          VERSÃO 3.2
        </span>
      </div>
      <div className="space-y-4 md:space-y-6 w-full">
        <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-5 md:p-8 shadow-md">
          <p className="text-slate-300 font-pokemon-gb text-[13px] md:text-[15px] leading-relaxed text-center mb-4 md:mb-6">
            Um projeto especial criado de pai para filho, unindo engenharia de
            software e diversão!
          </p>
          <p className="text-slate-400 font-pokemon-gb text-[10px] md:text-[12px] leading-relaxed text-center">
            O PokéVicente nasceu com a missão de ser um ambiente 100% offline,
            seguro e sem anúncios para explorar o universo Pokémon.
          </p>
        </div>
        <div className="bg-blue-900/50 border-2 border-blue-500 rounded-2xl p-5 md:p-8 shadow-md text-center">
          <h3 className="text-yellow-400 font-pokemon-solid text-xl md:text-3xl mb-4 md:mb-6">
            Novidades da v3.2
          </h3>
          <ul className="text-blue-100 font-pokemon-gb text-[10px] md:text-[12px] leading-relaxed space-y-4 md:space-y-6 text-left">
            <li className="flex items-start gap-3 md:gap-5">
              <span className="text-xl md:text-2xl shrink-0 leading-none mt-0.5 md:mt-1">🛡️</span>
              <span>
                <span className="text-white">SECOPS & ESTABILIDADE:</span> Auditoria de segurança e mitigação de vulnerabilidades em dependências nativas (Tar, Sharp, UUID) monitoradas via Sentinel OPS, garantindo um código blindado.
              </span>
            </li>
            <li className="flex items-start gap-3 md:gap-5">
              <span className="text-xl md:text-2xl shrink-0 leading-none mt-0.5 md:mt-1">🖥️</span>
              <span>
                <span className="text-white">LAYOUT ADAPTATIVO:</span> Interface 100% responsiva (Mobile-First). O jogo agora se expande de forma elegante para Monitores e Tablets, com painéis lado a lado no estilo Arcade.
              </span>
            </li>
            <li className="flex items-start gap-3 md:gap-5">
              <span className="text-xl md:text-2xl shrink-0 leading-none mt-0.5 md:mt-1">⚔️</span>
              <span>
                <span className="text-white">ARENA RPG (v3.1):</span> A Arena Super
                Trunfo evoluiu para um deck de 3 Pokémons com controle de Ataques, Defesas e matemática de Vantagens em tempo real.
              </span>
            </li>
            <li className="flex items-start gap-3 md:gap-5">
              <span className="text-xl md:text-2xl shrink-0 leading-none mt-0.5 md:mt-1">💸</span>
              <span>
                <span className="text-white">ALTO RISCO E RECOMPENSA:</span>{" "}
                O ingresso da Arena custa 50 MasterCoins. Vença a CPU para levar
                100 moedas, ou perca e sofra o prejuízo!
              </span>
            </li>
            <li className="flex items-start gap-3 md:gap-5">
              <span className="text-xl md:text-2xl shrink-0 leading-none mt-0.5 md:mt-1">⚙️</span>
              <span>
                <span className="text-white">ARQUITETURA LIMPA:</span>{" "}
                Refatoração completa usando Custom Hooks e Separação de
                Responsabilidades para máxima performance no seu Cartucho .PKV.
              </span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center mt-8 md:mt-12 pb-8 opacity-80">
          <span className="text-slate-500 font-pokemon-gb text-[10px] md:text-[12px] mb-3">
            Desenvolvido com ❤️ por
          </span>
          <span className="text-slate-300 font-pokemon-gb text-[14px] md:text-[18px]">
            DevChavatte
          </span>
        </div>
      </div>
    </div>
  );
}
