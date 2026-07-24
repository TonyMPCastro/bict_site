'use client'

import React from 'react'
import { Card3D } from './ui/card-3d'
import Image from 'next/image'

export const ImageBlock = ({ props }: { props: any }) => {
  const imageUrl = props.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop'
  const altText = props.altText || 'Imagem de destaque'
  const enable3D = props.enable3D ?? true
  const rounded = props.rounded || 'rounded-3xl'

  const content = (
    <div className={`relative w-full h-[400px] md:h-[600px] ${rounded} overflow-hidden shadow-2xl`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={altText}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  )

  if (enable3D) {
    return <Card3D className="w-full">{content}</Card3D>
  }

  return content
}
