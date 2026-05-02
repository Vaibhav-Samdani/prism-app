'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue, useReducedMotion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface MousePosition {
  x: number;
  y: number;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  span: string;
  hasPulse?: boolean;
  isDense?: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface TabContent {
  title: string;
  subtitle: string;
  features: { label: string; value: string }[];
  diagram: React.ReactNode;
}

interface TimelineStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ═══════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════

function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return mounted ? position : { x: 0, y: 0 };
}

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════

const BRANDS = ['AETHER', 'NEXUS', 'VELOCITY', 'ORBITAL', 'LATTICE', 'POLARIS', 'KINETIC', 'SYNAPSE', 'MERIDIAN', 'CATALYST'];

const FEATURES: FeatureCard[] = [
  {
    title: 'Autonomous Sub-tasking',
    description: 'Prism decomposes objectives into atomic units and orchestrates execution across agents without manual breakdown.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cyan-400">
        <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <rect x="18" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <rect x="2" y="18" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <rect x="18" y="18" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        <line x1="14" y1="8" x2="18" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="8" y1="14" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.8" />
        <circle cx="24" cy="24" r="2" fill="currentColor" opacity="0.9" />
      </svg>
    ),
    span: 'md:col-span-2 md:row-span-1',
    hasPulse: true,
  },
  {
    title: 'Zero-latency Real-time Sync',
    description: 'Sub-millisecond state propagation. Every cursor, every change, reflected across all clients instantly.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-violet-400">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="16" cy="16" r="7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
        <line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="16" y1="22" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Spatial Context Graph',
    description: 'A living knowledge graph that maps relationships between decisions, artifacts, and team signals in 3D space.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cyan-400">
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="24" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="16" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
        <line x1="10" y1="9" x2="14" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="18" y1="12" x2="22" y2="9" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="16" y1="17" x2="16" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    span: 'md:col-span-1 md:row-span-2',
  },
  {
    title: 'AI Triage Engine',
    description: 'Intelligent routing that prioritizes, assigns, and escalates based on real-time context and team capacity.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-violet-400">
        <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M16 12L22 15V21L16 24L10 21V15L16 12Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
        <circle cx="16" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
    span: 'md:col-span-1 md:row-span-1',
    isDense: true,
  },
  {
    title: 'Multi-threaded Collaboration',
    description: 'Parallel workstreams with intelligent merge. No more blocked dependencies or sequential bottlenecks.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-cyan-400">
        <path d="M6 8H26" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 16H26" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <path d="M6 24H26" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="20" cy="16" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="14" cy="24" r="3" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Decision Memory',
    description: 'Every decision is captured, indexed, and searchable. Your workspace accumulates institutional intelligence over time.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-violet-400">
        <rect x="4" y="6" width="24" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
        <path d="M8 12H24" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <path d="M8 16H20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M8 20H16" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="24" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M23 20L24 21L26 19" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    span: 'md:col-span-1 md:row-span-1',
  },
];

const TIMELINE_STEPS: TimelineStep[] = [
  {
    number: '01',
    title: 'Sense',
    description: 'Prism continuously monitors signals across your workspace — commits, messages, blockers, decisions — building a real-time awareness layer.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <line x1="12" y1="3" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" />
        <line x1="3" y1="12" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5" />
        <line x1="18" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Triage',
    description: 'AI classifies urgency, maps dependencies, and routes work to the right threads and agents — eliminating manual prioritization.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-violet-400">
        <path d="M4 4L12 8L20 4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 12L12 16L20 12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <path d="M4 20L12 24L20 20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Orchestrate',
    description: 'Parallel execution across human and AI agents. Dependencies dissolve as Prism intelligently sequences and accelerates work.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-cyan-400">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <rect x="8" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
        <line x1="11" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
        <line x1="12" y1="11" x2="12" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Resolve',
    description: 'Outcomes are captured, decisions indexed, and institutional memory compounds. Resolution becomes the beginning of the next cycle.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-violet-400">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const TAB_CONTENT: Record<string, TabContent> = {
  Engineering: {
    title: 'Ship at the speed of thought',
    subtitle: 'From PR to production without context-switching.',
    features: [
      { label: 'Active agents', value: '12' },
      { label: 'PRs triaged', value: '847' },
      { label: 'Cycle time', value: '↓ 62%' },
      { label: 'Deploy velocity', value: '↑ 3.1x' },
    ],
    diagram: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full opacity-80">
        <rect x="10" y="20" width="120" height="40" rx="4" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
        <text x="20" y="45" fill="#06b6d4" fontSize="10" fontFamily="monospace">feat/auth-flow</text>
        <rect x="10" y="80" width="120" height="40" rx="4" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <text x="20" y="105" fill="#8b5cf6" fontSize="10" fontFamily="monospace">fix/dash-render</text>
        <rect x="10" y="140" width="120" height="40" rx="4" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
        <text x="20" y="165" fill="#06b6d4" fontSize="10" fontFamily="monospace">perf/graph-opt</text>
        <line x1="140" y1="40" x2="200" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
        <line x1="140" y1="100" x2="200" y2="100" stroke="#8b5cf6" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
        <line x1="140" y1="160" x2="200" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.2" strokeDasharray="4 4" />
        <rect x="200" y="70" width="100" height="60" rx="6" stroke="#06b6d4" strokeWidth="1.5" fill="#06b6d4" fillOpacity="0.05" />
        <text x="215" y="98" fill="#f8fafc" fontSize="11" fontFamily="monospace">AI Merge</text>
        <text x="215" y="115" fill="#06b6d4" fontSize="9" fontFamily="monospace" opacity="0.6">auto-resolve</text>
        <line x1="310" y1="100" x2="350" y2="100" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
        <circle cx="360" cy="100" r="15" stroke="#8b5cf6" strokeWidth="1.5" fill="#8b5cf6" fillOpacity="0.1" />
        <path d="M355 100L358 103L365 96" stroke="#8b5cf6" strokeWidth="1.5" />
      </svg>
    ),
  },
  Design: {
    title: 'Spatial design intelligence',
    subtitle: 'Every asset, component, and decision in one living canvas.',
    features: [
      { label: 'Components linked', value: '2,340' },
      { label: 'Design debt tracked', value: 'Real-time' },
      { label: 'Handoff friction', value: '↓ 94%' },
      { label: 'Figma sync', value: 'Bi-directional' },
    ],
    diagram: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full opacity-80">
        <rect x="20" y="30" width="80" height="100" rx="8" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <rect x="30" y="40" width="60" height="12" rx="2" fill="#8b5cf6" fillOpacity="0.15" />
        <rect x="30" y="60" width="40" height="8" rx="2" fill="#8b5cf6" fillOpacity="0.1" />
        <rect x="30" y="75" width="60" height="8" rx="2" fill="#8b5cf6" fillOpacity="0.1" />
        <rect x="30" y="100" width="50" height="20" rx="4" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
        <rect x="130" y="50" width="140" height="80" rx="8" stroke="#06b6d4" strokeWidth="1" fill="#06b6d4" fillOpacity="0.03" />
        <circle cx="160" cy="80" r="8" fill="#06b6d4" fillOpacity="0.2" />
        <rect x="180" y="70" width="70" height="6" rx="2" fill="#06b6d4" fillOpacity="0.15" />
        <rect x="180" y="82" width="50" height="4" rx="1" fill="#06b6d4" fillOpacity="0.1" />
        <rect x="160" y="100" width="90" height="20" rx="4" stroke="#06b6d4" strokeWidth="1" opacity="0.5" />
        <text x="175" y="114" fill="#06b6d4" fontSize="9" fontFamily="monospace">Sync Active</text>
        <line x1="100" y1="80" x2="130" y2="80" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        <rect x="300" y="40" width="80" height="50" rx="6" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />
        <rect x="310" y="55" width="60" height="6" rx="2" fill="#06b6d4" fillOpacity="0.1" />
        <rect x="310" y="67" width="40" height="6" rx="2" fill="#06b6d4" fillOpacity="0.08" />
        <line x1="270" y1="90" x2="300" y2="65" stroke="#06b6d4" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      </svg>
    ),
  },
  Product: {
    title: 'Decision velocity, amplified',
    subtitle: 'From signal to strategy without information lag.',
    features: [
      { label: 'Stakeholder sync', value: 'Async-first' },
      { label: 'Roadmap drift', value: '↓ 78%' },
      { label: 'Decision capture', value: 'Automatic' },
      { label: 'Context preserved', value: '100%' },
    ],
    diagram: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full opacity-80">
        <line x1="30" y1="100" x2="370" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.2" />
        <circle cx="60" cy="100" r="12" stroke="#06b6d4" strokeWidth="1.5" fill="#06b6d4" fillOpacity="0.1" />
        <text x="55" y="104" fill="#06b6d4" fontSize="10" fontFamily="monospace">1</text>
        <line x1="72" y1="100" x2="128" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
        <circle cx="140" cy="100" r="12" stroke="#8b5cf6" strokeWidth="1.5" fill="#8b5cf6" fillOpacity="0.1" />
        <text x="135" y="104" fill="#8b5cf6" fontSize="10" fontFamily="monospace">2</text>
        <line x1="152" y1="100" x2="208" y2="100" stroke="#8b5cf6" strokeWidth="1" opacity="0.4" />
        <circle cx="220" cy="100" r="12" stroke="#06b6d4" strokeWidth="1.5" fill="#06b6d4" fillOpacity="0.1" />
        <text x="215" y="104" fill="#06b6d4" fontSize="10" fontFamily="monospace">3</text>
        <line x1="232" y1="100" x2="288" y2="100" stroke="#06b6d4" strokeWidth="1" opacity="0.4" />
        <circle cx="300" cy="100" r="12" stroke="#8b5cf6" strokeWidth="1.5" fill="#8b5cf6" fillOpacity="0.1" />
        <text x="295" y="104" fill="#8b5cf6" fontSize="10" fontFamily="monospace">4</text>
        <rect x="40" y="140" width="160" height="40" rx="6" stroke="#8b5cf6" strokeWidth="1" fill="#8b5cf6" fillOpacity="0.03" />
        <text x="55" y="158" fill="#f8fafc" fontSize="10" fontFamily="monospace">Signal Detected</text>
        <text x="55" y="170" fill="#8b5cf6" fontSize="8" fontFamily="monospace" opacity="0.6">AI confidence: 97%</text>
        <rect x="220" y="140" width="160" height="40" rx="6" stroke="#06b6d4" strokeWidth="1" fill="#06b6d4" fillOpacity="0.03" />
        <text x="240" y="158" fill="#f8fafc" fontSize="10" fontFamily="monospace">Resolution Path</text>
        <text x="240" y="170" fill="#06b6d4" fontSize="8" fontFamily="monospace" opacity="0.6">3 agents assigned</text>
      </svg>
    ),
  },
};

const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Core',
    price: '$39',
    period: '/seat/mo',
    description: 'Essential spatial collaboration for small teams ready to move beyond linear workflows.',
    features: ['Up to 10 seats', '5 active agents', 'Basic AI triage', '7-day decision memory', 'Standard integrations'],
    highlighted: false,
    cta: 'Start with Core',
  },
  {
    name: 'Pro',
    price: '$89',
    period: '/seat/mo',
    description: 'Full power for teams operating at machine-adjacent speed. Unlimited potential, zero friction.',
    features: ['Unlimited seats', 'Unlimited agents', 'Advanced AI triage', 'Unlimited decision memory', 'Spatial context graph', 'Priority support', 'Custom workflows'],
    highlighted: true,
    cta: 'Enter Prism',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Bespoke deployment for organizations requiring maximum control, compliance, and capability.',
    features: ['Everything in Pro', 'On-prem deployment', 'SSO & SCIM', 'Custom AI models', 'Dedicated success team', 'SLA guarantee', 'Audit logging'],
    highlighted: false,
    cta: 'Contact Sales',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'How is Prism different from Linear, Notion, or Asana?',
    answer: 'Prism isn\'t project management — it\'s a spatial execution layer. While traditional tools track tasks sequentially, Prism operates in parallel, with AI agents that actively decompose and execute work alongside your team. The interface is spatial, not list-based. The intelligence is autonomous, not manual.',
  },
  {
    question: 'What does "post-SaaS" mean?',
    answer: 'Post-SaaS describes software that doesn\'t just digitize old workflows — it replaces them entirely. Prism doesn\'t ask you to fill out forms and update statuses. It senses, triages, and executes. The workspace adapts to your work, not the other way around.',
  },
  {
    question: 'How does the AI triage engine work?',
    answer: 'Every signal entering your workspace — a message, commit, file change, or decision point — is classified by our AI in real-time. It assesses urgency, maps dependencies against your active work graph, and routes to the appropriate thread or agent. You see the result, not the process.',
  },
  {
    question: 'Can Prism integrate with our existing tools?',
    answer: 'Yes. Prism connects with GitHub, GitLab, Figma, Slack, Linear, and over 40 other tools through native integrations. Our bidirectional sync ensures that work flows seamlessly between Prism and your existing stack — no migration required.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Enterprise-grade security is foundational, not an add-on. All data is encrypted at rest and in transit. We\'re SOC 2 Type II certified, and our architecture ensures zero-knowledge encryption for sensitive operations. Enterprise customers can deploy on-prem with full air-gapped isolation.',
  },
];

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035]"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  );
}

function CursorSpotlight({ mouse }: { mouse: MousePosition }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[90] transition-opacity duration-300"
      aria-hidden="true"
      style={{
        background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(6, 182, 212, 0.06), rgba(139, 92, 246, 0.03), transparent 60%)`,
      }}
    />
  );
}

function MagneticButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (shouldReduceMotion || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setPosition({
        x: (e.clientX - centerX) * 0.15,
        y: (e.clientY - centerY) * 0.15,
      });
    },
    [shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  const baseClasses =
    'relative px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020204]';
  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:from-cyan-400 hover:to-violet-400 shadow-lg shadow-cyan-500/20'
      : 'bg-white/[0.04] border border-white/[0.08] text-white/80 hover:bg-white/[0.08] hover:text-white backdrop-blur-sm';

  return (
    <motion.button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function GlassCard({
  children,
  className = '',
  onMouseMove,
  onMouseLeave,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white/[0.01] border border-white/[0.08] backdrop-blur-2xl ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 15% 10%, rgba(255,255,255,0.04), transparent 50%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function FloatingShards({ scrollY }: { scrollY: number }) {
  const shouldReduceMotion = useReducedMotion();

  const shards = useMemo(
    () => [
      { x: '10%', y: '20%', size: 60, rotation: 35, speed: 0.3 },
      { x: '85%', y: '15%', size: 45, rotation: -20, speed: 0.2 },
      { x: '70%', y: '75%', size: 70, rotation: 60, speed: 0.4 },
      { x: '20%', y: '80%', size: 35, rotation: -45, speed: 0.25 },
      { x: '50%', y: '45%', size: 25, rotation: 80, speed: 0.15 },
    ],
    []
  );

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shards.map((shard, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: shard.x,
            top: shard.y,
            transform: `translateY(${scrollY * shard.speed * 0.1}px) rotate(${shard.rotation + scrollY * shard.speed * 0.02}deg)`,
          }}
        >
          <svg
            width={shard.size}
            height={shard.size * 1.6}
            viewBox="0 0 60 96"
            fill="none"
            className="opacity-[0.04]"
          >
            <path
              d="M30 0L60 30L30 96L0 30L30 0Z"
              stroke="url(#shardGrad)"
              strokeWidth="0.5"
              fill="url(#shardFill)"
            />
            <defs>
              <linearGradient id="shardGrad" x1="0" y1="0" x2="60" y2="96">
                <stop stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="shardFill" x1="0" y1="0" x2="60" y2="96">
                <stop stopColor="#06b6d4" stopOpacity="0.05" />
                <stop offset="1" stopColor="#8b5cf6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function MarqueeSection() {
  return (
    <section className="py-8 border-y border-white/[0.04] overflow-hidden" aria-label="Trusted by leading companies">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...BRANDS, ...BRANDS].map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="mx-12 text-xs tracking-[0.3em] text-white/20 font-light uppercase"
          >
            {brand}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}

function FeatureCardComponent({ feature, index }: { feature: FeatureCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (shouldReduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * -8, y: x * 8 });
    },
    [shouldReduceMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className={feature.span}
    >
      <GlassCard
        className={`h-full p-6 md:p-8 cursor-default transition-shadow duration-300 ${
          isHovered ? 'shadow-lg shadow-cyan-500/[0.05]' : ''
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: shouldReduceMotion
            ? undefined
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.2s ease-out, box-shadow 0.3s ease',
        }}
      >
        <motion.div
          className="mb-4"
          animate={{
            y: isHovered ? -4 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-white/90 font-semibold text-lg mb-2">{feature.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
        {feature.hasPulse && (
          <div className="mt-4" aria-hidden="true">
            <AIPulseVisualization />
          </div>
        )}
        {feature.isDense && (
          <div className="mt-4 space-y-2" aria-hidden="true">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-1.5 rounded-full bg-violet-500/30" style={{ width: `${60 + i * 15}%` }} />
                <span className="text-[10px] text-violet-400/60 font-mono">{85 + i * 4}%</span>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function AIPulseVisualization() {
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const nodes = useMemo(
    () => [
      { cx: 30, cy: 30, r: 3 },
      { cx: 80, cy: 20, r: 2.5 },
      { cx: 130, cy: 35, r: 3.5 },
      { cx: 50, cy: 70, r: 2 },
      { cx: 100, cy: 65, r: 3 },
      { cx: 150, cy: 75, r: 2.5 },
      { cx: 75, cy: 95, r: 2 },
      { cx: 120, cy: 90, r: 3 },
    ],
    []
  );

  const connections = useMemo(
    () => [
      [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 6], [4, 7], [5, 7],
    ],
    []
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="AI Pulse network visualization"
    >
      <svg viewBox="0 0 180 110" fill="none" className="w-full h-20">
        {connections.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#06b6d4"
            strokeWidth="0.5"
            animate={{
              opacity: hovered ? [0.2, 0.6, 0.2] : 0.15,
              strokeWidth: hovered ? [0.5, 1, 0.5] : 0.5,
            }}
            transition={{
              duration: 1.5 + i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={node.r}
            fill="#06b6d4"
            animate={{
              fillOpacity: hovered ? [0.3, 0.8, 0.3] : 0.2,
              r: hovered ? [node.r, node.r * 1.3, node.r] : node.r,
            }}
            transition={{
              duration: 1.2 + i * 0.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {shouldReduceMotion && (
          <>
            {connections.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].cx}
                y1={nodes[a].cy}
                x2={nodes[b].cx}
                y2={nodes[b].cy}
                stroke="#06b6d4"
                strokeWidth="0.5"
                opacity={0.15}
              />
            ))}
            {nodes.map((node, i) => (
              <circle
                key={i}
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill="#06b6d4"
                fillOpacity={0.2}
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}

function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 md:px-12" aria-labelledby="timeline-heading">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase font-mono">From Signal to Resolution</span>
          <h2 id="timeline-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3">
            The execution loop
          </h2>
        </motion.div>

        <div className="relative">
          {/* Light beam line */}
          <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.04] md:-translate-x-px" aria-hidden="true">
            <motion.div
              className="w-full bg-gradient-to-b from-cyan-500 via-violet-500 to-cyan-500 origin-top"
              style={{ height: shouldReduceMotion ? '100%' : lineHeight }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {TIMELINE_STEPS.map((step, index) => (
              <TimelineStepItem key={step.number} step={step} index={index} isLeft={index % 2 === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineStepItem({
  step,
  index,
  isLeft,
}: {
  step: TimelineStep;
  index: number;
  isLeft: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.4, 0.25, 1] }}
      className={`relative flex items-start gap-6 md:gap-0 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Node */}
      <div className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[#020204] border-2 border-cyan-500/40 flex items-center justify-center z-10" aria-hidden="true">
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
        />
      </div>

      {/* Content */}
      <div className={`ml-12 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
        <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
          {step.icon}
          <span className="text-[10px] tracking-[0.3em] text-white/20 font-mono">{step.number}</span>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold text-white/90 mb-2">{step.title}</h3>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm">{step.description}</p>
      </div>
    </motion.div>
  );
}

function UseCasesTabs() {
  const [activeTab, setActiveTab] = useState<keyof typeof TAB_CONTENT>('Engineering');
  const shouldReduceMotion = useReducedMotion();
  const tabs = Object.keys(TAB_CONTENT) as (keyof typeof TAB_CONTENT)[];
  const content = TAB_CONTENT[activeTab];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" aria-labelledby="usecases-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase font-mono">Built for Every Function</span>
          <h2 id="usecases-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3">
            One workspace. Infinite contexts.
          </h2>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12" role="tablist" aria-label="Use case categories">
          <div className="relative inline-flex bg-white/[0.02] rounded-full p-1 border border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={`panel-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 text-sm font-medium transition-colors duration-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] rounded-full"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-label={`${activeTab} use case`}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <GlassCard className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl md:text-3xl font-semibold text-white/90 mb-3">{content.title}</h3>
                  <p className="text-white/40 mb-8">{content.subtitle}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {content.features.map((f) => (
                      <div key={f.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <div className="text-lg font-semibold text-white/80 font-mono">{f.value}</div>
                        <div className="text-[10px] tracking-wider text-white/30 uppercase mt-1">{f.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-4 border border-white/[0.04]">
                  {content.diagram}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const shouldReduceMotion = useReducedMotion();

  const layer1Y = useTransform(scrollYProgress, [0.2, 0.6], shouldReduceMotion ? [0, 0] : [80, 0]);
  const layer1Opacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const layer1RotateX = useTransform(scrollYProgress, [0.2, 0.6], shouldReduceMotion ? [0, 0] : [25, 0]);

  const layer2Y = useTransform(scrollYProgress, [0.3, 0.7], shouldReduceMotion ? [0, 0] : [120, 0]);
  const layer2Opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const layer2Scale = useTransform(scrollYProgress, [0.3, 0.7], shouldReduceMotion ? [1, 1] : [0.85, 1]);

  const layer3Y = useTransform(scrollYProgress, [0.4, 0.8], shouldReduceMotion ? [0, 0] : [160, 0]);
  const layer3Opacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 px-6 md:px-12 relative" aria-labelledby="product-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase font-mono">The Spatial Engine</span>
          <h2 id="product-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3 mb-4">
            Prism doesn&apos;t just track work —<br className="hidden md:block" /> it executes it.
          </h2>
          <p className="text-white/30 text-sm max-w-md mx-auto">
            Three intelligent layers assemble in real-time, transforming chaos into orchestrated execution.
          </p>
        </motion.div>

        {/* Z-axis assembly */}
        <div className="relative h-[500px] md:h-[600px]" style={{ perspective: '1200px' }}>
          {/* Layer 1: Workspace */}
          <motion.div
            className="absolute inset-x-0 bottom-0"
            style={{ y: layer3Y, opacity: layer3Opacity }}
          >
            <GlassCard className="p-4 md:p-6 border-cyan-500/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
                <span className="text-[10px] tracking-[0.2em] text-cyan-400/60 uppercase font-mono">Workspace</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-2" />
                    <div className="h-1.5 w-16 rounded bg-white/10 mb-1.5" />
                    <div className="h-1.5 w-12 rounded bg-white/5" />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Layer 2: AI Triage */}
          <motion.div
            className="absolute inset-x-4 md:inset-x-12 bottom-20 md:bottom-28"
            style={{ y: layer2Y, opacity: layer2Opacity, scale: layer2Scale }}
          >
            <GlassCard className="p-4 md:p-6 border-violet-500/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-violet-400/60" />
                <span className="text-[10px] tracking-[0.2em] text-violet-400/60 uppercase font-mono">AI Triage</span>
              </div>
              <div className="flex gap-3">
                {['Critical', 'Active', 'Queued', 'Resolved'].map((state, i) => (
                  <div
                    key={state}
                    className="flex-1 rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 text-center"
                  >
                    <div className="text-lg font-mono text-white/60">{[3, 12, 7, 24][i]}</div>
                    <div className="text-[9px] tracking-wider text-white/30 uppercase mt-1">{state}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                    animate={{ width: ['0%', '78%'] }}
                    transition={{ duration: 2, delay: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] text-violet-400/60 font-mono">78%</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Layer 3: Command Center */}
          <motion.div
            className="absolute inset-x-8 md:inset-x-24 bottom-40 md:bottom-56"
            style={{ y: layer1Y, opacity: layer1Opacity, rotateX: layer1RotateX }}
          >
            <GlassCard className="p-4 md:p-6 border-white/[0.12] shadow-2xl shadow-cyan-500/[0.05]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[10px] tracking-[0.2em] text-white/50 uppercase font-mono">Command Center</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[9px] text-green-400/60 font-mono">LIVE</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {['Agents', 'Threads', 'Signals', 'Sync'].map((label, i) => (
                  <div key={label} className="rounded-md bg-white/[0.02] border border-white/[0.04] p-2 text-center">
                    <div className="text-sm font-mono text-white/70">{[12, 47, 183, '99.9%'][i]}</div>
                    <div className="text-[8px] tracking-wider text-white/25 uppercase mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full bg-white/[0.03] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${20 + i * 15}%`,
                        background: i % 2 === 0 ? '#06b6d4' : '#8b5cf6',
                        opacity: 0.4 + i * 0.1,
                      }}
                    />
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12" aria-labelledby="pricing-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-cyan-400/60 uppercase font-mono">Pricing</span>
          <h2 id="pricing-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3">
            Scale without friction
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PRICING_TIERS.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, index }: { tier: PricingTier; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative rounded-2xl overflow-hidden ${
        tier.highlighted ? 'md:-mt-4 md:mb-[-16px]' : ''
      }`}
    >
      {tier.highlighted && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-violet-500/5" />
          <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl" />
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(6,182,212,0.1), transparent)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
        </>
      )}
      <div
        className={`relative p-8 backdrop-blur-2xl ${
          tier.highlighted ? '' : 'bg-white/[0.01] border border-white/[0.06]'
        }`}
      >
        <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">{tier.name}</span>
        <div className="mt-3 mb-2 flex items-baseline gap-1">
          <span className="text-4xl font-light text-white/90">{tier.price}</span>
          {tier.period && <span className="text-sm text-white/30">{tier.period}</span>}
        </div>
        <p className="text-white/30 text-sm mb-6 leading-relaxed">{tier.description}</p>
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-white/50">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={`mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-cyan-400' : 'text-white/30'}`}
              >
                <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020204] ${
            tier.highlighted
              ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:from-cyan-400 hover:to-violet-400 shadow-lg shadow-cyan-500/20'
              : 'bg-white/[0.04] border border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white'
          }`}
        >
          {tier.cta}
        </button>
      </div>
    </motion.div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" aria-labelledby="faq-heading">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase font-mono">FAQ</span>
          <h2 id="faq-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-1">
          {FAQ_ITEMS.map((item, index) => (
            <FAQAccordion
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordion({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/[0.04] rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="text-white/80 font-medium pr-4">{item.question}</span>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="text-white/30 flex-shrink-0"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 text-white/40 text-sm leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.04]" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <PrismLogo />
            <p className="text-white/20 text-sm">Built for teams operating at machine-adjacent speed.</p>
          </div>
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {['Product', 'Pricing', 'Documentation', 'Company', 'Careers', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200 focus:outline-none focus-visible:text-cyan-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/15">© 2025 Prism. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Security'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[11px] text-white/15 hover:text-white/30 transition-colors duration-200 focus:outline-none focus-visible:text-cyan-400"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function PrismLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-2xl font-semibold tracking-tight text-white/80">Prism</span>
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          background: hovered
            ? 'linear-gradient(90deg, rgba(6,182,212,0.3), rgba(139,92,246,0.3))'
            : 'transparent',
        }}
        transition={{ duration: 0.3 }}
        style={{
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '-0.025em',
          lineHeight: '2rem',
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════

export default function Page() {
  const mouse = useMousePosition();
  const [scrollY, setScrollY] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020204] text-white antialiased selection:bg-cyan-500/30">
      <FilmGrain />
      <CursorSpotlight mouse={mouse} />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 overflow-hidden" aria-labelledby="hero-heading">
        <FloatingShards scrollY={scrollY} />

        {/* Ambient glow */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, rgba(139,92,246,0.02) 40%, transparent 70%)',
          }}
        />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-[10px] tracking-[0.4em] text-cyan-400/50 uppercase font-mono mb-6 px-4 py-1.5 rounded-full border border-cyan-500/10 bg-cyan-500/[0.02]">
              The first post-SaaS workspace
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] tracking-[-0.03em] mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="block">Work at the</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #06b6d4, #8b5cf6)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: shouldReduceMotion ? 'none' : 'gradientShift 8s ease infinite',
              }}
            >
              speed of light
            </span>
          </motion.h1>

          <motion.p
            className="text-white/30 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Autonomous. Real-time. Spatial. From signal to resolution without interface drag.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <MagneticButton variant="primary">Enter Prism</MagneticButton>
            <MagneticButton variant="secondary">
              <span className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <path d="M6.5 5L11 8L6.5 11V5Z" fill="currentColor" opacity="0.7" />
                </svg>
                Watch signal
              </span>
            </MagneticButton>
          </motion.div>

          {/* Stats panel */}
          <motion.div
            className="mt-16 inline-flex gap-8 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { label: 'Latency', value: '< 12ms' },
              { label: 'Uptime', value: '99.99%' },
              { label: 'Agents active', value: '2.4M' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-mono text-white/70">{stat.value}</div>
                <div className="text-[9px] tracking-[0.2em] text-white/25 uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ opacity: [0.2, 0.5, 0.2], y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* ═══ SOCIAL PROOF MARQUEE ═══ */}
      <MarqueeSection />

      {/* ═══ PRODUCT SHOWCASE ═══ */}
      <ProductShowcase />

      {/* ═══ BENTO FEATURES ═══ */}
      <section className="py-24 md:py-32 px-6 md:px-12" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-[10px] tracking-[0.3em] text-violet-400/60 uppercase font-mono">Capabilities</span>
            <h2 id="features-heading" className="text-3xl md:text-5xl font-light text-white/90 mt-3">
              Engineered for the extraordinary
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
            {FEATURES.map((feature, index) => (
              <FeatureCardComponent key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <Timeline />

      {/* ═══ USE CASES ═══ */}
      <UseCasesTabs />

      {/* ═══ PRICING ═══ */}
      <PricingSection />

      {/* ═══ FAQ ═══ */}
      <FAQSection />

      {/* ═══ FOOTER ═══ */}
      <Footer />

      {/* Global styles */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
} 