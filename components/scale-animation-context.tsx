"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ScaleAnimationState {
  settled: boolean;
  setSettled: (settled: boolean) => void;
}

// Default true: on any page without a HeroSection, the header logo renders
// immediately instead of waiting for an animation that will never run.
// HeroSection flips this to false on mount, then back to true once its
// scale illustration finishes settling, so the header logo reveal stays
// in sync with the hero animation only on the landing page.
const ScaleAnimationContext = createContext<ScaleAnimationState>({
  settled: true,
  setSettled: () => {},
});

export function ScaleAnimationProvider({ children }: { children: ReactNode }) {
  const [settled, setSettled] = useState(true);
  return (
    <ScaleAnimationContext.Provider value={{ settled, setSettled }}>
      {children}
    </ScaleAnimationContext.Provider>
  );
}

export function useScaleAnimation() {
  return useContext(ScaleAnimationContext);
}
