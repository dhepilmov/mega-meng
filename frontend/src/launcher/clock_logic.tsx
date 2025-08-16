import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * 24h Analog Mapping (clockwise, 0° = TOP):
 * - NOON (12:00)     => 0° (top)
 * - DUSK (18:00)     => 90° (right)
 * - MIDNIGHT (00:00) => 180° (down)
 * - MORNING (06:00)  => 270° (left)
 *
 * Angles returned here are measured in degrees clockwise from 12 o’clock (top).
 * You can pass these directly to CSS `transform: rotate(${angle}deg)` if your hand graphics
 * are drawn pointing up by default.
 */

export type ClockNowSource =
  | Date
  | (() => Date);

/** Core data the UI will read (headless). */
export interface ClockState {
  /** Angle for the 24h hour hand (0..360) with noon at 0°. */
  hour24Angle: number;
  /** Angle for the minute hand (0..360). */
  minuteAngle: number;
  /** Angle for the second hand (0..360). */
  secondAngle: number;

  /** Convenience raw time fields (local time). */
  hours24: number;   // 0..23
  minutes: number;   // 0..59
  seconds: number;   // 0..59
  millis: number;    // 0..999
}

/** Tuning options for ticking. */
export interface Use24hClockOptions {
  /** How often to update (ms). Default 1000. */
  tickRateMs?: number;
  /**
   * Time source (optional) for testing or custom clocks.
   * If omitted, uses the system clock.
   */
  now?: ClockNowSource;
  /**
   * Whether to use requestAnimationFrame for smooth ticking within each second.
   * Default false (saves power). If true, `secondAngle` animates fluidly.
   */
  smooth?: boolean;
}

/** Hand props (UI layer will define these components later). */
export interface HandProps {
  /** Angle in degrees clockwise from 12 o’clock (top). */
  angle: number;
}

/**
 * In the UI layer, you will implement components:
 *   - HourHand(props: HandProps)
 *   - MinuteHand(props: HandProps)
 *   - SecondHand(props: HandProps)
 *
 * We declare types here so logic can “default to use hand UI” by type,
 * without importing UI (avoids circular deps).
 */
export interface HandComponents {
  HourHand?: React.ComponentType<HandProps>;
  MinuteHand?: React.ComponentType<HandProps>;
  SecondHand?: React.ComponentType<HandProps>;
}

/** Context bundles the current clock state and (optionally) hand component registry. */
export interface ClockContextValue {
  state: ClockState;
  hands?: HandComponents; // UI can provide defaults; logic doesn’t render.
}

const ClockContext = createContext<ClockContextValue | null>(null);

/** Headless provider that computes angles and exposes them via context. */
export function ClockLogicProvider(
  props: React.PropsWithChildren<{
    options?: Use24hClockOptions;
    hands?: HandComponents; // Optional registry provided by UI layer.
  }>
) {
  const state = use24hClock(props.options);
  const value = useMemo<ClockContextValue>(() => ({ state, hands: props.hands }), [state, props.hands]);
  return <ClockContext.Provider value={value}>{props.children}</ClockContext.Provider>;
}

/** Hook the UI will call to read clock angles/state. */
export function useClockLogic() {
  const ctx = useContext(ClockContext);
  if (!ctx) {
    throw new Error("useClockLogic must be used within <ClockLogicProvider>.");
  }
  return ctx;
}

/** Core hook that computes a 24h hour angle + standard minute/second angles. */
export function use24hClock(options?: Use24hClockOptions): ClockState {
  const { tickRateMs = 1000, now, smooth = false } = options ?? {};
  const [nowMs, setNowMs] = useState<number>(() => getNowMs(now));

  const rafRef = useRef<number | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    if (smooth) {
      const loop = () => {
        setNowMs(getNowMs(now));
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
      return () => {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      };
    } else {
      // Discrete ticking
      const tick = () => setNowMs(getNowMs(now));
      tick(); // sync immediately
      const id = window.setInterval(tick, tickRateMs);
      tickRef.current = id;
      return () => {
        if (tickRef.current != null) clearInterval(tickRef.current);
      };
    }
  }, [tickRateMs, smooth, now]);

  // Break down local time
  const d = new Date(nowMs);
  const hours24 = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const millis = d.getMilliseconds();

  // Fractions
  const secondFrac = (seconds * 1000 + millis) / 60000; // within a minute
  const minuteFrac = (minutes + (seconds + millis / 1000) / 60) / 60; // within an hour

  // Minute & Second angles (standard 60-based)
  const minuteAngle = minuteFrac * 360;
  const secondAngle = ((seconds + millis / 1000) / 60) * 360;

  // 24h hour angle with NOON at 0° (top), clockwise.
  // Total seconds since midnight, then shift by -12h so NOON becomes 0°.
  const totalMs = ((hours24 * 60 + minutes) * 60 + seconds) * 1000 + millis;
  const noonShiftMs = totalMs - 12 * 60 * 60 * 1000; // shift so 12:00 => 0°
  const hour24Angle = normalize360((noonShiftMs % DAY_MS) / DAY_MS * 360);

  return {
    hour24Angle,
    minuteAngle,
    secondAngle,
    hours24,
    minutes,
    seconds,
    millis,
  };
}

/** Utilities */
const DAY_MS = 24 * 60 * 60 * 1000;

function getNowMs(src?: ClockNowSource): number {
  if (!src) return Date.now();
  if (src instanceof Date) return src.getTime();
  return src().getTime();
}

function normalize360(n: number): number {
  const r = n % 360;
  return r < 0 ? r + 360 : r;
}
