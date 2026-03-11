'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { 
  Globe, Zap, FileText, TrendingUp, Link2, Sparkles, 
  Rocket, DollarSign, BarChart3, Smartphone, Shield, 
  Clock, Check, Play, ArrowRight, Menu, X, Star,
  ChevronDown, Users, Target, Layers, Award, Lock,
  RefreshCw, Headphones, CreditCard, Gift, BadgeCheck,
  MessageCircle, Mail, ChevronRight, Timer, Percent,
  Building2, Briefcase, Crown, Bolt, Eye, MousePointer,
  PieChart, Settings, Database, Cloud, Cpu, MonitorPlay
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
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[rgb(218,255,1)]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px]" />
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
// TRUST BADGES
// ────────────────────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { icon: Shield, label: "256-bit SSL", sub: "Bank-level security" },
  { icon: RefreshCw, label: "30-Day Guarantee", sub: "Full money back" },
  { icon: Lock, label: "GDPR Compliant", sub: "Data protection" },
  { icon: Headphones, label: "24/7 Support", sub: "Always available" },
  { icon: Award, label: "99.9% Uptime", sub: "SLA guaranteed" },
];

const COMPANY_LOGOS = [
  "TechCrunch", "ProductHunt", "Forbes", "Wired", "FastCompany"
];

// ────────────────────────────────────────────────────────────────────────────
// FEATURE DATA
// ────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description: "Get a professionally designed website tailored to your domain with beautiful layouts and modern styling.",
    badge: "Popular"
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
    badge: "New"
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
    badge: "Revenue"
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
// ENTERPRISE FEATURES
// ────────────────────────────────────────────────────────────────────────────

const ENTERPRISE_FEATURES = [
  { icon: Building2, title: "Multi-Tenant Architecture", desc: "Host unlimited websites under one account" },
  { icon: Database, title: "API Access", desc: "RESTful API for custom integrations" },
  { icon: Cloud, title: "CDN Delivery", desc: "Global content delivery network" },
  { icon: Cpu, title: "Auto-Scaling", desc: "Handle traffic spikes automatically" },
  { icon: Lock, title: "SSO & SAML", desc: "Enterprise authentication support" },
  { icon: Settings, title: "White-Label", desc: "Custom branding options" },
];

// ────────────────────────────────────────────────────────────────────────────
// SHOWCASE FEATURES
// ────────────────────────────────────────────────────────────────────────────

const SHOWCASE_TABS = [
  { id: "dashboard", label: "Dashboard", icon: PieChart },
  { id: "editor", label: "Content Editor", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "seo", label: "SEO Tools", icon: Target },
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
    company: "DomainCapital LLC",
    avatar: "SC",
    content: "I had 50+ domains sitting idle. Within a week, FASTOFY turned them into revenue-generating websites. The AI content is surprisingly good and the ROI has been incredible.",
    rating: 5,
    revenue: "$12,000/mo",
  },
  {
    name: "Marcus Rivera",
    role: "Small Business Owner",
    company: "Rivera Consulting",
    avatar: "MR",
    content: "Got my business online in literally 10 minutes. No coding, no hiring developers. The SEO features helped me rank on Google within months. Game changer!",
    rating: 5,
    revenue: "300% traffic increase",
  },
  {
    name: "Emma Thompson",
    role: "Marketing Director",
    company: "GrowthLabs Agency",
    avatar: "ET",
    content: "The monetization features are incredible. Our clients' niche blogs are now generating passive income through AdSense without any manual setup. We've scaled to 200+ sites.",
    rating: 5,
    revenue: "$45,000/mo agency revenue",
  },
  {
    name: "David Kim",
    role: "CTO",
    company: "TechVentures Inc",
    avatar: "DK",
    content: "We use FASTOFY for all our portfolio companies' initial web presence. The API integration and white-label features make it perfect for enterprise deployment.",
    rating: 5,
    revenue: "50+ enterprise deployments",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// PRICING DATA
// ────────────────────────────────────────────────────────────────────────────

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "Free",
    originalPrice: null,
    description: "Perfect for launching your first website",
    trial: "Forever free",
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
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$39",
    originalPrice: "$49",
    period: "/month",
    description: "Best for growing your online presence",
    trial: "14-day free trial",
    discount: "20% OFF",
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
      "Custom domain mapping",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$119",
    originalPrice: "$149",
    period: "/month",
    description: "For agencies and serious businesses",
    trial: "14-day free trial",
    discount: "20% OFF",
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
      "Custom contract & SLA",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
];

// ────────────────────────────────────────────────────────────────────────────
// FAQ DATA
// ────────────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    question: "What exactly do I get for free?",
    answer: "You get a complete professional website for one domain including: custom design, AI-generated content (5-7 pages), SEO optimization, mobile responsiveness, SSL security, and 1 year of hosting - completely free. No credit card required.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer: "Start using all Professional or Enterprise features immediately with no payment required. If you love it, subscribe to continue. If not, simply don't - no questions asked, no charges ever.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied, contact us within 30 days for a full refund. No questions asked.",
  },
  {
    question: "Do I need technical skills or coding knowledge?",
    answer: "Not at all! FASTOFY is designed for everyone. Just sign up with your email, add your domain name, and we handle everything else. Our AI does the heavy lifting.",
  },
  {
    question: "Can I use my own domain?",
    answer: "Absolutely! You can connect any domain you own. We provide simple DNS instructions, and most domains are connected within minutes. We support all major registrars.",
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes! Save 20% when you choose annual billing. Use code FASTOFY20 at checkout for an additional 10% off your first year.",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// COUPON BANNER COMPONENT
// ────────────────────────────────────────────────────────────────────────────

function CouponBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("FASTOFY20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-[rgb(218,255,1)] via-[rgb(180,220,1)] to-[rgb(218,255,1)] text-[#0a0a0a] py-2.5 px-4 text-center relative">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Gift size={18} className="animate-bounce" />
        <span className="font-semibold">Limited Time Offer:</span>
        <span>Get 20% OFF your first year with code</span>
        <button 
          onClick={copyCode}
          className="bg-[#0a0a0a] text-[rgb(218,255,1)] px-3 py-1 rounded-md font-mono font-bold text-sm hover:bg-[#1a1a1a] transition-colors"
        >
          {copied ? "Copied!" : "FASTOFY20"}
        </button>
        <span className="text-sm opacity-80">• Ends in 48 hours</span>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
        aria-label="Close banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// LIVE CHAT WIDGET
// ────────────────────────────────────────────────────────────────────────────

function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[rgb(218,255,1)] rounded-full flex items-center justify-center shadow-lg shadow-[rgb(218,255,1)]/30 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="chat-widget-btn"
      >
        {isOpen ? <X size={24} className="text-[#0a0a0a]" /> : <MessageCircle size={24} className="text-[#0a0a0a]" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-[#111] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[rgb(218,255,1)]/20 to-emerald-500/20 p-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[rgb(218,255,1)] rounded-full flex items-center justify-center">
                  <Headphones size={20} className="text-[#0a0a0a]" />
                </div>
                <div>
                  <p className="font-semibold text-white">Sales Team</p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online - Reply in ~2 min
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 h-48 overflow-y-auto">
              <div className="bg-neutral-800/50 rounded-lg p-3 max-w-[85%]">
                <p className="text-sm text-neutral-300">Hi there! 👋 How can I help you today? Ask me anything about FASTOFY!</p>
                <p className="text-xs text-neutral-500 mt-1">Just now</p>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[rgb(218,255,1)]"
                />
                <button className="bg-[rgb(218,255,1)] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium hover:bg-[rgb(190,225,1)] transition-colors">
                  Send
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-2 text-center">
                Or email us at support@fastofy.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// MAIN LANDING PAGE COMPONENT
// ────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState("dashboard");
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
      
      {/* Coupon Banner */}
      <CouponBanner />

      {/* Live Chat Widget */}
      <LiveChatWidget />
      
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HEADER */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <motion.header 
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 backdrop-blur-md"
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
              Start Free Trial
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
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative min-h-screen flex items-center pt-24">
        <GridBackground />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10">
                <BadgeCheck size={16} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Trusted by 50,000+ users</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                <span className="text-sm text-neutral-400 ml-1">4.9/5</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Launch Your Website
              <span className="block bg-gradient-to-r from-[rgb(218,255,1)] via-emerald-400 to-[rgb(218,255,1)] bg-clip-text text-transparent mt-2">
                In Minutes, Not Months
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-8"
            >
              Transform your unused domains into professional, SEO-optimized websites with AI-generated content. No coding required.
            </motion.p>

            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-10"
            >
              {[
                { icon: Timer, text: "14-day free trial" },
                { icon: CreditCard, text: "No credit card required" },
                { icon: RefreshCw, text: "30-day money back" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                  <item.icon size={16} className="text-[rgb(218,255,1)]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                href="/dashboard"
                data-testid="hero-cta-btn"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[rgb(218,255,1)] text-[#0a0a0a] font-semibold rounded-xl hover:bg-[rgb(190,225,1)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(218,255,1)]/20"
              >
                Start Your Free Trial
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => scrollToSection('showcase')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-neutral-700 text-white font-semibold rounded-xl hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)] transition-all group"
              >
                <Play size={18} className="group-hover:scale-110 transition-transform" />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
            >
              {[
                { value: 50000, suffix: "+", label: "Websites Launched" },
                { value: 120, suffix: "+", label: "Countries" },
                { value: 99.9, suffix: "%", label: "Uptime SLA" },
                { value: 10, suffix: " min", label: "Setup Time" },
              ].map((stat, index) => (
                <SpotlightCard
                  key={index}
                  className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/50"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[rgb(218,255,1)]">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
                </SpotlightCard>
              ))}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {TRUST_BADGES.slice(0, 4).map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-neutral-500">
                  <badge.icon size={16} className="text-neutral-600" />
                  <span className="text-xs">{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* COMPANY LOGOS / SOCIAL PROOF */}
      {/* ──────────────────────────────────────────────────────────────────── */}

      <section className="py-12 border-y border-neutral-800/50 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm text-neutral-500 mb-8">Trusted by industry leaders and featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {COMPANY_LOGOS.map((name, i) => (
              <span key={i} className="text-lg md:text-xl font-bold text-neutral-400 tracking-wider">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FEATURES SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="features" className="relative py-24 lg:py-32">
        <GridBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 mb-4">
                <Sparkles size={14} className="text-[rgb(218,255,1)]" />
                <span className="text-[rgb(218,255,1)] text-sm font-semibold">Powerful Features</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Enterprise-grade tools to launch, grow, and monetize your websites
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
                <SpotlightCard className="h-full p-6 rounded-2xl border border-neutral-800 bg-neutral-900/30 hover:border-[rgb(218,255,1)]/30 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(218,255,1)]/20 to-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon size={24} className="text-[rgb(218,255,1)]" />
                    </div>
                    {feature.badge && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                        feature.badge === 'New' ? 'bg-blue-500/20 text-blue-400' :
                        feature.badge === 'Popular' ? 'bg-[rgb(218,255,1)]/20 text-[rgb(218,255,1)]' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Enterprise Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 p-8 rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/80 to-neutral-800/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-500/20 flex items-center justify-center">
                <Crown size={20} className="text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Enterprise-Grade Infrastructure</h3>
                <p className="text-sm text-neutral-500">Built for scale, security, and reliability</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {ENTERPRISE_FEATURES.map((item, i) => (
                <div key={i} className="text-center p-4 rounded-xl bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                  <item.icon size={24} className="mx-auto text-violet-400 mb-2" />
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* PRODUCT SHOWCASE SECTION - REDESIGNED */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="showcase" className="relative py-24 lg:py-32 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d10] to-[#0a0a0a]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-[rgb(218,255,1)]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <MonitorPlay size={14} className="text-emerald-400" />
                <span className="text-emerald-400 text-sm font-semibold">See It In Action</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Powerful Dashboard, Simple Experience
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Everything you need to manage your websites, all in one place
              </p>
            </motion.div>
          </div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center p-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
              {SHOWCASE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeShowcaseTab === tab.id 
                      ? 'bg-[rgb(218,255,1)] text-[#0a0a0a]' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main Preview Window */}
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-700/50 bg-gradient-to-b from-neutral-900 to-neutral-950 overflow-hidden shadow-2xl shadow-black/50">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/80">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <ChevronRight size={14} className="text-neutral-600" />
                    <ChevronRight size={14} className="text-neutral-600" />
                  </div>
                </div>
                <div className="flex-1 max-w-md mx-4">
                  <div className="h-8 rounded-lg bg-neutral-800/80 flex items-center px-3 gap-2">
                    <Lock size={12} className="text-green-400" />
                    <span className="text-xs text-neutral-400">app.fastofy.com/dashboard</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Settings size={14} className="text-neutral-500" />
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 bg-[#080808] min-h-[400px]">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Welcome back, John</h3>
                    <p className="text-sm text-neutral-500">Here's what's happening with your websites</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[rgb(218,255,1)] text-[#0a0a0a] rounded-lg text-sm font-medium">
                    <Zap size={14} />
                    Generate Content
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Active Sites", value: "12", change: "+2", color: "text-emerald-400" },
                    { label: "Total Views", value: "48.2K", change: "+18%", color: "text-blue-400" },
                    { label: "Revenue", value: "$2,840", change: "+12%", color: "text-[rgb(218,255,1)]" },
                    { label: "New Leads", value: "156", change: "+24", color: "text-violet-400" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50">
                      <p className="text-xs text-neutral-500 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">{stat.value}</span>
                        <span className={`text-xs ${stat.color}`}>{stat.change}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-medium">Traffic Overview</p>
                      <div className="flex gap-2">
                        <span className="text-xs px-2 py-1 rounded bg-neutral-700 text-neutral-300">7D</span>
                        <span className="text-xs px-2 py-1 rounded bg-[rgb(218,255,1)]/20 text-[rgb(218,255,1)]">30D</span>
                        <span className="text-xs px-2 py-1 rounded bg-neutral-700 text-neutral-300">90D</span>
                      </div>
                    </div>
                    {/* Simulated Chart */}
                    <div className="h-32 flex items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-[rgb(218,255,1)]/60 to-[rgb(218,255,1)]/20 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50">
                    <p className="font-medium mb-4">Top Pages</p>
                    <div className="space-y-3">
                      {[
                        { page: "/home", views: "12.4K" },
                        { page: "/products", views: "8.2K" },
                        { page: "/blog/ai-tips", views: "5.1K" },
                        { page: "/contact", views: "2.8K" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-neutral-400">{item.page}</span>
                          <span className="text-[rgb(218,255,1)]">{item.views}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Feature Cards */}
            <div className="hidden lg:block absolute -right-8 top-1/4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-4 rounded-xl border border-emerald-500/30 bg-neutral-900/95 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">SEO Score</p>
                    <p className="text-xs text-emerald-400">95/100 - Excellent</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="hidden lg:block absolute -left-8 top-1/3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-4 rounded-xl border border-[rgb(218,255,1)]/30 bg-neutral-900/95 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[rgb(218,255,1)]/20 flex items-center justify-center">
                    <Sparkles size={20} className="text-[rgb(218,255,1)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">AI Generated</p>
                    <p className="text-xs text-neutral-400">24 articles today</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="hidden lg:block absolute -right-4 bottom-1/4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="p-4 rounded-xl border border-violet-500/30 bg-neutral-900/95 backdrop-blur-sm shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <DollarSign size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Revenue</p>
                    <p className="text-xs text-violet-400">+$420 today</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MousePointer, title: "One-Click Deploy", desc: "Go live instantly", color: "from-[rgb(218,255,1)]" },
              { icon: Eye, title: "Real-time Preview", desc: "See changes live", color: "from-blue-400" },
              { icon: Bolt, title: "AI Content Engine", desc: "Auto-generate articles", color: "from-violet-400" },
              { icon: PieChart, title: "Advanced Analytics", desc: "Track everything", color: "from-emerald-400" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <SpotlightCard className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/30 text-center hover:border-neutral-700 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color}/20 to-transparent flex items-center justify-center mx-auto mb-3`}>
                    <item.icon size={24} className={`bg-gradient-to-r ${item.color} to-white bg-clip-text text-white`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-neutral-500">{item.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* How It Works */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-center mb-10">Get Started in 4 Simple Steps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 1, icon: Link2, title: "Connect Domain", desc: "Point your DNS to FASTOFY in minutes" },
                { step: 2, icon: Sparkles, title: "AI Designs", desc: "Our AI creates your perfect website" },
                { step: 3, icon: Settings, title: "Customize", desc: "Fine-tune everything to your liking" },
                { step: 4, icon: Rocket, title: "Launch", desc: "Go live with one click" },
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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                <Layers size={14} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold">Product Roadmap</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Our Journey & Vision
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                See where we've been and where we're headed
              </p>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-neutral-800 rounded-full">
              <motion.div
                initial={{ width: "0%" }}
                whileInView={{ width: "35%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-[rgb(218,255,1)] to-emerald-500 rounded-full"
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
                  <div className="hidden lg:flex absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 items-center justify-center z-10"
                    style={{
                      borderColor: item.status === 'completed' ? 'rgb(218,255,1)' : item.status === 'current' ? '#3b82f6' : '#404040',
                      backgroundColor: item.status === 'completed' ? 'rgb(218,255,1)' : '#0d0d0d',
                    }}
                  >
                    {item.status === 'completed' && <Check size={12} className="text-[#0a0a0a]" />}
                    {item.status === 'current' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                  </div>

                  <SpotlightCard className={`mt-10 p-6 rounded-2xl border ${
                    item.status === 'current' ? 'border-blue-500/50 bg-blue-500/5' : 'border-neutral-800 bg-neutral-900/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                        item.status === 'completed' ? 'bg-[rgb(218,255,1)]/20 text-[rgb(218,255,1)]' :
                        item.status === 'current' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-neutral-800 text-neutral-500'
                      }`}>
                        {item.phase}
                      </span>
                      {item.status === 'current' && (
                        <span className="text-xs text-blue-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                          In Progress
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{item.title}</h3>
                    <ul className="space-y-2">
                      {item.items.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-neutral-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'completed' ? 'bg-[rgb(218,255,1)]' : 
                            item.status === 'current' ? 'bg-blue-400' : 'bg-neutral-600'
                          }`} />
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
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-4">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-sm font-semibold">Customer Success Stories</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Loved by Thousands Worldwide
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                See how businesses are transforming their online presence with FASTOFY
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
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {testimonial.revenue && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400">
                        {testimonial.revenue}
                      </span>
                    )}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-neutral-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[rgb(218,255,1)]/50 to-emerald-500/30 flex items-center justify-center text-sm font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{testimonial.name}</p>
                      <p className="text-xs text-neutral-500">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {TRUST_BADGES.map((badge, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[rgb(218,255,1)]/10 flex items-center justify-center mb-3">
                    <badge.icon size={24} className="text-[rgb(218,255,1)]" />
                  </div>
                  <p className="font-semibold text-sm">{badge.label}</p>
                  <p className="text-xs text-neutral-500">{badge.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* PRICING SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section id="pricing" className="relative py-24 lg:py-32 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d10] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 mb-4">
                <Percent size={14} className="text-[rgb(218,255,1)]" />
                <span className="text-[rgb(218,255,1)] text-sm font-semibold">Limited Time: 20% OFF</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                Start free, scale as you grow. No hidden fees ever.
              </p>
            </motion.div>
          </div>

          {/* Value Props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12"
          >
            {[
              { icon: Timer, text: "14-day free trial" },
              { icon: CreditCard, text: "No credit card required" },
              { icon: RefreshCw, text: "30-day money-back guarantee" },
              { icon: X, text: "Cancel anytime" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <item.icon size={12} className="text-emerald-400" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </motion.div>

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
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[rgb(218,255,1)] to-emerald-400 text-[#0a0a0a] text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <SpotlightCard className={`h-full p-6 rounded-2xl border ${
                  tier.highlighted 
                    ? 'border-[rgb(218,255,1)]/50 ring-1 ring-[rgb(218,255,1)]/20 bg-gradient-to-b from-[rgb(218,255,1)]/5 to-transparent' 
                    : 'border-neutral-800 bg-neutral-900/30'
                }`}>
                  {/* Discount Badge */}
                  {tier.discount && (
                    <div className="absolute top-6 right-6">
                      <span className="text-xs font-bold px-2 py-1 rounded bg-red-500/20 text-red-400">
                        {tier.discount}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{tier.description}</p>
                  
                  {/* Price */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-[rgb(218,255,1)]">{tier.price}</span>
                    {tier.period && <span className="text-neutral-500">{tier.period}</span>}
                  </div>
                  {tier.originalPrice && (
                    <p className="text-sm text-neutral-500 mb-4">
                      <span className="line-through">{tier.originalPrice}/month</span>
                    </p>
                  )}

                  {/* Trial Info */}
                  <div className="flex items-center gap-2 mb-6 text-sm text-emerald-400">
                    <Timer size={14} />
                    <span>{tier.trial}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check size={16} className="text-[rgb(218,255,1)] mt-0.5 flex-shrink-0" />
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href="/dashboard"
                    data-testid={`pricing-cta-${tier.name.toLowerCase()}`}
                    className={`block w-full py-3 text-center font-semibold rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-[rgb(218,255,1)] text-[#0a0a0a] hover:bg-[rgb(190,225,1)] hover:-translate-y-0.5'
                        : 'border border-neutral-700 hover:border-[rgb(218,255,1)] hover:text-[rgb(218,255,1)]'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>

          {/* Money Back Guarantee */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 max-w-2xl mx-auto text-center"
          >
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield size={24} className="text-emerald-400" />
                <h3 className="text-lg font-semibold">30-Day Money-Back Guarantee</h3>
              </div>
              <p className="text-sm text-neutral-400">
                Try FASTOFY risk-free. If you're not completely satisfied within 30 days, 
                we'll refund 100% of your payment. No questions asked.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FAQ SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-400">
                Got questions? We've got answers.
              </p>
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
                  <AnimatePresence>
                    {openFaqIndex === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 text-sm text-neutral-400 leading-relaxed"
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-neutral-400 mb-4">Still have questions?</p>
            <a 
              href="mailto:support@fastofy.com"
              className="inline-flex items-center gap-2 text-[rgb(218,255,1)] hover:underline"
            >
              <Mail size={16} />
              Contact our support team
            </a>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* CTA SECTION */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <section className="relative py-24 lg:py-32">
        <GridBackground />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgb(218,255,1)]/10 border border-[rgb(218,255,1)]/20 mb-6">
              <Rocket size={16} className="text-[rgb(218,255,1)]" />
              <span className="text-[rgb(218,255,1)] text-sm font-semibold">Start Your Journey Today</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Domains?
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
              Join 50,000+ entrepreneurs and businesses who are turning their unused domains into revenue-generating websites.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
              {[
                { icon: Timer, text: "14-day free trial" },
                { icon: CreditCard, text: "No credit card" },
                { icon: RefreshCw, text: "30-day guarantee" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-neutral-400">
                  <item.icon size={14} className="text-[rgb(218,255,1)]" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard"
              data-testid="final-cta-btn"
              className="inline-flex items-center gap-2 px-10 py-5 bg-[rgb(218,255,1)] text-[#0a0a0a] font-semibold text-lg rounded-xl hover:bg-[rgb(190,225,1)] transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[rgb(218,255,1)]/20"
            >
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <p className="mt-6 text-sm text-neutral-500">
              No credit card required • Setup in under 10 minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* FOOTER */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      
      <footer className="border-t border-neutral-800 py-16 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <img src="/logo/fastofy.png" alt="Fastofy" className="w-10 h-10" />
                <span className="text-lg font-semibold">FASTOFY</span>
              </Link>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Transform unused domains into professional websites with AI-powered content generation.
              </p>
              <div className="flex items-center gap-3">
                {TRUST_BADGES.slice(0, 3).map((badge, i) => (
                  <div key={i} className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center" title={badge.label}>
                    <badge.icon size={14} className="text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollToSection('roadmap')} className="hover:text-white transition-colors">Roadmap</button></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">API Docs</Link></li>
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
                <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="mailto:support@fastofy.com" className="hover:text-white transition-colors">support@fastofy.com</a></li>
                <li><span className="text-[rgb(218,255,1)]">Live Chat Available</span></li>
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
              <a href="#" className="text-neutral-500 hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
