import { MonthlyPhotoCollage } from '../data/mockData';
import {
  Camera,
  Download,
  Sparkles,
  Calendar
} from 'lucide-react';

interface PhotoCollageModuleProps {
  photos: MonthlyPhotoCollage[];
}

export const PhotoCollageModule = ({ photos }: PhotoCollageModuleProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-brand-600" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Monthly Classroom Moments & Activity Booklets
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Monthly photo collages published by Mont 1 teachers.
        </p>
      </div>

      {/* Grid of photo booklets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map(booklet => (
          <div
            key={booklet.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Photo Banner with tag */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={booklet.coverImage}
                  alt={booklet.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-300" />
                  <span>{booklet.month}</span>
                </div>
                <div className="absolute top-3 right-3 bg-brand-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {booklet.photoCount} Photos Inside
                </div>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {booklet.title}
                </h3>

                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Activity Highlights:
                  </span>
                  {booklet.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-slate-500 truncate">
                {booklet.pdfFileName} ({booklet.pdfFileSize})
              </span>
              <button
                onClick={() => window.open(`/samples/${booklet.pdfFileName || 'NAFL_Mont1_Classroom_Moments_Nov2026.pdf'}`, '_blank')}
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View PDF Album</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
