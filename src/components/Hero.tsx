import { Link } from 'react-router'
import { useEffect, useRef } from 'react'
import bannerImage from '../assets/Banner-2.png'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    let scanY = 0
    let t = 0

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Farmland silhouette
      ctx.fillStyle = 'rgba(15,94,60,0.08)'
      ctx.beginPath()
      ctx.moveTo(0, canvas.height)
      for (let x = 0; x <= canvas.width; x += 4) {
        const y = canvas.height * 0.65 + Math.sin(x * 0.012 + t * 0.3) * 18 + Math.sin(x * 0.025 + t * 0.15) * 10
        ctx.lineTo(x, y)
      }
      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Scan line
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30)
      grad.addColorStop(0, 'transparent')
      grad.addColorStop(0.5, 'rgba(15,94,60,0.35)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.fillRect(0, scanY - 30, canvas.width, 60)

      // Dot grid
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      for (let gx = 0; gx < canvas.width; gx += 40) {
        for (let gy = 0; gy < canvas.height; gy += 40) {
          ctx.beginPath()
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      scanY = (scanY + 1.2) % canvas.height
      t += 0.008
      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(10,61,40,0.8) 0%, rgba(30,41,59,0.75) 50%, rgba(15,26,18,0.9) 100%), url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-6xl md:text-8xl font-800 text-white leading-none tracking-tight mb-4">
          FASAL<span className="text-fasal-success">RAKSHA</span>
        </h1>

        <p className="text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto font-400 italic mb-12 leading-relaxed">
          “Between the wild and the harvest, we create a safer boundary.”
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-4 bg-fasal-emerald hover:bg-fasal-emerald-dark text-white font-600 text-base rounded transition-all flex items-center gap-2 group"
          >
            Try Live Demo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          <a
            href="https://github.com/Dishti-ec/TETRA038.git"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/25 hover:border-white/50 text-white/80 hover:text-white font-500 text-base rounded transition-all flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-10 text-white/40 text-sm">
          <Stat value="Real-Time" label="Risk Analysis" />
          <div className="w-px h-8 bg-white/20"/>
          <Stat value="Interactive" label="Control Panel" />
          <div className="w-px h-8 bg-white/20"/>
          <Stat value="Live" label="Field Insights" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-fasal-success text-xl font-600">{value}</div>
      <div className="text-xs mt-0.5">{label}</div>
    </div>
  )
}
