# LazyType website

Marketing site for [LazyType](https://github.com/SamNickGammer/lazytype.omprakashbharti.in) — fast AI dictation for macOS. Built by SamNickGammer.

A dynamic, animated landing page built around a voice-reactive WebGL orb: ambient
by default, and it responds to your microphone when you tap **Speak to it**.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS 3](https://tailwindcss.com/) + TypeScript
- [framer-motion](https://www.framer.com/motion/) — page-load sequence & scroll reveals
- [OGL](https://github.com/oframe/ogl) — the WebGL voice orb shader
- [lucide-react](https://lucide.dev/) — icons
- Fonts via `next/font`: Bricolage Grotesque (display) · Inter (body) · JetBrains Mono (mono)

## Structure

```
website/
├─ app/                 # App Router: layout (fonts + metadata), page, globals.css
├─ components/
│  ├─ ui/voice-orb.tsx  # WebGL orb (OGL), opt-in mic, CSS fallback if no WebGL
│  └─ site/             # reveal.tsx (scroll reveals), transcript.tsx (signature)
├─ lib/utils.ts         # cn() class merge helper
└─ tailwind.config.ts   # brand/voice color tokens + font roles
```

## Develop

```bash
cd website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The orb only requests microphone
access after you click **Speak to it** — never on load.

## Build

```bash
npm run build
npm start
```

## Deploy

The site is a standard Next.js 14 app and hosts anywhere that supports Next.

- **Vercel (recommended):** import the repo and set the project **Root Directory** to
  `website/`. Build command `npm run build`, output is detected automatically.
- **Netlify / Cloudflare Pages:** base directory `website/`, build `npm run build`.
- **Self-host:** `npm run build && npm start` behind your reverse proxy of choice.

> Note: the page uses WebGL and the Web Audio API in the browser. Both degrade
> gracefully — if WebGL is unavailable the orb falls back to a static CSS gradient,
> and the mic stays off until the user opts in.
