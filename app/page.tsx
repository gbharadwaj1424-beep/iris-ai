"use client";

import { useLenis } from "@/hooks/useLenis";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { ArchitecturePipeline } from "@/components/landing/ArchitecturePipeline";
import { InteractiveDemo } from "@/components/landing/InteractiveDemo";
import { Segmentation } from "@/components/landing/Segmentation";
import { Explainability } from "@/components/landing/Explainability";
import { PerformanceDashboard } from "@/components/landing/PerformanceDashboard";
import { ObjectDetection } from "@/components/landing/ObjectDetection";
import { CompareSlider } from "@/components/landing/CompareSlider";
import { Models } from "@/components/landing/Models";
import { TechStack } from "@/components/landing/TechStack";
import { Timeline } from "@/components/landing/Timeline";
import { Team } from "@/components/landing/Team";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  useLenis();

  return (
    <main className="relative bg-void">
      <Navbar />
      <Hero />
      <ProblemStatement />
      <ArchitecturePipeline />
      <InteractiveDemo />
      <Segmentation />
      <Explainability />
      <PerformanceDashboard />
      <ObjectDetection />
      <CompareSlider />
      <Models />
      <TechStack />
      <Timeline />
      <Team />
      <Footer />
    </main>
  );
}
