import { useState } from 'react';
import { MonthlyLearningObjective } from '../data/mockData';
import {
  BookOpen,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  Shirt,
  Package
} from 'lucide-react';

interface MonthlyThemeModuleProps {
  data: MonthlyLearningObjective;
}

export const MonthlyThemeModule = ({ data }: MonthlyThemeModuleProps) => {
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {/* Monthly Curriculum Hero Card */}
      <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur text-white">
              {data.month} • {data.grade}
            </span>
            <span className="text-xs text-brand-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-200" strokeWidth={1.75} />
              <span>Updated {data.uploadedAt}</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
            {data.themeTitle}
          </h2>
          <p className="text-sm text-brand-100/90 mt-2 max-w-2xl leading-relaxed">
            {data.themeDescription}
          </p>

          {/* Quick link to original school PDF artefact */}
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-white">
              <FileText className="w-4 h-4 text-brand-200" strokeWidth={1.75} />
              <span>Curriculum Deck: <strong className="font-semibold">{data.pdfFileName}</strong> ({data.pdfFileSize})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPdfViewer(true)}
                className="bg-white text-brand-700 hover:bg-brand-50 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>View Slide Deck</span>
              </button>
              <button
                onClick={() => window.open(`/samples/${data.pdfFileName}`, '_blank')}
                className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Objectives Grid - Clean outline icons matching bottom nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.objectives.map((area, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-xl border border-brand-200 bg-brand-50/60 text-brand-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {area.area}
                </h3>
              </div>

              <ul className="space-y-2.5">
                {area.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Special Dress-Up & Activity Schedule for the month */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl border border-amber-200 bg-amber-50/60 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Curriculum Key Dates & Dress-Up Schedule
              </h3>
              <p className="text-xs text-slate-500">Extracted from NAFL monthly slide deck</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                <th className="py-2.5 px-3 rounded-l-lg">Date & Day</th>
                <th className="py-2.5 px-3">Celebration / Activity</th>
                <th className="py-2.5 px-3">Dress Code</th>
                <th className="py-2.5 px-3 rounded-r-lg">Items to Bring</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.specialDates.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-slate-800">{item.day}</span>
                    <p className="text-slate-500 text-[11px]">{item.title}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200">
                      <Shirt className="w-3 h-3 text-purple-600" strokeWidth={1.75} />
                      <span>{item.dressCode}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                      <Package className="w-3 h-3 text-emerald-600" strokeWidth={1.75} />
                      <span>{item.bringItem}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated In-App PDF / Slide Deck Viewer Modal */}
      {showPdfViewer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" strokeWidth={1.75} />
                <div>
                  <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider">Official Curriculum Slide Pack</span>
                  <h3 className="font-bold text-base text-white">
                    {data.pdfFileName}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowPdfViewer(false)}
                className="text-slate-400 hover:text-white text-2xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {/* Slide mockup carousel */}
            <div className="my-4 flex-1 bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-700 overflow-y-auto min-h-[280px]">
              <div className="w-12 h-12 rounded-2xl border border-brand-400/40 bg-brand-500/20 text-brand-300 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h4 className="text-base font-bold text-white mb-1">
                Slide 1 of 4: Monthly Curriculum Overview
              </h4>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                "National Academy For Learning — Montessori 1 — Curriculum Plan for November 2026. Theme: Community Helpers & Transport"
              </p>
              <div className="p-3 bg-slate-900/80 rounded-xl text-left text-xs font-mono text-slate-300 max-w-lg w-full border border-slate-700 space-y-1">
                <div>[Page 1] Learning Goals: Sensorial Cylinders, Phonics /s/, /a/, /t/</div>
                <div>[Page 2] Songs & Rhymes: The Wheels on the Bus</div>
                <div>[Page 3] Special Celebrations: Children's Day (Nov 14), Helper Day (Nov 20)</div>
                <div>[Page 4] Reminder: Label all water bottles and snack boxes</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-700 text-xs text-slate-400">
              <span>Showing original uncompressed PDF upload</span>
              <button
                onClick={() => window.open(`/samples/${data.pdfFileName}`, '_blank')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Open in New Tab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
