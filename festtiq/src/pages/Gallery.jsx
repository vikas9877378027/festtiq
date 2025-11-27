// src/components/TailwindCarouselFive.jsx
import React, { useState, useEffect } from 'react'

const images = [
  'https://picsum.photos/id/1015/600/400',
  'https://picsum.photos/id/1016/600/400',
  'https://picsum.photos/id/1018/600/400',
  'https://picsum.photos/id/1020/600/400',
  'https://picsum.photos/id/1024/600/400',
  'https://picsum.photos/id/1025/600/400',
  'https://picsum.photos/id/1027/600/400',
]

export default function TailwindCarouselFive() {
  const [current, setCurrent] = useState(0)
  const len = images.length

  // auto-advance every 3s
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent(c => (c + 1) % len)
    }, 3000)
    return () => clearInterval(iv)
  }, [len])

  // helper to compute minimal circular offset in range [-len/2..+len/2]
  function circularOffset(i) {
    let diff = i - current
    if (diff < -len / 2) diff += len
    if (diff > len / 2) diff -= len
    return diff
  }

  return (
    <div className="relative w-full max-w-4xl h-64 mx-auto flex items-center justify-center overflow-hidden">
      {images.map((src, i) => {
        const delta = circularOffset(i)
        // only render slides with |delta| ≤ 2
        if (Math.abs(delta) > 2) return null

        // position & style based on how far from center
        const x = delta * 220
        const scale =
          delta === 0 ? 'scale-110' : Math.abs(delta) === 1 ? 'scale-95' : 'scale-75'
        const opacity =
          delta === 0 ? 'opacity-100' : Math.abs(delta) === 1 ? 'opacity-80' : 'opacity-50'
        const zIndex =
          delta === 0 ? 'z-30' : Math.abs(delta) === 1 ? 'z-20' : 'z-10'

        return (
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className={`
              absolute 
              w-64 h-40 
              object-cover 
              rounded-xl 
              shadow-lg 
              transition-all duration-500 ease-in-out
              ${scale} ${opacity} ${zIndex}
            `}
            style={{ transform: `translateX(${x}px)` }}
          />
        )
      })}

      {/* Prev / Next controls */}
      <button
        onClick={() => setCurrent((current - 1 + len) % len)}
        className="absolute left-2 text-white text-3xl focus:outline-none"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent((current + 1) % len)}
        className="absolute right-2 text-white text-3xl focus:outline-none"
      >
        ›
      </button>
    </div>
  )
}
