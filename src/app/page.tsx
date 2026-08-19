import { Expertise } from "@/components/sections/home/expertise";
import { FinalCta } from "@/components/sections/home/final-cta";
import { HeroIntro } from "@/components/sections/home/hero-intro";
import { People } from "@/components/sections/home/people";
import { PrinciplesProcess } from "@/components/sections/home/principles-process";
import { ProjectBreak } from "@/components/sections/home/project-break";
import { SelectedWork } from "@/components/sections/home/selected-work";
import { TestimonialInsights } from "@/components/sections/home/testimonial-insights";

export default function HomePage() {
  return (
    <main id="main-content">
      <HeroIntro />
      <SelectedWork />
      <Expertise />
      <PrinciplesProcess />
      <ProjectBreak />
      <People />
      <TestimonialInsights />
      <FinalCta />
    </main>
  );
}
