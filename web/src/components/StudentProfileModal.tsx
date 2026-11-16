import { useState, useEffect } from 'react';
import { StudentProfile, AuthorizedGuardian, FeedbackItem } from '../data/mockData';
import { CoveringTeacherConfirmModal } from './CoveringTeacherConfirmModal';
import {
  GUARDIAN_AVATAR_PRESETS,
  AVATAR_STUDENT_BOY,
  AVATAR_STUDENT_GIRL,
  AVATAR_FATHER,
  AVATAR_MOTHER,
  AVATAR_GRANDFATHER,
  AVATAR_GRANDMOTHER
} from '../data/avatarIcons';
import {
  Phone,
  MapPin,
  Bus,
  ShieldAlert,
  IdCard,
  Briefcase,
  Search,
  Users,
  Edit3,
  Plus,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Save,
  Clock,
  AlertCircle,
  MessageSquare,
  Check,
  X,
  Send,
  Upload,
  ZoomIn
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile; // Default parent child profile
  onUpdateProfile?: (updated: StudentProfile) => void;
  onSendFeedback?: (feedback: FeedbackItem) => void;
  userRole?: 'parent' | 'teacher' | 'principal' | 'admin';
  classRoster?: StudentProfile[];
  isCoveringTeacher?: boolean;
  coveringTeacherName?: string;
  activeSectionName?: string;
}

export const StudentProfileModal = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onSendFeedback,
  userRole = 'parent',
  classRoster = [],
  isCoveringTeacher = false,
  coveringTeacherName = 'Ms. Ananya',
  activeSectionName = 'Mont 1A',
}: StudentProfileModalProps) => {
  const isTeacher = userRole === 'teacher';
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Enlarged photo lightbox state
  const [enlargedPhoto, setEnlargedPhoto] = useState<{
    url: string;
    name: string;
    role: string;
    badge?: string;
    gatePassId?: string;
  } | null>(null);

  // Teacher query dialog state
  const [queryingGuardianId, setQueryingGuardianId] = useState<string | null>(null);
  const [queryText, setQueryText] = useState<string>('');

  // Covering teacher guardrail confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    actionTitle: string;
    onConfirm: () => void;
    auditStampMessage?: string;
  } | null>(null);

  // Editable local state
  const [editFormData, setEditFormData] = useState<StudentProfile>(profile);

  // New guardian form state
  const [newGuardianName, setNewGuardianName] = useState('');
  const [newGuardianRelation, setNewGuardianRelation] = useState('Grandfather');
  const [newGuardianMobile, setNewGuardianMobile] = useState('');
  const [newGuardianType, setNewGuardianType] = useState<'Pickup & Drop' | 'Pickup Only'>('Pickup & Drop');
  const [newGuardianPhoto, setNewGuardianPhoto] = useState<string>(AVATAR_GRANDFATHER);

  // Reusable file reader for uploading photos from device / camera
  const handleImageUpload = (file: File, callback: (base64Url: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setEditFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  // Filter roster for teacher view
  const filteredRoster = classRoster.filter(item =>
    item.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.student.rollNumber.includes(searchQuery) ||
    item.student.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeProfile = isTeacher && classRoster.length > 0
    ? (filteredRoster[selectedStudentIndex] || classRoster[0] || profile)
    : profile;

  const currentDisplay = isEditing ? editFormData : activeProfile;
  const { student, parents } = currentDisplay;

  const handleAddGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardianName.trim() || !newGuardianMobile.trim()) return;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newGuardian: AuthorizedGuardian = {
      id: `g-${Date.now()}`,
      name: newGuardianName.trim(),
      relation: newGuardianRelation,
      mobile: newGuardianMobile.trim(),
      photo: newGuardianPhoto || AVATAR_GRANDFATHER,
      authorizationType: newGuardianType,
      gatePassId: `NAFL-GP-2026-${Math.floor(Math.random() * 800 + 100)}`,
      status: 'parent_declared',
      verified: false,
      declaredBy: `${parents.father.name || 'Parent'} (Father)`,
      declaredAt: formattedDate
    };

    setEditFormData(prev => ({
      ...prev,
      parents: {
        ...prev.parents,
        authorizedGuardians: [...(prev.parents.authorizedGuardians || []), newGuardian]
      }
    }));

    setNewGuardianName('');
    setNewGuardianMobile('');
    setNewGuardianPhoto(AVATAR_GRANDFATHER);
  };

  const handleRemoveGuardian = (id: string) => {
    setEditFormData(prev => ({
      ...prev,
      parents: {
        ...prev.parents,
        authorizedGuardians: (prev.parents.authorizedGuardians || []).filter(g => g.id !== id)
      }
    }));
  };

  const handleSaveProfile = () => {
    onUpdateProfile?.(editFormData);
    setIsEditing(false);
    setSuccessBanner('Successfully updated profile! New escorts are immediately active for gate pickup under Parent Declaration.');
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  // Option B: Teacher Governance Handlers
  const handleAcknowledgeGuardian = (guardianId: string) => {
    const targetStudent = activeProfile;
    const targetGuardian = targetStudent.parents.authorizedGuardians?.find(g => g.id === guardianId);
    if (!targetGuardian) return;

    const todayDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const verifierStamp = isCoveringTeacher
      ? `${coveringTeacherName} (Covering Teacher)`
      : 'Ms. Ananya (Class Teacher)';

    const doStamp = () => {
      const updatedGuardians = (targetStudent.parents.authorizedGuardians || []).map(g =>
        g.id === guardianId
          ? {
              ...g,
              status: 'verified' as const,
              verified: true,
              verifiedBy: verifierStamp,
              verifiedAt: todayDate,
              queryReason: undefined
            }
          : g
      );

      const updatedProfile: StudentProfile = {
        ...targetStudent,
        parents: {
          ...targetStudent.parents,
          authorizedGuardians: updatedGuardians
        }
      };

      onUpdateProfile?.(updatedProfile);
      setSuccessBanner(`✓ Stamped ${targetGuardian.name} as Verified by School!`);
      setTimeout(() => setSuccessBanner(null), 3500);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Verify Pickup Escort: ${targetGuardian.name} for ${targetStudent.student.name}`,
        auditStampMessage: `Escort verification in ${activeSectionName} will be recorded and stamped as: Verified by ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doStamp,
      });
    } else {
      doStamp();
    }
  };

  const handleSendQueryToParent = (guardianId: string) => {
    if (!queryText.trim()) return;
    const targetStudent = activeProfile;
    const targetGuardian = targetStudent.parents.authorizedGuardians?.find(g => g.id === guardianId);
    if (!targetGuardian) return;

    const queryMessage = queryText.trim();

    const updatedGuardians = (targetStudent.parents.authorizedGuardians || []).map(g =>
      g.id === guardianId
        ? {
            ...g,
            status: 'query_raised' as const,
            queryReason: queryMessage
          }
        : g
    );

    const updatedProfile: StudentProfile = {
      ...targetStudent,
      parents: {
        ...targetStudent.parents,
        authorizedGuardians: updatedGuardians
      }
    };

    onUpdateProfile?.(updatedProfile);

    // Dispatch feedback notification note directly to parent
    if (onSendFeedback) {
      onSendFeedback({
        id: `fb-${Date.now()}`,
        recipient: 'Parent',
        senderRole: 'teacher',
        senderName: 'Ms. Ananya (Class Teacher)',
        category: 'General',
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        title: `Escort Inquiry: ${targetGuardian.name} (${targetStudent.student.name})`,
        message: `Regarding authorized pickup escort "${targetGuardian.name}" (${targetGuardian.relation}): ${queryMessage}. Please review in your student profile or contact school office if urgent.`,
        requiresAcknowledgement: true,
        acknowledged: false
      });
    }

    setQueryingGuardianId(null);
    setQueryText('');
    setSuccessBanner(`Inquiry dispatched to parent via Feedback Desk & escort flagged.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold">
              {isTeacher ? <Users className="w-5 h-5" strokeWidth={1.75} /> : <IdCard className="w-5 h-5" strokeWidth={1.75} />}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                {isTeacher ? `${activeSectionName} — Class Roster` : isEditing ? 'Edit Profile & Gate Pass Guardians' : 'Student & Parent Profile'}
              </h2>
              <p className="text-xs text-slate-500">
                {isTeacher
                  ? 'Visual student directory & verified pickup contacts'
                  : isEditing
                  ? 'Update contact info and authorized pickup escorts'
                  : 'Official NAFL Student Record • Visual ID & Gate Pass'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isTeacher && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold p-1 leading-none"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Teacher View: Student Selector Strip */}
        {isTeacher && classRoster.length > 0 && (
          <div className="space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search student by name or roll number..."
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setSelectedStudentIndex(0);
                }}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50/50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" strokeWidth={1.75} />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
              {filteredRoster.map((item, idx) => {
                const isSelected = selectedStudentIndex === idx;
                const hasPendingEscort = item.parents.authorizedGuardians?.some(g => g.status === 'parent_declared');
                return (
                  <button
                    key={item.student.admissionNumber}
                    onClick={() => {
                      setSelectedStudentIndex(idx);
                      setQueryingGuardianId(null);
                      setQueryText('');
                    }}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.student.photo ? (
                      <img src={item.student.photo} alt={item.student.name} className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <span>#{item.student.rollNumber}</span>
                    )}
                    <span>{item.student.name}</span>
                    {hasPendingEscort && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="1 new escort awaiting teacher verification stamp" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EDIT MODE FORM FOR PARENTS */}
        {isEditing ? (
          <div className="space-y-5 animate-fade-in text-xs">
            {/* Student Photo Picker */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 text-xs block">1. Student Visual ID Photo</span>
              <div className="flex items-center gap-4">
                <img
                  src={editFormData.student.photo || AVATAR_STUDENT_BOY}
                  alt={student.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm shrink-0 bg-white"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Real Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, url => setEditFormData(prev => ({ ...prev, student: { ...prev.student, photo: url } })));
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, student: { ...prev.student, photo: AVATAR_STUDENT_BOY } }))}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                        editFormData.student.photo === AVATAR_STUDENT_BOY
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👦 Boy Avatar
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData(prev => ({ ...prev, student: { ...prev.student, photo: AVATAR_STUDENT_GIRL } }))}
                      className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                        editFormData.student.photo === AVATAR_STUDENT_GIRL
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      👧 Girl Avatar
                    </button>
                  </div>
                  <span className="text-[10.5px] text-slate-500 block">
                    Upload camera portrait or select graphic outline avatar.
                  </span>
                </div>
              </div>
            </div>

            {/* Parent Contacts Edit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Father */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 block">Father Details</span>
                  <label className="cursor-pointer text-[10.5px] text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors">
                    <Upload className="w-3 h-3 text-brand-600" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, url => setEditFormData(prev => ({
                          ...prev,
                          parents: { ...prev.parents, father: { ...prev.parents.father, photo: url } }
                        })));
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Mobile Number</label>
                  <input
                    type="text"
                    value={editFormData.parents.father.mobile}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, father: { ...prev.parents.father, mobile: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Email Address</label>
                  <input
                    type="email"
                    value={editFormData.parents.father.email}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, father: { ...prev.parents.father, email: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Occupation</label>
                  <input
                    type="text"
                    value={editFormData.parents.father.occupation}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, father: { ...prev.parents.father, occupation: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>

              {/* Mother */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 block">Mother Details</span>
                  <label className="cursor-pointer text-[10.5px] text-brand-700 hover:text-brand-800 font-bold flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200 transition-colors">
                    <Upload className="w-3 h-3 text-brand-600" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, url => setEditFormData(prev => ({
                          ...prev,
                          parents: { ...prev.parents, mother: { ...prev.parents.mother, photo: url } }
                        })));
                      }}
                    />
                  </label>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Mobile Number</label>
                  <input
                    type="text"
                    value={editFormData.parents.mother.mobile}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, mother: { ...prev.parents.mother, mobile: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Email Address</label>
                  <input
                    type="email"
                    value={editFormData.parents.mother.email}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, mother: { ...prev.parents.mother, email: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-semibold uppercase">Occupation</label>
                  <input
                    type="text"
                    value={editFormData.parents.mother.occupation}
                    onChange={e => setEditFormData(prev => ({
                      ...prev,
                      parents: { ...prev.parents, mother: { ...prev.parents.mother, occupation: e.target.value } }
                    }))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 block">Emergency Contact</span>
                  <label className="cursor-pointer text-[10.5px] text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 bg-amber-100/70 px-2 py-0.5 rounded-lg border border-amber-300 transition-colors">
                    <Upload className="w-3 h-3 text-amber-700" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, url => setEditFormData(prev => ({
                          ...prev,
                          parents: { ...prev.parents, emergencyContact: { ...prev.parents.emergencyContact, photo: url } }
                        })));
                      }}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={editFormData.parents.emergencyContact.name}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    parents: { ...prev.parents, emergencyContact: { ...prev.parents.emergencyContact, name: e.target.value } }
                  }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Relation (e.g. Grandmother)"
                  value={editFormData.parents.emergencyContact.relation}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    parents: { ...prev.parents, emergencyContact: { ...prev.parents.emergencyContact, relation: e.target.value } }
                  }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={editFormData.parents.emergencyContact.mobile}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    parents: { ...prev.parents, emergencyContact: { ...prev.parents.emergencyContact, mobile: e.target.value } }
                  }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 block">Residential Address & Transport</span>
                <textarea
                  rows={2}
                  value={editFormData.parents.residentialAddress}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    parents: { ...prev.parents, residentialAddress: e.target.value }
                  }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                />
                <input
                  type="text"
                  placeholder="Bus Stop Name"
                  value={editFormData.parents.busStopName || ''}
                  onChange={e => setEditFormData(prev => ({
                    ...prev,
                    parents: { ...prev.parents, busStopName: e.target.value }
                  }))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Authorized Gate Pass Guardians Management */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-950 text-xs block">
                    Authorized Pickup Escorts & Gate Pass
                  </span>
                  <span className="text-[11px] text-emerald-800">
                    Individuals officially authorized to collect the child from school gates.
                  </span>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>

              {/* List of current guardians */}
              <div className="space-y-2">
                {(editFormData.parents.authorizedGuardians || []).map(g => (
                  <div key={g.id} className="p-2.5 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <img src={g.photo} alt={g.name} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{g.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 font-semibold text-slate-600">{g.relation}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 block">{g.mobile} • {g.authorizationType}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveGuardian(g.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove guardian"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Guardian Sub-Form */}
              <div className="p-3 bg-white/90 rounded-xl border border-emerald-300 space-y-2.5 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 block">
                  + Add New Authorized Pickup Person
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Ramesh Kumar)"
                    value={newGuardianName}
                    onChange={e => setNewGuardianName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Uncle / Driver / Nanny)"
                    value={newGuardianRelation}
                    onChange={e => setNewGuardianRelation(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Phone (+91 ...)"
                    value={newGuardianMobile}
                    onChange={e => setNewGuardianMobile(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  />
                  <select
                    value={newGuardianType}
                    onChange={e => setNewGuardianType(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Pickup & Drop">Pickup & Drop Authorized</option>
                    <option value="Pickup Only">Pickup Only (Afternoon Dismissal)</option>
                  </select>
                </div>

                {/* Photo Upload & Personality Outline Avatar Picker for New Guardian */}
                <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={newGuardianPhoto}
                        alt="Preview"
                        className="w-10 h-10 rounded-xl object-cover border border-emerald-300 bg-white shadow-2xs shrink-0"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-emerald-950 block">Escort Visual ID Photo</span>
                        <span className="text-[10px] text-slate-500">Upload a real camera photo or select personality avatar</span>
                      </div>
                    </div>

                    <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Real Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, url => setNewGuardianPhoto(url));
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block mb-1">Or choose graphic outline avatar:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {GUARDIAN_AVATAR_PRESETS.map(preset => (
                        <button
                          type="button"
                          key={preset.label}
                          onClick={() => {
                            setNewGuardianPhoto(preset.url);
                            if (!newGuardianRelation || newGuardianRelation === 'Grandfather') {
                              setNewGuardianRelation(preset.role);
                            }
                          }}
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition-all ${
                            newGuardianPhoto === preset.url
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddGuardian}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Gate Pass List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setEditFormData(profile);
                  setIsEditing(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Update Profile</span>
              </button>
            </div>
          </div>
        ) : (
          /* VIEW MODE WITH VISUAL ID PHOTOS & GATE PASS GUARDIANS */
          <div className="space-y-5 animate-fade-in text-xs">
            {/* Student Visual ID Card */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 relative z-10">
                <button
                  type="button"
                  onClick={() => setEnlargedPhoto({
                    url: student.photo || AVATAR_STUDENT_BOY,
                    name: student.name,
                    role: `${student.grade} • ${student.section}`,
                    badge: `Roll #${student.rollNumber}`,
                    gatePassId: student.admissionNumber
                  })}
                  className="relative shrink-0 group focus:outline-none cursor-pointer self-start sm:self-center"
                  title="Click to view enlarged photo"
                >
                  <img
                    src={student.photo || AVATAR_STUDENT_BOY}
                    alt={student.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/50 shadow-md bg-white/20 group-hover:ring-2 group-hover:ring-white transition-all"
                  />
                  <div className="absolute inset-0 bg-black/25 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    Verified ID
                  </span>
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">{student.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur">
                      Roll #{student.rollNumber}
                    </span>
                  </div>
                  <p className="text-xs text-brand-100 font-medium">
                    {student.grade} • {student.section} • {student.academicYear}
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap text-[11px]">
                    <span className="font-mono bg-black/20 px-2 py-0.5 rounded text-white/90">
                      Adm: {student.admissionNumber}
                    </span>
                    <span className="bg-rose-500/80 px-2 py-0.5 rounded text-white font-bold">
                      {student.bloodGroup}
                    </span>
                    <span className="bg-emerald-500/80 px-2 py-0.5 rounded text-white font-semibold">
                      {student.house}
                    </span>
                    <span className="text-brand-200">
                      DOB: {student.dob}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parents Visual ID Contacts */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                <Briefcase className="w-4 h-4 text-brand-600" />
                <span>Parents & Legal Guardians</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Father */}
                <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setEnlargedPhoto({
                      url: parents.father.photo || AVATAR_FATHER,
                      name: parents.father.name,
                      role: 'Father & Legal Guardian',
                      badge: parents.father.occupation
                    })}
                    className="relative shrink-0 group focus:outline-none cursor-pointer"
                    title="Click to view enlarged photo"
                  >
                    <img
                      src={parents.father.photo || AVATAR_FATHER}
                      alt={parents.father.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-2xs group-hover:ring-2 group-hover:ring-brand-400 transition-all bg-white"
                    />
                    <div className="absolute inset-0 bg-black/25 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs truncate block">{parents.father.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold shrink-0">Father</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{parents.father.occupation}</p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                      <a href={`tel:${parents.father.mobile}`} className="flex items-center gap-1 text-slate-700 hover:text-brand-600 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" /> {parents.father.mobile}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mother */}
                <div className="p-3 rounded-2xl border border-slate-200 bg-white flex items-center gap-3 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setEnlargedPhoto({
                      url: parents.mother.photo || AVATAR_MOTHER,
                      name: parents.mother.name,
                      role: 'Mother & Legal Guardian',
                      badge: parents.mother.occupation
                    })}
                    className="relative shrink-0 group focus:outline-none cursor-pointer"
                    title="Click to view enlarged photo"
                  >
                    <img
                      src={parents.mother.photo || AVATAR_MOTHER}
                      alt={parents.mother.name}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-100 shadow-2xs group-hover:ring-2 group-hover:ring-brand-400 transition-all bg-white"
                    />
                    <div className="absolute inset-0 bg-black/25 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 text-xs truncate block">{parents.mother.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold shrink-0">Mother</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{parents.mother.occupation}</p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                      <a href={`tel:${parents.mother.mobile}`} className="flex items-center gap-1 text-slate-700 hover:text-brand-600 font-medium">
                        <Phone className="w-3 h-3 text-slate-400" /> {parents.mother.mobile}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AUTHORIZED PICKUP GUARDIANS & GATE PASS (OPTION B: HYBRID 2-TIER GOVERNANCE) */}
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-emerald-950 text-xs">
                    Authorized Pickup & Drop Escorts (Gate Pass Active)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {parents.authorizedGuardians?.some(g => g.status === 'parent_declared') && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 animate-pulse">
                      Action Needed
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {(parents.authorizedGuardians || []).length} Authorized
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-800 leading-relaxed">
                For child safety, NAFL releases students only to parents or verified escorts below. Tap any photo to enlarge.
              </p>

              {/* Teacher Alert Notice if escorts are awaiting verification stamp */}
              {isTeacher && parents.authorizedGuardians?.some(g => g.status === 'parent_declared') && (
                <div className="p-2.5 bg-amber-100/80 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="text-[11px] font-medium">
                      Escort declared by parent (active for 12:30 PM pickup). Awaiting teacher verification stamp.
                    </span>
                  </div>
                </div>
              )}

              {/* Compact 2-Column Grid as preferred by user */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(parents.authorizedGuardians && parents.authorizedGuardians.length > 0) ? (
                  parents.authorizedGuardians.map(guardian => {
                    const isVerified = guardian.status === 'verified';
                    const isQueryRaised = guardian.status === 'query_raised';
                    const isParentDeclared = guardian.status === 'parent_declared' || (!isVerified && !isQueryRaised);

                    return (
                      <div
                        key={guardian.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isQueryRaised
                            ? 'bg-rose-50/80 border-rose-200 shadow-2xs'
                            : isParentDeclared
                            ? 'bg-amber-50/60 border-amber-200/90 shadow-2xs'
                            : 'bg-white border-emerald-200/80 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Reasonably sized clickable avatar with lightbox popup */}
                          <button
                            type="button"
                            onClick={() => setEnlargedPhoto({
                              url: guardian.photo,
                              name: guardian.name,
                              role: `${guardian.relation} • ${guardian.authorizationType}`,
                              badge: isVerified ? 'Verified by School' : isQueryRaised ? 'Teacher Query' : 'Parent Declared',
                              gatePassId: guardian.gatePassId
                            })}
                            className="relative shrink-0 group focus:outline-none cursor-pointer"
                            title="Click to view enlarged photo"
                          >
                            <img
                              src={guardian.photo}
                              alt={guardian.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:ring-2 group-hover:ring-brand-400 transition-all bg-white"
                            />
                            <div className="absolute inset-0 bg-black/25 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ZoomIn className="w-3.5 h-3.5 text-white" />
                            </div>
                            {isVerified ? (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-white shadow-2xs" title="Verified by School">
                                <ShieldCheck className="w-2.5 h-2.5" />
                              </span>
                            ) : isQueryRaised ? (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-rose-500 text-white shadow-2xs" title="Query Raised by Teacher">
                                <AlertCircle className="w-2.5 h-2.5" />
                              </span>
                            ) : (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-amber-500 text-white shadow-2xs" title="Parent Declared">
                                <Clock className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </button>

                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-slate-900 text-xs truncate block">{guardian.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold shrink-0">
                                {guardian.relation}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <a href={`tel:${guardian.mobile}`} className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-medium truncate">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" /> {guardian.mobile}
                              </a>
                            </div>

                            <div className="flex items-center justify-between gap-1 text-[9.5px] pt-0.5">
                              <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-600 truncate">
                                {guardian.gatePassId}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded font-bold ${
                                guardian.authorizationType === 'Pickup & Drop'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}>
                                {guardian.authorizationType}
                              </span>
                            </div>

                            {/* Status Line */}
                            {isVerified && (
                              <div className="pt-0.5 flex items-center gap-1 text-[9.5px] text-emerald-700 font-semibold truncate">
                                <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Verified by School</span>
                              </div>
                            )}
                            {isParentDeclared && (
                              <div className="pt-0.5 flex items-center gap-1 text-[9.5px] text-amber-800 font-semibold truncate">
                                <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                                <span>Parent Declared (Active)</span>
                              </div>
                            )}
                            {isQueryRaised && (
                              <div className="pt-0.5 flex items-center gap-1 text-[9.5px] text-rose-700 font-bold truncate">
                                <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                                <span title={guardian.queryReason}>Query: "{guardian.queryReason}"</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Teacher Control Desk Actions: Acknowledge Stamp or Query Parent */}
                        {isTeacher && (
                          <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-center justify-end gap-1.5 flex-wrap">
                            {!isVerified && (
                              <button
                                type="button"
                                onClick={() => handleAcknowledgeGuardian(guardian.id)}
                                className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9.5px] flex items-center gap-1 shadow-2xs transition-colors"
                              >
                                <Check className="w-2.5 h-2.5" />
                                <span>Acknowledge</span>
                              </button>
                            )}
                            {queryingGuardianId !== guardian.id ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setQueryingGuardianId(guardian.id);
                                  setQueryText(guardian.queryReason || '');
                                }}
                                className="px-2 py-0.5 rounded-lg bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-[9.5px] flex items-center gap-1 shadow-2xs transition-colors"
                              >
                                <MessageSquare className="w-2.5 h-2.5 text-amber-600" />
                                <span>{isQueryRaised ? 'Update Query' : 'Query'}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setQueryingGuardianId(null);
                                  setQueryText('');
                                }}
                                className="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 font-medium text-[9.5px]"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}

                        {/* Inline Query Dialog for Teacher */}
                        {isTeacher && queryingGuardianId === guardian.id && (
                          <div className="mt-2 p-2 bg-amber-50 rounded-xl border border-amber-300 space-y-1.5 animate-fade-in col-span-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9.5px] font-bold text-amber-900 uppercase tracking-wider">
                                Query Parent via Feedback
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setQueryingGuardianId(null);
                                  setQueryText('');
                                }}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {[
                                'Please update with a clear face portrait',
                                'Please confirm Gate 2 protocol',
                                'Escort not recognized'
                              ].map(preset => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setQueryText(preset)}
                                  className="text-[8.5px] px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 font-medium"
                                >
                                  {preset}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={queryText}
                                onChange={e => setQueryText(e.target.value)}
                                placeholder="Reason for query..."
                                className="flex-1 px-2 py-1 rounded-lg border border-amber-200 bg-white text-[10px] focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleSendQueryToParent(guardian.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[9.5px] flex items-center gap-1 shrink-0 shadow-2xs"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Send</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-3 bg-white/80 rounded-xl border border-slate-200 text-slate-500 text-center col-span-2 text-xs italic">
                    No additional guardians added. Only parents authorized.
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact & Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEnlargedPhoto({
                    url: parents.emergencyContact.photo || AVATAR_GRANDMOTHER,
                    name: parents.emergencyContact.name,
                    role: `Emergency Contact (${parents.emergencyContact.relation})`,
                    badge: parents.emergencyContact.mobile
                  })}
                  className="relative shrink-0 group focus:outline-none cursor-pointer"
                  title="Click to view enlarged photo"
                >
                  <img
                    src={parents.emergencyContact.photo || AVATAR_GRANDMOTHER}
                    alt={parents.emergencyContact.name}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-200 shrink-0 group-hover:ring-2 group-hover:ring-amber-400 transition-all bg-white"
                  />
                  <div className="absolute inset-0 bg-black/25 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>Emergency Contact</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                    {parents.emergencyContact.name} ({parents.emergencyContact.relation})
                  </p>
                  <a href={`tel:${parents.emergencyContact.mobile}`} className="text-slate-600 flex items-center gap-1 hover:text-amber-800 text-[11px] font-medium pt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" /> {parents.emergencyContact.mobile}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200/90 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand-100 border border-brand-200 text-brand-700 flex items-center justify-center shrink-0">
                  <Bus className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-brand-950 text-xs block">Transport Details</span>
                  <p className="font-semibold text-slate-900 text-xs mt-0.5 truncate">{parents.transportMode}</p>
                  <p className="text-[11px] text-slate-600 truncate">{parents.busRouteNumber} • {parents.busStopName}</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <span className="font-semibold text-slate-800">Residential Address: </span>
                <span className="text-slate-600">{parents.residentialAddress}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Enlarged Photo Lightbox Modal Popup */}
        {enlargedPhoto && (
          <div
            className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setEnlargedPhoto(null)}
          >
            <div
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-xs w-full shadow-2xl border border-slate-200 space-y-4 animate-scale-in text-center relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setEnlargedPhoto(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-lg font-bold"
              >
                &times;
              </button>

              <div className="pt-2">
                <div className="relative mx-auto w-36 h-36 rounded-2xl overflow-hidden border-2 border-brand-400 shadow-md bg-slate-50 flex items-center justify-center">
                  <img
                    src={enlargedPhoto.url}
                    alt={enlargedPhoto.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-base">{enlargedPhoto.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{enlargedPhoto.role}</p>
                {enlargedPhoto.badge && (
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    {enlargedPhoto.badge}
                  </span>
                )}
                {enlargedPhoto.gatePassId && (
                  <p className="text-[11px] font-mono text-slate-600 pt-1">
                    Pass ID: <span className="font-bold text-slate-900">{enlargedPhoto.gatePassId}</span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setEnlargedPhoto(null)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Close Preview
              </button>
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
    </div>
  );
};
