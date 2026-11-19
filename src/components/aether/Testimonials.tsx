import { motion } from "motion/react";

const quotes = [
  {
    quote:
      "The unboxing alone felt like a film. Aether's attention to material is unmatched in this category.",
    name: "Imogen Pak",
    role: "Creative Director, FORM Studio",
  },
  {
    quote:
      "I no longer browse five marketplaces. Whatever Aether ships, it's already the right thing.",
    name: "Mateo Ribeiro",
    role: "Industrial Designer",
  },
  {
    quote: "Service like a private gallery. Returns handled before I'd unpacked the spare unit.",
    name: "Naomi Eze",
    role: "Architect, ECHO Projects",
  },
];

export function Testimonials() {
  return (
    <section
      id="story"
      className="relative scroll-mt-24 py-32 overflow-hidden border-y border-white/5"
    >
      <div className="absolute inset-0 bg-aurora opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-8 mb-16">
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.32em] text-aether mb-4">
              10 / Voices
            </p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.88]">
              Heard from
              <br />
              <span className="text-aether-gradient">the inner circle.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass-strong rounded-3xl p-8 lg:p-10 flex flex-col gap-8 shadow-elevated"
            >
              <span className="font-display text-6xl text-aether leading-none">"</span>
              <blockquote className="text-lg leading-relaxed text-platinum">{q.quote}</blockquote>
              <figcaption className="mt-auto">
                <div className="font-display tracking-[0.08em] text-xl">{q.name}</div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground mt-1">
                  {q.role}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
