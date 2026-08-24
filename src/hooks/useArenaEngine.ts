import { useState, useEffect } from "react";
import { fetchPokemonData } from "../services/pokeApi";
import { getDamageMultiplier } from "../utils/TypeEffectiveness";

export type ArenaPhase = "DRAFT" | "BATTLE" | "GAMEOVER";

export type PokemonPreviewData = {
  id: number;
  name: string;
  hp: number;
  attack: number;
  defense: number;
  types: string[];
};

export type BattleFighter = PokemonPreviewData & { maxHp: number };

export function useArenaEngine() {
  const [phase, setPhase] = useState<ArenaPhase>("DRAFT");
  const [coins, setCoins] = useState<number>(0);
  const [backpack, setBackpack] = useState<number[]>([]);
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [battleResult, setBattleResult] = useState<"WIN" | "LOSE" | null>(null);
  const [playerDeck, setPlayerDeck] = useState<BattleFighter[]>([]);
  const [cpuDeck, setCpuDeck] = useState<BattleFighter[]>([]);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [activeCpuIdx, setActiveCpuIdx] = useState(0);
  const [isArenaReady, setIsArenaReady] = useState(false);
  const [battleLog, setBattleLog] = useState<string>(
    "SISTEMA PRONTO. AGUARDANDO COMANDO...",
  );
  const [logSpeaker, setLogSpeaker] = useState<"INFO" | "PLAYER" | "CPU">(
    "INFO",
  );
  const [displayedLog, setDisplayedLog] = useState<string>("");
  const [isProcessingTurn, setIsProcessingTurn] = useState<boolean>(false);
  const [playerAnim, setPlayerAnim] = useState<string>("");
  const [cpuAnim, setCpuAnim] = useState<string>("");

  useEffect(() => {
    const save = JSON.parse(
      localStorage.getItem("vicente-save") || '{"pokedex": [], "score": 0}',
    );
    setBackpack(save.pokedex || []);
    setCoins(save.score || 0);
  }, []);

  useEffect(() => {
    let i = 0;
    setDisplayedLog("");
    const interval = setInterval(() => {
      setDisplayedLog(battleLog.slice(0, i + 1));
      i++;
      if (i >= battleLog.length) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [battleLog]);

  const updateCoins = (amount: number) => {
    setCoins((prevCoins) => {
      const newTotal = prevCoins + amount;
      const save = JSON.parse(
        localStorage.getItem("vicente-save") || '{"pokedex": [], "score": 0}',
      );
      save.score = newTotal;
      localStorage.setItem("vicente-save", JSON.stringify(save));
      return newTotal;
    });
  };

  const triggerAnim = (target: "PLAYER" | "CPU", animClass: string) => {
    if (target === "PLAYER") {
      setPlayerAnim(animClass);
      setTimeout(() => setPlayerAnim(""), 400);
    } else {
      setCpuAnim(animClass);
      setTimeout(() => setCpuAnim(""), 400);
    }
  };

  const handleStartBattle = async () => {
    if (playerHand.length !== 3) return;

    const ENTRY_FEE = 50;
    if (coins < ENTRY_FEE) {
      alert(`Você precisa de ${ENTRY_FEE} MasterCoins para batalhar!`);
      return;
    }

    updateCoins(-ENTRY_FEE);
    setPhase("BATTLE");
    setIsArenaReady(false);
    setBattleResult(null);
    setLogSpeaker("INFO");
    setBattleLog("SISTEMA PRONTO. AGUARDANDO COMANDO...");
    setIsProcessingTurn(false);

    const cpuPicks = [
      Math.floor(Math.random() * 1025) + 1,
      Math.floor(Math.random() * 1025) + 1,
      Math.floor(Math.random() * 1025) + 1,
    ];

    const fetchFighterData = async (
      id: number,
    ): Promise<PokemonPreviewData> => {
      const data = await fetchPokemonData(id);
      return {
        id: data.id,
        name: data.name,
        hp: data.stats.find((s: any) => s.stat.name === "hp")?.base_stat || 0,
        attack:
          data.stats.find((s: any) => s.stat.name === "attack")?.base_stat || 0,
        defense:
          data.stats.find((s: any) => s.stat.name === "defense")?.base_stat ||
          0,
        types: data.types.map((t: any) => t.type.name),
      };
    };

    try {
      const [pDeck, cDeck] = await Promise.all([
        Promise.all(playerHand.map(fetchFighterData)),
        Promise.all(cpuPicks.map(fetchFighterData)),
      ]);

      const enhanceDeck = (deck: PokemonPreviewData[]): BattleFighter[] =>
        deck.map((p) => ({ ...p, maxHp: p.hp }));

      setPlayerDeck(enhanceDeck(pDeck));
      setCpuDeck(enhanceDeck(cDeck));
      setActivePlayerIdx(0);
      setActiveCpuIdx(0);
      setIsArenaReady(true);
    } catch (error) {
      console.error("Erro na Arena", error);
      alert("Falha ao comunicar com a PokéAPI.");
      updateCoins(ENTRY_FEE);
      setPhase("DRAFT");
    }
  };

  const handleCombatTurn = (playerAction: "ATTACK" | "DEFEND") => {
    if (isProcessingTurn) return;
    setIsProcessingTurn(true);

    const pDeck = [...playerDeck];
    const cDeck = [...cpuDeck];
    let pCard = { ...pDeck[activePlayerIdx] };
    let cCard = { ...cDeck[activeCpuIdx] };

    let playerDamage = 0;
    if (playerAction === "ATTACK") {
      triggerAnim("PLAYER", "animate-attack-up");
      triggerAnim("CPU", "animate-shake ring-4 ring-red-500");
      setLogSpeaker("PLAYER");

      const multiplier = getDamageMultiplier(pCard.types, cCard.types);
      const isCritical = Math.random() < 0.15;
      const critMultiplier = isCritical ? 1.5 : 1;

      const rawDamage = Math.max(5, pCard.attack - cCard.defense / 2);
      playerDamage = Math.floor(rawDamage * multiplier * critMultiplier);

      let effectText = "";
      if (isCritical) effectText += " CRÍTICO!";
      if (multiplier > 1) effectText += " (Dano Crítico)";
      else if (multiplier < 1 && multiplier > 0) {
        effectText += " (Bloqueado parcialmente)";
        if (playerDamage < 1) playerDamage = 1;
      } else if (multiplier === 0) {
        playerDamage = 2;
        effectText += " (Escudo impenetrável. Dano colateral aplicado)";
      }

      cCard.hp -= playerDamage;
      setBattleLog(`> ATAQUE EXECUTADO: -${playerDamage}HP.${effectText}`);
    } else {
      setLogSpeaker("PLAYER");
      pCard.defense += 20;
      setBattleLog(`> PROTOCOLO DE DEFESA ATIVADO! Escudo ampliado.`);
    }

    if (cCard.hp <= 0) {
      cCard.hp = 0;
      cDeck[activeCpuIdx] = cCard;
      setCpuDeck(cDeck);

      setTimeout(() => {
        setLogSpeaker("INFO");
        setBattleLog(`ALERTA: Inimigo ${cCard.name} destruído!`);

        setTimeout(() => {
          if (activeCpuIdx + 1 >= 3) {
            setIsProcessingTurn(false);
            setPhase("GAMEOVER");
            setBattleResult("WIN");
            setBattleLog("MISSÃO CONCLUÍDA COM SUCESSO.");
            updateCoins(100);
          } else {
            setActiveCpuIdx((prev) => prev + 1);
            setBattleLog(`AVISO: Novo alvo detectado.`);
            setIsProcessingTurn(false);
          }
        }, 2000);
      }, 1500);
      return;
    }

    setTimeout(() => {
      triggerAnim("CPU", "animate-attack-down");
      triggerAnim("PLAYER", "animate-shake ring-4 ring-red-500");
      setLogSpeaker("CPU");

      const cpuMultiplier = getDamageMultiplier(cCard.types, pCard.types);
      const isCpuCritical = Math.random() < 0.15;
      const cpuCritMultiplier = isCpuCritical ? 1.5 : 1;

      const cpuRawDamage = Math.max(5, cCard.attack - pCard.defense / 2);
      let cpuDamage = Math.floor(
        cpuRawDamage * cpuMultiplier * cpuCritMultiplier,
      );

      let cpuEffectText = "";
      if (isCpuCritical) cpuEffectText += " GOLPE CRÍTICO!";
      if (cpuMultiplier > 1) cpuEffectText += " (Super Efetivo)";
      else if (cpuMultiplier < 1 && cpuMultiplier > 0) {
        cpuEffectText += " (Escudo resistiu)";
        if (cpuDamage < 1) cpuDamage = 1;
      } else if (cpuMultiplier === 0) {
        cpuDamage = 2;
        cpuEffectText += " (Dano contido)";
      }

      pCard.hp -= cpuDamage;
      setBattleLog(
        `> INIMIGO ATACA: ${cCard.name} causou -${cpuDamage}HP.${cpuEffectText}`,
      );

      if (playerAction === "DEFEND") {
        pCard.defense -= 20;
      }

      pDeck[activePlayerIdx] = pCard;
      cDeck[activeCpuIdx] = cCard;
      setPlayerDeck(pDeck);
      setCpuDeck(cDeck);

      if (pCard.hp <= 0) {
        pCard.hp = 0;
        setTimeout(() => {
          setLogSpeaker("INFO");
          setBattleLog(`FALHA CRÍTICA: Seu ${pCard.name} foi abatido!`);
          setTimeout(() => {
            if (activePlayerIdx + 1 >= 3) {
              setIsProcessingTurn(false);
              setPhase("GAMEOVER");
              setBattleResult("LOSE");
              setBattleLog("TODAS AS UNIDADES DESTRUÍDAS.");
            } else {
              setActivePlayerIdx((prev) => prev + 1);
              setLogSpeaker("INFO");
              setBattleLog(`SISTEMA: Envie sua próxima unidade.`);
              setIsProcessingTurn(false);
            }
          }, 2000);
        }, 1500);
      } else {
        setTimeout(() => {
          setLogSpeaker("INFO");
          setBattleLog("SISTEMA ESTÁVEL. Aguardando novo comando...");
          setIsProcessingTurn(false);
        }, 2000);
      }
    }, 2500);
  };

  const resetArena = () => {
    setPhase("DRAFT");
    setPlayerHand([]);
    setIsProcessingTurn(false);
  };

  return {
    state: {
      phase,
      coins,
      backpack,
      playerHand,
      battleResult,
      playerDeck,
      cpuDeck,
      activePlayerIdx,
      activeCpuIdx,
      isArenaReady,
      battleLog,
      logSpeaker,
      displayedLog,
      isProcessingTurn,
      playerAnim,
      cpuAnim,
    },
    actions: {
      setPhase,
      setPlayerHand,
      handleStartBattle,
      handleCombatTurn,
      resetArena,
    },
  };
}
