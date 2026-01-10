import { useEffect, useRef, useState } from "react";
import { symbols } from "../constants/symbols";

type Params = {
  spinToken?: number;
  stopIndex?: number;
  allowStop?: boolean;
  onStop?: (index: number) => void;
};

export const useSpinAnimation = ({ spinToken = 0, stopIndex, allowStop = false, onStop }: Params) => {

  const totalItems = symbols.length * 4;

  const [position, setPosition] = useState(0);

  const rafRef = useRef<number | null>(null);
  const stopIndexRef = useRef<number | undefined>(undefined);
  const onStopRef = useRef<typeof onStop>();

  const animationStateRef = useRef<{
    startTime: number;
    absPos: number;
    goalAbsPos: number | null;
    decelStartPos: number | null;
    finalIndex: number;
    mode: 'spinning' | 'decel' | 'stopped';
  } | null>(null);

  const shouldStopRef = useRef<boolean>(false);
  useEffect(() => {
    shouldStopRef.current = !!allowStop;
  }, [allowStop]);

  useEffect(() => {
    stopIndexRef.current = stopIndex;
  }, [stopIndex]);

  useEffect(() => {
    onStopRef.current = onStop;
  }, [onStop]);

  useEffect(() => {
    shouldStopRef.current = false;
    if (!spinToken) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const now = performance.now();

    const currentAbs = animationStateRef.current?.absPos ?? 0;
    const targetIndex = stopIndexRef.current !== undefined 
      ? Math.abs(stopIndexRef.current) % symbols.length 
      : Math.floor(Math.random() * symbols.length);

    const goalAbsPos = null;

    animationStateRef.current = {
      startTime: now,
      absPos: currentAbs,
      goalAbsPos,
      decelStartPos: null,
      finalIndex: targetIndex,
      mode: 'spinning',
    };

    const MAX_SPEED = 1100;
    const DECEL_MS = 1200;
    const itemHeightLocal = 110;
    const cycleHeightLocal = itemHeightLocal * symbols.length;
    const totalItemsLocal = symbols.length * 4;
    const totalHeightLocal = itemHeightLocal * totalItemsLocal;

    let lastTime = now;

    const animate = (time: number) => {
      const state = animationStateRef.current!;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (state.mode === 'spinning') {
        state.absPos += MAX_SPEED * dt;

        if (shouldStopRef.current && state.goalAbsPos === null) {
          const remainderLocal = state.absPos % cycleHeightLocal;
          let deltaToTarget = (state.finalIndex * itemHeightLocal - remainderLocal + cycleHeightLocal) % cycleHeightLocal;
          if (deltaToTarget < itemHeightLocal) deltaToTarget += cycleHeightLocal;
          const extraCycles = 1;
          state.goalAbsPos = state.absPos + deltaToTarget + extraCycles * cycleHeightLocal;
          state.decelStartPos = state.absPos;
          state.startTime = time;
          state.mode = 'decel';
        }
      } else if (state.mode === 'decel') {
        const decelStart = state.decelStartPos ?? state.absPos;
        const distanceToGoal = (state.goalAbsPos ?? state.absPos) - decelStart;
        const decelProgress = Math.min(1, (time - state.startTime) / DECEL_MS);
        const eased = 1 - Math.pow(1 - decelProgress, 3);
        state.absPos = decelStart + distanceToGoal * eased;

        if (decelProgress >= 1) {
          state.absPos = state.goalAbsPos ?? state.absPos;
          state.mode = 'stopped';
        }
      }

      if (state.mode !== 'stopped') {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setPosition(((state.absPos % totalHeightLocal) + totalHeightLocal) % totalHeightLocal);
        onStopRef.current?.(state.finalIndex);
        rafRef.current = null;
        return;
      }

      const normalizedPos = ((state.absPos % totalHeightLocal) + totalHeightLocal) % totalHeightLocal;
      setPosition(normalizedPos);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [spinToken]);

  const reelItems = () => {
    const counts = new Map<string, number>();
    return Array.from({ length: totalItems }, (_, i) => {
      const src = symbols[i % symbols.length];
      const seen = counts.get(src) ?? 0;
      counts.set(src, seen + 1);
      const id = `${src}-${seen}`;
      return { id, src };
    });
  };

  return { reelItems, position };
};
