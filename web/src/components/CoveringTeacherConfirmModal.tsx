import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export interface CoveringTeacherConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionTitle: string;
  targetSectionName: string;
  primaryTeacherName: string;
  coveringTeacherName: string;
  auditStampMessage?: string;
}

export const CoveringTeacherConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  targetSectionName,
  primaryTeacherName,
  coveringTeacherName,
  auditStampMessage
}: CoveringTeacherConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl border border-amber-200 shadow-xl max-w-md w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 bg-amber-50/90 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Covering Teacher Confirmation
              </h3>
              <p className="text-[11px] text-amber-900 font-medium">
                Cross-Section Action Governance & Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-amber-100/60 transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Pending Action
            </span>
            <p className="font-bold text-slate-900 text-sm">
              {actionTitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-2xl">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Target Section</span>
              <span className="font-bold text-slate-900 block mt-0.5">{targetSectionName}</span>
              <span className="text-[11px] text-slate-500 block">Class Teacher: {primaryTeacherName}</span>
            </div>

            <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-2xl">
              <span className="text-[10px] text-slate-600 font-semibold block uppercase">Covering Teacher</span>
              <span className="font-bold text-slate-900 block mt-0.5">{coveringTeacherName}</span>
              <span className="text-[11px] text-emerald-700 font-semibold block">Substitute Authority</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Immutable Audit Trail</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {auditStampMessage || `This update will be logged with an official audit record as reviewed by ${coveringTeacherName} (Covering Teacher).`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm & Audit Stamp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
