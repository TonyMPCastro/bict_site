'use client'

import React, { useState } from 'react'
import { X, Save, Shield, Key } from 'lucide-react'
import { PERMISSIONS } from '@/lib/permissions'

interface UsuarioData {
  id?: string
  nome: string
  email: string
  senha?: string
  role: string
  departamento?: string
  ativo: boolean
  permissoes: string[]
}

interface UsuarioFormModalProps {
  usuario?: UsuarioData | null
  isOpen: boolean
  onClose: () => void
  onSave: (data: UsuarioData) => Promise<void>
}

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({
  usuario,
  isOpen,
  onClose,
  onSave
}) => {
  const [nome, setNome] = useState(usuario?.nome || '')
  const [email, setEmail] = useState(usuario?.email || '')
  const [senha, setSenha] = useState('')
  const [role, setRole] = useState(usuario?.role || 'EDITOR')
  const [departamento, setDepartamento] = useState(usuario?.departamento || '')
  const [ativo, setAtivo] = useState(usuario?.ativo ?? true)
  const [permissoes, setPermissoes] = useState<string[]>(usuario?.permissoes || [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleTogglePerm = (perm: string) => {
    if (permissoes.includes(perm)) {
      setPermissoes(permissoes.filter((p) => p !== perm))
    } else {
      setPermissoes([...permissoes, perm])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSave({
      id: usuario?.id,
      nome,
      email,
      senha,
      role,
      departamento,
      ativo,
      permissoes
    })
    setIsSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {usuario ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <p className="text-xs text-slate-500">Configure os dados de acesso e permissões</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {usuario ? 'Senha (deixe em branco para manter)' : 'Senha de Acesso'}
              </label>
              <input
                type="password"
                required={!usuario}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Papel (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              >
                <option value="ADMIN">ADMIN (Acesso Total)</option>
                <option value="EDITOR">EDITOR (Conteúdo)</option>
                <option value="DOCENTE">DOCENTE (Professor)</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Departamento</label>
              <input
                type="text"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                placeholder="Ex: Coordenação de Ensino"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="user-ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 rounded text-primary"
            />
            <label htmlFor="user-ativo" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
              Usuário Ativo (Pode fazer login na plataforma)
            </label>
          </div>

          {/* Permissões Granulares */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Permissões Granulares (RBAC)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(PERMISSIONS).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 cursor-pointer hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    checked={permissoes.includes(value)}
                    onChange={() => handleTogglePerm(value)}
                    className="h-4 w-4 rounded text-primary"
                  />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold bg-primary text-white rounded-xl flex items-center gap-1.5 shadow-md hover:bg-primary/90"
            >
              <Save className="h-4 w-4" /> Salvar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
