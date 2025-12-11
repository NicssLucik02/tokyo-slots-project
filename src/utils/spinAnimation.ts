import { useEffect, useMemo, useRef, useState } from "react";
import { symbols } from "../constants/symbols";

type Params = {
  spinToken?: number;
  stopIndex?: number;
  allowStop?: boolean;
  onStop?: (index: number) => void;
};

export const useSpinAnimation = ({ spinToken = 0, stopIndex, allowStop = false, onStop }: Params) => {

  const itemHeight = 110;
  const totalItems = symbols.length * 4;
  const totalHeight = itemHeight * totalItems;
  const cycleHeight = itemHeight * symbols.length;

  const [position, setPosition] = useState(0);

  const rafRef = useRef<number | null>(null);

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
    shouldStopRef.current = false;
    if (!spinToken) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const now = performance.now();

    const currentAbs = animationStateRef.current?.absPos ?? 0;
    const targetIndex = stopIndex !== undefined 
      ? Math.abs(stopIndex) % symbols.length 
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

    let lastTime = now;

    const animate = (time: number) => {
      const state = animationStateRef.current!;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (state.mode === 'spinning') {
        state.absPos += MAX_SPEED * dt;

        if (shouldStopRef.current && state.goalAbsPos === null) {
          const remainderLocal = state.absPos % cycleHeight;
          let deltaToTarget = (state.finalIndex * itemHeight - remainderLocal + cycleHeight) % cycleHeight;
          if (deltaToTarget < itemHeight) deltaToTarget += cycleHeight;
          const extraCycles = 1;
          state.goalAbsPos = state.absPos + deltaToTarget + extraCycles * cycleHeight;
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
        setPosition(((state.absPos % totalHeight) + totalHeight) % totalHeight);
        onStop?.(state.finalIndex);
        rafRef.current = null;
        return;
      }

      const normalizedPos = ((state.absPos % totalHeight) + totalHeight) % totalHeight;
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

  const reelItems = useMemo(() => {
    return Array.from({ length: totalItems }, (_, i) => symbols[i % symbols.length]);
  }, [totalItems]);

  return { reelItems, position };
};
