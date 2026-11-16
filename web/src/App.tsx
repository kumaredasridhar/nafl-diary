import { useState } from 'react';
import { Header } from './components/Header';
import { CalendarModule } from './components/CalendarModule';
import { CircularsModule } from './components/CircularsModule';
import { MediaGalleryModule } from './components/MediaGalleryModule';
import { RequestsModule } from './components/RequestsModule';
import { AdminConsoleModule } from './components/AdminConsoleModule';
import { TeacherArtefactUploader } from './components/TeacherArtefactUploader';
import { StudentProfileModal } from './components/StudentProfileModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ReferenceModal } from './components/ReferenceModal';
import { LoginModal, UserSession } from './components/LoginModal';
import {
  MOCK_EVENTS,
  MOCK_MONTHLY_OBJECTIVES,
  MOCK_CURRICULUM_BY_MONTH,
  MOCK_CIRCULARS,
  MOCK_MEDIA,
  MOCK_STUDENT_PROFILE,
  MOCK_CLASS_ROSTER,
  MOCK_FEEDBACK,
  MOCK_FEES,
  MOCK_LEAVE_REQUESTS,
  MOCK_PTM_SLOTS,
  MOCK_SECTIONS,
  ClassSection,
  CircularNotice,
  CalendarEvent,
  FeedbackItem,
  LeaveRequest,
  MediaItem,
  MonthlyLearningObjective,
  StudentProfile,
  PtmSlot
} from './data/mockData';
import {
  Calendar,
  BellRing,
  Camera,
  Send,
  School,
  LogIn,
  Building
} from 'lucide-react';

export function App() {
  // Session state: Role is derived directly from active session
  const [userSession, setUserSession] = useState<UserSession | null>({
    role: 'parent',
    name: 'Rajesh Sharma',
    identifier: 'NAFL/2026/M1-042',
    childName: 'Aarav Sharma',
    grade: 'Mont 1A'
  });

  const [activeTab, setActiveTab] = useState<'calendar' | 'circulars' | 'requests' | 'gallery' | 'admin'>('calendar');
  const activeChild = 'Aarav Sharma (Mont 1A)';

  // Modals state (Discrete sections)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploaderInitialType, setUploaderInitialType] = useState<'monthly_plan' | 'circular' | 'photos' | 'video' | 'calendar'>('circular');

  // Dynamic reactive data
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [circulars, setCirculars] = useState<CircularNotice[]>(MOCK_CIRCULARS);
  const [mediaList, setMediaList] = useState<MediaItem[]>(MOCK_MEDIA);
  const [curriculumByMonth, setCurriculumByMonth] = useState<Record<string, MonthlyLearningObjective>>(MOCK_CURRICULUM_BY_MONTH);
  const [monthlyObjectives] = useState(MOCK_MONTHLY_OBJECTIVES);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(MOCK_FEEDBACK);
  const [fees] = useState(MOCK_FEES);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE);
  const [classRoster, setClassRoster] = useState<StudentProfile[]>(MOCK_CLASS_ROSTER);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  const [ptmSlots, setPtmSlots] = useState(MOCK_PTM_SLOTS);
  const [sections, setSections] = useState<ClassSection[]>(MOCK_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>('mont-1a');

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];
  const activeSectionName = currentSection.shortName; // e.g. 'Mont 1A', 'Mont 1B'

  const homeSectionId = userSession?.assignedSectionId || (userSession?.role === 'teacher' ? 'mont-1a' : undefined);
  const isTeacher = userSession?.role === 'teacher';
  const isAdmin = userSession?.role === 'admin';
  const homeSection = sections.find(s => s.id === homeSectionId) || sections[0];
  const teacherGradeTier = homeSection?.gradeTier; // e.g. 'Montessori 1'

  // Restrict switching strictly to the teacher's grade level (e.g. within Mont 1, not across Mont 1 and Mont 2)
  const accessibleSections = isTeacher && teacherGradeTier
    ? sections.filter(s => s.gradeTier === teacherGradeTier)
    : sections;

  const isCoveringTeacher = Boolean(
    isTeacher &&
    homeSectionId &&
    activeSectionId !== homeSectionId
  );

  // Filter roster for the active section (when viewed by teacher)
  const scopedClassRoster = classRoster.filter(s =>
    !s.student.sectionId || s.student.sectionId === activeSectionId
  );

  // Handlers
  const handleUpdateProfile = (updated: StudentProfile) => {
    setStudentProfile(prev =>
      prev.student.admissionNumber === updated.student.admissionNumber ? updated : prev
    );
    setClassRoster(prev =>
      prev.map(item =>
        item.student.admissionNumber === updated.student.admissionNumber ? updated : item
      )
    );
  };
  const handleAcknowledgeCircular = (id: string) => {
    setCirculars(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              acknowledgedByParent: true,
              acknowledgedAt: new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          : c
      )
    );
  };

  const handleAcknowledgeFeedback = (id: string) => {
    setFeedbackList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              acknowledged: true,
              acknowledgedAt: new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          : item
      )
    );
  };

  const handleSendFeedback = (newItem: FeedbackItem) => {
    setFeedbackList(prev => [newItem, ...prev]);
  };

  const handleApplyLeave = (newLeave: LeaveRequest) => {
    setLeaveRequests(prev => [newLeave, ...prev]);
  };

  const handleBookPtmSlot = (slotId: string, previousSlotId?: string) => {
    setPtmSlots(prev =>
      prev.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, status: 'Booked', bookedByStudentId: 'NAFL/2026/M1-042' };
        }
        if (previousSlotId && slot.id === previousSlotId) {
          return { ...slot, status: 'Available', bookedByStudentId: undefined };
        }
        return slot;
      })
    );
  };

  const handleCancelPtmSlot = (slotId: string) => {
    setPtmSlots(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { ...slot, status: 'Available', bookedByStudentId: undefined }
          : slot
      )
    );
  };

  const handleAddPtmSlot = (newSlot: PtmSlot) => {
    setPtmSlots(prev => [...prev, newSlot]);
  };

  const handleUpdatePtmSlot = (slotId: string, updates: Partial<PtmSlot>) => {
    setPtmSlots(prev =>
      prev.map(slot => (slot.id === slotId ? { ...slot, ...updates } : slot))
    );
  };

  const handleDeletePtmSlot = (slotId: string) => {
    setPtmSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const handleAddCircular = (newCirc: CircularNotice) => {
    setCirculars(prev => [newCirc, ...prev]);
  };

  const handleAddEvent = (newEvent: CalendarEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleAddMedia = (newMedia: MediaItem) => {
    setMediaList(prev => [newMedia, ...prev]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMediaList(prev => prev.map(m => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleDeleteCircular = (id: string) => {
    setCirculars(prev => prev.filter(c => c.id !== id));
  };

  const handleAddCurriculum = (monthKey: string, objective: MonthlyLearningObjective) => {
    setCurriculumByMonth(prev => ({
      ...prev,
      [monthKey]: objective
    }));
  };

  const handleApproveLeave = (leaveId: string, remarks?: string) => {
    const reviewerStamp = isCoveringTeacher
      ? `${userSession?.name || 'Ms. Ananya'} (Covering Teacher)`
      : `${userSession?.name || 'Ms. Ananya'} (Class Teacher)`;
    setLeaveRequests(prev =>
      prev.map(item =>
        item.id === leaveId
          ? {
              ...item,
              status: 'Approved',
              reviewedBy: reviewerStamp,
              teacherRemarks: remarks || `Approved by ${reviewerStamp}. Rest well!`
            }
          : item
      )
    );
  };

  const handleRejectLeave = (leaveId: string, remarks?: string) => {
    const reviewerStamp = isCoveringTeacher
      ? `${userSession?.name || 'Ms. Ananya'} (Covering Teacher)`
      : `${userSession?.name || 'Ms. Ananya'} (Class Teacher)`;
    setLeaveRequests(prev =>
      prev.map(item =>
        item.id === leaveId
          ? {
              ...item,
              status: 'Rejected',
              reviewedBy: reviewerStamp,
              teacherRemarks: remarks || `Kindly meet ${reviewerStamp} at drop-off.`
            }
          : item
      )
    );
  };

  const handleOpenUploader = (type: 'monthly_plan' | 'circular' | 'photos' | 'video' | 'calendar' = 'circular') => {
    setUploaderInitialType(type);
    setIsUploaderOpen(true);
  };

  const handleLogin = (session: UserSession) => {
    setUserSession(session);
    if (session.assignedSectionId) {
      setActiveSectionId(session.assignedSectionId);
    } else {
      setActiveSectionId('mont-1a');
    }
    if (session.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('calendar');
    }
    setIsLoginOpen(false);
  };

  const handleAddStudent = (newStudent: StudentProfile) => {
    setClassRoster(prev => [newStudent, ...prev]);
  };

  const handleLogout = () => {
    setUserSession(null);
  };

  const handleSelectSection = (newSectionId: string) => {
    const target = sections.find(s => s.id === newSectionId);
    if (isTeacher && teacherGradeTier && target && target.gradeTier !== teacherGradeTier) {
      return; // Restrict cross-grade switching (e.g. between Mont 1 and Mont 2)
    }
    setActiveSectionId(newSectionId);
  };

  const pendingCircularsCount = circulars.filter(c => c.requiresAcknowledgement && !c.acknowledgedByParent).length;
  const pendingFeedbackCount = feedbackList.filter(f => f.requiresAcknowledgement && !f.acknowledged && f.recipient === 'Parent').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 sm:pb-12">
      {/* Top Header with clean NAFL branding & discrete tools */}
      <Header
        userSession={userSession}
        activeChild={activeChild}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
        onOpenReference={() => setIsReferenceOpen(true)}
        onLogout={handleLogout}
        feedbackNotificationCount={pendingFeedbackCount}
        sections={accessibleSections}
        activeSectionId={activeSectionId}
        onSelectSection={handleSelectSection}
        isCoveringTeacher={isCoveringTeacher}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {!userSession ? (
          /* Clean Logged Out View: Zero tabs, zero private data exposed */
          <div className="max-w-md mx-auto my-8 sm:my-14 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold mx-auto shadow-xs">
              <School className="w-8 h-8" strokeWidth={1.75} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                National Academy For Learning
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Sign in to view your child's academic calendar, monthly curriculum plans, circulars, leave requests, and media gallery.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <LogIn className="w-4 h-4" strokeWidth={1.75} />
                <span>Sign In to School Portal</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">Or Instant 1-Tap Sign-In</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleLogin({
                    role: 'parent',
                    name: 'Rajesh Sharma',
                    identifier: 'NAFL/2026/M1-042',
                    childName: 'Aarav Sharma',
                    grade: 'Mont 1A',
                    assignedSectionId: 'mont-1a'
                  })}
                  className="p-3 bg-brand-50/60 hover:bg-brand-100/60 border border-brand-200 rounded-2xl text-left transition-colors"
                >
                  <span className="font-bold text-slate-900 block">👨‍👩‍👧 Parent</span>
                  <span className="text-[10px] text-slate-500 block truncate">Aarav (Mont 1A)</span>
                </button>

                <button
                  onClick={() => handleLogin({
                    role: 'teacher',
                    name: 'Ms. Ananya',
                    identifier: 'ananya@nafl.in',
                    grade: 'Mont 1',
                    assignedSectionId: 'mont-1a'
                  })}
                  className="p-3 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200 rounded-2xl text-left transition-colors"
                >
                  <span className="font-bold text-slate-900 block">👩‍🏫 Teacher</span>
                  <span className="text-[10px] text-slate-500 block truncate">Ms. Ananya (Mont 1)</span>
                </button>

                <button
                  onClick={() => handleLogin({
                    role: 'admin',
                    name: 'Mr. Sundaram',
                    identifier: 'registrar@nafl.in',
                    department: 'Registrar & Admissions Desk'
                  })}
                  className="p-3 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200 rounded-2xl text-left transition-colors"
                >
                  <span className="font-bold text-indigo-950 block">👨‍💼 Admin Office</span>
                  <span className="text-[10px] text-indigo-700 block truncate">Mr. Sundaram (Registrar)</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Need assistance? Contact the NAFL administrative desk at <span className="text-slate-600 font-medium">office@nafl.in</span>
            </p>
          </div>
        ) : (
          <div>
            {/* Teacher Overview & Governance Bar */}
            {isTeacher && (
              <div className="mb-4 p-3 sm:px-4 sm:py-2.5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs animate-fade-in shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Class Section:</span>
                  </span>
                  <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-xl px-2.5 py-1">
                    <span className="font-bold text-slate-900">{currentSection.name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-mono">{currentSection.roomNumber}</span>
                  </div>
                  <span className="text-amber-800 hidden md:inline">
                    Teacher: <span className="font-semibold">{currentSection.primaryTeacher.name}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-bold text-[11px]">
                    {scopedClassRoster.length} Students Active
                  </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {isCoveringTeacher ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-950 font-bold text-[11px] shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Covering Teacher Mode (Primary: {currentSection.primaryTeacher.name})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100/90 text-emerald-900 font-bold text-[11px] border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>Home Section (Your Class)</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Desktop Navigation Tabs - Consolidated Tabs */}
            <div className="hidden sm:flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto text-sm font-semibold">
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeTab === 'admin'
                      ? 'bg-indigo-950 text-white shadow-xs'
                      : 'text-indigo-950 hover:bg-indigo-100/60 border border-indigo-200 bg-indigo-50/70'
                  }`}
                >
                  <Building className="w-4 h-4 text-indigo-400" strokeWidth={1.75} />
                  <span>Admin Desk</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" strokeWidth={1.75} />
                <span>Calendar & Plan</span>
              </button>

              <button
                onClick={() => setActiveTab('circulars')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative ${
                  activeTab === 'circulars'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BellRing className="w-4 h-4" strokeWidth={1.75} />
                <span>Circulars</span>
                {pendingCircularsCount > 0 && !isTeacher && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === 'circulars' ? 'bg-amber-400 text-slate-950' : 'bg-amber-500 text-white'
                  }`}>
                    {pendingCircularsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'requests'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Send className="w-4 h-4" strokeWidth={1.75} />
                <span>Requests & Leave</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Camera className="w-4 h-4" strokeWidth={1.75} />
                <span>Media & Gallery</span>
              </button>
            </div>

            {/* Active Content Module */}
            {activeTab === 'calendar' && (
              <CalendarModule
                events={events}
                curriculum={monthlyObjectives}
                curriculumByMonth={curriculumByMonth}
                userRole={isTeacher ? 'teacher' : 'parent'}
                onOpenUploader={handleOpenUploader}
                activeSectionName={activeSectionName}
              />
            )}
            {activeTab === 'circulars' && (
              <CircularsModule
                circulars={circulars}
                onAcknowledge={handleAcknowledgeCircular}
                onDeleteCircular={handleDeleteCircular}
                userRole={isTeacher ? 'teacher' : 'parent'}
                onOpenUploader={handleOpenUploader}
                activeSectionName={activeSectionName}
                activeSectionId={activeSectionId}
                isCoveringTeacher={isCoveringTeacher}
                coveringTeacherName={userSession?.name || 'Ms. Ananya'}
              />
            )}
            {activeTab === 'requests' && (
              <RequestsModule
                leaveRequests={leaveRequests}
                onApplyLeave={handleApplyLeave}
                ptmSlots={ptmSlots}
                onBookPtmSlot={handleBookPtmSlot}
                onCancelPtmSlot={handleCancelPtmSlot}
                onApproveLeave={handleApproveLeave}
                onRejectLeave={handleRejectLeave}
                onAddPtmSlot={handleAddPtmSlot}
                onUpdatePtmSlot={handleUpdatePtmSlot}
                onDeletePtmSlot={handleDeletePtmSlot}
                userRole={isTeacher ? 'teacher' : 'parent'}
                activeSectionName={activeSectionName}
                activeSectionId={activeSectionId}
                isCoveringTeacher={isCoveringTeacher}
                coveringTeacherName={userSession?.name || 'Ms. Ananya'}
              />
            )}
            {activeTab === 'gallery' && (
              <MediaGalleryModule
                media={mediaList}
                userRole={isTeacher ? 'teacher' : 'parent'}
                onOpenUploader={handleOpenUploader}
                activeSectionName={activeSectionName}
                activeSectionId={activeSectionId}
                onDeleteMedia={handleDeleteMedia}
                onUpdateMedia={handleUpdateMedia}
                isCoveringTeacher={isCoveringTeacher}
                coveringTeacherName={userSession?.name || 'Ms. Ananya'}
              />
            )}
            {activeTab === 'admin' && (
              <AdminConsoleModule
                sections={sections}
                onUpdateSections={setSections}
                classRoster={classRoster}
                onUpdateClassRoster={setClassRoster}
                onAddStudent={handleAddStudent}
                circulars={circulars}
                onAddCircular={handleAddCircular}
                fees={fees}
                activeSectionName={activeSectionName}
                activeSectionId={activeSectionId}
                onSelectSection={handleSelectSection}
              />
            )}
          </div>
        )}
      </main>

      {/* Discrete Modals */}
      <TeacherArtefactUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        initialType={uploaderInitialType}
        onAddCircular={handleAddCircular}
        onAddEvent={handleAddEvent}
        onAddMedia={handleAddMedia}
        onAddCurriculum={handleAddCurriculum}
        activeSectionName={activeSectionName}
        isCoveringTeacher={isCoveringTeacher}
        coveringTeacherName={userSession?.name || 'Ms. Ananya'}
      />
      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={studentProfile}
        onUpdateProfile={handleUpdateProfile}
        onSendFeedback={handleSendFeedback}
        userRole={userSession?.role || 'parent'}
        classRoster={scopedClassRoster}
        isCoveringTeacher={isCoveringTeacher}
        coveringTeacherName={userSession?.name || 'Ms. Ananya'}
        activeSectionName={activeSectionName}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        feedbackList={feedbackList}
        onAcknowledgeFeedback={handleAcknowledgeFeedback}
        onSendFeedback={handleSendFeedback}
        userRole={userSession?.role || 'parent'}
      />

      <ReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
        fees={fees}
        userRole={userSession?.role || 'parent'}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {/* Mobile-First Bottom Navigation Bar: Clean 4/5 Tabs */}
      {userSession && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 shadow-lg animate-fade-in">
          <div className={`grid ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'} gap-1 text-center`}>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                  activeTab === 'admin' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium'
                }`}
              >
                <Building className="w-5 h-5 mb-0.5" strokeWidth={1.75} />
                <span className="text-[10px] leading-tight">Admin</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                activeTab === 'calendar' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" strokeWidth={1.75} />
              <span className="text-[10px] leading-tight">Calendar</span>
            </button>

            <button
              onClick={() => setActiveTab('circulars')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors relative ${
                activeTab === 'circulars' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <div className="relative">
                <BellRing className="w-5 h-5 mb-0.5" strokeWidth={1.75} />
                {pendingCircularsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </div>
              <span className="text-[10px] leading-tight">Circulars</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                activeTab === 'requests' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Send className="w-5 h-5 mb-0.5" strokeWidth={1.75} />
              <span className="text-[10px] leading-tight">Requests</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-colors ${
                activeTab === 'gallery' ? 'text-brand-600 font-bold' : 'text-slate-500 font-medium'
              }`}
            >
              <Camera className="w-5 h-5 mb-0.5" strokeWidth={1.75} />
              <span className="text-[10px] leading-tight">Gallery</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default App;
