'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function getUsuarios() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error('Não autorizado')

  const usuarios = await db.user.findMany({
    include: {
      permissoes: true
    },
    orderBy: { criadoEm: 'desc' }
  })

  return usuarios.map((u) => ({
    id: u.id,
    nome: u.nome,
    email: u.email,
    role: u.role,
    departamento: u.departamento,
    ativo: u.ativo,
    ultimoAcesso: u.ultimoAcesso ? u.ultimoAcesso.toISOString() : null,
    criadoEm: u.criadoEm.toISOString(),
    permissoes: u.permissoes.map((p) => p.permissao)
  }))
}

export async function saveUsuario(data: {
  id?: string
  nome: string
  email: string
  senha?: string
  role: string
  departamento?: string
  ativo: boolean
  permissoes: string[]
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Apenas Administradores podem gerenciar usuários.')
  }

  try {
    let userId = data.id

    if (userId) {
      // Atualizar usuário existente
      const updateData: any = {
        nome: data.nome,
        email: data.email,
        role: data.role,
        departamento: data.departamento,
        ativo: data.ativo
      }

      if (data.senha && data.senha.trim() !== '') {
        updateData.senha = await bcrypt.hash(data.senha, 10)
      }

      await db.user.update({
        where: { id: userId },
        data: updateData
      })
    } else {
      // Criar novo usuário
      if (!data.senha) throw new Error('Senha é obrigatória para novo usuário.')
      const hashedPassword = await bcrypt.hash(data.senha, 10)

      const newUser = await db.user.create({
        data: {
          nome: data.nome,
          email: data.email,
          senha: hashedPassword,
          role: data.role,
          departamento: data.departamento,
          ativo: data.ativo
        }
      })
      userId = newUser.id
    }

    // Atualizar Permissões
    await db.permissaoUsuario.deleteMany({
      where: { usuarioId: userId }
    })

    if (data.permissoes && data.permissoes.length > 0) {
      for (const p of data.permissoes) {
        await db.permissaoUsuario.create({
          data: {
            usuarioId: userId!,
            permissao: p
          }
        })
      }
    }

    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Erro ao salvar usuário' }
  }
}

export async function toggleUsuarioAtivo(id: string, ativo: boolean) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  try {
    await db.user.update({
      where: { id },
      data: { ativo }
    })
    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao alterar status' }
  }
}

export async function deleteUsuario(id: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    throw new Error('Não autorizado')
  }

  try {
    await db.user.delete({ where: { id } })
    revalidatePath('/admin/usuarios')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro ao excluir usuário' }
  }
}
