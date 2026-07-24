'use client'

import React from 'react'

export const InstructorBlock = ({ props }: { props: any }) => {
  const name = props.name || 'Prof. Dr. João Silva'
  const role = props.role || 'Coordenador do BICT'
  const bio = props.bio || 'Doutor em Engenharia de Computação, possui mais de 15 anos de experiência em docência e pesquisa em sistemas embarcados.'
  const avatar = props.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop'
  
  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden glass border border-slate-200/50 dark:border-slate-800/50 shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-8 md:gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={avatar} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-wider">
            Coordenação
          </div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{name}</h3>
          <p className="text-lg font-medium text-primary">{role}</p>
          
          <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 mx-auto md:mx-0 rounded-full my-4"></div>
          
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {bio}
          </p>
        </div>
      </div>
    </div>
  )
}
