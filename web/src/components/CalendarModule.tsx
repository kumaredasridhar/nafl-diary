import { useState } from 'react';
import { CalendarEvent, MonthlyLearningObjective, MOCK_CURRICULUM_BY_MONTH } from '../data/mockData';
import {
  Calendar as CalendarIcon,
  Shirt,
  Package,
  PartyPopper,
  GraduationCap,
  Download,
  BookOpen,
  Eye,
  FileText,
  UploadCloud,
  Plus
} from 'lucide-react';

interface CalendarModuleProps {
  events: CalendarEvent[];
  curriculum?: MonthlyLearningObjective;
  curriculumByMonth?: Record<string, MonthlyLearningObjective>;
  userRole?: 'parent' | 'teacher';
  onOpenUploader?: (type: 'monthly_plan' | 'calendar') => void;
  activeSectionName?: string;
}

export const CalendarModule = ({
  events,
  curriculum,
  curriculumByMonth,
  userRole = 'parent',
  onOpenUploader,
  activeSectionName = 'Mont 1A',
}: CalendarModuleProps) => {
  const isTeacher = userRole === 'teacher';
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('2026-11'); // Nov 2026 default
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEventModal, setActiveEventModal] = useState<CalendarEvent | null>(null);
  const [showPdfViewer, setShowPdfViewer] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const handleDownloadIcs = () => {
    const calendarEvents = events.map(evt => {
      const cleanDate = evt.date.replace(/-/g, '');
      const desc = [
        evt.description || evt.title,
        evt.dressUpPrompt ? `Wear: ${evt.dressUpPrompt}` : '',
        evt.bringToSchool ? `Bring: ${evt.bringToSchool}` : '',
        evt.type ? `Type: ${evt.type}` : '',
      ].filter(Boolean).join('\\n');

      return [
        'BEGIN:VEVENT',
        `UID:${evt.id}-nafl-2026@nafl.in`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;VALUE=DATE:${cleanDate}`,
        `DTEND;VALUE=DATE:${cleanDate}`,
        `SUMMARY:NAFL - ${evt.title}`,
        `DESCRIPTION:${desc}`,
        'LOCATION:National Academy For Learning (NAFL), Basaveshwarnagar, Bengaluru',
        'STATUS:CONFIRMED',
        'END:VEVENT'
      ].join('\r\n');
    }).join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//National Academy For Learning//NAFL Academic Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      calendarEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'NAFL_Academic_Calendar_2026_27.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadToast('Downloaded NAFL_Academic_Calendar_2026_27.ics! Compatible with iOS, Android & Google Calendar.');
    setTimeout(() => setDownloadToast(null), 4000);
  };

  // Only populated months (June to December 2026). Zero empty future months!
  const academicMonths = [
    { name: 'June 2026', short: 'Jun', key: '2026-06' },
    { name: 'July 2026', short: 'Jul', key: '2026-07' },
    { name: 'August 2026', short: 'Aug', key: '2026-08' },
    { name: 'September 2026', short: 'Sep', key: '2026-09' },
    { name: 'October 2026', short: 'Oct', key: '2026-10' },
    { name: 'November 2026', short: 'Nov (Now)', key: '2026-11', isCurrent: true },
    { name: 'December 2026', short: 'Dec', key: '2026-12' },
  ];

  const currentMonthData = academicMonths.find(m => m.key === selectedMonthKey) || academicMonths[5];
  const activeCurriculum = (curriculumByMonth && curriculumByMonth[selectedMonthKey]) || MOCK_CURRICULUM_BY_MONTH[selectedMonthKey];

  const handleOpenPdf = (file?: string) => {
    const targetFile = file || activeCurriculum?.pdfFileName || 'NAFL_Mont1_December_2026_Curriculum_Plan.pdf';
    window.open(`/samples/${targetFile}`, '_blank');
  };

  // Filter events for selected month and category
  const monthEvents = events.filter(e => {
    const matchesMonth = e.date.startsWith(selectedMonthKey);
    if (!matchesMonth) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'dress_up') return e.type === 'dress_up' || !!e.bringToSchool;
    if (selectedCategory === 'holiday') return e.type === 'holiday';
    if (selectedCategory === 'ptm') return e.type === 'ptm';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* 1-Tap Horizontal Month Picker Strip (Only populated months) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-semibold">
          {academicMonths.map(m => {
            const isSelected = selectedMonthKey === m.key;
            return (
              <button
                key={m.key}
                onClick={() => {
                  setSelectedMonthKey(m.key);
                  setSelectedCategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{m.short}</span>
                {m.isCurrent && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-brand-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Learning Artefact Card (Top of active month) */}
      {activeCurriculum && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden animate-fade-in">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur text-white">
                {activeCurriculum.month} • {activeCurriculum.grade}
              </span>
              <span className="text-xs text-brand-200">
                Uploaded {activeCurriculum.uploadedAt}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Theme: {activeCurriculum.themeTitle}
              </h2>
              <p className="text-xs sm:text-sm text-brand-100/90 mt-1 max-w-2xl leading-relaxed">
                {activeCurriculum.themeDescription}
              </p>
            </div>

            {/* Artefact Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 border-t border-white/20 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-200" strokeWidth={1.75} />
                <span className="truncate max-w-[200px] sm:max-w-none">{activeCurriculum.pdfFileName} ({activeCurriculum.pdfFileSize})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPdfViewer(true)}
                  className="bg-white text-brand-700 hover:bg-brand-50 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>View Slide Deck</span>
                </button>
                {isTeacher && onOpenUploader && (
                  <button
                    onClick={() => onOpenUploader('monthly_plan')}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Update Deck</span>
                  </button>
                )}
                <button
                  onClick={() => handleOpenPdf()}
                  className="bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Month Event Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        {/* Month Header & Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl border border-brand-200 bg-brand-50/60 text-brand-600 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">
                  {currentMonthData.name} Schedule
                </h3>
                {isTeacher && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {activeSectionName} View
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                All school events, holidays, and dress-up instructions
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {isTeacher && onOpenUploader && (
              <button
                onClick={() => onOpenUploader('calendar')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Add Class Date</span>
              </button>
            )}

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Dates ({monthEvents.length})
            </button>
            <button
              onClick={() => setSelectedCategory('dress_up')}
              className={`px-3 py-1 rounded-xl transition-all ${
                selectedCategory === 'dress_up'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Costumes & Items
            </button>
            <button
              onClick={() => setSelectedCategory('holiday')}
              className={`px-3 py-1 rounded-xl transition-all ${
                selectedCategory === 'holiday'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Holidays
            </button>
          </div>
        </div>
      </div>

      {/* Chronological List of Events (Zero Duplication!) */}
        <div className="divide-y divide-slate-100">
          {monthEvents.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <CalendarIcon className="w-10 h-10 mx-auto mb-2 opacity-30" strokeWidth={1.5} />
              <p className="text-sm font-medium">No special events or holidays marked for this month.</p>
              <p className="text-xs text-slate-400 mt-1">Regular academic routine applies.</p>
            </div>
          ) : (
            monthEvents.map(event => {
              const eventDateObj = new Date(event.date);
              const dayName = eventDateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNumber = eventDateObj.getDate();

              return (
                <div
                  key={event.id}
                  onClick={() => setActiveEventModal(event)}
                  className="py-3.5 flex items-start gap-3.5 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-all cursor-pointer group"
                >
                  {/* Date badge */}
                  <div className="shrink-0 w-12 text-center rounded-xl py-1.5 px-1 bg-slate-100 group-hover:bg-brand-50 transition-colors border border-slate-200 group-hover:border-brand-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-500 group-hover:text-brand-600">
                      {dayName}
                    </span>
                    <span className="block text-lg font-extrabold text-slate-900 group-hover:text-brand-700 leading-tight">
                      {dayNumber}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-slate-900 text-sm">
                        {event.title}
                      </h4>
                      {event.type === 'dress_up' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <Shirt className="w-3 h-3" strokeWidth={1.75} /> Dress-Up Day
                        </span>
                      )}
                      {event.type === 'holiday' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <PartyPopper className="w-3 h-3" strokeWidth={1.75} /> Holiday
                        </span>
                      )}
                      {event.type === 'ptm' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" strokeWidth={1.75} /> PTM
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    {/* Integrated Dress-Up & Bring tags directly on the row */}
                    {(event.dressUpPrompt || event.bringToSchool) && (
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        {event.dressUpPrompt && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50/80 border border-purple-200 text-purple-800 font-medium">
                            <Shirt className="w-3.5 h-3.5 text-purple-600" strokeWidth={1.75} />
                            <span><strong>Wear:</strong> {event.dressUpPrompt}</span>
                          </span>
                        )}
                        {event.bringToSchool && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-800 font-medium">
                            <Package className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
                            <span><strong>Bring:</strong> {event.bringToSchool}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Download Feedback Toast */}
        {downloadToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CalendarIcon className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
            <span>{downloadToast}</span>
          </div>
        )}

        {/* Sync Footer */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-500">
            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
            <span>Syncs with Apple Calendar, Google Calendar & Outlook</span>
          </span>
          <button
            onClick={handleDownloadIcs}
            className="flex items-center gap-1.5 font-semibold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200 transition-colors shadow-2xs hover:bg-brand-100"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Export Phone Calendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* Slide Deck Modal Viewer */}
      {showPdfViewer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-400" strokeWidth={1.75} />
                <div>
                  <span className="text-[10px] font-semibold text-brand-400 uppercase tracking-wider">Official Curriculum Slide Pack</span>
                  <h3 className="font-bold text-base text-white">
                    {activeCurriculum?.pdfFileName || curriculum?.pdfFileName || 'Curriculum_Plan.pdf'}
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

            <div className="my-4 flex-1 bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-slate-700 overflow-y-auto min-h-[260px]">
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
              <span>Showing official school curriculum upload</span>
              <button
                onClick={() => handleOpenPdf()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl"
              >
                <Download className="w-3.5 h-3.5" strokeWidth={1.75} /> Open in New Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {activeEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                  {activeEventModal.date}
                </span>
                <h3 className="font-bold text-lg text-slate-900 mt-1">
                  {activeEventModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveEventModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {activeEventModal.description && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeEventModal.description}
              </p>
            )}

            {activeEventModal.dressUpPrompt && (
              <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs">
                <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                  <Shirt className="w-4 h-4 text-purple-600" strokeWidth={1.75} /> What to Wear:
                </div>
                <p className="text-purple-800">{activeEventModal.dressUpPrompt}</p>
              </div>
            )}

            {activeEventModal.bringToSchool && (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                  <Package className="w-4 h-4 text-emerald-600" strokeWidth={1.75} /> What to Bring:
                </div>
                <p className="text-emerald-800">{activeEventModal.bringToSchool}</p>
              </div>
            )}

            <button
              onClick={() => setActiveEventModal(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
