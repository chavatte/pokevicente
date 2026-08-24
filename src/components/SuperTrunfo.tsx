import { useArenaEngine } from "../hooks/useArenaEngine";
import ArenaDraft from "./ArenaDraft";
import ArenaBattle from "./ArenaBattle";
import ArenaGameOver from "./ArenaGameOver";

type SuperTrunfoProps = {
  onClose: () => void;
};

export default function SuperTrunfo({ onClose }: SuperTrunfoProps) {
  const { state, actions } = useArenaEngine();

  return (
    <>
      {state.phase === "DRAFT" && (
        <ArenaDraft state={state} actions={actions} onClose={onClose} />
      )}

      {state.phase === "BATTLE" && (
        <ArenaBattle state={state} actions={actions} />
      )}

      {state.phase === "GAMEOVER" && (
        <ArenaGameOver state={state} actions={actions} />
      )}
    </>
  );
}