import { useState } from 'react';
import { LeaveRequest, PtmSlot } from '../data/mockData';
import { CoveringTeacherConfirmModal } from './CoveringTeacherConfirmModal';
import {
  Clock,
  CheckCircle,
  FileText,
  UserCheck,
  PlusCircle,
  FileCheck2,
  CalendarCheck,
  Printer,
  Bus,
  ShieldCheck,
  X,
  Send,
  Plus,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

interface RequestsModuleProps {
  leaveRequests: LeaveRequest[];
  onApplyLeave: (leave: LeaveRequest) => void;
  ptmSlots: PtmSlot[];
  onBookPtmSlot: (slotId: string, previousSlotId?: string) => void;
  onCancelPtmSlot?: (slotId: string) => void;
  onAddPtmSlot?: (slot: PtmSlot) => void;
  onUpdatePtmSlot?: (slotId: string, updates: Partial<PtmSlot>) => void;
  onDeletePtmSlot?: (slotId: string) => void;
  onApproveLeave?: (id: string, remarks?: string) => void;
  onRejectLeave?: (id: string, remarks?: string) => void;
  userRole: 'parent' | 'teacher';
  activeSectionName?: string;
  activeSectionId?: string;
  isCoveringTeacher?: boolean;
  coveringTeacherName?: string;
}

export const RequestsModule = ({
  leaveRequests,
  onApplyLeave,
  ptmSlots,
  onBookPtmSlot,
  onCancelPtmSlot,
  onAddPtmSlot,
  onUpdatePtmSlot,
  onDeletePtmSlot,
  onApproveLeave,
  onRejectLeave,
  userRole,
  activeSectionName = 'Mont 1A',
  activeSectionId = 'mont-1a',
  isCoveringTeacher = false,
  coveringTeacherName = 'Ms. Ananya',
}: RequestsModuleProps) => {
  const isTeacher = userRole === 'teacher';
  const [activeSubTab, setActiveSubTab] = useState<'leave' | 'ptm' | 'certificates'>('leave');
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveRequest['type']>('Medical / Illness');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Certificates & Route change states
  const [showBonafideModal, setShowBonafideModal] = useState(false);
  const [bonafidePurpose, setBonafidePurpose] = useState('Passport & Visa Application');
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [transportRoute, setTransportRoute] = useState('Route 4: Vijayanagar Club (Stop 3)');
  const [transportDate, setTransportDate] = useState('2026-11-18');
  const [transportReason, setTransportReason] = useState('Medical appointment in Vijayanagar');
  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 'req-bon-1',
      type: 'Bonafide Certificate',
      details: 'Passport Application • Ref #NAFL/BON/2026-27/019',
      date: '10 Nov 2026',
      status: 'Issued & Signed' as const,
    },
    {
      id: 'req-trn-1',
      type: 'Route Notice',
      details: 'Route 4 (Vijayanagar Club) drop-off with Registered Grandparent',
      date: '04 Nov 2026',
      status: 'Approved by Transport Desk' as const,
    }
  ]);

  const handleTransportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = {
      id: `req-trn-${Date.now()}`,
      type: 'Route Notice',
      details: `${transportRoute} on ${transportDate} (${transportReason || 'Parent request'})`,
      date: 'Today',
      status: 'Approved by Transport Desk' as const,
    };
    setServiceRequests(prev => [newReq, ...prev]);
    setShowTransportModal(false);
    setSuccessBanner(`Transport route change dispatched and approved for ${transportDate}!`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Teacher PTM Management State (Fix 5)
  const [showAddPtmModal, setShowAddPtmModal] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState('11:15 AM – 11:30 AM');
  const [newSlotDate, setNewSlotDate] = useState('2026-12-05');
  const [newSlotLocation, setNewSlotLocation] = useState('Room 104 (Mont 1A Classroom)');

  const sectionTeacherName = activeSectionName?.includes('1B') ? 'Ms. Shalini' : 'Ms. Ananya';
  const sectionRoom = activeSectionName?.includes('1B') ? 'Room 106' : 'Room 104';
  const sectionStudentsCount = activeSectionName?.includes('1B') ? 22 : 24;

  const [confirmAction, setConfirmAction] = useState<{
    actionTitle: string;
    onConfirm: () => void;
    auditStampMessage?: string;
  } | null>(null);

  const handleTriggerApproveLeave = (leave: LeaveRequest) => {
    const doApprove = () => {
      const remarks = isCoveringTeacher
        ? `Approved by Covering Teacher (${coveringTeacherName}). Rest well!`
        : 'Approved by Class Teacher. Rest well!';
      onApproveLeave?.(leave.id, remarks);
      setSuccessBanner(`Approved leave application for ${leave.studentName}!`);
      setTimeout(() => setSuccessBanner(null), 3500);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Approve Leave Application for ${leave.studentName}`,
        auditStampMessage: `Leave for ${leave.studentName} in ${activeSectionName} will be recorded as reviewed by ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doApprove,
      });
    } else {
      doApprove();
    }
  };

  const handleTriggerRejectLeave = (leave: LeaveRequest) => {
    const doReject = () => {
      const remarks = isCoveringTeacher
        ? `Kindly discuss with covering teacher (${coveringTeacherName}).`
        : 'Kindly discuss with class teacher.';
      onRejectLeave?.(leave.id, remarks);
      setSuccessBanner(`Updated status for ${leave.studentName}.`);
      setTimeout(() => setSuccessBanner(null), 3500);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Reject Leave Application for ${leave.studentName}`,
        auditStampMessage: `Leave rejection for ${leave.studentName} in ${activeSectionName} will be recorded as reviewed by ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doReject,
      });
    } else {
      doReject();
    }
  };

  const handleTriggerToggleBlockSlot = (slot: PtmSlot) => {
    const nextStatus = slot.status === 'Blocked' ? 'Available' : 'Blocked';
    const actionLabel = slot.status === 'Blocked' ? 'Unblock Slot' : 'Block Slot for Break';
    const doToggle = () => {
      onUpdatePtmSlot?.(slot.id, { status: nextStatus });
      setSuccessBanner(`${actionLabel} (${slot.timeSlot}) successful.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `${actionLabel} (${slot.timeSlot})`,
        auditStampMessage: `PTM slot update in ${activeSectionName} (${sectionRoom}) will be recorded under ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doToggle,
      });
    } else {
      doToggle();
    }
  };

  const handleTriggerDeleteSlot = (slotId: string, timeSlot: string) => {
    const doDelete = () => {
      onDeletePtmSlot?.(slotId);
      setSuccessBanner(`Deleted ${timeSlot} slot.`);
      setTimeout(() => setSuccessBanner(null), 3000);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Delete PTM Slot (${timeSlot})`,
        auditStampMessage: `Deleting developmental slot in ${activeSectionName} (${sectionRoom}) will be logged under ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doDelete,
      });
    } else {
      doDelete();
    }
  };

  const filteredLeaveRequests = isTeacher && activeSectionId
    ? leaveRequests.filter(l => !l.sectionId || l.sectionId === activeSectionId)
    : leaveRequests;

  const filteredPtmSlots = isTeacher && activeSectionId
    ? ptmSlots.filter(s => !s.sectionId || s.sectionId === activeSectionId)
    : ptmSlots;

  const approvedLeavesCount = filteredLeaveRequests.filter(l => l.status === 'Approved').length;
  const pendingLeavesCount = filteredLeaveRequests.filter(l => l.status === 'Pending').length;
  const inClassCount = sectionStudentsCount - approvedLeavesCount;

  const handleCreatePtmSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime.trim()) return;
    const newSlot: PtmSlot = {
      id: `ptm-${Date.now()}`,
      date: newSlotDate,
      timeSlot: newSlotTime.trim(),
      teacherName: isCoveringTeacher ? `${sectionTeacherName} (Covered by ${coveringTeacherName})` : sectionTeacherName,
      grade: activeSectionName,
      sectionId: activeSectionId,
      status: 'Available',
      location: newSlotLocation || `${sectionRoom} (${activeSectionName} Classroom)`
    };

    const doAdd = () => {
      onAddPtmSlot?.(newSlot);
      setShowAddPtmModal(false);
      setSuccessBanner(`Opened new PTM developmental slot for ${activeSectionName}: ${newSlot.timeSlot}!`);
      setTimeout(() => setSuccessBanner(null), 3500);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Add PTM Slot (${newSlot.timeSlot})`,
        auditStampMessage: `New developmental slot in ${activeSectionName} (${sectionRoom}) will be created under ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doAdd,
      });
    } else {
      doAdd();
    }
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !reason.trim()) return;

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      studentName: 'Aarav Sharma',
      grade: 'Mont 1A',
      type: leaveType,
      startDate,
      endDate: endDate || startDate,
      numberOfDays: 1,
      reason: reason.trim(),
      status: 'Pending',
      submittedOn: 'Just now'
    };

    onApplyLeave(newLeave);
    setReason('');
    setStartDate('');
    setEndDate('');
    setShowLeaveForm(false);
    setSuccessBanner('Leave application submitted to class teacher Ms. Ananya!');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Quick Action Sub-tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('leave')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap text-center ${
            activeSubTab === 'leave' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTeacher ? `Leave Approvals (${activeSectionName})` : 'Leave Applications'}
        </button>
        <button
          onClick={() => setActiveSubTab('ptm')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap text-center ${
            activeSubTab === 'ptm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTeacher ? 'My PTM Schedule' : 'PTM Slot Booking'}
        </button>
        <button
          onClick={() => setActiveSubTab('certificates')}
          className={`flex-1 py-2 px-3 rounded-xl transition-all whitespace-nowrap text-center ${
            activeSubTab === 'certificates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isTeacher ? 'Class Letters' : 'Official Letters'}
        </button>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* TAB 1: LEAVE APPLICATIONS / APPROVALS */}
      {activeSubTab === 'leave' && (
        <div className="space-y-4">
          {isTeacher && isCoveringTeacher && (
            <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-semibold shadow-2xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>
                  Covering Teacher Mode active for {activeSectionName} (Primary: {sectionTeacherName}). Cross-section actions require confirmation and will be audit-stamped.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-bold uppercase tracking-wide shrink-0">
                Covering
              </span>
            </div>
          )}

          {isTeacher ? (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-amber-950 block">{activeSectionName} Daily Attendance Snapshot</span>
                <span className="text-[11px] text-amber-800">
                  {inClassCount} In Class • {approvedLeavesCount} On Approved Leave • {pendingLeavesCount} Pending Review
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 self-start sm:self-auto">
                Class Teacher: {sectionTeacherName} ({sectionRoom})
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Leave History & Status</h3>
              <button
                onClick={() => setShowLeaveForm(!showLeaveForm)}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>{showLeaveForm ? 'Cancel Form' : 'Apply for Leave'}</span>
              </button>
            </div>
          )}

          {/* Form */}
          {showLeaveForm && (
            <form onSubmit={handleLeaveSubmit} className="p-5 bg-white rounded-2xl border border-brand-200 shadow-sm space-y-4 text-xs animate-fade-in">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-600" />
                <span>Submit Student Leave Application</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reason Category</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Medical / Illness">Medical / Illness (Urgent)</option>
                    <option value="Family Travel">Family Travel (Planned)</option>
                    <option value="Urgent Event">Urgent Event</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date (or same day)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Explanation / Doctor's Advice</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Aarav has developed a mild fever and cold. Doctor advised 2 days rest..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
                >
                  Submit to Class Teacher
                </button>
              </div>
            </form>
          )}

          {/* Leave list */}
          <div className="space-y-3">
            {filteredLeaveRequests.map(leave => (
              <div
                key={leave.id}
                className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">
                      {isTeacher ? `${leave.studentName} (${leave.grade})` : `${leave.startDate} ${leave.endDate !== leave.startDate ? `to ${leave.endDate}` : ''}`}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                      {leave.type}
                    </span>
                    <span className="text-slate-400">
                      • {leave.startDate} {leave.endDate !== leave.startDate ? `– ${leave.endDate}` : ''} ({leave.numberOfDays || 1} day)
                    </span>
                  </div>
                  <p className="text-slate-600">{leave.reason}</p>

                  {leave.teacherRemarks && (
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5 mt-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span><strong>{leave.reviewedBy}:</strong> {leave.teacherRemarks}</span>
                    </p>
                  )}
                </div>

                <div className="shrink-0 self-start sm:self-auto">
                  {isTeacher && leave.status === 'Pending' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleTriggerApproveLeave(leave)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleTriggerRejectLeave(leave)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
                      >
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : leave.status === 'Approved' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {isTeacher ? 'Approved by You' : 'Approved'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PTM SCHEDULE & BOOKINGS */}
      {activeSubTab === 'ptm' && (() => {
        const myBookedSlot = ptmSlots.find(s => s.bookedByStudentId === 'NAFL/2026/M1-042');
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {isTeacher ? `My PTM Schedule — ${sectionTeacherName} (${activeSectionName})` : 'Upcoming Term 1 PTM Schedule'}
                </h3>
                <p className="text-xs text-slate-500">
                  Saturday, 05 December 2026 • 15-Minute Individual Developmental Slots {isTeacher ? `with ${activeSectionName} Parents` : `with ${sectionTeacherName}`}
                </p>
              </div>
            </div>

            {/* Teacher PTM Action Bar & Slot Stats (Fix 5) */}
            {isTeacher && isCoveringTeacher && (
              <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-semibold shadow-2xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>
                    Covering Teacher Mode active for {activeSectionName} PTM. Modifications will be recorded with audit stamp ({coveringTeacherName} - Covering Teacher).
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-bold uppercase tracking-wide shrink-0">
                  Covering
                </span>
              </div>
            )}

            {isTeacher && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-950">{activeSectionName} PTM Schedule:</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 font-semibold text-[11px]">
                    Total: {filteredPtmSlots.length} Slots
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    Booked: {filteredPtmSlots.filter(s => s.status === 'Booked').length}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-[11px]">
                    Open: {filteredPtmSlots.filter(s => s.status === 'Available').length}
                  </span>
                  {filteredPtmSlots.some(s => s.status === 'Blocked') && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                      Blocked: {filteredPtmSlots.filter(s => s.status === 'Blocked').length}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPtmModal(true)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Add PTM Slot</span>
                </button>
              </div>
            )}

            {/* Parent Active Booking Banner & Limitation Notice */}
            {!isTeacher && (
              myBookedSlot ? (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">
                        Your PTM Appointment is Booked: {myBookedSlot.timeSlot}
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Room 102 with {myBookedSlot.teacherName}. (Policy: Maximum 1 slot per student to ensure all families get time).
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onCancelPtmSlot?.(myBookedSlot.id);
                      setSuccessBanner('Released your PTM booking. You may now pick a new slot.');
                      setTimeout(() => setSuccessBanner(null), 3500);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 font-semibold text-xs self-start sm:self-auto shrink-0 shadow-2xs transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-200/80 text-brand-900 text-xs flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>
                    Select any available 15-minute slot below for your Term 1 developmental review. (1 slot limit per ward).
                  </span>
                </div>
              )
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {filteredPtmSlots.map(slot => {
                const isMyBooking = slot.bookedByStudentId === 'NAFL/2026/M1-042';
                const isBooked = slot.status === 'Booked';
                return (
                  <div
                    key={slot.id}
                    className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                      isMyBooking
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : isBooked
                        ? 'border-slate-200 bg-slate-50/70 opacity-70'
                        : slot.status === 'Blocked'
                        ? 'border-slate-200 bg-slate-100/80 opacity-75'
                        : slot.status === 'Available'
                        ? 'border-slate-200 bg-white hover:border-brand-300 shadow-2xs'
                        : 'border-slate-100 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-sm block">{slot.timeSlot}</span>
                        {slot.status === 'Blocked' && (
                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                            Break
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        {slot.location || (isTeacher ? 'Room 102 (Mont 1A)' : `${slot.teacherName} (${slot.grade})`)}
                      </span>
                    </div>

                    <div className="mt-3">
                      {isTeacher ? (
                        isBooked ? (
                          <div className="p-2 rounded-xl bg-white border border-brand-200 text-center shadow-2xs">
                            <span className="text-[10px] font-bold text-brand-900 block truncate">
                              Booked: Rajesh Sharma
                            </span>
                            <span className="text-[9px] text-slate-500 block truncate">
                              Parent of Aarav (Mont 1A)
                            </span>
                          </div>
                        ) : slot.status === 'Blocked' ? (
                          <div className="space-y-1.5">
                            <span className="text-center block text-[10px] text-slate-600 font-bold bg-slate-200/80 py-1 rounded-lg">
                              Blocked for Break
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleTriggerToggleBlockSlot(slot)}
                                className="flex-1 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-[10px] flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <Unlock className="w-2.5 h-2.5 text-emerald-600" />
                                <span>Unblock</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTriggerDeleteSlot(slot.id, slot.timeSlot)}
                                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-2xs"
                                title="Delete Slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <span className="text-center block text-[10.5px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 py-1 rounded-lg">
                              Open for Parents
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleTriggerToggleBlockSlot(slot)}
                                className="flex-1 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 font-semibold text-[10px] flex items-center justify-center gap-1 shadow-2xs"
                              >
                                <Lock className="w-2.5 h-2.5 text-amber-600" />
                                <span>Block</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTriggerDeleteSlot(slot.id, slot.timeSlot)}
                                className="p-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-2xs"
                                title="Delete Slot"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )
                      ) : isMyBooking ? (
                        <div className="space-y-1">
                          <div className="text-center py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center gap-1 shadow-2xs">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Your Booked Slot</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onCancelPtmSlot?.(slot.id);
                              setSuccessBanner('Released PTM slot.');
                              setTimeout(() => setSuccessBanner(null), 3500);
                            }}
                            className="w-full text-center text-[10px] text-slate-400 hover:text-rose-600 underline font-medium"
                          >
                            Release Slot
                          </button>
                        </div>
                      ) : slot.status === 'Available' ? (
                        myBookedSlot ? (
                          <button
                            onClick={() => {
                              onBookPtmSlot(slot.id, myBookedSlot.id);
                              setSuccessBanner(`Rescheduled PTM appointment to ${slot.timeSlot}!`);
                              setTimeout(() => setSuccessBanner(null), 4000);
                            }}
                            className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
                          >
                            Reschedule to Here
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onBookPtmSlot(slot.id);
                              setSuccessBanner(`Confirmed PTM slot at ${slot.timeSlot} on Dec 5!`);
                              setTimeout(() => setSuccessBanner(null), 4000);
                            }}
                            className="w-full py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
                          >
                            Book Slot
                          </button>
                        )
                      ) : (
                        <span className="text-center block text-[11px] text-slate-400 italic py-1">
                          Reserved by another parent
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* TAB 3: OFFICIAL LETTERS & CERTIFICATES */}
      {activeSubTab === 'certificates' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Official School Document & Service Requests</h3>
                <p className="text-[11px] text-slate-500">
                  Generate authorized digital certificates or notify the NAFL transport desk with zero paperwork.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Bonafide / Study Certificate</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                    Instant Issue
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Official certified letter for Passport, Visa, Tax tuition claim, or employer reimbursement. Digitally signed by NAFL Principal.
                </p>
                <button
                  onClick={() => setShowBonafideModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                  <span>Generate / View Certificate</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Temporary Bus Route Change</span>
                  <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold text-[10px]">
                    Direct to Dispatch
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Request alternate drop-off stop (e.g. Route 4 Vijayanagar Club, Route 7 Rajajinagar) or gate pickup with a registered guardian for 1-2 days.
                </p>
                <button
                  onClick={() => setShowTransportModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Bus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Submit Route Notice</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Service Requests Log */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active & Recent Service Requests</span>
            </h4>

            <div className="space-y-2">
              {serviceRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{req.type}</span>
                      <span className="text-[10px] text-slate-400">• {req.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{req.details}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1 shrink-0">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{req.status}</span>
                    </span>
                    {req.type === 'Bonafide Certificate' && (
                      <button
                        onClick={() => setShowBonafideModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-[10px] shadow-2xs"
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Bonafide Certificate Modal */}
      {showBonafideModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[94vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Official Bonafide / Study Certificate</h3>
              </div>
              <button
                onClick={() => setShowBonafideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Purpose Selector */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <label className="font-bold text-slate-700 block">Certificate Purpose / Issuance Reason:</label>
              <select
                value={bonafidePurpose}
                onChange={(e) => setBonafidePurpose(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-xs"
              >
                <option value="Passport & Visa Application">Passport & Visa Application</option>
                <option value="Corporate Child Education Allowance Claim">Corporate Child Education Allowance / Tax Claim</option>
                <option value="Residential Address & Guardian Verification">Residential Address & Guardian Verification</option>
                <option value="General Bonafide Verification">General Bonafide School Verification</option>
              </select>
            </div>

            {/* Formal Letterhead Certificate View */}
            <div className="border-2 border-slate-200 rounded-2xl p-6 sm:p-8 bg-white space-y-5 text-slate-800 shadow-inner">
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="font-black text-lg sm:text-xl text-slate-900 tracking-wide uppercase">
                  National Academy For Learning (NAFL)
                </h2>
                <p className="text-xs text-slate-600">
                  Basaveshwarnagar, Bengaluru — 560079, Karnataka, India
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Affiliated to CISCE & CAIE • School Code: KA-042 • Estd 1994
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-1">
                <span>Ref: NAFL/BON/2026-27/019</span>
                <span>Date: 12 November 2026</span>
              </div>

              <div className="text-center py-2">
                <span className="font-bold text-sm tracking-widest text-slate-900 uppercase border-b border-slate-900 pb-0.5">
                  TO WHOMSOEVER IT MAY CONCERN
                </span>
              </div>

              <div className="text-xs sm:text-sm leading-relaxed space-y-3 text-slate-700">
                <p>
                  This is to certify that <strong>Master Aarav Sharma</strong> (Admission No:{' '}
                  <span className="font-mono font-semibold">NAFL-2026-084</span>) is a bona fide student of
                  National Academy For Learning (NAFL), studying in <strong>Montessori 1 (Section A)</strong> for
                  the academic session <strong>2026–2027</strong>.
                </p>
                <p>
                  As per school admission records, his date of birth is <strong>14 April 2023</strong> (Fourteenth
                  April Two Thousand Twenty-Three). His parents on record are <strong>Mr. Rajesh Sharma</strong> and{' '}
                  <strong>Mrs. Priya Sharma</strong>, residing in Bengaluru.
                </p>
                <p>
                  This certificate is issued upon the parent's request for the express purpose of{' '}
                  <strong>{bonafidePurpose}</strong>.
                </p>
              </div>

              <div className="pt-6 flex items-end justify-between border-t border-slate-100">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600/60 flex items-center justify-center text-[9px] font-bold text-emerald-800 uppercase tracking-tighter mx-auto mb-1 rotate-[-12deg] bg-emerald-50">
                    Official<br />NAFL Seal
                  </div>
                  <span className="text-[10px] text-slate-400 block">Digital Institutional Seal</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-serif italic text-base text-slate-800 font-bold">
                    Dr. Indira Jayakrishnan
                  </div>
                  <span className="font-bold text-xs text-slate-900 block">Principal</span>
                  <span className="text-[10px] text-slate-500 block">National Academy For Learning</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => setShowBonafideModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Temporary Route Change Notice Modal */}
      {showTransportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Temporary Bus Route Notice</h3>
                  <span className="text-[11px] text-slate-500">Mont 1A • Student: Aarav Sharma</span>
                </div>
              </div>
              <button
                onClick={() => setShowTransportModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTransportSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Effective Date of Route Change</label>
                <input
                  type="date"
                  value={transportDate}
                  onChange={(e) => setTransportDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alternative Drop-off Destination</label>
                <select
                  value={transportRoute}
                  onChange={(e) => setTransportRoute(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="Route 4: Vijayanagar Club (Stop 3)">Route 4: Vijayanagar Club (Stop 3, 12:55 PM)</option>
                  <option value="Route 7: Rajajinagar 1st Block (Stop 2)">Route 7: Rajajinagar 1st Block (Stop 2, 12:45 PM)</option>
                  <option value="Route 2: Malleshwaram 8th Cross">Route 2: Malleshwaram 8th Cross (Stop 5, 01:10 PM)</option>
                  <option value="Gate 1 Self-Pickup: Grandparent Collection">Gate 1 Campus Self-Pickup by Registered Grandparent (12:30 PM)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Reason / Instructions for Bus Attendant</label>
                <textarea
                  value={transportReason}
                  onChange={(e) => setTransportReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 focus:ring-2 focus:ring-brand-500 text-xs"
                  placeholder="e.g. Doctor appointment near Vijayanagar, grandfather will be at stop..."
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <strong>Safety Protocol:</strong> The bus conductor will verify the receiving guardian's photo against the NAFL Escort Registry before handing over the child.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTransportModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Route Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Add PTM Slot Modal (Fix 5) */}
      {showAddPtmModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add New PTM Developmental Slot</h3>
                  <span className="text-[11px] text-slate-500">Mont 1A • Saturday, 05 December 2026</span>
                </div>
              </div>
              <button
                onClick={() => setShowAddPtmModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePtmSlot} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Time Slot Window</label>
                <input
                  type="text"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  placeholder="e.g. 11:15 AM – 11:30 AM"
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold focus:ring-2 focus:ring-brand-500 text-xs"
                  required
                />
              </div>

              {/* Quick Preset Pills */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  1-Tap Preset Times:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '11:15 AM – 11:30 AM',
                    '11:30 AM – 11:45 AM',
                    '11:45 AM – 12:00 PM',
                    '12:00 PM – 12:15 PM',
                    '12:15 PM – 12:30 PM'
                  ].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setNewSlotTime(preset)}
                      className={`px-2 py-1 rounded-lg text-[10.5px] border transition-all ${
                        newSlotTime === preset
                          ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Date</label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Meeting Location / Channel</label>
                <select
                  value={newSlotLocation}
                  onChange={(e) => setNewSlotLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium focus:ring-2 focus:ring-brand-500 text-xs"
                >
                  <option value="Room 104 (Mont 1A Classroom)">Room 104 (Mont 1A Classroom — In-Person)</option>
                  <option value="Room 102 (Junior Montessori Wing)">Room 102 (Junior Montessori Wing)</option>
                  <option value="Google Meet Video Link (Remote)">Google Meet Video Link (Remote)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPtmModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Open Slot for Parents</span>
                </button>
              </div>
            </form>
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
          targetSectionName={`${activeSectionName} (${sectionRoom})`}
          primaryTeacherName={sectionTeacherName}
          coveringTeacherName={coveringTeacherName}
          auditStampMessage={confirmAction.auditStampMessage}
        />
      )}
    </div>
  );
};
