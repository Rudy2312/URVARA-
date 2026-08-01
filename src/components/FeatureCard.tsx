interface FeatureCardProps {
  icon: string
  title: string
  description: string
  variant?: 'problem' | 'feature'
  imageSrc?: string
  imageAlt?: string
}

export default function FeatureCard({
  icon,
  title,
  description,
  variant = 'feature',
  imageSrc,
  imageAlt,
}: FeatureCardProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all hover:shadow-lg group ${
        variant === 'problem'
          ? 'bg-white border-fasal-border hover:border-fasal-amber/40'
          : 'bg-white border-fasal-border hover:border-fasal-emerald/40'
      }`}
    >
      {imageSrc && (
        <div className="h-44 overflow-hidden bg-fasal-surface">
          <img
            src={imageSrc}
            alt={imageAlt ?? title}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="text-3xl mb-4 hidden">{icon}</div>
        <h3
          style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
          className="text-lg font-700 text-fasal-slate uppercase tracking-wide mb-2"
        >
          {title}
        </h3>
        <p className="text-sm text-fasal-muted leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
