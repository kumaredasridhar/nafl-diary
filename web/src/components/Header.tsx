import {
  School,
  ShieldCheck,
  MessageSquare,
  FileSpreadsheet,
  LogOut,
  IdCard,
  UserCheck,
  BookOpen,
  Users,
  Briefcase
} from 'lucide-react';
import { UserSession } from './LoginModal';
import { ClassSection } from '../data/mockData';

interface HeaderProps {
  userSession: UserSession | null;
  activeChild: string;
  onOpenProfile: () => void;
  onOpenFeedback: () => void;
  onOpenReference: () => void;
  onLogout: () => void;
  feedbackNotificationCount?: number;
  sections?: ClassSection[];
  activeSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
  isCoveringTeacher?: boolean;
}

export const Header = ({
  userSession,
  activeChild,
  onOpenProfile,
  onOpenFeedback,
  onOpenReference,
  onLogout,
  feedbackNotificationCount = 0,
  sections = [],
  activeSectionId,
  onSelectSection,
  isCoveringTeacher = false,
}: HeaderProps) => {
  const isTeacher = userSession?.role === 'teacher';
  const isAdmin = userSession?.role === 'admin';
  const isPrincipal = userSession?.role === 'principal';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: NAFL Branding (shrink-0 ensures it NEVER gets squeezed or hidden on mobile) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold shrink-0">
            <School className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.75} />
          </div>
          <div className="shrink-0">
            <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg block leading-none">
              NAFL
            </span>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-600 tracking-tight block mt-1 leading-none">
              National Academy For Learning
            </p>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Discrete Action Icons: Feedback, Reference (Fees), Profile */}
          {userSession && (
            <div className="flex items-center gap-0.5 sm:gap-1.5 border-r border-slate-200 pr-1 sm:pr-2.5">
              {/* Feedback Button */}
              <button
                onClick={onOpenFeedback}
                className="relative p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                title={isTeacher ? "Class Communication & Remarks" : "Feedback & Teacher Notes"}
              >
                <MessageSquare className="w-4 h-4" strokeWidth={1.75} />
                {feedbackNotificationCount > 0 && !isTeacher && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                )}
              </button>

              {/* Reference & Fees Button */}
              <button
                onClick={onOpenReference}
                className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                title={isTeacher ? "Teacher Academic Reference & Guidelines" : "Fee Records & School Guidelines"}
              >
                {isTeacher ? (
                  <BookOpen className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <FileSpreadsheet className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>

              {/* Student Profile / Class Roster Button */}
              <button
                onClick={onOpenProfile}
                className="p-2 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                title={isTeacher ? "Class Roster & Student Directory" : "Student & Parent Profile"}
              >
                {isTeacher ? (
                  <Users className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <IdCard className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          )}

          {/* User / Student Identity Badge: Full pill on desktop, hidden on tiny mobile to save space */}
          {userSession ? (
            isTeacher ? (
              <div className="flex items-center gap-1.5">
                {sections && sections.length > 0 && (
                  <div className="relative flex items-center gap-1">
                    <select
                      value={activeSectionId}
                      onChange={(e) => onSelectSection?.(e.target.value)}
                      className={`font-bold text-xs py-1.5 px-3 rounded-full cursor-pointer focus:outline-hidden focus:ring-2 transition-colors shadow-2xs ${
                        isCoveringTeacher
                          ? 'bg-amber-200/90 border border-amber-400 text-amber-950 focus:ring-amber-500'
                          : 'bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 text-amber-950 focus:ring-amber-500'
                      }`}
                      title="Switch Active Class Section"
                      aria-label="Switch Active Class Section"
                    >
                      {sections.map(sec => (
                        <option key={sec.id} value={sec.id}>
                          {sec.shortName} ({sec.roomNumber})
                        </option>
                      ))}
                    </select>
                    {isCoveringTeacher && (
                      <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-950 font-bold text-[10.5px] border border-amber-400">
                        Covering
                      </span>
                    )}
                  </div>
                )}
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" strokeWidth={1.75} />
                  <span>{userSession.name} (Teacher)</span>
                </div>
              </div>
            ) : isAdmin ? (
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-indigo-600 shrink-0" strokeWidth={1.75} />
                <span>{userSession.name} (Admin Desk)</span>
              </div>
            ) : isPrincipal ? (
              <div className="flex items-center gap-1.5 bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold">
                <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" strokeWidth={1.75} />
                <span>Principal</span>
              </div>
            ) : (
              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 transition-colors px-3 py-1.5 rounded-full border border-slate-200 text-xs"
                title="Click to view student profile"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">
                  {activeChild}
                </span>
              </button>
            )
          ) : null}

          {/* Logout Button (Only rendered when user is logged in) */}
          {userSession && (
            <button
              onClick={onLogout}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
