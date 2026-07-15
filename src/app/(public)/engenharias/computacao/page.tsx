import GradeApp from "@/components/grade-computacao/GradeApp";

export const metadata = {
  title: "Grade Curricular - Engenharia da Computação",
  description: "Visualize e planeje a sua grade curricular para o curso de Engenharia da Computação.",
};

export default function ComputacaoPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <GradeApp />
    </div>
  );
}
