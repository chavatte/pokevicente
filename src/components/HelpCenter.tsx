type HelpCenterProps = {
  onClose: () => void;
};

export default function HelpCenter({ onClose }: HelpCenterProps) {
  return (
    <div className="flex flex-col w-full max-w-md h-full pt-6 px-4 pb-24 overflow-y-auto scroll-smooth animate-fade-in-up">
      <div className="relative flex items-center justify-center mb-6">
        <button
          onClick={onClose}
          className="absolute left-0 text-slate-400 hover:text-white font-pokemon-gb text-2xl active:scale-90 px-2"
        >
          &lt;
        </button>
        <h2 className="text-4xl text-yellow-400 font-pokemon-solid text-center drop-shadow-md">
          Manual
        </h2>
      </div>
      <div className="space-y-4">
        <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl p-4 shadow-md">
          <p className="text-white font-pokemon-gb text-[14px] leading-relaxed text-center">
            Bem-vindo ao PokéVicente! Aqui você pode capturar, colecionar e
            batalhar. Veja como funciona:
          </p>
        </div>
        <div className="bg-blue-900/50 border-2 border-blue-500 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-md">🔍</span>
            <h3 className="text-yellow-400 font-pokemon-solid text-2xl">
              Quem é esse?
            </h3>
          </div>
          <p className="text-blue-100 font-pokemon-gb text-[12px] leading-relaxed mb-3">
            Olhe a sombra e adivinhe o nome. Acertar de primeira rende mais{" "}
            <span className="text-yellow-400 font-bold">MasterCoins (🪙)</span>{" "}
            e inicia um <strong>Combo</strong>!
          </p>
          <ul className="text-blue-200 font-pokemon-gb text-[10px] leading-relaxed space-y-2 ml-2 border-l-2 border-blue-400 pl-3">
            <li>🔥 Acertos de 1ª dão bônus de Combo!</li>
            <li>❌ Errar 3 vezes no mesmo Pokémon faz você perder moedas.</li>
            <li>
              🏃‍♂️ Use "Fugir" se não souber (perde o Combo, mas não as moedas).
            </li>
          </ul>
        </div>
        <div className="bg-green-900/50 border-2 border-green-500 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-md">🎒</span>
            <h3 className="text-yellow-400 font-pokemon-solid text-2xl">
              Mochila
            </h3>
          </div>
          <p className="text-green-100 font-pokemon-gb text-[12px] leading-relaxed">
            Sua coleção! Aqui ficam todos os Pokémons que você capturou. Clique
            neles para ver as barras de poder e as evoluções.
          </p>
        </div>
        <div className="bg-red-900/50 border-2 border-red-500 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-md">⚔️</span>
            <h3 className="text-yellow-400 font-pokemon-solid text-2xl">
              Super Trunfo
            </h3>
          </div>
          <p className="text-red-100 font-pokemon-gb text-[12px] leading-relaxed mb-3">
            A arena de aposta! Escolha um lutador da Mochila. O jogo sorteia um
            atributo para a batalha.
          </p>
          <ul className="text-red-200 font-pokemon-gb text-[10px] leading-relaxed space-y-2 ml-2 border-l-2 border-red-400 pl-3">
            <li>
              🏆 <strong>Vitória:</strong> Ganhe +20 MasterCoins.
            </li>
            <li>
              💀 <strong>Derrota:</strong> Perca -15 MasterCoins.
            </li>
            <li>
              💸 <strong>Atenção:</strong> É preciso ter no mínimo 1 MasterCoin
              para entrar na Arena!
            </li>
          </ul>
        </div>
        <div className="bg-purple-900/50 border-2 border-purple-500 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-md">📖</span>
            <h3 className="text-yellow-400 font-pokemon-solid text-2xl">
              PokéWiki
            </h3>
          </div>
          <p className="text-purple-100 font-pokemon-gb text-[12px] leading-relaxed">
            A enciclopédia completa. Pesquise qualquer Pokémon do mundo por nome
            ou número para aprender tudo sobre ele.
          </p>
        </div>
        <div className="bg-orange-900/50 border-2 border-orange-500 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl drop-shadow-md">💾</span>
            <h3 className="text-yellow-400 font-pokemon-solid text-2xl">
              Cartucho .PKV
            </h3>
          </div>
          <p className="text-orange-100 font-pokemon-gb text-[12px] leading-relaxed">
            Não perca o seu progresso! No menu principal, clique em "
            <strong>EXPORTAR</strong>" para criar o seu Cartucho VIP (um arquivo
            seguro com final <strong>.pkv</strong>) que guarda seus Pokémons e
            suas moedas. Para continuar jogando em outro celular, basta clicar
            em "<strong>IMPORTAR</strong>" e selecionar o seu cartucho!
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-yellow-400 text-yellow-900 font-pokemon-gb text-[15px] px-6 py-4 rounded-full shadow-lg border-b-4 border-yellow-600 active:scale-95 transition-all hover:bg-yellow-300 animate-bounce"
        >
          ENTENDI! BORA JOGAR
        </button>
      </div>
    </div>
  );
}
