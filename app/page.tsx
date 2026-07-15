export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-6">Bem-vindo ao Sistema BICT</h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Sistema configurado com sucesso e pronto para personalização.
      </p>
      
      <div className="max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-blue-800">Próximos Passos</h2>
        <ul className="list-disc pl-5 space-y-2 text-blue-900">
          <li>Acesse o painel para personalizar as cores e logo do site.</li>
          <li>Cadastre páginas no Construtor de Páginas.</li>
          <li>Gerencie os menus através da interface administrativa.</li>
        </ul>
      </div>
    </div>
  );
}
