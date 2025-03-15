"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { gsap } from "gsap";
import Lenis from "lenis";
import { ArrowRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import OceanVisualization from "@/components/ocean-visualization"
import FeatureSection from "@/components/feature-section"
import DashboardPreview from "@/components/dashboard-preview"
import MarketplacePreview from "@/components/marketplace-preview"
import GovernanceSection from "@/components/governance-section"
import { ConnectButton } from "@rainbow-me/rainbowkit"

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    const tl = gsap.timeline();

    tl.from(heroRef.current, {
      opacity: 0,
      duration: 1.2,
      y: 100,
      ease: "power4.out",
    })
    .from(textRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power4.out",
    }, "-=0.7")
    .from(statsRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "back.out(1.7)",
    }, "-=0.5");

    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-blue-950 text-white">
      {/* Navigation */}
      <header className="container z-10 mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">OceanGuard</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            <li>
              <Link href="#features" className="text-blue-200 hover:text-white transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#dashboard" className="text-blue-200 hover:text-white transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="#marketplace" className="text-blue-200 hover:text-white transition-colors">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="#governance" className="text-blue-200 hover:text-white transition-colors">
                Governance
              </Link>
            </li>
          </ul>
        </nav>
        <ConnectButton />
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <OceanVisualization />
        <div className="container relative z-10 mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
            Protecting Our Oceans <br />
            <span className="bg-gradient-to-r bg-clip-text text-gray-100">
              With AI & Blockchain
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Predict ocean health metrics, tokenize conservation efforts, and trade carbon credits in a decentralized
            marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Explore Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
              Join Marketplace
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Core Components
          </span>
        </h2>
        <FeatureSection />
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Ocean Health Prediction
          </span>
        </h2>
        <DashboardPreview />
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Carbon Credit Marketplace
          </span>
        </h2>
        <MarketplacePreview />
      </section>

      {/* Governance Section */}
      <section id="governance" className="container mx-auto px-4 py-24">
        <h2 className="mb-16 text-center text-4xl font-bold">
          <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Decentralized Governance
          </span>
        </h2>
        <GovernanceSection />
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Join the Ocean Conservation Revolution</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-blue-100">
            Be part of the solution to protect our oceans and combat climate change through innovative technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-bold">OceanGuard</span>
              </div>
              <p className="text-blue-200">AI-Powered Ocean Health Prediction & Carbon Credit Marketplace</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Platform</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Governance
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Resources</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Whitepaper
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect</h3>
              <ul className="space-y-2 text-blue-200">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-blue-900 pt-8 text-center text-blue-200">
            <p>© {new Date().getFullYear()} OceanGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

