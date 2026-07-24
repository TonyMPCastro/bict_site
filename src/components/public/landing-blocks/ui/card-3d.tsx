'use client'

import React, { useState } from 'react'

export const Card3D = ({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) => {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left
    const y = e.clientY - box.top
    const centerX = box.width / 2
    const centerY = box.height / 2

    const rotateXValue = ((y - centerY) / centerY) * -12
    const rotateYValue = ((x - centerX) / centerX) * 12

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: 'transform 0.15s ease-out'
        }}
        className="w-full h-full transform-style-3d"
      >
        {children}
      </div>
    </div>
  )
}
