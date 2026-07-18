import GradeApp from "@/components/grade-computacao/GradeApp";

export const metadata = {
  title: "Grade Curricular - Engenharia da Computação",
  description: "Visualize e planeje a sua grade curricular para o curso de Engenharia da Computação.",
};

export default function ComputacaoPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors">
      <GradeApp />
    </div>
  );
}
