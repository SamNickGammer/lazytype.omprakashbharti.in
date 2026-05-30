import Link from "next/link";

const REPO = "https://github.com/SamNickGammer/lazytype.omprakashbharti.in";
const DOWNLOAD = `${REPO}/releases/latest/download/LazyType.dmg`;

const features = [
  {
    title: "Hold-to-talk",
    body: "Hold a key and speak. Release and your words are cleaned up and pasted into whatever app you're in.",
    icon: "🎙️",
  },
  {
    title: "Context-aware cleanup",
    body: "LazyType reads nearby app context so names, jargon, and terms come out spelled correctly every time.",
    icon: "✨",
  },
  {
    title: "Edit by voice",
    body: 'Highlight text and say "make this shorter" or "turn this into bullets." It rewrites in place.',
    icon: "✏️",
  },
  {
    title: "Custom vocabulary",
    body: "Teach it the names, products, and project words you use so they're never mangled.",
    icon: "📚",
  },
  {
    title: "Bring your own model",
    body: "Use Groq by default, or point LazyType at any OpenAI-compatible provider — including local models.",
    icon: "🔌",
  },
  {
    title: "Private by design",
    body: "There's no LazyType server. The only data that leaves your Mac goes straight to the provider you choose.",
    icon: "🔒",
  },
];

const steps = [
  { n: "01", title: "Download & install", body: "Grab the DMG and drag LazyType to Applications. Works on Apple Silicon and Intel." },
  { n: "02", title: "Add an API key", body: "Get a free Groq API key (or use your own provider) and paste it into setup." },
  { n: "03", title: "Hold, talk, done", body: "Hold Fn to talk or tap Command-Fn to toggle. Your text appears wherever your cursor is." },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <BrandMark />
          <span className="text-lg font-semibold tracking-tight">LazyType</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="#features" className="hidden hover:text-white sm:block">Features</a>
          <a href="#how" className="hidden hover:text-white sm:block">How it works</a>
          <a href={REPO} className="hover:text-white">GitHub</a>
          <a
            href={DOWNLOAD}
            className="rounded-full bg-brand px-4 py-2 font-medium text-white transition hover:bg-brand-dark"
          >
            Download
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="brand-glow pointer-events-none absolute inset-x-0 top-0 h-[500px]" />
        <div className="relative mx-auto max-w-4xl px-6 pb-24 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
            Free & open source · macOS
          </span>
          <h1 className="mt-6 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-7xl">
            Talk. <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">LazyType</span> writes.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Fast AI dictation for your Mac. Hold a key, say what you mean, and get clean,
            context-aware text pasted into any app — no monthly subscription.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={DOWNLOAD}
              className="w-full rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark sm:w-auto"
            >
              ⬇ Download LazyType.dmg
            </a>
            <a
              href={REPO}
              className="w-full rounded-full border border-white/15 px-8 py-4 text-base font-semibold text-neutral-200 transition hover:bg-white/5 sm:w-auto"
            >
              View source
            </a>
          </div>
          <p className="mt-4 text-sm text-neutral-500">Works on all Macs · Apple Silicon + Intel</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to type by voice
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
          The speed of premium dictation tools, without the price tag or the privacy trade-offs.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-brand/40 hover:bg-white/[0.05]"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Up and running in three steps
        </h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <div className="text-4xl font-bold text-brand-light/60">{s.n}</div>
              <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/20 to-brand-light/10 p-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Stop typing. Start talking.</h2>
          <p className="mx-auto mt-4 max-w-xl text-neutral-300">
            LazyType is free and open source. Download it and dictate your next email, message, or doc.
          </p>
          <a
            href={DOWNLOAD}
            className="mt-8 inline-block rounded-full bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition hover:bg-brand-dark"
          >
            ⬇ Download for macOS
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-neutral-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <BrandMark />
            <span>LazyType — built by <span className="text-neutral-300">SamNickGammer</span></span>
          </div>
          <div className="flex items-center gap-6">
            <a href={REPO} className="hover:text-white">GitHub</a>
            <a href={`${REPO}/blob/main/LICENSE`} className="hover:text-white">MIT License</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-light text-sm font-black text-white"
    >
      L
    </span>
  );
}
