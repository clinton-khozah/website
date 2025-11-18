"use client"

export function StarsBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Small Stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`small-star-${i}`}
          className="star star-small absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite ${Math.random() * 3}s`,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 4px #fff, 0 0 8px #fff'
          }}
        />
      ))}
      
      {/* Medium Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`medium-star-${i}`}
          className="star star-medium absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 4}s`,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 6px #fff, 0 0 12px #fff'
          }}
        />
      ))}
      
      {/* Large Stars */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={`large-star-${i}`}
          className="star star-large absolute"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 5}s`,
            backgroundColor: '#ffffff',
            boxShadow: '0 0 8px #fff, 0 0 16px #fff'
          }}
        />
      ))}
    </div>
  )
} 