import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeatureCard from '../components/FeatureCard'
import Timeline from '../components/Timeline'
import Footer from '../components/Footer'
import FarmSimulation from '../components/FarmSimulation'
import { Link } from 'react-router'
import { useState } from 'react'
import prb1 from '../assets/prb-1.png'
import prb2 from '../assets/prb-2.png'
import prb3 from '../assets/prb-3.png'
import prb4 from '../assets/prb-4.png'

const PROBLEMS = [
  {
    icon: '🐄',
    title: 'Crop Damage',
    description: 'Stray cattle and wild animals destroy crops overnight, causing catastrophic seasonal losses for small farmers.',
    imageSrc: prb1,
    imageAlt: 'Crop damage in a farm field',
  },
  {
    icon: '⚡',
    title: 'Dangerous Electric Fences',
    description: '"Zatka" high-voltage fences pose lethal hazards to animals, farm labourers, and children — yet remain widespread.',
    imageSrc: prb2,
    imageAlt: 'Dangerous electric fencing on a farm',
  },
  {
    icon: '🌱',
    title: 'Farmer Losses',
    description: 'Repeated crop destruction pushes farmers into debt cycles with no affordable, reliable protection alternative.',
    imageSrc: prb3,
    imageAlt: 'Farmer losses due to crop damage',
  },
  {
    icon: '🐐',
    title: 'Animal Safety Risk',
    description: 'Pesticide-sprayed crops are lethal to grazing livestock. Animals need deterrence, not harm.',
    imageSrc: prb4,
    imageAlt: 'Animal safety risk in the field',
  },
]

const FEATURES = [
  { icon: '📷', title: 'Live AI Detection', description: 'Edge-AI vision model continuously scans the farm perimeter and identifies animals in real time.' },
  { icon: '🎥', title: 'Camera Monitoring', description: 'Multi-camera dashboard feed with YOLO-style bounding boxes and species labels overlaid on the live view.' },
  { icon: '📱', title: 'Instant Alerts', description: 'Real-time push and dashboard alerts with species, confidence, boundary, and recommended action.' },
  { icon: '🚨', title: 'Risk Analysis', description: 'Decision Engine classifies each detection as Low / Medium / High risk based on species, proximity, and zone.' },
  { icon: '💡', title: 'LED Strobe Control', description: 'Automated or manual trigger of dynamic LED strobes — effective deterrents that are invisible to humans at distance.' },
  { icon: '🔊', title: 'Sound Deterrent', description: 'Species-tuned high-frequency audio pulses that disorient and redirect animals without causing harm.' },
  { icon: '💧', title: 'Water Sprayer', description: 'Automated water mist activated for high-risk intrusions — humane and effective for persistent offenders.' },
  { icon: '📊', title: 'Farm Dashboard', description: 'Live KPI overview of daily detections, risk levels, alert counts, and protection status at a glance.' },
  { icon: '📜', title: 'Detection History', description: 'Full audit log of every intrusion event with species, confidence, action taken, and timestamp.' },
]

const HOW_IT_WORKS = [
  { number: 1, icon: '📡', title: 'Perimeter Scan', description: 'Solar-powered cameras continuously monitor the farm perimeter, streaming to the edge AI processor.' },
  { number: 2, icon: '🤖', title: 'AI Detection', description: 'FasalRaksha AI (YOLO-v8 family) processes each frame in real time and flags any animal movement.' },
  { number: 3, icon: '🦮', title: 'Species Classification', description: 'The model classifies the detected animal — Cow, Buffalo, Goat, Pig, or Stray Dog — with confidence score.' },
  { number: 4, icon: '⚖️', title: 'Risk Calculation', description: 'Decision Engine combines species, proximity to boundary, and zone to assign a Low / Medium / High risk level.' },
  { number: 5, icon: '🎯', title: 'Deterrent Triggered', description: 'A safe, species-aware deterrent combination (LED / sound / water) is automatically or manually activated.' },
  { number: 6, icon: '🔔', title: 'Farmer Notified', description: 'The farmer receives an instant dashboard alert and simulated push notification with full detection context.' },
  { number: 7, icon: '🗂️', title: 'Incident Logged', description: 'The entire event — animal, confidence, risk, action, timestamp — is stored in Detection History for audit.' },
]

const TEAM = [
  { name: 'DISHTI PATEL', role: 'AI / ML Engineer', initial: 'D' },
  { name: 'RUDRAKSH KUMAWAT', role: 'Full-Stack Developer', initial: 'R' },
  { name: 'MAITRI SHAH', role: 'Hardware & UI/UX Designer', initial: 'M' },
]

export default function Landing() {
  const [copied, setCopied] = useState<string | null>(null)

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="landing" />
      <Hero />

      {/* Problem Statement */}
      <section id="problem" className="py-20 md:py-28 px-6 md:px-12 bg-fasal-surface">
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="The Problem" />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-fasal-slate uppercase tracking-tight mb-4">
            Why Farmers Need a Better Solution
          </h2>
          <p className="text-fasal-muted text-lg mb-12 max-w-2xl">
            Across Gujarat, farmers lose livelihoods to stray animals — and current "solutions" are either useless or deadly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROBLEMS.map((p) => (
              <FeatureCard key={p.title} {...p} variant="problem" />
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section id="solution" className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="The Solution" />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-fasal-slate uppercase tracking-tight mb-4">
            One Platform. Complete Protection.
          </h2>
          <p className="text-fasal-muted text-lg mb-16 max-w-2xl">
            FasalRaksha turns edge-AI detection into automated, non-lethal deterrence — all visible on a single control screen.
          </p>

          {/* Flow diagram */}
          <div className="overflow-x-auto">
            <div className="flex items-center gap-0 min-w-max mx-auto" style={{ width: 'fit-content' }}>
              {[
                { icon: '📡', label: 'Camera Array' },
                { icon: '🤖', label: 'FasalRaksha AI' },
                { icon: '🦮', label: 'Animal Detection' },
                { icon: '⚖️', label: 'Decision Engine' },
                { icon: '🛡️', label: 'Safe Deterrent' },
                { icon: '🔔', label: 'Farmer Alert' },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-3 w-28">
                    <div className="w-14 h-14 rounded-full bg-fasal-slate flex items-center justify-center text-2xl shadow-md">
                      {step.icon}
                    </div>
                    <p className="text-xs font-600 text-fasal-slate text-center leading-tight">{step.label}</p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex items-center mx-1 text-fasal-emerald">
                      <div className="w-6 h-0.5 bg-fasal-border" />
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 md:py-28 px-6 md:px-12 bg-fasal-surface">
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="Features" />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-fasal-slate uppercase tracking-tight mb-12">
            Everything in One Dashboard
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionLabel text="How It Works" />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-fasal-slate uppercase tracking-tight mb-12">
            The 7-Step Protection Pipeline
          </h2>
          <Timeline steps={HOW_IT_WORKS} />
        </div>
      </section>

      {/* Live 3D Simulation */}
      <section id="simulation" className="py-20 md:py-28 px-6 md:px-12 bg-fasal-slate">
        <div className="max-w-7xl mx-auto">
          <SectionLabel text="Live Simulation" light />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-white uppercase tracking-tight mb-4">
            Interactive 3D Digital Twin
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-2xl">
            Explore a real-time simulation of FasalRaksha in action — select an intruding animal, start the scenario, and watch AI detection, risk assessment, and automated deterrents respond live.
          </p>
          <FarmSimulation />
          <p className="text-white/30 text-xs mt-4 text-center" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            3D Digital Twin · Simulation Mode · Demonstrates GPIO/Relay workflow for physical implementation
          </p>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-20 md:py-28 px-6 md:px-12 bg-fasal-slate">
        <div className="max-w-6xl mx-auto">
          <SectionLabel text="Architecture" light />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-white uppercase tracking-tight mb-12">
            System Architecture
          </h2>
          <ArchitectureDiagram />
        </div>
      </section>

      {/* Demo Credentials */}
      <section id="demo" className="py-20 md:py-28 px-6 md:px-12 bg-fasal-surface">
        <div className="max-w-md mx-auto text-center">
          <SectionLabel text="Try It Now" center />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl font-700 text-fasal-slate uppercase tracking-tight mb-3">
            Live Demo Access
          </h2>
          <p className="text-fasal-muted mb-8">Use these credentials to access the full dashboard instantly.</p>
          <div className="bg-white rounded-2xl border border-fasal-border p-6 shadow-sm text-left">
            <CopyField label="Email" value="demo@fasalraksha.ai" copied={copied === 'email'} onCopy={() => copy('demo@fasalraksha.ai', 'email')} />
            <CopyField label="Password" value="fasalraksha123" copied={copied === 'pass'} onCopy={() => copy('fasalraksha123', 'pass')} />
            <Link
              to="/login"
              className="mt-5 w-full block text-center py-3 bg-fasal-emerald hover:bg-fasal-emerald-dark text-white font-600 rounded-lg transition-colors"
            >
              Login to Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionLabel text="Team" center />
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-4xl md:text-5xl font-700 text-fasal-slate uppercase tracking-tight mb-12 text-center">
            Built By
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {TEAM.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-fasal-slate flex items-center justify-center text-white text-xl font-700 mx-auto mb-3">
                  {member.initial}
                </div>
                <p className="font-600 text-fasal-slate text-sm">{member.name}</p>
                <p className="text-fasal-muted text-xs mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function SectionLabel({ text, light, center }: { text: string; light?: boolean; center?: boolean }) {
  return (
    <p
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
      className={`text-xs font-600 uppercase tracking-widest mb-3 ${center ? 'text-center' : ''} ${light ? 'text-fasal-success' : 'text-fasal-emerald'}`}
    >
      — {text}
    </p>
  )
}

function CopyField({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="mb-4">
      <p className="text-xs text-fasal-muted font-500 mb-1.5 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2 bg-fasal-surface rounded-lg px-3 py-2.5 border border-fasal-border">
        <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="flex-1 text-sm text-fasal-slate">{value}</span>
        <button
          onClick={onCopy}
          className="text-xs font-500 text-fasal-emerald hover:text-fasal-emerald-dark transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

function ArchitectureDiagram() {
  const layers = [
    {
      label: 'Edge Layer',
      items: ['Solar Camera', 'PIR Sensor', 'Edge AI Processor'],
      color: '#0F5E3C',
      icon: '📡',
    },
    {
      label: 'AI & Decision',
      items: ['YOLO-v8 Inference', 'Species Classifier', 'Decision Engine'],
      color: '#B7791F',
      icon: '🤖',
    },
    {
      label: 'Actuator Layer',
      items: ['LED Strobes', 'High-Freq Speaker', 'Water Sprayer'],
      color: '#B3261E',
      icon: '🛡️',
    },
    {
      label: 'Cloud & Sync',
      items: ['Event Store', 'Alert Dispatcher', 'API Gateway'],
      color: '#1F9D55',
      icon: '☁️',
    },
    {
      label: 'Dashboard',
      items: ['Live Monitoring', 'Detection History', 'Device Controls'],
      color: '#0F5E3C',
      icon: '🖥️',
    },
  ]

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-4 items-stretch justify-center">
        {layers.map((layer, i) => (
          <div key={layer.label} className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5 w-44">
              <div className="text-2xl mb-2">{layer.icon}</div>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif', color: layer.color }} className="text-sm font-700 uppercase tracking-wider mb-3">
                {layer.label}
              </p>
              <div className="space-y-1.5">
                {layer.items.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: layer.color }} />
                    <p className="text-white/60 text-xs">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="text-white/20 self-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-white/30 text-xs mt-8" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        Edge → AI → Actuator → Cloud → Dashboard · Solar-powered · Off-grid ready
      </p>
    </div>
  )
}
