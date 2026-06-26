"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * The signature device: shows raw, mumbly speech (with filler) being typed,
 * then resolving into the clean text LazyType actually pastes. Cycles forever.
 * The split between the lavender "spoken" line and the white "typed" line is
 * the whole product in one component.
 */
const TAKES = [
  {
    said: "um so can you like reschedule the standup to 2 maybe",
    typed: "Can you reschedule the standup to 2pm?",
  },
  {
    said: "ok ship it but uh add a note about the api key thing",
    typed: "Ship it — and add a note about the API key.",
  },
  {
    said: "thanks so much for the uh quick turnaround on this",
    typed: "Thanks so much for the quick turnaround on this.",
  },
];

const TYPE_MS = 32;
const HOLD_MS = 1900;

export function Transcript() {
  const [take, setTake] = useState(0);
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding">("typing");
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) setCount(TAKES[0].typed.length);
  }, []);

  const current = TAKES[take];

  useEffect(() => {
    if (reduced.current) return;
    if (phase === "typing") {
      if (count < current.typed.length) {
        const id = setTimeout(() => setCount((c) => c + 1), TYPE_MS);
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("holding"), HOLD_MS);
      return () => clearTimeout(id);
    }
    // holding -> advance to next take
    const id = setTimeout(() => {
      setTake((t) => (t + 1) % TAKES.length);
      setCount(0);
      setPhase("typing");
    }, 500);
    return () => clearTimeout(id);
  }, [phase, count, current.typed.length]);

  const done = count >= current.typed.length;

  return (
    <div className="glass mx-auto w-full max-w-xl rounded-2xl p-5 text-left">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-[10px]">live dictation</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={done ? "pasted" : "transcribing"}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
              done ? "text-voice" : "text-lavender-faint"
            }`}
          >
            {done ? "● pasted" : "○ transcribing"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* What you said */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`said-${take}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 font-mono text-sm leading-relaxed text-lavender-faint"
        >
          <span className="text-voice/70">you&nbsp;say&nbsp;›&nbsp;</span>
          &ldquo;{current.said}&rdquo;
        </motion.p>
      </AnimatePresence>

      {/* What LazyType writes */}
      <p className="mt-3 font-mono text-base leading-relaxed text-[#ECEAF5]">
        <span className="text-brand-light">it&nbsp;writes&nbsp;›&nbsp;</span>
        {current.typed.slice(0, count)}
        <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-voice align-middle animate-caret" />
      </p>
    </div>
  );
}
