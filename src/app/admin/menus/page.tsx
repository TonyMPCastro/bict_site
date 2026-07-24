import { redirect } from 'next/navigation'

export const metadata = {
  title: "Gerenciar Menus | Admin BICT",
};

export default function MenusPage() {
  redirect('/admin/configuracoes')
}
