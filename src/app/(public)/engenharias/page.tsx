import GradeApp from "@/components/grade-computacao/GradeApp";

export const metadata = {
  title: "Grade Curricular - Engenharias BICT",
  description: "Visualize e planeje a sua grade curricular para as Engenharias e cursos do BICT.",
};

export default function ComputacaoPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors">
      <GradeApp />
    </div>
  );
}
