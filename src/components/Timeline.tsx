interface TimelineStep {
  number: number
  title: string
  description: string
  icon: string
}

interface TimelineProps {
  steps: TimelineStep[]
  variant?: 'landing' | 'monitoring'
}

export default function Timeline({ steps, variant = 'landing' }: TimelineProps) {
  if (variant === 'monitoring') {
    return (
      <div className="space-y-2">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-2 text-xs text-white/70">
            <span className="text-fasal-success mt-0.5">{step.icon}</span>
            <span>{step.description}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-px bg-fasal-border hidden md:block" />
      <div className="space-y-8">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-fasal-slate flex items-center justify-center z-10 relative">
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }} className="text-fasal-success font-600 text-sm">
                  {String(step.number).padStart(2, '0')}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-fasal-border md:hidden" />
              )}
            </div>
            <div className="pt-3">
              <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif' }} className="text-base font-700 text-fasal-slate uppercase tracking-wide flex items-center gap-2 mb-1">
                <span>{step.icon}</span> {step.title}
              </h4>
              <p className="text-sm text-fasal-muted leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
