'use client'

import React from 'react'

export const VideoBlock = ({ props }: { props: any }) => {
  const title = props.title
  const videoUrl = props.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {title && (
        <h3 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      )}
      <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-black">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
