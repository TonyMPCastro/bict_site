"use client";
import React, { useMemo } from 'react';
import { GraduationCap, X, PlayCircle, CheckCircle, Clock, BookOpen, Lightbulb, AlertTriangle } from 'lucide-react';

interface Course {
  code: string;
  name: string;
  hours: number;
  type: string;
  req: string[];
}

interface Semester {
  semester: number;
  phase: string;
  courses: Course[];
}

interface PlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumData: Semester[];
  courseStatus: Record<string, boolean | 'progress' | null>;
  onToggleProgress: (code: string) => void;
  typeConfig: Record<string, { label: string; bg: string; text: string; border: string }>;
}

export default function PlannerModal({
  isOpen,
  onClose,
  curriculumData,
  courseStatus,
  onToggleProgress,
  typeConfig,
}: PlannerModalProps) {
  const allCourses = useMemo(
    () => curriculumData.flatMap(s => s.courses).filter((c: Course) => c.type !== 'second_cycle_placeholder'),
    [curriculumData]
  );

  // Disciplinas elegíveis: não concluídas/cursando e todos os req[] cumpridos
  const eligible = useMemo(() => {
    return allCourses
      .filter((c: Course) =>
        !courseStatus[c.code] &&
        (c.req ?? []).every((req: string) => courseStatus[req] === true)
      )
      .map((c: Course) => {
        const sem = curriculumData.find(s => s.courses.some((sc: Course) => sc.code === c.code));
        return { ...c, semester: sem?.semester ?? 0 };
      })
      .sort((a: Course & { semester: number }, b: Course & { semester: number }) => a.semester - b.semester);
  }, [allCourses, courseStatus, curriculumData]);

  // Disciplinas bloqueadas por apenas 1 pré-requisito pendente
  const almostEligible = useMemo(() => {
    return allCourses
      .filter((c: Course) => {
        if (courseStatus[c.code]) return false;
        const pending = (c.req ?? []).filter((req: string) => courseStatus[req] !== true);
        return pending.length === 1;
      })
      .map((c: Course) => {
        const pending = (c.req ?? []).filter((req: string) => courseStatus[req] !== true);
        const blocker = allCourses.find((a: Course) => a.code === pending[0]);
        const sem = curriculumData.find(s => s.courses.some((sc: Course) => sc.code === c.code));
        return { ...c, semester: sem?.semester ?? 0, blockedBy: blocker };
      })
      .sort((a: any, b: any) => a.semester - b.semester)
      .slice(0, 6);
  }, [allCourses, courseStatus, curriculumData]);

  const totalEligibleHours = eligible.reduce((s: number, c: any) => s + c.hours, 0);
  const alreadyProgress = eligible.filter((c: any) => courseStatus[c.code] === 'progress').length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="planner-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-2xl max-h-[90dvh] flex flex-col bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap size={22} className="text-white" />
            </div>
            <div>
              <h2 id="planner-title" className="text-lg font-black text-white leading-tight">
                Simulador de Matrícula
              </h2>
              <p className="text-indigo-200 text-xs mt-0.5">
                Disciplinas liberadas pelos seus pré-requisitos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 px-5 py-3 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/50 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen size={15} className="text-indigo-500" />
            <span className="font-bold text-indigo-700 dark:text-indigo-300">{eligible.length}</span>
            <span className="text-indigo-600 dark:text-indigo-400">disciplinas disponíveis</span>
          </div>
          <div className="w-px h-4 bg-indigo-200 dark:bg-indigo-800 hidden sm:block" />
          <div className="flex items-center gap-2 text-sm">
            <Clock size={15} className="text-indigo-500" />
            <span className="font-bold text-indigo-700 dark:text-indigo-300">{totalEligibleHours}h</span>
            <span className="text-indigo-600 dark:text-indigo-400">disponíveis</span>
          </div>
          {alreadyProgress > 0 && (
            <>
              <div className="w-px h-4 bg-indigo-200 dark:bg-indigo-800 hidden sm:block" />
              <div className="flex items-center gap-2 text-sm">
                <PlayCircle size={15} className="text-amber-500" />
                <span className="font-bold text-amber-600 dark:text-amber-400">{alreadyProgress} marcadas como cursando</span>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6" style={{ scrollbarWidth: 'thin' }}>

          {/* Eligible courses */}
          {eligible.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <CheckCircle size={40} className="text-emerald-400" />
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Tudo em dia!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Não há novas disciplinas liberadas por pré-requisito no momento. Continue concluindo para desbloquear mais.
              </p>
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Disciplinas que você pode cursar agora
              </h3>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {eligible.map((course: any) => {
                  const isProgress = courseStatus[course.code] === 'progress';
                  const cfg = typeConfig[course.type] ?? { label: 'BICT', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
                  return (
                    <div
                      key={course.code}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        isProgress
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 ring-1 ring-amber-300'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
                      }`}
                    >
                      <button
                        onClick={() => onToggleProgress(course.code)}
                        className={`shrink-0 mt-0.5 p-1 rounded-full transition-colors ${
                          isProgress
                            ? 'text-amber-500 bg-amber-100 dark:bg-amber-900/40 hover:bg-amber-200'
                            : 'text-slate-300 dark:text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                        }`}
                        title={isProgress ? "Remover de 'Cursando'" : "Adicionar ao plano (marcar como Cursando)"}
                      >
                        <PlayCircle size={20} fill={isProgress ? 'currentColor' : 'none'} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {course.code}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 ml-auto">
                            {course.semester}º · {course.hours}h
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                          {course.name}
                        </p>
                        {course.req.length > 0 && (
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                            <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                            Req. cumpridos: {course.req.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Almost eligible */}
          {almostEligible.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                Quase lá — falta apenas 1 pré-requisito
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {almostEligible.map((course: any) => {
                  const cfg = typeConfig[course.type] ?? { label: 'BICT', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' };
                  return (
                    <div
                      key={course.code}
                      className="flex items-start gap-3 p-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-75"
                    >
                      <div className="shrink-0 mt-1">
                        <Lightbulb size={16} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                            {course.code}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{course.name}</p>
                        {course.blockedBy && (
                          <p className="text-[11px] text-red-500 dark:text-red-400 mt-1 font-medium">
                            Aguardando: {course.blockedBy.code} — {course.blockedBy.name}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Clique em <PlayCircle size={12} className="inline text-amber-500 mx-0.5" /> para marcar como <span className="font-bold text-amber-500">Cursando</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
