import { Link } from 'react-router'

interface NavbarProps {
  variant?: 'landing' | 'minimal'
}

export default function Navbar({ variant = 'landing' }: NavbarProps) {
  if (variant === 'minimal') {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-fasal-slate/95 backdrop-blur-sm border-b border-white/10 h-14 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <LeafIcon />
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-xl font-700 tracking-wide uppercase">
            FasalRaksha
          </span>
        </Link>
      </nav>
    )
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-fasal-slate/95 backdrop-blur-sm border-b border-white/10 h-16 flex items-center px-6 md:px-12">
      <div className="flex items-center gap-2 flex-1">
        <LeafIcon />
        <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-2xl font-700 tracking-wide uppercase">
          FasalRaksha
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-500 text-white/70">
        <a href="#problem" className="hover:text-white transition-colors">Problem</a>
        <a href="#solution" className="hover:text-white transition-colors">Solution</a>
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        <a href="#simulation" className="hover:text-white transition-colors">Simulation</a>
        <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
        <a href="#team" className="hover:text-white transition-colors">Team</a>
      </div>
      <div className="flex items-center gap-3 ml-8">
        <a
          href="https://github.com/Dishti-ec/TETRA038.git"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-500 text-white/80 border border-white/20 rounded hover:border-white/50 hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-600 bg-fasal-emerald text-white rounded hover:bg-fasal-emerald-dark transition-colors"
        >
          Try Live Demo
        </Link>
      </div>
    </nav>
  )
}

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#0F5E3C"/>
      <path d="M8 20c0 0 2-8 10-10C18 10 20 8 20 8c0 0-8 2-10 10z" fill="#ffffff" fillOpacity="0.9"/>
      <path d="M8 20 L14 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
