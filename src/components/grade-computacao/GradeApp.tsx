"use client";
import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutGrid, BarChart3, Clock, BookOpen, Printer,
  CheckCircle, PlayCircle, Moon, Sun, Download, Upload,
  Activity, Trash2, ArrowLeft, ChevronDown, PieChart as PieChartIcon, List, Search
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { engineeringTracks, typeConfig } from './data/curriculumData';
import { useTheme } from 'next-themes';

import TrackSelector from './TrackSelector';
import ConfirmModal from '@/components/ui/ConfirmModal';

// ─── SVG Overlay de pré-requisitos ───────────────────────────────────────────
const SvgOverlay = ({ hoveredCourse, curriculumData }: { hoveredCourse: any, curriculumData: any }) => {
  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    const draw = () => {
      if (!hoveredCourse) { setPaths([]); return; }
      const newPaths: any[] = [];
      const allCourses = curriculumData.flatMap((s: any) => s.courses);
      const target = allCourses.find((c: any) => c.code === hoveredCourse);

      const getPos = (code: any) => {
        const el = document.getElementById(`course-${code}`);
        const wrapper = document.getElementById('grid-scroll-wrapper');
        if (!el || !wrapper) return null;
        const er = el.getBoundingClientRect();
        const wr = wrapper.getBoundingClientRect();
        return {
          left:  { x: er.left  - wr.left,              y: er.top - wr.top + er.height / 2 },
          right: { x: er.right - wr.left,               y: er.top - wr.top + er.height / 2 },
        };
      };

      if (target?.req) {
        target.req.forEach((reqCode: any) => {
          const p1 = getPos(reqCode), p2 = getPos(hoveredCourse);
          if (p1 && p2) newPaths.push({
            d: `M ${p1.right.x} ${p1.right.y} C ${p1.right.x+30} ${p1.right.y}, ${p2.left.x-30} ${p2.left.y}, ${p2.left.x} ${p2.left.y}`,
            color: '#f59e0b', dash: '4,4'
          });
        });
      }
      allCourses.forEach((c: any) => {
        if (c.req?.includes(hoveredCourse)) {
          const p1 = getPos(hoveredCourse), p2 = getPos(c.code);
          if (p1 && p2) newPaths.push({
            d: `M ${p1.right.x} ${p1.right.y} C ${p1.right.x+30} ${p1.right.y}, ${p2.left.x-30} ${p2.left.y}, ${p2.left.x} ${p2.left.y}`,
            color: '#3b82f6', dash: 'none'
          });
        }
      });
      setPaths(newPaths);
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [hoveredCourse, curriculumData]);

  if (!hoveredCourse || paths.length === 0) return null;
  return (
    <svg className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible no-print" style={{ width:'100%', height:'100%' }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="3"
          strokeDasharray={p.dash} strokeLinecap="round" className="opacity-70" />
      ))}
    </svg>
  );
};

// ─── Phase label helpers ─────────────────────────────────────────────────────
const PHASE_LABELS = {
  bict:         { label: 'BICT',         color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  second_cycle: { label: '2º Ciclo',     color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300' },
};

// ─── Utilitários de persistência (localStorage + cookie fallback) ────────────
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano em segundos

function setCookie(key: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${key}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function getCookie(key: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${key}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function persistData(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* storage cheio */ }
  setCookie(key, value);
}

function readData(key: string): string | null {
  try {
    const ls = localStorage.getItem(key);
    if (ls !== null) return ls;
  } catch { /* sem acesso */ }
  return getCookie(key);
}



const getInitialCourseStatus = () => {
  if (typeof window === 'undefined') return {};
  const saved = readData('bict-status');
  if (!saved) return {};
  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [selectedTrack, setSelectedTrack] = useState<keyof typeof engineeringTracks | null>(null); // null = tela de seleção
  const [view, setView] = useState('grid');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted && theme === 'dark';

  const [courseStatus, setCourseStatus] = useState<Record<string, boolean | 'progress' | null>>(getInitialCourseStatus);

  const [showOnlyPending, setShowOnlyPending] = useState(false);
  const [showOnlyProgress, setShowOnlyProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileRef = useRef(null); // deve ficar ANTES de qualquer early return

  // Restore track from localStorage/cookie
  useEffect(() => {
    const saved = readData('bict-track');
    const knownTrackIds = Object.keys(engineeringTracks) as Array<keyof typeof engineeringTracks>;
    if (saved && knownTrackIds.includes(saved as keyof typeof engineeringTracks)) {
      setSelectedTrack(saved as keyof typeof engineeringTracks);
    }
  }, []);



  useEffect(() => {
    persistData('bict-status', JSON.stringify(courseStatus));
  }, [courseStatus]);

  // ── Track selection ────────────────────────────────────────────────────────
  const handleSelectTrack = (trackId: string) => {
    const validTrack = trackId as keyof typeof engineeringTracks;
    setSelectedTrack(validTrack);
    persistData('bict-track', trackId);
    setActiveFilters([]);
    setHoveredCourse(null);
    setShowOnlyPending(false);
    setShowOnlyProgress(false);
    setView('grid');
  };

  const handleImportJSON = (parsed: { track?: string; status?: Record<string, string | boolean | null> }) => {
    const knownTrackIds = Object.keys(engineeringTracks) as Array<keyof typeof engineeringTracks>;
    if (parsed.track && knownTrackIds.includes(parsed.track as keyof typeof engineeringTracks)) {
      setSelectedTrack(parsed.track as keyof typeof engineeringTracks);
      persistData('bict-track', parsed.track);
    }
    if (parsed.status) {
      const normalizedStatus: Record<string, boolean | 'progress' | null> = {};
      Object.entries(parsed.status).forEach(([key, value]) => {
        if (value === true || value === false || value === 'progress' || value === null) {
          normalizedStatus[key] = value;
        }
      });
      setCourseStatus(normalizedStatus);
    }
  };

  // ── Se não tem track escolhido → TrackSelector ────────────────────────────
  if (!selectedTrack) {
    return (
      <TrackSelector
        onSelectTrack={handleSelectTrack}
        onImportJSON={handleImportJSON}
      />
    );
  }

  // ── Dados da ênfase escolhida ──────────────────────────────────────────────
  const track = engineeringTracks[selectedTrack as keyof typeof engineeringTracks];
  const curriculumData = track.semesters;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const toggleStatus = (code: string, targetStatus: boolean | 'progress') => {
    setCourseStatus((prev: Record<string, boolean | 'progress' | null>) => ({ ...prev, [code]: prev[code] === targetStatus ? null : targetStatus }));
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const isFiltered = (course: any) => {
    if (course.type === 'second_cycle_placeholder') return true;
    const typeMatch    = activeFilters.length === 0 || activeFilters.includes(course.type);
    const pendingMatch = showOnlyPending   ? !courseStatus[course.code]                 : true;
    const progMatch    = showOnlyProgress  ? courseStatus[course.code] === 'progress'   : true;
    return typeMatch && pendingMatch && progMatch;
  };

  const exportData = () => {
    const data = { track: selectedTrack, version: '2022', status: courseStatus };
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    a.download = `grade_bict_${selectedTrack}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const result = ev.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Arquivo inválido');
        }
        const parsed = JSON.parse(result);
        handleImportJSON(parsed);
      } catch { alert('Arquivo inválido!'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearData = () => {
    setIsClearModalOpen(true);
  };

  const handleConfirmClear = () => {
    setCourseStatus({});
    setIsClearModalOpen(false);
  };

  // ── Dados filtrados para charts ────────────────────────────────────────────
  const filteredData = curriculumData.map(semester => {
    const courses = 'isPlaceholder' in semester && semester.isPlaceholder
      ? semester.courses
      : semester.courses.filter(c => isFiltered(c));
    const validCourses = courses.filter(c => c.type !== 'second_cycle_placeholder');
    return {
      ...semester,
      courses,
      totalHours:      validCourses.reduce((s, c) => s + c.hours, 0),
      completedHours:  validCourses.reduce((s, c) => s + (courseStatus[c.code] === true ? c.hours : 0), 0),
      progressHours:   validCourses.reduce((s, c) => s + (courseStatus[c.code] === 'progress' ? c.hours : 0), 0),
      pendingHours:    validCourses.reduce((s, c) => s + (!courseStatus[c.code] ? c.hours : 0), 0),
      totalCount:      validCourses.length,
      completedCount:  validCourses.filter(c => courseStatus[c.code] === true).length,
      progressCount:   validCourses.filter(c => courseStatus[c.code] === 'progress').length,
      pendingCount:    validCourses.filter(c => !courseStatus[c.code]).length,
    };
  });

  // ── Totais globais (excluindo placeholders) ────────────────────────────────
  const allRealCourses = curriculumData.flatMap(s => s.courses).filter(c => c.type !== 'second_cycle_placeholder');
  const totalCourseHours   = allRealCourses.reduce((s, c) => s + c.hours, 0);
  const completedHours     = allRealCourses.reduce((s, c) => s + (courseStatus[c.code] === true ? c.hours : 0), 0);
  const progressHours      = allRealCourses.reduce((s, c) => s + (courseStatus[c.code] === 'progress' ? c.hours : 0), 0);
  const totalCount         = allRealCourses.length;
  const completedCount     = allRealCourses.filter(c => courseStatus[c.code] === true).length;
  const progressCount      = allRealCourses.filter(c => courseStatus[c.code] === 'progress').length;
  const pendingCount       = totalCount - completedCount - progressCount;
  const completionPct      = totalCourseHours > 0 ? ((completedHours / totalCourseHours) * 100).toFixed(1) : '0.0';
  const progressPct        = totalCourseHours > 0 ? ((progressHours  / totalCourseHours) * 100).toFixed(1) : '0.0';

  // ── Cálculos para o Dashboard ──────────────────────────────────────────────
  const donutData = [
    { name: 'Concluído', value: completedHours, color: '#10b981' },
    { name: 'Cursando', value: progressHours, color: '#fbbf24' },
    { name: 'Pendente', value: totalCourseHours - completedHours - progressHours, color: '#3b82f6' },
  ];

  const barChartData = Object.entries(typeConfig).filter(([k]) => k !== 'second_cycle_placeholder').map(([key, cfg]) => {
    const courses = allRealCourses.filter(c => c.type === key);
    const total = courses.reduce((s, c) => s + c.hours, 0);
    const completed = courses.reduce((s, c) => s + (courseStatus[c.code] === true ? c.hours : 0), 0);
    const progress = courses.reduce((s, c) => s + (courseStatus[c.code] === 'progress' ? c.hours : 0), 0);
    return {
      name: cfg.label,
      'Concluído': completed,
      'Cursando': progress,
      'Pendente': total - completed - progress,
      total
    };
  });

  const getBottlenecks = () => {
    const deps: Record<string, any[]> = {};
    allRealCourses.forEach(c => {
      if (c.req) {
        c.req.forEach(reqCode => {
          if (!deps[reqCode]) deps[reqCode] = [];
          deps[reqCode].push(c);
        });
      }
    });
    return Object.entries(deps)
      .map(([code, courses]) => ({ code, count: courses.length, courses }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };
  const bottlenecks = getBottlenecks();

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 font-sans p-4 md:p-8 transition-colors duration-300">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="w-full mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          {/* Botão de troca de ênfase — destacado */}
          <button
            id="btn-change-track"
            onClick={() => { setSelectedTrack(null); localStorage.removeItem('bict-track'); }}
            className="no-print group inline-flex items-center gap-2.5 mb-3 pl-2 pr-3 py-1.5 rounded-xl border transition-all duration-200
              bg-white dark:bg-slate-800
              border-slate-200 dark:border-slate-700
              hover:border-slate-400 dark:hover:border-slate-500
              hover:shadow-md
              text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white
              text-sm font-semibold"
            title="Clique para trocar a ênfase de engenharia"
          >
            <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold"
              style={{ background: track.accentColor + '22', color: track.accentColor, border: `1px solid ${track.accentColor}55` }}
            >
              {track.code}
            </span>
            <span>{track.shortName}</span>
            <ChevronDown size={13} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
          </button>

          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-gray-50">{track.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-0.5 text-sm">
            Grade Curricular BICT — UFMA &nbsp;·&nbsp; Matriz 2022
          </p>

          {/* Progress Bar */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 no-print">
            <div className="w-full max-w-xs bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 flex overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${completionPct}%` }} title={`Concluído: ${completionPct}%`} />
              <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${progressPct}%` }} title={`Cursando: ${progressPct}%`} />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {completionPct}% Concluído
              <span className="font-normal text-gray-500 dark:text-gray-400 ml-1">
                (
                <span className="text-emerald-600 font-semibold" title="Concluídas">✓ {completedCount}</span> •
                <span className="text-amber-500 font-semibold ml-1" title="Cursando">▶ {progressCount}</span> •
                <span className="text-blue-500 font-semibold ml-1" title="Pendentes">○ {pendingCount}</span>
                ) / {completedHours}h de {totalCourseHours}h
              </span>
            </span>
          </div>
        </div>

        {/* Controls toolbar */}
        <div className="flex flex-wrap items-center bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-700 no-print gap-1">
          {[
            { key:'grid',  label:'Grade',    icon:<LayoutGrid size={16}/> },
            { key:'chart', label:'Histórico',icon:<BarChart3 size={16}/> },
            { key:'radar', label:'Sinergia', icon:<Activity size={16}/> },
            { key:'dashboard', label:'Dashboard', icon:<PieChartIcon size={16}/> },
            { key:'list',  label:'Lista',    icon:<List size={16}/> },
          ].map(({ key, label, icon }) => (
            <button key={key} id={`btn-view-${key}`} onClick={() => setView(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                view === key
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}>
              {icon} <span className="hidden sm:inline">{label}</span>
            </button>
          ))}

          <div className="w-px bg-gray-200 dark:bg-slate-600 mx-1 self-stretch my-1" />

          <button id="btn-dark-mode" onClick={() => setTheme(isDarkMode ? 'light' : 'dark')} className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700" title="Modo Escuro">
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button id="btn-print" onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
            <Printer size={16} /> <span className="hidden md:inline">Imprimir</span>
          </button>
        </div>
      </div>

      {/* ─── Backup / Progresso bar ───────────────────────────────────────────── */}
      <div className="no-print w-full mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        {/* Ícone e descrição */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
            <Download size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-tight">Salvar / Restaurar Progresso</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
              O sistema não salva dados no servidor. Exporte um <strong>.json</strong> para não perder seu progresso.
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="btn-export"
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-500/30 transition-all duration-150"
            title="Exportar progresso como arquivo JSON"
          >
            <Download size={15} />
            <span>Exportar .json</span>
          </button>

          <label
            id="btn-import"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 active:bg-slate-200 border border-slate-300 dark:border-slate-600 text-gray-700 dark:text-gray-200 text-sm font-semibold shadow-sm cursor-pointer transition-all duration-150"
            title="Importar progresso de um arquivo JSON"
          >
            <Upload size={15} />
            <span>Importar .json</span>
            <input type="file" accept=".json" className="hidden" onChange={importData} />
          </label>

          <div className="w-px h-8 bg-slate-300 dark:bg-slate-600 mx-1" />

          <button
            id="btn-clear"
            onClick={clearData}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-transparent hover:border-red-200 dark:hover:border-red-800 text-sm font-semibold transition-all duration-150"
            title="Limpar todo o progresso"
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* ─── Main content ─────────────────────────────────────────────────── */}
      <div className="w-full no-print">

        {/* ── GRID VIEW ─────────────────────────────────────────────────────── */}
        {view === 'grid' && (
          <div className="space-y-4">
            {/* Legend / Filters */}
            <div className="relative md:sticky md:top-0 z-50 flex flex-wrap items-center gap-3 p-3 md:p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-sm md:shadow-md border border-gray-200 dark:border-slate-800 mb-4 no-print transition-colors">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">Filtros por Área:</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(typeConfig).filter(([k]) => k !== 'second_cycle_placeholder').map(([key, cfg]) => {
                  const active = activeFilters.includes(key);
                  return (
                    <button key={key} id={`filter-${key}`} onClick={() => toggleFilter(key)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                        active
                          ? `${cfg.bg} ${cfg.border} ${cfg.text} ring-2 ring-offset-1 ring-blue-400`
                          : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${cfg.bg} border ${cfg.border}`} />
                      {cfg.label}
                    </button>
                  );
                })}
                {activeFilters.length > 0 && (
                  <button onClick={() => setActiveFilters([])} className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 px-2 py-1">
                    Limpar Filtros
                  </button>
                )}
                <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2 hidden sm:block self-center" />
                <button id="filter-pending"
                  onClick={() => { setShowOnlyPending(!showOnlyPending); if (!showOnlyPending) setShowOnlyProgress(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                    showOnlyPending
                      ? 'bg-blue-100 border-blue-300 text-blue-800 ring-2 ring-offset-1 ring-blue-400'
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}>
                  Somente Pendentes
                </button>
                <button id="filter-progress"
                  onClick={() => { setShowOnlyProgress(!showOnlyProgress); if (!showOnlyProgress) setShowOnlyPending(false); }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold ${
                    showOnlyProgress
                      ? 'bg-amber-100 border-amber-300 text-amber-800 ring-2 ring-offset-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
                  }`}>
                  Só "Cursando"
                </button>
              </div>
            </div>

            {/* Kanban horizontal */}
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar grid-container" id="grid-scroll-area">
              <div className="flex space-x-4 relative min-w-max w-full" id="grid-scroll-wrapper">
                <SvgOverlay hoveredCourse={hoveredCourse} curriculumData={curriculumData} />

                {filteredData.map((semData) => {
                  const phaseInfo = PHASE_LABELS[semData.phase as keyof typeof PHASE_LABELS] || PHASE_LABELS.bict;

                  return (
                    <div key={semData.semester} className="flex-none w-60 flex flex-col gap-2 semester-column relative z-10">
                      {/* Column Header */}
                      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 relative z-20 mb-3 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">{semData.semester}º Período</h2>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${phaseInfo.color}`}>{phaseInfo.label}</span>
                        </div>
                        {!('isPlaceholder' in semData && semData.isPlaceholder) && (
                          <div className="flex justify-between items-center mt-1 text-[11px] text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1"><BookOpen size={12} /> {semData.courses.length} disc.</span>
                            <span className="flex items-center gap-1 font-semibold"><Clock size={12} /> {semData.totalHours}h</span>
                          </div>
                        )}
                      </div>

                      {/* Cards */}
                      <div className="flex flex-col gap-3 flex-1 mt-2">
                        {semData.courses.map((course, idx) => {
                          if (course.type === 'second_cycle_placeholder') {
                            return (
                              <div key={idx} className="p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-center gap-2 min-h-[80px]">
                                <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">2º Ciclo</span>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px]">Dados a cadastrar</span>
                              </div>
                            );
                          }

                          const colorStyle = typeConfig[course.type as keyof typeof typeConfig] || typeConfig.bict_mandatory;
                          const isCompleted = courseStatus[course.code] === true;
                          const isProgress  = courseStatus[course.code] === 'progress';

                          let cardBg = 'bg-white dark:bg-slate-800/60 border-gray-200 dark:border-slate-700';
                          let badgeClass = 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700';
                          let textColor = 'text-gray-800 dark:text-gray-100';

                          if (isCompleted) {
                            cardBg = 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50';
                            badgeClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50';
                            textColor = 'text-gray-600 dark:text-gray-400';
                          } else if (isProgress) {
                            cardBg = 'bg-amber-50/80 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 ring-1 ring-amber-200 dark:ring-amber-700/50';
                            badgeClass = 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50';
                            textColor = 'text-gray-800 dark:text-gray-200';
                          }

                          return (
                            <div
                              key={idx}
                              id={`course-${course.code}`}
                              onMouseEnter={() => setHoveredCourse(course.code)}
                              onMouseLeave={() => setHoveredCourse(null)}
                              onClick={e => { const target = e.target as HTMLElement | null; if (target?.closest('button')) return; setHoveredCourse(p => p === course.code ? null : course.code); }}
                              className={`p-2 rounded-lg border shadow-sm flex flex-col h-full transition-all relative overflow-hidden group border-l-4 cursor-pointer ${colorStyle.border} ${
                                isFiltered(course) ? 'opacity-100 scale-100' : 'opacity-20 grayscale scale-95'
                              } ${hoveredCourse === course.code ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-offset-1 dark:ring-offset-slate-900 z-20' : 'z-10'} ${cardBg}`}
                            >
                              <div className={`absolute top-0 left-0 w-full h-1 ${colorStyle.bg}`} />
                              <div className="flex justify-between items-start mb-1.5">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeClass}`}>{course.code}</span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${colorStyle.bg} ${colorStyle.text}`}>{course.hours}h</span>
                                  <div className="flex gap-0.5">
                                    <button
                                      onClick={e => { e.stopPropagation(); toggleStatus(course.code, 'progress'); }}
                                      className={`p-0.5 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 ${isProgress ? 'text-amber-500 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600 hover:text-amber-400'}`}
                                      title={isProgress ? "Desmarcar 'Cursando'" : "Marcar como 'Cursando'"}
                                    >
                                      <PlayCircle size={15} fill={isProgress ? 'currentColor' : 'none'} strokeWidth={isProgress ? 1 : 2} />
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); toggleStatus(course.code, true); }}
                                      className={`p-0.5 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 ${isCompleted ? 'text-emerald-500 dark:text-emerald-400' : 'text-gray-300 dark:text-gray-600 hover:text-emerald-400'}`}
                                      title={isCompleted ? 'Desmarcar' : 'Marcar como concluída'}
                                    >
                                      <CheckCircle size={15} fill={isCompleted ? 'currentColor' : 'none'} strokeWidth={isCompleted ? 1 : 2} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <h3 className={`text-xs font-semibold leading-tight flex-1 ${textColor}`}>{course.name}</h3>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CHART VIEW ────────────────────────────────────────────────────── */}
        {view === 'chart' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 chart-container transition-colors">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Carga Horária por Semestre</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Distribuição das horas-aula ao longo dos períodos.</p>
              </div>
              <div className="h-72 w-full flex items-end gap-2 sm:gap-4 border-b-2 border-l-2 border-gray-100 dark:border-slate-700 pb-2 pl-2 mt-8 relative">
                <div className="absolute left-0 bottom-0 h-full w-full pointer-events-none flex flex-col justify-between text-xs text-gray-500">
                  {['500h','400h','300h','200h','100h','0h'].map(l => (
                    <span key={l} className="-ml-8 border-b border-gray-200 dark:border-slate-700 w-full text-left inline-block">{l}</span>
                  ))}
                </div>
                {filteredData.filter(d => !('isPlaceholder' in d && d.isPlaceholder)).map((data) => {
                  const maxH = 500;
                  const heightPercent = Math.min((data.totalHours / maxH) * 100, 100);
                  const phase = data.phase;
                  const pendingColor = phase === 'second_cycle' ? 'bg-indigo-200 dark:bg-indigo-700/50' : 'bg-blue-200 dark:bg-blue-600/50';
                  return (
                    <div key={`bar-${data.semester}`} className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative">
                      <div className="absolute bottom-[calc(100%+10px)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <span className="block text-[10px] font-bold bg-gray-800 dark:bg-slate-950 text-white px-2 py-1.5 rounded whitespace-nowrap text-center shadow-lg">
                          {data.semester}º · {data.totalHours}h<br/>
                          <span className="text-emerald-400">✓ {data.completedHours}h</span><br/>
                          <span className="text-amber-400">▶ {data.progressHours}h</span><br/>
                          <span className="text-blue-300">○ {data.pendingHours}h</span>
                        </span>
                      </div>
                      <div className="w-full max-w-[60px] flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                        <div className={`w-full transition-all duration-500 border-b border-white/20 ${pendingColor} rounded-t-md`} style={{ height: `${data.totalHours ? (data.pendingHours/data.totalHours)*100 : 0}%` }} />
                        <div className="w-full bg-amber-400 dark:bg-amber-600 transition-all duration-500 border-b border-white/20" style={{ height: `${data.totalHours ? (data.progressHours/data.totalHours)*100 : 0}%` }} />
                        <div className="w-full bg-emerald-500 dark:bg-emerald-600 transition-all duration-500 rounded-b-sm" style={{ height: `${data.totalHours ? (data.completedHours/data.totalHours)*100 : 0}%` }} />
                      </div>
                      <span className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-400">P{data.semester}</span>
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" />Concluído</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-400" />Cursando</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-300 dark:bg-blue-600/50" />BICT Pendente</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-700/50" />2º Ciclo Pendente</span>
              </div>
            </div>

            {/* Disciplines count */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 chart-container transition-colors">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Quantidade de Disciplinas por Semestre</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volume de matérias por período.</p>
              </div>
              <div className="h-60 w-full flex items-end gap-2 sm:gap-4 border-b-2 border-l-2 border-gray-100 dark:border-slate-700 pb-2 pl-2 relative mt-8">
                <div className="absolute left-0 bottom-0 h-full w-full pointer-events-none flex flex-col justify-between text-xs text-gray-400">
                  {['10','8','6','4','2','0'].map(l => (
                    <span key={l} className="-ml-6 border-b border-gray-100 dark:border-slate-700 w-full text-left inline-block">{l}</span>
                  ))}
                </div>
                {filteredData.filter(d => !('isPlaceholder' in d && d.isPlaceholder)).map((data) => {
                  const heightPercent = (data.totalCount / 10) * 100;
                  return (
                    <div key={`disc-${data.semester}`} className="flex-1 flex flex-col items-center justify-end h-full z-10 group relative">
                      <div className="absolute bottom-[calc(100%+10px)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <span className="block text-[10px] font-bold bg-gray-800 dark:bg-slate-950 text-white px-2 py-1.5 rounded whitespace-nowrap text-center shadow-lg">
                          {data.totalCount} disc.<br/>
                          <span className="text-emerald-400">✓ {data.completedCount}</span><br/>
                          <span className="text-amber-400">▶ {data.progressCount}</span><br/>
                          <span className="text-blue-300">○ {data.pendingCount}</span>
                        </span>
                      </div>
                      <div className="w-full max-w-[60px] flex flex-col justify-end" style={{ height: `${heightPercent}%` }}>
                        <div className="w-full bg-blue-200 dark:bg-blue-600/50 rounded-t-md transition-all duration-500 border-b border-white/20" style={{ height: `${data.totalCount ? (data.pendingCount/data.totalCount)*100 : 0}%` }} />
                        <div className="w-full bg-amber-400 dark:bg-amber-600 transition-all duration-500 border-b border-white/20" style={{ height: `${data.totalCount ? (data.progressCount/data.totalCount)*100 : 0}%` }} />
                        <div className="w-full bg-emerald-500 dark:bg-emerald-600 transition-all duration-500 rounded-b-sm" style={{ height: `${data.totalCount ? (data.completedCount/data.totalCount)*100 : 0}%` }} />
                      </div>
                      <span className="mt-4 text-xs font-semibold text-gray-700 dark:text-gray-400">P{data.semester}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── RADAR VIEW ────────────────────────────────────────────────────── */}
        {view === 'radar' && (() => {
          const relevantTypes = ['bict_mandatory','bict_elective','eng_specific','complementary'];
          const axes = relevantTypes.map(key => {
            const allC = curriculumData.flatMap(s => s.courses).filter(c => c.type === key);
            const t = allC.reduce((a, c) => a + c.hours, 0) || 1;
            const com = allC.reduce((a, c) => a + (courseStatus[c.code] === true ? c.hours : 0), 0);
            const prog = allC.reduce((a, c) => a + (courseStatus[c.code] === 'progress' ? c.hours : 0), 0);
            return { key, label: typeConfig[key as keyof typeof typeConfig].label, total: t, completed: com, progress: prog, percent: Math.min((com + prog*0.5) / t, 1) };
          });
          const n = axes.length;
          const size = 320, ctr = size/2, r = size*0.35;
          const pt = (i: number, scale: number) => ({
            x: ctr + r*scale * Math.cos(Math.PI*2*i/n - Math.PI/2),
            y: ctr + r*scale * Math.sin(Math.PI*2*i/n - Math.PI/2)
          });
          const bgGrids = [0.25,0.5,0.75,1].map(scale =>
            axes.map((_, i) => { const p = pt(i, scale); return `${p.x},${p.y}`; }).join(' ')
          );
          const valPts = axes.map((a, i) => { const p = pt(i, a.percent); return `${p.x},${p.y}`; }).join(' ');

          return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 transition-colors flex flex-col md:flex-row gap-8 items-center justify-center min-h-[500px]">
              <div className="flex-1 max-w-md text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sinergia de Eixos Acadêmicos</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Visualização do progresso distribuído entre os eixos formativos da sua ênfase.</p>
                <div className="space-y-4">
                  {axes.map(ax => (
                    <div key={ax.key} className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                      <div className="flex justify-between font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">
                        <span>{ax.label}</span>
                        <span>{Math.round(ax.percent*100)}% dom.</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 flex">
                        <div className="bg-emerald-500 h-1.5 rounded-l-full" style={{ width: `${(ax.completed/ax.total)*100}%` }} />
                        <div className="bg-amber-400 h-1.5" style={{ width: `${(ax.progress/ax.total)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex justify-center items-center">
                <svg width={size} height={size} className="overflow-visible">
                  {bgGrids.map((pts, gi) => (
                    <polygon key={gi} points={pts} fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-slate-700" />
                  ))}
                  {axes.map((_, i) => {
                    const p = pt(i, 1);
                    return <line key={i} x1={ctr} y1={ctr} x2={p.x} y2={p.y} stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-slate-700" />;
                  })}
                  <polygon points={valPts} fill={track.accentColor} fillOpacity="0.2" stroke={track.accentColor} strokeWidth="2" strokeLinejoin="round" />
                  {axes.map((a, i) => {
                    const p = pt(i, a.percent);
                    return <circle key={i} cx={p.x} cy={p.y} r="4" fill={track.accentColor} />;
                  })}
                  {axes.map((a, i) => {
                    const p = pt(i, 1.18);
                    return (
                      <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
                        className="text-[9px] fill-gray-600 dark:fill-gray-400" fontSize="10">
                        {a.label.split(' ').slice(0,2).join(' ')}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          );
        })()}

        {/* ── DASHBOARD VIEW ────────────────────────────────────────────────── */}
        {view === 'dashboard' && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Progresso Global (Donut) */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col items-center relative">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 self-start mb-2">Progresso Global</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 self-start mb-4">Total de horas concluídas vs pendentes</p>
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} innerRadius={75} outerRadius={105} paddingAngle={4} dataKey="value" stroke="none">
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}h`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centro do Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{completionPct}%</span>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-500">Concluído</span>
                  </div>
                </div>
              </div>

              {/* Top Gargalos */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Top 5 Gargalos</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Disciplinas que são pré-requisito para mais matérias.</p>
                <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                  {bottlenecks.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">Nenhum gargalo identificado.</div>
                  ) : bottlenecks.map((item, idx) => {
                    const courseInfo = allRealCourses.find(c => c.code === item.code);
                    const name = courseInfo ? courseInfo.name : 'Desconhecida';
                    const isCompleted = courseStatus[item.code] === true;
                    return (
                      <div key={item.code} className={`flex items-center justify-between p-3 rounded-lg border ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-gray-50 dark:bg-slate-900/50 border-gray-200 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${isCompleted ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}>
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300">{item.code}</span>
                              {isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
                            </div>
                            <span className={`text-sm font-semibold block mt-0.5 truncate ${isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`} title={name}>{name}</span>
                          </div>
                        </div>
                        <div className="text-right ml-3 flex-shrink-0">
                          <span className="text-lg font-black text-blue-600 dark:text-blue-400 leading-none">{item.count}</span>
                          <span className="text-[9px] text-gray-500 block uppercase font-bold tracking-wider mt-0.5">Trancadas</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Barras por Eixo */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Progresso por Eixo de Formação</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Distribuição de horas concluídas e pendentes por categoria da grade.</p>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={barChartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#475569" opacity={0.2} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(100,116,139,0.1)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0f172a' }} />
                    <Legend iconType="circle" />
                    <Bar dataKey="Concluído" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Cursando" stackId="a" fill="#fbbf24" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Pendente" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── LIST VIEW ─────────────────────────────────────────────────────── */}
        {view === 'list' && (() => {
          const normalizeString = (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          const searchLower = normalizeString(searchTerm);
          
          const listCourses = allRealCourses.filter(c => 
            normalizeString(c.name).includes(searchLower) || normalizeString(c.code).includes(searchLower)
          );
          
          const grouped = {
            'Cursando': listCourses.filter(c => courseStatus[c.code] === 'progress'),
            'Pendentes': listCourses.filter(c => !courseStatus[c.code]),
            'Concluídas': listCourses.filter(c => courseStatus[c.code] === true),
          };

          return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 min-h-[500px] animate-fadeInUp">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Visão em Lista</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Encontre disciplinas rapidamente.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por código ou nome..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                {Object.entries(grouped).map(([groupName, items]) => {
                  if (items.length === 0) return null;
                  
                  let headerColor = 'text-gray-900 dark:text-gray-100';
                  let borderColor = 'border-gray-200 dark:border-slate-700';
                  if (groupName === 'Cursando') { headerColor = 'text-amber-600 dark:text-amber-400'; borderColor = 'border-amber-200 dark:border-amber-800/50'; }
                  if (groupName === 'Concluídas') { headerColor = 'text-emerald-600 dark:text-emerald-400'; borderColor = 'border-emerald-200 dark:border-emerald-800/50'; }

                  return (
                    <div key={groupName}>
                      <h3 className={`text-lg font-bold mb-3 flex items-center gap-2 ${headerColor}`}>
                        {groupName}
                        <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-500 px-2 py-0.5 rounded-full">{items.length}</span>
                      </h3>
                      <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 p-4 rounded-xl border bg-gray-50/50 dark:bg-slate-900/20 ${borderColor}`}>
                        {items.map(course => {
                          const isCompleted = courseStatus[course.code] === true;
                          const isProgress  = courseStatus[course.code] === 'progress';
                          const colorStyle = typeConfig[course.type as keyof typeof typeConfig] || typeConfig.bict_mandatory;

                          return (
                            <div key={course.code} className="flex flex-col p-3 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm hover:border-blue-400 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300`}>{course.code}</span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colorStyle.bg} ${colorStyle.text}`}>{colorStyle.label}</span>
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => toggleStatus(course.code, 'progress')}
                                    className={`p-1 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 ${isProgress ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-gray-400'}`}
                                    title={isProgress ? "Desmarcar 'Cursando'" : "Marcar como 'Cursando'"}
                                  >
                                    <PlayCircle size={16} fill={isProgress ? 'currentColor' : 'none'} />
                                  </button>
                                  <button
                                    onClick={() => toggleStatus(course.code, true)}
                                    className={`p-1 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700 ${isCompleted ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-gray-400'}`}
                                    title={isCompleted ? 'Desmarcar' : 'Marcar como concluída'}
                                  >
                                    <CheckCircle size={16} fill={isCompleted ? 'currentColor' : 'none'} />
                                  </button>
                                </div>
                              </div>
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-snug">{course.name}</h4>
                              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-700/50">
                                <span className="flex items-center gap-1 font-semibold"><Clock size={12}/>{course.hours}h</span>
                                {course.req?.length > 0 && <span className="truncate ml-2" title={course.req.join(', ')}>Req: {course.req.join(', ')}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>

      {/* ─── Print view ───────────────────────────────────────────────────────── */}
      <div className="hidden print:block w-full text-black bg-white">
        <div className="text-center mb-6 mt-4">
          <h2 className="text-2xl font-bold border-b-2 border-black pb-2 inline-block">
            Grade Curricular — {track.name} · BICT UFMA
          </h2>
        </div>
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-black">
              <th className="py-2 px-2 border border-gray-400">Sem</th>
              <th className="py-2 px-2 border border-gray-400">Fase</th>
              <th className="py-2 px-2 border border-gray-400">Código</th>
              <th className="py-2 px-2 border border-gray-400">Disciplina</th>
              <th className="py-2 px-2 border border-gray-400 text-center">CH</th>
              <th className="py-2 px-2 border border-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {curriculumData.map((semester) => (
              <React.Fragment key={semester.semester}>
                {semester.courses.map((course, idx) => {
                  const isCompleted = courseStatus[course.code] === true;
                  const isProgress  = courseStatus[course.code] === 'progress';
                  const statusText  = isCompleted ? '✓ Concluído' : isProgress ? '▶ Cursando' : '○ Pendente';
                  if (course.type === 'second_cycle_placeholder') return null;
                  return (
                    <tr key={course.code} className="border-b border-gray-300">
                      {idx === 0 && (
                        <td rowSpan={semester.courses.filter(c => c.type !== 'second_cycle_placeholder').length}
                          className="py-1 px-2 border border-gray-400 text-center font-bold bg-gray-100 align-middle">
                          {semester.semester}º
                        </td>
                      )}
                      {idx === 0 && (
                        <td rowSpan={semester.courses.filter(c => c.type !== 'second_cycle_placeholder').length}
                          className="py-1 px-2 border border-gray-400 text-center align-middle text-[9px]">
                          {semester.phase === 'second_cycle' ? '2º Ciclo' : 'BICT'}
                        </td>
                      )}
                      <td className="py-1 px-2 border border-gray-400 font-mono">{course.code}</td>
                      <td className="py-1 px-2 border border-gray-400">{course.name}</td>
                      <td className="py-1 px-2 border border-gray-400 text-center">{course.hours}h</td>
                      <td className="py-1 px-2 border border-gray-400 font-semibold">{statusText}</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 10mm; }
          body { background-color: white !important; }
          #grid-scroll-area { overflow: visible !important; display: block !important; }
          #grid-scroll-wrapper { display: flex !important; flex-wrap: wrap !important; width: 100% !important; min-width: 100% !important; justify-content: flex-start !important; gap: 1.5rem !important; }
          .semester-column { page-break-inside: avoid !important; break-inside: avoid !important; margin-bottom: 1.5rem !important; flex: 0 0 auto !important; }
        }
      `}} />

      <ConfirmModal 
        isOpen={isClearModalOpen}
        title="Limpar Progresso"
        message="Deseja limpar todo o progresso desta ênfase? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
        variant="danger"
      />
    </div>
  );
}
