import PaginaForm from "./PaginaForm";

export const metadata = {
  title: "Nova Página | Admin BICT",
};

export default function NovaPaginaPage() {
  return (
    <main className="p-4 md:p-8 h-full">
      <PaginaForm />
    </main>
  );
}
