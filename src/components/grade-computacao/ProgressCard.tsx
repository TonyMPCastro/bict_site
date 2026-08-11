import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Download, Share2, X } from 'lucide-react';
import { trackList } from './data/curriculumData';

interface ProgressCardProps {
  trackId: string;
  completionPct: number;
  totalHours: number;
  completedHours: number;
  semestersRemaining: number | null;
  onClose: () => void;
}

export default function ProgressCard({ trackId, completionPct, totalHours, completedHours, semestersRemaining, onClose }: ProgressCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const track = trackList.find(t => t.id === trackId);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3, style: { transform: 'scale(1)', transformOrigin: 'top left' } });
      const link = document.createElement('a');
      link.download = `progresso_${track?.shortName.toLowerCase().replace(/\s+/g, '_')}_${completionPct}pct.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Não foi possível gerar a imagem. Tente novamente.');
    }
  };

  if (!track) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
        
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-500" /> Compartilhar Progresso
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center">
          
          {/* Card to Export */}
          <div 
            ref={cardRef} 
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl p-8 flex flex-col justify-between"
            style={{ background: `linear-gradient(135deg, ${track.accentColor} 0%, #0f172a 100%)` }}
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4"></div>

            {/* Top Section */}
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-white/70 font-semibold tracking-wider text-xs uppercase mb-1">Grade Curricular BICT</p>
                <h2 className="text-white font-black text-2xl max-w-[200px] leading-tight">{track.name}</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                <span className="text-white font-black text-3xl">{completionPct}%</span>
                <span className="block text-white/80 text-[10px] uppercase font-bold text-center -mt-1">Concluído</span>
              </div>
            </div>

            {/* Middle Section - Progress Bar */}
            <div className="relative z-10 mt-auto mb-8">
              <div className="flex justify-between text-white/90 text-sm font-medium mb-2">
                <span>Progresso Total</span>
                <span>{completedHours}h / {totalHours}h</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-1000 rounded-full"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4">
              <div>
                {semestersRemaining !== null && (
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-white/60 text-[10px] uppercase font-bold">Estimativa</p>
                      <p className="text-white font-bold text-sm">~{semestersRemaining} semestres</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">UFMA • Gerado no App</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <button 
            onClick={handleDownload}
            className="mt-6 flex items-center gap-2 w-full justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/30"
          >
            <Download size={20} />
            Baixar Imagem PNG
          </button>
        </div>
      </div>
    </div>
  );
}
