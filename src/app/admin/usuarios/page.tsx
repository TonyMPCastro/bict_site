'use client'

import React, { useEffect, useState } from 'react'
import { getUsuarios, saveUsuario, toggleUsuarioAtivo, deleteUsuario } from './actions'
import { UsuarioFormModal } from '@/components/admin/UsuarioFormModal'
import { Users, Plus, Search, Edit, Trash2, CheckCircle, XCircle, ShieldCheck, Clock } from 'lucide-react'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadUsuarios = async () => {
    setLoading(true)
    try {
      const data = await getUsuarios()
      setUsuarios(data)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadUsuarios()
  }, [])

  const handleSave = async (data: any) => {
    await saveUsuario(data)
    await loadUsuarios()
  }

  const handleToggleAtivo = async (id: string, currentAtivo: boolean) => {
    await toggleUsuarioAtivo(id, !currentAtivo)
    await loadUsuarios()
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      await deleteUsuario(id)
      await loadUsuarios()
    }
  }

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestão de Usuários & Permissões</h1>
            <p className="text-xs text-slate-500">Cadastre usuários e gerencie permissões granulares de acesso (RBAC)</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null)
            setModalOpen(true)
          }}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md"
        >
          <Plus className="h-4 w-4" /> Novo Usuário
        </button>
      </div>

      {/* Busca e Tabela */}
      <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 space-y-4">
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Carregando usuários...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase">
                <tr>
                  <th className="p-3">Usuário</th>
                  <th className="p-3">Papel (Role)</th>
                  <th className="p-3">Permissões</th>
                  <th className="p-3">Último Acesso</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{u.nome}</div>
                      <div className="text-slate-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.permissoes.map((p: string) => (
                          <span key={p} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded">
                            {p}
                          </span>
                        ))}
                        {u.permissoes.length === 0 && <span className="text-slate-400 text-[11px]">Nenhuma</span>}
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">
                      {u.ultimoAcesso ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {new Date(u.ultimoAcesso).toLocaleString('pt-BR')}
                        </span>
                      ) : (
                        'Nunca'
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleAtivo(u.id, u.ativo)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                          u.ativo
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {u.ativo ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedUser(u)
                          setModalOpen(true)
                        }}
                        className="p-1.5 text-slate-600 hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <UsuarioFormModal
          usuario={selectedUser}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
