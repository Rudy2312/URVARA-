export default function Footer() {
  return (
    <footer className="bg-fasal-slate text-white/60 py-12 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#0F5E3C"/>
                <path d="M8 20c0 0 2-8 10-10C18 10 20 8 20 8c0 0-8 2-10 10z" fill="#ffffff" fillOpacity="0.9"/>
                <path d="M8 20 L14 14" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-xl font-700 tracking-wide uppercase">FasalRaksha</span>
            </div>
            <p className="text-sm text-white/40 max-w-xs leading-relaxed">
              AI-powered non-invasive crop protection platform. Protect Crops. Protect Animals. Protect Farmers.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-sm font-700 uppercase tracking-wider mb-3">Links</p>
              <div className="space-y-2">
                <a href="#problem" className="block text-sm hover:text-white transition-colors">Problem</a>
                <a href="#features" className="block text-sm hover:text-white transition-colors">Features</a>
                <a href="#architecture" className="block text-sm hover:text-white transition-colors">Architecture</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="block text-sm hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-white text-sm font-700 uppercase tracking-wider mb-3">Hackathon</p>
              <div className="space-y-2 text-sm">
                <p>Track B — AgriTech</p>
                <p>Problem Statement 2</p>
                <p>Stray Animal Deterrence</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2025 FasalRaksha — AI Crop Protection System</p>
          <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>Built for Hackathon · Track B · Problem Statement 2</p>
        </div>
      </div>
    </footer>
  )
}
