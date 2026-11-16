import { useState, useEffect } from 'react';
import { CircularNotice } from '../data/mockData';
import { CoveringTeacherConfirmModal } from './CoveringTeacherConfirmModal';
import {
  FileCheck,
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  UploadCloud,
  Send,
  Users,
  Trash2
} from 'lucide-react';

interface CircularsModuleProps {
  circulars: CircularNotice[];
  onAcknowledge: (id: string) => void;
  onDeleteCircular?: (id: string) => void;
  userRole?: 'parent' | 'teacher';
  onOpenUploader?: (type: 'circular') => void;
  activeSectionName?: string;
  activeSectionId?: string;
  isCoveringTeacher?: boolean;
  coveringTeacherName?: string;
}

export const CircularsModule = ({
  circulars,
  onAcknowledge,
  onDeleteCircular,
  userRole = 'parent',
  onOpenUploader,
  activeSectionName = 'Mont 1A',
  activeSectionId = 'mont-1a',
  isCoveringTeacher = false,
  coveringTeacherName = 'Ms. Ananya',
}: CircularsModuleProps) => {
  const isTeacher = userRole === 'teacher';
  const [filter, setFilter] = useState<'all' | 'pending' | 'signed'>('all');
  const [viewingPdf, setViewingPdf] = useState<CircularNotice | null>(null);
  const [nudgeToast, setNudgeToast] = useState<string | null>(null);

  // Covering teacher guardrail confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    actionTitle: string;
    onConfirm: () => void;
    auditStampMessage?: string;
  } | null>(null);

  const handleTriggerDeleteCircular = (circular: CircularNotice) => {
    const doDelete = () => {
      onDeleteCircular?.(circular.id);
      setNudgeToast(`Retracted circular notice ${circular.circularNumber} ("${circular.title}")`);
      setTimeout(() => setNudgeToast(null), 3500);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Retract Circular Notice: ${circular.circularNumber}`,
        auditStampMessage: `Retracting circular notice in ${activeSectionName} will be recorded under ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  };

  // Section-aware circulars: Parents only receive school-wide, grade-tier, or their own section notices
  const sectionScopedCirculars = circulars.filter(c => {
    if (c.targetScope === 'all_school' || c.target === 'Whole School' || c.target === 'Mont 1 & Mont 2') return true;
    if (c.targetScope === 'grade_tier' || c.target === 'Mont 1') return true;
    if (c.targetScope === 'section' || c.targetSectionId) {
      if (c.targetSectionId) return c.targetSectionId === activeSectionId;
      if (c.target) return c.target === activeSectionName;
    }
    return true;
  });

  const pendingCount = sectionScopedCirculars.filter(c => c.requiresAcknowledgement && !c.acknowledgedByParent).length;
  const teacherPendingCount = sectionScopedCirculars.filter(c => c.requiresAcknowledgement).length;
  const showPendingTab = isTeacher ? teacherPendingCount > 0 : pendingCount > 0;

  useEffect(() => {
    if (!showPendingTab && filter === 'pending') {
      setFilter('all');
    }
  }, [showPendingTab, filter]);

  const filteredCirculars = sectionScopedCirculars.filter(c => {
    if (isTeacher) {
      if (filter === 'pending') return c.requiresAcknowledgement;
      if (filter === 'signed') return !c.requiresAcknowledgement;
      return true;
    }
    if (filter === 'pending') return c.requiresAcknowledgement && !c.acknowledgedByParent;
    if (filter === 'signed') return c.acknowledgedByParent;
    return true;
  });

  const handleSendNudge = (circularTitle: string) => {
    setNudgeToast(`Sent signature reminder notification to pending ${activeSectionName} parents for "${circularTitle}"`);
    setTimeout(() => setNudgeToast(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification for Teacher Nudges */}
      {nudgeToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
          <span>{nudgeToast}</span>
        </div>
      )}

      {/* Teacher Action Header */}
      {isTeacher ? (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div>
            <span className="font-bold text-amber-950 block">{activeSectionName} Section Compliance & Circulars</span>
            <span className="text-[11px] text-amber-800">
              Track parent digital acknowledgements across school-wide and section notices.
            </span>
          </div>
          {onOpenUploader && (
            <button
              onClick={() => onOpenUploader('circular')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto transition-all shadow-xs shrink-0"
            >
              <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Publish Section Notice</span>
            </button>
          )}
        </div>
      ) : (
        /* Pending Signature Notice Banner for Parents */
        pendingCount > 0 && (
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.75} />
              <span>{pendingCount} Circular requires your signature / acknowledgement</span>
            </div>
            <button
              onClick={() => setFilter('pending')}
              className="text-[11px] underline font-bold text-amber-900 shrink-0"
            >
              Filter Pending
            </button>
          </div>
        )
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Circulars ({circulars.length})
        </button>
        {showPendingTab && (
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
            }`}
          >
            {isTeacher ? 'Requires Parent Signs' : `Requires Signature (${pendingCount})`}
          </button>
        )}
        <button
          onClick={() => setFilter('signed')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'signed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {isTeacher ? 'Informational Notices' : 'Signed & Acknowledged'}
        </button>
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.map(circular => (
          <div
            key={circular.id}
            className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 shadow-sm ${
              circular.requiresAcknowledgement && !circular.acknowledgedByParent
                ? 'border-amber-300 ring-2 ring-amber-400/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex-1">
                {/* Meta header */}
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {circular.circularNumber}
                  </span>
                  <span className="text-xs text-slate-500">
                    {circular.publishDate}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {circular.target}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {circular.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {circular.summary}
                </p>

                {/* PDF Artefact Pill */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => setViewingPdf(circular)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                    <span>{circular.pdfFileName}</span>
                    <span className="text-slate-400 text-[10px]">({circular.pdfFileSize})</span>
                  </button>
                </div>
              </div>

              {/* Acknowledgement / Compliance Action Box */}
              <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {isTeacher ? (
                  <div className="space-y-2 text-left sm:text-right">
                    {circular.requiresAcknowledgement ? (
                      <div className="bg-amber-50/80 border border-amber-200/90 p-3 rounded-2xl text-xs space-y-1.5 min-w-[210px]">
                        <div className="flex items-center justify-between gap-2 text-amber-950 font-bold text-xs">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-amber-700" strokeWidth={1.75} />
                            <span>{activeSectionName} Signed</span>
                          </span>
                          <span className="text-emerald-700">22 / 24 (92%)</span>
                        </div>
                        <div className="w-full bg-amber-200/80 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: '92%' }}></div>
                        </div>
                        <div className="flex items-center justify-between pt-1 gap-2">
                          <span className="text-[10px] text-slate-500">2 Pending parents</span>
                          <button
                            onClick={() => handleSendNudge(circular.title)}
                            className="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 font-bold text-[10px] flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Send className="w-2.5 h-2.5 text-amber-700" strokeWidth={1.75} />
                            <span>Nudge</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic block">
                        Informational (No sign-off needed)
                      </span>
                    )}

                    {/* Teacher Retract Action */}
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleTriggerDeleteCircular(circular)}
                        className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[10.5px] flex items-center gap-1 shadow-2xs transition-colors"
                        title="Retract / Delete Circular"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Retract Notice</span>
                      </button>
                    </div>
                  </div>
                ) : circular.requiresAcknowledgement ? (
                  circular.acknowledgedByParent ? (
                    <div className="inline-flex flex-col items-start sm:items-end text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                      <span className="font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Acknowledged & Signed
                      </span>
                      <span className="text-[10px] text-emerald-600 mt-0.5">
                        {circular.acknowledgedAt || 'Recorded in school log'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-start sm:items-end gap-1.5">
                      <button
                        onClick={() => onAcknowledge(circular.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm shadow-amber-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <FileCheck className="w-4 h-4" />
                        <span>Acknowledge & Sign Receipt</span>
                      </button>
                      <span className="text-[10px] text-amber-700 font-medium">
                        Action required by parent
                      </span>
                    </div>
                  )
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    Informational only (No sign-off needed)
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PDF View Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-brand-700">
                  {viewingPdf.circularNumber}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-0.5">
                  {viewingPdf.title}
                </h3>
              </div>
              <button
                onClick={() => setViewingPdf(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
              <span className="font-medium text-slate-700">File: {viewingPdf.pdfFileName}</span>
              <span>Size: {viewingPdf.pdfFileSize}</span>
            </div>

            {/* Authentic Circular Document Render */}
            <div className="flex-1 w-full rounded-2xl border border-slate-200 overflow-y-auto bg-slate-50/60 p-4 sm:p-5 max-h-[60vh] space-y-4 shadow-inner text-slate-800">
              {/* NAFL Header Banner */}
              <div className="bg-[#0369a1] text-white p-4 rounded-xl shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-bold text-sm sm:text-base tracking-wide">NATIONAL ACADEMY FOR LEARNING (NAFL)</h4>
                    <p className="text-[11px] text-sky-100">Basaveshwarnagar, Bengaluru | Affiliated to CISCE & CAIE</p>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded self-start sm:self-auto font-semibold">
                    Official Notice
                  </span>
                </div>
              </div>

              {/* Circular Metadata Box */}
              <div className="bg-white rounded-xl border border-slate-200 p-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Circular No</span>
                  <span className="font-mono font-bold text-slate-900">{viewingPdf.circularNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Publish Date</span>
                  <span className="font-semibold text-slate-800">{viewingPdf.publishDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Section</span>
                  <span className="font-semibold text-brand-700">{viewingPdf.target}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                  <span className="font-semibold text-slate-800">{viewingPdf.category}</span>
                </div>
              </div>

              {/* Subject */}
              <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">Subject</span>
                <h5 className="font-bold text-sky-950 text-xs sm:text-sm">{viewingPdf.title}</h5>
              </div>

              {/* Circular Full Content */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 text-xs sm:text-sm space-y-3 leading-relaxed text-slate-700">
                <p className="font-semibold text-slate-900">Dear Parents,</p>
                <p>
                  We are pleased to announce that our Annual Junior Athletic Meet for Montessori and Primary sections will be held on Saturday, 19th December 2026 at the NAFL Campus Sports Grounds.
                </p>

                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-900 block text-xs">Event Highlights for Montessori 1:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs pl-1">
                    <li>25m Fun Dash & Obstacle Balancing Crawl</li>
                    <li>Color Sorting Relay & Ring Toss Activity</li>
                    <li>Parent-Child Bonding 3-Legged Fun Walk</li>
                  </ul>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200/70">
                  <span className="font-bold text-amber-950 block text-xs">Dress Code & Student Requirements:</span>
                  <ul className="list-disc list-inside space-y-1 text-amber-900 text-xs pl-1">
                    <li>Student House Color T-shirt (Ruby / Sapphire / Emerald / Amber) with navy sports shorts</li>
                    <li>Comfortable running sports shoes and labeled NAFL sun cap</li>
                    <li>Please send a labeled water bottle and healthy fruit snack box</li>
                  </ul>
                </div>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-900">Timings:</strong> 08:30 AM to 11:30 AM (Children must be dropped at Gate 2 by 08:15 AM).
                </p>

                <div className="pt-2 border-t border-slate-100 text-xs">
                  <p className="text-slate-500">Warm regards,</p>
                  <p className="font-bold text-slate-800">Office of the Principal & Physical Education Department</p>
                  <p className="text-slate-600">National Academy For Learning</p>
                </div>
              </div>

              {/* Signature Status Slip */}
              {viewingPdf.requiresAcknowledgement && (
                <div className="p-3.5 rounded-xl border bg-amber-50 border-amber-200 text-xs flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-amber-950 block">[ DIGITAL PARENT CONSENT SLIP ]</span>
                    <span className="text-[11px] text-amber-800">
                      {viewingPdf.acknowledgedByParent
                        ? `Signed & Acknowledged by Parent on ${viewingPdf.acknowledgedAt || 'Today'}`
                        : 'Parent digital signature / consent receipt required before Nov 27, 2026.'}
                    </span>
                  </div>
                  {viewingPdf.acknowledgedByParent ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] shrink-0 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Signed
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-200 text-amber-900 rounded-lg font-bold text-[11px] shrink-0">
                      Action Required
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingPdf(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.open(`/samples/${viewingPdf.pdfFileName}`, '_blank')}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download / Open Standalone PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Covering Teacher Confirmation Modal */}
      {confirmAction && (
        <CoveringTeacherConfirmModal
          isOpen={Boolean(confirmAction)}
          onClose={() => setConfirmAction(null)}
          onConfirm={confirmAction.onConfirm}
          actionTitle={confirmAction.actionTitle}
          targetSectionName={activeSectionName}
          primaryTeacherName={activeSectionName?.includes('1B') ? 'Ms. Shalini' : 'Ms. Ananya'}
          coveringTeacherName={coveringTeacherName}
          auditStampMessage={confirmAction.auditStampMessage}
        />
      )}
    </div>
  );
};
