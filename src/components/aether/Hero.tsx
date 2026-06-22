import { motion } from "motion/react";
import { Hero3D } from "./Hero3D";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden grain"
    >
      {/* 3D backdrop */}
      <div className="absolute inset-0">
        <Hero3D />
      </div>
      {/* vignette + bottom fade */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,oklch(0.13_0.02_270/0.85)_100%)]" />
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-60 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-aether pulse-ring" />
          Winter Index · 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display leading-[0.82] tracking-[-0.005em]"
          style={{ fontSize: "clamp(4rem, 12vw, 12rem)" }}
        >
          <span className="block text-platinum-gradient">Objects worth</span>
          <span className="block text-aether-gradient">keeping.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-10 max-w-xl text-lg md:text-xl text-platinum/85 leading-relaxed"
        >
          Aether is a curated index of the world's most considered electronics,
          fashion, and home goods — assembled into one cinematic shop.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <a
            href="#categories"
            className="group inline-flex items-center gap-3 rounded-full bg-platinum text-background px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium magnetic hover:shadow-glow"
          >
            Enter the index
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#story"
            className="inline-flex items-center gap-3 rounded-full glass px-7 py-4 text-xs uppercase tracking-[0.22em] hover:bg-[oklch(1_0_0/0.08)] transition"
          >
            <span className="h-2 w-2 rounded-full bg-aether" />
            Watch the film · 1:42
          </a>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.32em] text-platinum/60"
      >
        <span>Scroll</span>
        <span className="block h-10 w-px bg-gradient-to-b from-platinum/60 to-transparent" />
      </motion.div>
    </section>
  );
}
