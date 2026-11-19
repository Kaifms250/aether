import "@fontsource/bebas-neue/400.css";
import "@fontsource/barlow/300.css";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { SmoothScroll } from "@/components/aether/SmoothScroll";
import { Nav } from "@/components/aether/Nav";
import { Hero } from "@/components/aether/Hero";
import { BrandMarquee } from "@/components/aether/BrandMarquee";
import { Stats } from "@/components/aether/Stats";
import { Categories } from "@/components/aether/Categories";
import { Showcase } from "@/components/aether/Showcase";
import { Testimonials } from "@/components/aether/Testimonials";
import { Newsletter } from "@/components/aether/Newsletter";
import { Footer } from "@/components/aether/Footer";

export default function Index() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let timer = 0;
    let attempts = 0;
    const scrollWhenReady = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 40) {
        attempts += 1;
        timer = window.setTimeout(scrollWhenReady, 50);
      }
    };
    scrollWhenReady();
    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <main className="relative bg-background text-foreground overflow-x-clip">
      <SmoothScroll />
      <Nav />
      <Hero />
      <BrandMarquee />
      <Stats />
      <Categories />
      <Showcase />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
