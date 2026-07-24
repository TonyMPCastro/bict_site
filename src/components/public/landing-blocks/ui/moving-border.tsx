'use client'

import React from 'react'

export const MovingBorderButton = ({
  children,
  onClick,
  className = '',
  containerClassName = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  containerClassName?: string
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative p-[1px] overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x cursor-pointer ${containerClassName}`}
    >
      <div
        className={`relative z-10 bg-white dark:bg-slate-950 px-6 py-3 rounded-[11px] font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
