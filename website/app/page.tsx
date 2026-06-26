"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Sparkles,
  WandSparkles,
  BookOpen,
  Plug,
  ShieldCheck,
  ArrowRight,
  Download,
} from "lucide-react";
import { VoiceOrb } from "@/components/ui/voice-orb";
import { Reveal } from "@/components/site/reveal";
import { Transcript } from "@/components/site/transcript";

const REPO = "https://github.com/SamNickGammer/lazytype.omprakashbharti.in";
const DOWNLOAD = `${REPO}/releases/latest/download/LazyType.dmg`;

const features = [
  {
    icon: Mic,
    title: "Hold-to-talk",
    body: "Hold a key and speak. Release, and your words land — cleaned up — wherever your cursor is.",
    span: "lg:col-span-1",
  },
  {
    icon: Sparkles,
    title: "Context-aware cleanup",
    body: "LazyType reads nearby app context, so names, jargon, and product terms come out spelled right every time — not phonetically guessed.",
    span: "lg:col-span-2",
  },
  {
    icon: WandSparkles,
    title: "Edit by voice",
    body: 'Select text, say "make this shorter" or "turn this into bullets," and watch it rewrite in place.',
    span: "lg:col-span-2",
  },
  {
    icon: BookOpen,
    title: "Custom vocabulary",
    body: "Teach it the names and project words you use so they're never mangled.",
    span: "lg:col-span-1",
  },
  {
    icon: Plug,
    title: "Bring your own model",
    body: "Groq by default, or point it at any OpenAI-compatible provider — including local models.",
    span: "lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "There is no LazyType server. The only data that leaves your Mac goes straight to the provider you chose — nowhere else.",
    span: "lg:col-span-2",
  },
];

const loop = [
  { key: "Fn", verb: "Hold", note: "Press and hold to open the mic." },
  { key: "🎙", verb: "Speak", note: "Say it however it comes out." },
  { key: "↩", verb: "Release", note: "Clean text appears, pasted." },
];

export default function Home() {
  const [listening, setListening] = useState(false);
  const [level, setLevel] = useState(0);

  return (
    <main className="relative overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50">
        <div className="mx-4 mt-4 flex max-w-content items-center justify-between gap-4 rounded-full px-5 py-3 glass sm:mx-auto">
          <a href="#top" className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-display text-lg font-semibold tracking-tight">
              LazyType
            </span>
          </a>
          <nav className="flex items-center gap-1 text-sm text-lavender">
            <a href="#features" className="hidden rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white sm:block">
              Features
            </a>
            <a href="#loop" className="hidden rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white sm:block">
              The loop
            </a>
            <a href={REPO} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:bg-white/5 hover:text-white">
              <GitHubMark className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href={DOWNLOAD}
              className="ml-1 rounded-full bg-brand px-4 py-1.5 font-medium text-white transition hover:bg-brand-dark"
            >
              Download
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative mx-auto flex max-w-content flex-col items-center px-6 pb-24 pt-14 text-center sm:pt-20">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-voice" />
          <span className="eyebrow text-[11px]">Free &amp; open source · macOS</span>
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-7 font-display text-6xl font-semibold leading-[0.95] tracking-tight sm:text-8xl"
        >
          Speak. <span className="text-wash">It types.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-lavender"
        >
          Fast AI dictation for your Mac. Hold a key, say what you mean, and get
          clean, context-aware text pasted into any app — no subscription.
        </motion.p>

        {/* Orb centerpiece */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-10 flex h-[300px] w-[300px] items-center justify-center sm:h-[380px] sm:w-[380px]"
        >
          {/* Reactive glow ring — swells with your voice when listening. */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full blur-3xl transition-opacity duration-300"
            style={{
              background:
                "radial-gradient(circle, rgba(107,92,245,0.45), rgba(67,224,216,0.18) 55%, transparent 72%)",
              transform: `scale(${1 + level * 0.5})`,
              opacity: 0.7 + level * 0.3,
            }}
          />
          <VoiceOrb
            listening={listening}
            onLevel={setLevel}
            className="relative z-10"
          />

          {/* Mic toggle, overlaid at the base of the orb */}
          <button
            onClick={() => setListening((v) => !v)}
            aria-pressed={listening}
            className={`absolute -bottom-2 z-20 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-xl transition ${
              listening
                ? "bg-voice/15 text-voice ring-1 ring-voice/40"
                : "glass text-lavender hover:text-white"
            }`}
          >
            {listening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            {listening ? "Listening…" : "Speak to it"}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 w-full"
        >
          <Transcript />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <a
            href={DOWNLOAD}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark sm:w-auto"
          >
            <Download className="h-5 w-5" />
            Download LazyType.dmg
          </a>
          <a
            href={REPO}
            className="flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-[#ECEAF5] glass transition hover:bg-white/5 sm:w-auto"
          >
            <GitHubMark className="h-5 w-5" />
            View source
          </a>
        </motion.div>
        <p className="mt-4 font-mono text-xs text-lavender-faint">
          works on all macs · apple silicon + intel
        </p>
      </section>

      {/* Features — asymmetric bento */}
      <section id="features" className="mx-auto max-w-content px-6 py-20">
        <Reveal>
          <p className="eyebrow text-center">what it does</p>
          <h2 className="mt-3 text-center font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Premium dictation, minus the price
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lavender">
            The speed of paid tools, without the subscription or the privacy
            trade-offs.
          </p>
        </Reveal>

        <div className="mt-14 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08} className={f.span}>
                <div className="group h-full rounded-3xl p-7 glass transition hover:border-brand/40 hover:bg-white/[0.05]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/15 text-brand-light ring-1 ring-brand/25 transition group-hover:bg-brand/25">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-lavender">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* The loop — the real usage sequence, not a generic setup list */}
      <section id="loop" className="relative mx-auto max-w-content px-6 py-20">
        <Reveal>
          <p className="eyebrow text-center">the loop</p>
          <h2 className="mt-3 text-center font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Hold. Speak. Release.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lavender">
            One muscle-memory gesture. No window to open, no button to find.
          </p>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connecting hairline on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          {loop.map((s, i) => (
            <Reveal key={s.verb} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl text-2xl glass">
                  <span className="font-mono">{s.key}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {s.verb}
                </h3>
                <p className="mt-2 max-w-[14rem] text-sm text-lavender">
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center font-mono text-xs text-lavender-faint">
            default: hold <Kbd>Fn</Kbd> to talk · tap <Kbd>⌘</Kbd>
            <Kbd>Fn</Kbd> to toggle · fully remappable
          </p>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal>
          <div className="dotgrid relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand/20 via-surface to-voice/10 p-12 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand/30 blur-3xl" />
            <h2 className="relative font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Stop typing. Start talking.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lavender">
              Free and open source. Download it and dictate your next email,
              message, or commit.
            </p>
            <a
              href={DOWNLOAD}
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
            >
              Download for macOS
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-lavender-faint sm:flex-row">
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span>
              LazyType — built by{" "}
              <a href={REPO} className="text-lavender hover:text-white">
                SamNickGammer
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href={REPO} className="hover:text-white">
              GitHub
            </a>
            <a href={`${REPO}/blob/main/LICENSE`} className="hover:text-white">
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 inline-flex min-w-[1.6em] items-center justify-center rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-[#ECEAF5]">
      {children}
    </kbd>
  );
}

function BrandMark() {
  return (
    <img
      src="/logo.png"
      alt="LazyType logo"
      width={28}
      height={28}
      className="h-7 w-7 rounded-lg"
    />
  );
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.555 0-.274-.01-1-.015-1.965-3.197.695-3.872-1.54-3.872-1.54-.523-1.33-1.277-1.685-1.277-1.685-1.044-.714.08-.699.08-.699 1.155.082 1.763 1.186 1.763 1.186 1.026 1.758 2.692 1.25 3.348.956.103-.743.401-1.25.73-1.538-2.553-.29-5.238-1.277-5.238-5.683 0-1.255.448-2.282 1.183-3.087-.119-.29-.513-1.46.112-3.043 0 0 .965-.309 3.163 1.18a10.97 10.97 0 0 1 2.88-.388c.977.004 1.96.132 2.88.388 2.196-1.489 3.16-1.18 3.16-1.18.627 1.583.233 2.753.114 3.043.737.805 1.182 1.832 1.182 3.087 0 4.417-2.69 5.39-5.252 5.674.413.355.78 1.057.78 2.13 0 1.538-.014 2.778-.014 3.157 0 .308.207.668.79.554A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}
