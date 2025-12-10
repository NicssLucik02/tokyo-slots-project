import { useEffect, useMemo, useRef, useState } from "react";
import { symbols } from "../constants/symbols";
import { useSlotStore } from "../store/useSlotStore";

type Params = {
  spinToken?: number;
  stopIndex?: number;
  onStop?: (index: number) => void;
};

export const useSpinAnimation = ({ spinToken = 0, stopIndex, onStop }: Params) => {
  const { handleChangeSpinStatus } = useSlotStore();

  const itemHeight = 110;
  const totalItems = symbols.length * 4;
  const totalHeight = itemHeight * totalItems;
  const cycleHeight = itemHeight * symbols.length;

  const [position, setPosition] = useState(0);

  const rafRef = useRef<number | null>(null);

  const animationStateRef = useRef<{
    startTime: number;
    absPos: number;
    goalAbsPos: number;
    decelStartPos: number;
    finalIndex: number;
  } | null>(null);

  useEffect(() => {
    if (!spinToken) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    handleChangeSpinStatus(true);

    const now = performance.now();

    const currentAbs = animationStateRef.current?.absPos ?? 0;
    const remainder = currentAbs % cycleHeight;

    const targetIndex = stopIndex !== undefined 
      ? Math.abs(stopIndex) % symbols.length 
      : Math.floor(Math.random() * symbols.length);

    let deltaToTarget = (targetIndex * itemHeight - remainder + cycleHeight) % cycleHeight;
    if (deltaToTarget < itemHeight) deltaToTarget += cycleHeight;

    const extraCycles = 3 + Math.floor(Math.random() * 2);
    const goalAbsPos = currentAbs + deltaToTarget + extraCycles * cycleHeight;

    animationStateRef.current = {
      startTime: now,
      absPos: currentAbs,
      goalAbsPos,
      decelStartPos: 0,
      finalIndex: targetIndex,
    };

    const ACCEL_MS = 800 + Math.random() * 300;
    const CRUISE_MS = 1400 + Math.random() * 600;
    const DECEL_MS = 2200 + Math.random() * 800;
    const MAX_SPEED = 1100;

    let lastTime = now;

    const animate = (time: number) => {
      const state = animationStateRef.current!;
      const t = time - state.startTime;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      let speed = 0;

      if (t < ACCEL_MS) {
        const k = t / ACCEL_MS;
        speed = MAX_SPEED * (1 - Math.cos(k * Math.PI)) / 2;
      } else if (t < ACCEL_MS + CRUISE_MS) {
        speed = MAX_SPEED;
      } else if (t < ACCEL_MS + CRUISE_MS + DECEL_MS) {
        const decelProgress = (t - ACCEL_MS - CRUISE_MS) / DECEL_MS;
        if (state.decelStartPos === 0) {
          state.decelStartPos = state.absPos;
        }
        const distanceToGoal = state.goalAbsPos - state.decelStartPos;
        const eased = 1 - Math.pow(1 - decelProgress, 3);
        state.absPos = state.decelStartPos + distanceToGoal * eased;
      } else {
        state.absPos = state.goalAbsPos;
      }

      if (t < ACCEL_MS + CRUISE_MS + DECEL_MS) {
        state.absPos += speed * dt;
        rafRef.current = requestAnimationFrame(animate);
      } else {
        state.absPos = state.goalAbsPos;
        setPosition(state.absPos % totalHeight);
        handleChangeSpinStatus(false);
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
  }, []);

  return { reelItems, position };
};
