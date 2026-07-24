'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { Newspaper, Calendar, ArrowRight, Sparkles } from 'lucide-react'

export const NewsGridBlock = ({ props }: { props: any }) => {
  const title = props.title || 'Últimas Notícias'
  const subtitle = props.subtitle || 'Acompanhe novidades, comunicados e eventos do BICT'
  const limit = props.limit || 6
  const showDestaque = props.showDestaque ?? true
  const showDate = props.showDate ?? true
  const showExcerpt = props.showExcerpt ?? true
  const buttonText = props.buttonText || 'Ver Todas as Notícias'

  const [posts, setPosts] = useState<any[]>(props.items || [])
  const [loading, setLoading] = useState(!props.items)

  useEffect(() => {
    if (!props.items) {
      fetch('/api/admin/noticias')
        .then((res) => res.json())
        .then((data) => {
          if (data.data && Array.isArray(data.data)) {
            setPosts(data.data)
          }
        })
        .catch((err) => console.error('Erro ao carregar notícias:', err))
        .finally(() => setLoading(false))
    }
  }, [props.items])

  const safePosts = Array.isArray(posts) ? posts.slice(0, limit) : []
  const featuredPost = showDestaque && safePosts.length > 0 ? safePosts[0] : null
  const gridPosts = showDestaque && safePosts.length > 0 ? safePosts.slice(1) : safePosts

  return (
    <div className="space-y-10 w-full">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
      </div>

      {/* Card Grande de Destaque se ativo */}
      {featuredPost && (
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white p-8 md:p-12 shadow-2xl group hover:border-primary/50 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Newspaper className="h-64 w-64 text-white" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                <Sparkles className="h-3.5 w-3.5" /> Destaque
              </span>
              {showDate && (featuredPost.dataPublicacao || featuredPost.date) && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(featuredPost.dataPublicacao || featuredPost.date).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight group-hover:text-primary transition-colors">
              <Link href={`/noticias/${featuredPost.slug}`}>
                {featuredPost.titulo || featuredPost.title}
              </Link>
            </h3>

            {showExcerpt && (featuredPost.resumo || featuredPost.description) && (
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredPost.resumo || featuredPost.description}
              </p>
            )}

            <div className="pt-4">
              <Link
                href={`/noticias/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-primary hover:text-white font-bold text-xs px-6 py-3 rounded-full transition-all shadow-lg"
              >
                <span>Ler Notícia Completa</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grade com o restante das notícias */}
      {gridPosts.length > 0 && (
        <BentoGrid>
          {gridPosts.map((item: any, idx: number) => (
            <BentoGridItem
              key={item.id || idx}
              title={item.titulo || item.title}
              description={showExcerpt ? item.resumo || item.description : ''}
              header={
                <div className="flex items-center justify-between text-xs text-primary font-bold">
                  <span className="flex items-center gap-1">
                    <Newspaper className="h-3.5 w-3.5" />
                    Notícia BICT
                  </span>
                  {showDate && (item.dataPublicacao || item.date) && (
                    <span className="text-slate-400 font-normal">
                      {new Date(item.dataPublicacao || item.date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              }
              onClick={() => {
                if (item.slug) window.location.href = `/noticias/${item.slug}`
              }}
            />
          ))}
        </BentoGrid>
      )}

      {/* Botão Ver Mais */}
      <div className="text-center pt-4">
        <Link
          href="/noticias"
          className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-900 hover:bg-primary hover:text-white text-slate-700 dark:text-slate-200 px-6 py-3 rounded-full text-xs font-bold transition-all shadow-sm"
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
