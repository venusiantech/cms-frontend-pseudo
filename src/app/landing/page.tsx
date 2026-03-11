'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  Globe, Zap, FileText, TrendingUp, Link2, Sparkles, 
  Rocket, DollarSign, BarChart3, Smartphone, Shield, 
  Clock, Check, Play, ArrowRight, Menu, X, Star,
  ChevronDown, Users, Target, Layers
} from "lucide-react";

// ────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ────────────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { id: "features", label: "Features" },
  { id: "showcase", label: "Product" },
  { id: "roadmap", label: "Roadmap" },
  { id: "pricing", label: "Pricing" },
  { id: "testimonials", label: "Testimonials" },
] as const;

// ────────────────────────────────────────────────────────────────────────────
// GRID BACKGROUND COMPONENT
// ────────────────────────────────────────────────────────────────────────────

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgb(218,255,1)]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[rgb(218,255,1)]/3 rounded-full blur-[100px]" />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// SPOTLIGHT EFFECT
// ────────────────────────────────────────────────────────────────────────────

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isHovered
          ? `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(218,255,1,0.06), transparent 50%)`
          : 'transparent',
      }}
    >
      {children}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ────────────────────────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// FEATURE DATA
// ────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description: "Get a professionally designed website tailored to your domain with beautiful layouts and modern styling.",
  },
  {
    icon: Rocket,
    title: "One-Click Launch",
    description: "Launch your complete website instantly. No complex setup, no technical hurdles - just instant deployment.",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Content System",
    description: "Auto-generate high-quality content using relevant keywords. Scheduled updates keep search engines engaged.",
  },
  {
    icon: Target,
    title: "Advanced OnPage SEO",
    description: "Every page includes optimized meta tags, keywords, headings, alt texts, and schema markup.",
  },
  {
    icon: Link2,
    title: "Smart Backlinking",
    description: "Automatic internal linking plus strategic external backlinks to boost domain authority.",
  },
  {
    icon: Users,
    title: "Customer Engagement",
    description: "Built-in live chat widget and customizable forms to convert visitors into customers.",
  },
  {
    icon: DollarSign,
    title: "Ad Networks & Monetization",
    description: "Pre-configured Google AdSense and Amazon affiliate integration for passive income.",
  },
  {
    icon: BarChart3,
    title: "Traffic Analytics",
    description: "Comprehensive analytics showing visitor behavior, traffic sources, and conversion metrics.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "All websites automatically adapt to any screen size for perfect viewing everywhere.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// ROADMAP DATA
// ────────────────────────────────────────────────────────────────────────────

const ROADMAP_ITEMS = [
  {
    phase: "Phase 1",
    title: "Launch",
    status: "completed",
    items: ["AI Content Generation", "Multi-template System", "Domain Management", "Basic Analytics"],
  },
  {
    phase: "Phase 2",
    title: "Growth",
    status: "current",
    items: ["Advanced SEO Tools", "Lead Generation Suite", "Live Chat Integration", "Monetization Options"],
  },
  {
    phase: "Phase 3",
    title: "Scale",
    status: "upcoming",
    items: ["API Access", "White-label Solution", "Team Collaboration", "Custom Templates"],
  },
  {
    phase: "Phase 4",
    title: "Future Vision",
    status: "planned",
    items: ["AI Website Editor", "E-commerce Integration", "Multi-language Support", "Enterprise Features"],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS DATA
// ────────────────────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Domain Investor",
    avatar: "SC",
    content: "I had 50+ domains sitting idle. Within a week, FASTOFY turned them into revenue-generating websites. The AI content is surprisingly good.",
    rating: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Small Business Owner",
    avatar: "MR",
    content: "Got my business online in literally 10 minutes. No coding, no hiring developers. The SEO features helped me rank on Google within months.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Freelance Consultant",
    avatar: "ET",
    content: "The monetization features are incredible. My niche blog is now generating passive income through AdSense without any manual setup.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Marketing Agency",
    avatar: "DK",
    content: "We use FASTOFY for all our clients' microsites. The speed and quality are unmatched. Essential tool for any digital agency.",
    rating: 5,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// PRICING DATA
// ────────────────────────────────────────────────────────────────────────────

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for launching your first website",
    features: [
      "1 domain with free hosting (1 year)",
      "AI-generated website design",
      "5-7 pages of content",
      "OnPage SEO optimization",
      "Mobile responsive design",
      "SSL security included",
      "Live chat widget",
      "Basic analytics dashboard",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "Best for growing your online presence",
    features: [
      "Up to 5 domains",
      "Drip content scheduling (50 posts/month)",
      "Advanced SEO with backlinking",
      "Lead generation forms & popups",
      "Live chat with automation",
      "Google AdSense integration",
      "Amazon Associates support",
      "Advanced traffic analytics",
      "Priority email support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For serious businesses and agencies",
    features: [
      "Unlimited domains",
      "Unlimited drip content",
      "Premium SEO optimization",
      "Internal/External backlinking strategy",
      "Advanced lead generation suite",
      "Multi-channel chat integration",
      "Full monetization tools",
      "White-label analytics dashboard",
      "API access for integrations",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// FAQ DATA
// ────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What exactly do I get for free?",
    answer: "You get a complete professional website for one domain including: custom design, AI-generated content (5-7 pages), SEO optimization, mobile responsiveness, SSL security, and 1 year of hosting - completely free.",
  },
  {
    question: "How long does it take to set up my website?",
    answer: "Most websites are ready in 5-10 minutes. Our AI analyzes your domain, generates relevant content, creates a professional design, and sets up hosting automatically.",
  },
  {
    question: "Do I need technical skills or coding knowledge?",
    answer: "Not at all! FASTOFY is designed for everyone. Just sign up with your email, add your domain name, and we handle everything else.",
  },
  {
    question: "Can I customize my website after it's created?",
    answer: "Yes! You can edit content, change colors, upload images, and modify layouts through our easy-to-use dashboard.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// MAIN LANDING PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 100], ['rgba(10,10,10,0)', 'rgba(10,10,10,0.95)']);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 80;
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY;
      window.scrollTo({ top: rect.top + scrollTop - headerOffset, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans antialiased">
      
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <motion.header 
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-md"
      >
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo/fastofy.png" alt="Fastofy" className="w-12 h-12" />
            <span className="text-xl font-semibold tracking-tight">FASTOFY</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm text-neutral-400 hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/dashboard"
              data-testid="header-cta-btn"
              className="px-5 py-2.5 bg-[rgb(218,255,1)] text-[#0a0a0a] text-sm font-semibold rounded-lg hover:bg-[rgb(190,225,1)] transition-all hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#0a0a0a] border-t border-white/5 px-6 py-4"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-neutral-400 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Link href="/login" className="text-neutral-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link 
                  href="/dashboard"
                  className="px-5 py-3 bg-[rgb(218,255,1)] text-[#0a0a0a] text-center font-semibold rounded-lg"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative min-h-screen flex items-center pt-16">
        <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgb(218,255,1)]/20 bg-[rgb(218,255,1)]/5 mb-8"
            >
              <Sparkles size={14} className="text-[rgb(218,255,1)]" />
              <span className="text-sm text-[rgb(218,255,1)] font-medium">AI-Powered Website Builder</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Launch Your Website
              <span className="block text-[rgb(218,255,1)] mt-2">In Minutes, Not Months</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10"
            >
              Transform your unused domains into professional, SEO-optimized websites with AI-generated content. No coding required.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                href="/dashboard"
                data-testid="hero-cta-btn"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[rgb(218,255,1)] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[rgb(190,225,1)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(218,255,1)]/20"
              >
                Get Your Free Website
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => scrollToSection('showcase')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)] transition-all"
              >
                <Play size={18} />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { value: 50000, suffix: "+", label: "Websites Launched" },
                { value: 120, suffix: "+", label: "Countries" },
                { value: 99.9, suffix: "%", label: "Uptime" },
                { value: 10, suffix: " min", label: "Setup Time" },
              ].map((stat, index) => (
                <SpotlightCard
                  key={index}
                  className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[rgb(218,255,1)]">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FEATURES SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="features" className="relative py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">Features</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Everything You Need
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Powerful tools to launch, grow, and monetize your websites
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <SpotlightCard className="h-full p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 hover:border-[rgb(218,255,1)]/30 transition-colors group">
                  <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 flex items-center justify-center mb-4 group-hover:bg-[rgb(218,255,1)]/20 transition-colors">
                    <feature.icon size={24} className="text-[rgb(218,255,1)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Additional Features Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50"
          >
            <h3 className="text-xl font-semibold text-center mb-6">Plus Many More</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { icon: Shield, label: "SSL Security", sub: "HTTPS included" },
                { icon: Zap, label: "Fast Loading", sub: "Optimized speed" },
                { icon: Clock, label: "Auto Backups", sub: "Daily backups" },
                { icon: Globe, label: "24/7 Uptime", sub: "Reliable hosting" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg bg-[rgb(218,255,1)]/10 flex items-center justify-center mb-2">
                    <item.icon size={20} className="text-[rgb(218,255,1)]" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className="text-xs text-neutral-500">{item.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* PRODUCT SHOWCASE SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="showcase" className="relative py-24 lg:py-32">
        <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">Product</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                See It In Action
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Watch how FASTOFY transforms idle domains into professional websites
              </p>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-2xl shadow-black/50">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-7 rounded-md bg-neutral-800 flex items-center px-3">
                    <span className="text-xs text-neutral-500">fastofy.com/dashboard</span>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content Mockup */}
              <div className="p-6 bg-[#080808]">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 rounded-xl bg-neutral-800/50 border border-neutral-700/50 animate-pulse" />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-neutral-800/50 border border-neutral-700/50 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-1/4 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-4 rounded-xl border border-neutral-700 bg-neutral-900/90 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Website Live!</p>
                    <p className="text-xs text-neutral-500">mybusiness.com</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="absolute -left-4 bottom-1/4 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-4 rounded-xl border border-neutral-700 bg-neutral-900/90 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgb(218,255,1)]/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-[rgb(218,255,1)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">AI Generating...</p>
                    <p className="text-xs text-neutral-500">12 articles ready</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* How It Works Steps */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, icon: Link2, title: "Connect Domain", desc: "Point your DNS to FASTOFY" },
              { step: 2, icon: Sparkles, title: "AI Designs", desc: "Instant website generation" },
              { step: 3, icon: Layers, title: "Customize", desc: "Make it uniquely yours" },
              { step: 4, icon: Rocket, title: "Go Live", desc: "One-click deployment" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <SpotlightCard className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg bg-[rgb(218,255,1)] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                    {item.step}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center mx-auto mt-4 mb-4">
                    <item.icon size={28} className="text-[rgb(218,255,1)]" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </SpotlightCard>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight size={20} className="text-neutral-700" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* ROADMAP SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="roadmap" className="relative py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">Roadmap</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Product Journey
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                See where we've been and where we're headed
              </p>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-neutral-800">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "35%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-[rgb(218,255,1)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ROADMAP_ITEMS.map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 items-center justify-center"
                    style={{
                      borderColor: item.status === 'completed' ? 'rgb(218,255,1)' : item.status === 'current' ? 'rgb(218,255,1)' : '#404040',
                      backgroundColor: item.status === 'completed' ? 'rgb(218,255,1)' : '#0d0d0d',
                    }}
                  >
                    {item.status === 'completed' && <Check size={10} className="text-[#0a0a0a]" />}
                    {item.status === 'current' && <div className="w-2 h-2 rounded-full bg-[rgb(218,255,1)] animate-pulse" />}
                  </div>

                  <SpotlightCard className={`mt-8 p-6 rounded-2xl border ${item.status === 'current' ? 'border-[rgb(218,255,1)]/50' : 'border-neutral-800'} bg-neutral-900/30`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        item.status === 'completed' ? 'bg-[rgb(218,255,1)]/20 text-[rgb(218,255,1)]' :
                        item.status === 'current' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-neutral-800 text-neutral-500'
                      }`}>
                        {item.phase}
                      </span>
                      {item.status === 'current' && (
                        <span className="text-xs text-blue-400">Current</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.items.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'completed' ? 'bg-[rgb(218,255,1)]' : 'bg-neutral-600'}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* TESTIMONIALS SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="testimonials" className="relative py-24 lg:py-32">
        <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">Testimonials</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Loved by Thousands
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                See what our customers have to say about FASTOFY
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SpotlightCard className="h-full p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} size={16} className="fill-[rgb(218,255,1)] text-[rgb(218,255,1)]" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-neutral-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[rgb(218,255,1)]/50 to-[rgb(218,255,1)]/20 flex items-center justify-center text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* PRICING SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="pricing" className="relative py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">Pricing</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Choose the plan that fits your needs. Start free, scale as you grow.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[rgb(218,255,1)] text-[#0a0a0a] text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <SpotlightCard className={`h-full p-6 rounded-2xl border ${tier.highlighted ? 'border-[rgb(218,255,1)]/50 ring-1 ring-[rgb(218,255,1)]/20' : 'border-neutral-800'} bg-neutral-900/30`}>
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-[rgb(218,255,1)]">{tier.price}</span>
                    {tier.period && <span className="text-neutral-500">{tier.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check size={16} className="text-[rgb(218,255,1)] mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/dashboard"
                    data-testid={`pricing-cta-${tier.name.toLowerCase()}`}
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-[rgb(218,255,1)] text-[#0a0a0a] hover:bg-[rgb(190,225,1)]'
                        : 'border border-neutral-700 hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)]'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FAQ SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-[rgb(218,255,1)] text-sm font-semibold uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left p-5 rounded-xl border border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium pr-4">{item.question}</span>
                    <ChevronDown 
                      size={20} 
                      className={`text-neutral-500 transition-transform flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                    />
                  </div>
                  {openFaqIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 text-sm text-neutral-400 leading-relaxed"
                    >
                      {item.answer}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* CTA SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Launch Your Website?
            </h2>
            <p className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of domain owners who are turning their unused domains into revenue-generating websites.
            </p>
            <Link
              href="/dashboard"
              data-testid="final-cta-btn"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[rgb(218,255,1)] text-[#0a0a0a] font-semibold text-lg rounded-xl hover:bg-[rgb(190,225,1)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(218,255,1)]/20"
            >
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <p className="mt-6 text-sm text-neutral-500">
              No credit card required. Free hosting for 1 year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <footer className="border-t border-neutral-800 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/logo/fastofy.png" alt="Fastofy" className="w-10 h-10" />
                <span className="text-lg font-semibold">FASTOFY</span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Transform unused domains into professional websites with AI-powered content generation.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('roadmap')} className="hover:text-white transition-colors">Roadmap</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="mailto:support@fastofy.com" className="hover:text-white transition-colors">support@fastofy.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} FASTOFY. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
