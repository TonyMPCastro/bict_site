'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'
import { LoginConfig, DEFAULT_LOGIN_CONFIG } from '@/types/cms'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Utiliza a configuração default ou customizada do CMS
  const config: LoginConfig = DEFAULT_LOGIN_CONFIG

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (res?.error) {
        setError(res.error || 'Credenciais inválidas.')
        setLoading(false)
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Imagem de Fundo com Overlay */}
      {config.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${config.backgroundImage})` }}
        >
          <div
            className="absolute inset-0 bg-slate-950"
            style={{ opacity: config.overlayOpacity ?? 0.6 }}
          />
        </div>
      )}

      {/* Card do Formulário */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto h-12 w-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {config.titulo || 'Portal de Gestão BICT'}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {config.instructionText || 'Use seu CPF ou Matrícula institucional para entrar'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3.5 rounded-xl border border-red-200 dark:border-red-900/40 flex items-center gap-2.5 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                E-mail ou Matrícula
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="admin@bict.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Senha
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                'Entrar na Plataforma'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
