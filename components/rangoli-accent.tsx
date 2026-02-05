export function RangoliAccent({ className = '', position = 'left' }: { className?: string; position?: 'left' | 'right' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: position === 'right' ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Outer petals - maroon */}
      <circle cx="100" cy="100" r="80" fill="hsl(340 60% 35% / 0.15)" />
      
      {/* Petal pattern */}
      <path
        d="M100 40 C110 50, 120 60, 100 80 C80 60, 90 50, 100 40Z"
        fill="hsl(340 60% 35% / 0.3)"
      />
      <path
        d="M160 100 C150 110, 140 120, 120 100 C140 80, 150 90, 160 100Z"
        fill="hsl(340 60% 35% / 0.3)"
      />
      <path
        d="M100 160 C90 150, 80 140, 100 120 C120 140, 110 150, 100 160Z"
        fill="hsl(340 60% 35% / 0.3)"
      />
      <path
        d="M40 100 C50 90, 60 80, 80 100 C60 120, 50 110, 40 100Z"
        fill="hsl(340 60% 35% / 0.3)"
      />
      
      {/* Diagonal petals */}
      <path
        d="M135 65 C140 75, 145 85, 125 95 C115 75, 125 70, 135 65Z"
        fill="hsl(340 60% 35% / 0.25)"
      />
      <path
        d="M135 135 C125 130, 115 125, 125 105 C145 115, 140 125, 135 135Z"
        fill="hsl(340 60% 35% / 0.25)"
      />
      <path
        d="M65 135 C70 125, 75 115, 95 125 C85 145, 75 140, 65 135Z"
        fill="hsl(340 60% 35% / 0.25)"
      />
      <path
        d="M65 65 C75 70, 85 75, 75 95 C55 85, 60 75, 65 65Z"
        fill="hsl(340 60% 35% / 0.25)"
      />
      
      {/* Center circle with dots */}
      <circle cx="100" cy="100" r="25" fill="hsl(340 60% 35% / 0.4)" />
      <circle cx="100" cy="100" r="15" fill="hsl(25 95% 53% / 0.5)" />
      <circle cx="100" cy="100" r="8" fill="hsl(340 60% 35% / 0.6)" />
      
      {/* Small decorative dots around center */}
      <circle cx="100" cy="70" r="4" fill="hsl(25 95% 53% / 0.4)" />
      <circle cx="130" cy="100" r="4" fill="hsl(25 95% 53% / 0.4)" />
      <circle cx="100" cy="130" r="4" fill="hsl(25 95% 53% / 0.4)" />
      <circle cx="70" cy="100" r="4" fill="hsl(25 95% 53% / 0.4)" />
    </svg>
  )
}

export function RangoliCorner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Corner arc pattern */}
      <path
        d="M0 0 Q75 0, 75 75 Q75 0, 150 0"
        fill="hsl(340 60% 35% / 0.08)"
      />
      <path
        d="M0 0 Q60 0, 60 60 Q60 0, 120 0"
        fill="hsl(340 60% 35% / 0.12)"
      />
      <path
        d="M0 0 Q45 0, 45 45 Q45 0, 90 0"
        fill="hsl(340 60% 35% / 0.16)"
      />
      
      {/* Decorative dots */}
      <circle cx="20" cy="20" r="3" fill="hsl(25 95% 53% / 0.5)" />
      <circle cx="40" cy="15" r="2.5" fill="hsl(25 95% 53% / 0.5)" />
      <circle cx="60" cy="12" r="2" fill="hsl(25 95% 53% / 0.5)" />
      <circle cx="15" cy="40" r="2.5" fill="hsl(25 95% 53% / 0.5)" />
      <circle cx="12" cy="60" r="2" fill="hsl(25 95% 53% / 0.5)" />
    </svg>
  )
}
