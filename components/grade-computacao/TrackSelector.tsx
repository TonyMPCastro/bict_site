import React, { useRef } from 'react';
import { Upload, Monitor, Building2, Cog, Leaf, GraduationCap, ArrowRight, FileJson } from 'lucide-react';
import { trackList } from './data/curriculumData';

const ICONS = {
  monitor:  Monitor,
  building: Building2,
  cog:      Cog,
  leaf:     Leaf,
};

const TRACK_STYLES = {
  computacao: {
    bg:        'from-emerald-500/20 to-teal-600/10',
    border:    'border-emerald-500/40 hover:border-emerald-400',
    badge:     'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    btn:       'from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-emerald-500/30',
    icon:      'text-emerald-400',
    glow:      'group-hover:shadow-emerald-500/20',
  },
  civil: {
    bg:        'from-orange-500/20 to-amber-600/10',
    border:    'border-orange-500/40 hover:border-orange-400',
    badge:     'bg-orange-500/20 text-orange-300 border border-orange-500/40',
    btn:       'from-orange-600 to-amber-700 hover:from-orange-500 hover:to-amber-600 shadow-orange-500/30',
    icon:      'text-orange-400',
    glow:      'group-hover:shadow-orange-500/20',
  },
  mecanica: {
    bg:        'from-blue-500/20 to-indigo-600/10',
    border:    'border-blue-500/40 hover:border-blue-400',
    badge:     'bg-blue-500/20 text-blue-300 border border-blue-500/40',
    btn:       'from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 shadow-blue-500/30',
    icon:      'text-blue-400',
    glow:      'group-hover:shadow-blue-500/20',
  },
  ambiental: {
    bg:        'from-green-500/20 to-emerald-600/10',
    border:    'border-green-500/40 hover:border-green-400',
    badge:     'bg-green-500/20 text-green-300 border border-green-500/40',
    btn:       'from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 shadow-green-500/30',
    icon:      'text-green-400',
    glow:      'group-hover:shadow-green-500/20',
  },
};

export default function TrackSelector({ onSelectTrack, onImportJSON }) {
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && typeof parsed === 'object') {
          onImportJSON(parsed);
        }
      } catch {
        alert('Arquivo JSON inválido!');
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-slate-400 mb-6">
          UFMA  <br />
          Bacharelado Interdisciplinar em Ciência e Tecnologia
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
          Monte sua <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Grade Curricular</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
          Escolha sua ênfase de engenharia para visualizar e acompanhar sua jornada acadêmica no BICT.
        </p>
      </div>

      {/* Track Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-6xl relative z-10">
        {trackList.map((track) => {
          const style = TRACK_STYLES[track.id];
          const Icon = ICONS[track.icon] || Monitor;
          const totalSemesters = track.semesters.filter(s => !s.isPlaceholder).length;
          const totalHours = track.semesters
            .filter(s => !s.isPlaceholder)
            .reduce((sum, s) => sum + s.totalHours, 0);

          return (
            <button
              key={track.id}
              id={`track-${track.id}`}
              onClick={() => onSelectTrack(track.id)}
              className={`group relative flex flex-col text-left p-6 rounded-2xl bg-gradient-to-br ${style.bg} border ${style.border} transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${style.glow} cursor-pointer`}
            >
              {/* Code badge */}
              <span className={`self-start text-xs font-bold px-2 py-0.5 rounded-full ${style.badge} mb-4`}>
                {track.code}
              </span>

              {/* Icon */}
              <div className={`mb-3 ${style.icon}`}>
                <Icon size={32} strokeWidth={1.5} />
              </div>

              {/* Name & description */}
              <h2 className="text-lg font-bold text-white leading-tight mb-1">{track.name}</h2>
              <p className="text-sm text-slate-400 flex-1 mb-4">{track.description}</p>

              {/* Stats */}
              <div className="flex gap-3 text-xs text-slate-500 mb-5">
                <span>{totalSemesters} semestres</span>
                <span>·</span>
                <span>{totalHours.toLocaleString('pt-BR')}h</span>
              </div>

              {/* CTA */}
              <div className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r ${style.btn} shadow-lg text-white text-sm font-semibold transition-all duration-200 group-hover:gap-3`}>
                Selecionar
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Import option */}
      <div className="mt-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-px w-24 bg-white/10" />
          <span className="text-slate-500 text-sm">ou</span>
          <div className="h-px w-24 bg-white/10" />
        </div>
        <div className="mt-4 text-center">
          <button
            id="btn-import-json"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all duration-200"
          >
            <FileJson size={16} />
            Restaurar de backup JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <p className="text-slate-600 text-xs mt-2">
            O sistema não armazena dados — exporte seu progresso em JSON para continuar depois.
          </p>
        </div>
      </div>
    </div>
  );
}
