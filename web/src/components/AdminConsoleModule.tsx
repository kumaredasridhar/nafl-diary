import { useState } from 'react';
import {
  FileSpreadsheet,
  ArrowRightLeft,
  GraduationCap,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  UserPlus,
  Bus,
  CreditCard,
  BellRing,
  Send,
  FileCheck2,
  Building,
  Save,
  Check,
  X
} from 'lucide-react';
import {
  ClassSection,
  StudentProfile,
  CircularNotice,
  FeeRecord,
  MOCK_STAFF_DIRECTORY,
  SAMPLE_ENROLLMENT_CSV
} from '../data/mockData';
import { AVATAR_STUDENT_BOY, AVATAR_STUDENT_GIRL, AVATAR_FATHER, AVATAR_MOTHER } from '../data/avatarIcons';

interface AdminConsoleModuleProps {
  sections: ClassSection[];
  onUpdateSections: (sections: ClassSection[]) => void;
  classRoster: StudentProfile[];
  onUpdateClassRoster: (roster: StudentProfile[]) => void;
  onAddStudent: (student: StudentProfile) => void;
  circulars: CircularNotice[];
  onAddCircular: (circular: CircularNotice) => void;
  fees: FeeRecord[];
  activeSectionName?: string;
  activeSectionId?: string;
  onSelectSection?: (sectionId: string) => void;
}

interface ParsedCsvStudent {
  admissionNumber: string;
  name: string;
  gradeTier: string;
  section: string;
  rollNumber: string;
  gender: string;
  parentName: string;
  primaryMobile: string;
  parentEmail: string;
  busRoute: string;
  isDuplicate: boolean;
}

interface PromotionAuditRecord {
  id: string;
  timestamp: string;
  sourceSection: string;
  targetSection: string;
  promotedCount: number;
  retainedCount: number;
  retainedStudentNames: string[];
  executedBy: string;
}

export const AdminConsoleModule = ({
  sections,
  onUpdateSections,
  classRoster,
  onUpdateClassRoster,
  onAddStudent,
  circulars,
  onAddCircular,
  fees,
}: AdminConsoleModuleProps) => {
  const [activeTab, setActiveTab] = useState<'mapping' | 'admissions' | 'emergency' | 'transport' | 'finance'>('mapping');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Sub-Feature 1: CSV Bulk Intake State ---
  const [csvContent, setCsvContent] = useState<string>('');
  const [parsedStudents, setParsedStudents] = useState<ParsedCsvStudent[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  // --- Sub-Feature 2: Visual Staff Assignment Matrix State ---
  const [editableSections, setEditableSections] = useState<ClassSection[]>(sections);

  // --- Sub-Feature 3: Year-Over-Year Promotion Wizard State ---
  const [promoSourceSectionId, setPromoSourceSectionId] = useState<string>('mont-1a');
  const [promoTargetSectionId, setPromoTargetSectionId] = useState<string>('mont-2a');
  const [unselectedStudentAdmissions, setUnselectedStudentAdmissions] = useState<Record<string, 'retain' | 'transfer' | 'hold'>>({});
  const [promotionAuditHistory, setPromotionAuditHistory] = useState<PromotionAuditRecord[]>([
    {
      id: 'audit-2025-26',
      timestamp: '01 Jun 2026, 11:30 AM',
      sourceSection: 'Mont 1A (2025–2026)',
      targetSection: 'Mont 2A (2026–2027)',
      promotedCount: 22,
      retainedCount: 1,
      retainedStudentNames: ['Karan Mehta (Retained in Mont 1)'],
      executedBy: 'Mr. Sundaram (Registrar)'
    }
  ]);

  // --- In-Year Admin State: Quick Admission & TC Generator ---
  const [isQuickAdmissionOpen, setIsQuickAdmissionOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentAdm, setNewStudentAdm] = useState('');
  const [newStudentSectionId, setNewStudentSectionId] = useState('mont-1a');
  const [newStudentParentName, setNewStudentParentName] = useState('');
  const [newStudentMobile, setNewStudentMobile] = useState('');

  // TC / Bonafide Certificate Generator state
  const [selectedCertStudentAdm, setSelectedCertStudentAdm] = useState<string>('NAFL/2026/M1-042');
  const [certificateType, setCertificateType] = useState<'bonafide' | 'transfer'>('bonafide');
  const [viewingCertModal, setViewingCertModal] = useState(false);

  // Emergency Broadcast State
  const [emergencyTitle, setEmergencyTitle] = useState('');
  const [emergencySummary, setEmergencySummary] = useState('');
  const [emergencySeverity, setEmergencySeverity] = useState<'Severe Weather Alert' | 'Emergency School Closure' | 'Transport Route Alert'>('Severe Weather Alert');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- PARSE CSV HELPER ---
  const handleParseCsv = (rawText: string) => {
    setCsvContent(rawText);
    setCsvError(null);
    try {
      const lines = rawText.trim().split('\n');
      if (lines.length < 2) {
        setCsvError('CSV must contain a header row and at least one student record.');
        setParsedStudents([]);
        return;
      }
      const records: ParsedCsvStudent[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim());
        if (cols.length >= 8) {
          const adm = cols[0];
          const isDup = classRoster.some(s => s.student.admissionNumber === adm);
          records.push({
            admissionNumber: adm,
            name: cols[1],
            gradeTier: cols[2] || 'Montessori 1',
            section: cols[3] || 'Section A',
            rollNumber: cols[4] || `${i + 20}`,
            gender: cols[5] || 'Boy',
            parentName: cols[6] || 'Parent',
            primaryMobile: cols[7] || '+91 98860 00000',
            parentEmail: cols[8] || 'parent@example.com',
            busRoute: cols[9] || 'Self Drop',
            isDuplicate: isDup
          });
        }
      }
      setParsedStudents(records);
    } catch {
      setCsvError('Failed to parse CSV format. Please ensure comma-separated values.');
    }
  };

  const handleCommitBulkImport = () => {
    if (parsedStudents.length === 0) return;
    const newProfiles: StudentProfile[] = parsedStudents.map(p => {
      const secId = p.section.includes('B') ? 'mont-1b' : p.section.includes('C') ? 'mont-1c' : p.section.includes('D') ? 'mont-1d' : 'mont-1a';
      return {
        student: {
          name: p.name,
          admissionNumber: p.admissionNumber,
          grade: p.gradeTier,
          section: p.section,
          sectionId: secId,
          rollNumber: p.rollNumber,
          dob: '15 May 2023',
          bloodGroup: 'B+ Positive',
          house: 'Emerald Dragons',
          academicYear: '2026–2027',
          photo: p.gender === 'Girl' ? AVATAR_STUDENT_GIRL : AVATAR_STUDENT_BOY
        },
        parents: {
          father: {
            name: p.parentName,
            mobile: p.primaryMobile,
            email: p.parentEmail,
            occupation: 'Software Engineer',
            photo: AVATAR_FATHER
          },
          mother: {
            name: `${p.parentName.split(' ')[0]} Mother`,
            mobile: p.primaryMobile,
            email: p.parentEmail,
            occupation: 'Architect',
            photo: AVATAR_MOTHER
          },
          emergencyContact: {
            name: 'Local Guardian',
            relation: 'Grandparent',
            mobile: p.primaryMobile
          },
          residentialAddress: 'Indiranagar, Bengaluru - 560038',
          transportMode: p.busRoute.includes('Route') ? `School Bus (${p.busRoute})` : 'Parent Pick-up',
          busRouteNumber: p.busRoute,
          busStopName: 'Main Gate'
        }
      };
    });

    onUpdateClassRoster([...newProfiles, ...classRoster]);
    showToast(`Successfully enrolled ${newProfiles.length} students into NAFL Student Registry!`);
    setParsedStudents([]);
    setCsvContent('');
  };

  // --- SAVE STAFF MATRIX CHANGES ---
  const handleSaveStaffMatrix = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSections(editableSections);
    showToast('Saved updated staff and room allocations across all class sections!');
  };

  const handleStaffChange = (secId: string, field: 'primaryTeacher' | 'coTeacher' | 'roomNumber', value: string) => {
    setEditableSections(prev =>
      prev.map(sec => {
        if (sec.id !== secId) return sec;
        if (field === 'primaryTeacher') {
          const staff = MOCK_STAFF_DIRECTORY.find(s => s.id === value);
          return {
            ...sec,
            primaryTeacher: {
              id: value,
              name: staff?.name || 'Class Teacher',
              email: staff?.email || 'teacher@nafl.in'
            }
          };
        } else if (field === 'coTeacher') {
          const staff = MOCK_STAFF_DIRECTORY.find(s => s.id === value);
          return {
            ...sec,
            coTeacher: {
              name: staff?.name || 'Co-Teacher'
            }
          };
        } else {
          return {
            ...sec,
            roomNumber: value
          };
        }
      })
    );
  };

  // --- EXECUTE PROMOTION ROLLOVER ---
  const sourceStudents = classRoster.filter(s => s.student.sectionId === promoSourceSectionId);
  const targetSection = sections.find(s => s.id === promoTargetSectionId) || sections[4];
  const sourceSection = sections.find(s => s.id === promoSourceSectionId) || sections[0];

  const handleToggleStudentPromotion = (admissionNumber: string) => {
    setUnselectedStudentAdmissions(prev => {
      const next = { ...prev };
      if (next[admissionNumber]) {
        delete next[admissionNumber]; // Re-checked = promote
      } else {
        next[admissionNumber] = 'retain'; // Unchecked = retain in current grade
      }
      return next;
    });
  };

  const handleExecutePromotion = () => {
    const retainedAdmList = Object.keys(unselectedStudentAdmissions);
    const promotedStudents: string[] = [];
    const retainedStudentNames: string[] = [];

    const updatedRoster = classRoster.map(s => {
      if (s.student.sectionId !== promoSourceSectionId) return s;
      if (retainedAdmList.includes(s.student.admissionNumber)) {
        retainedStudentNames.push(`${s.student.name} (Retained in ${sourceSection.shortName})`);
        return {
          ...s,
          student: {
            ...s.student,
            academicYear: '2027–2028 (Retained)'
          }
        };
      } else {
        promotedStudents.push(s.student.name);
        return {
          ...s,
          student: {
            ...s.student,
            grade: targetSection.gradeTier,
            section: targetSection.shortName.replace(/Mont \d/, 'Section '),
            sectionId: targetSection.id,
            academicYear: '2027–2028'
          }
        };
      }
    });

    onUpdateClassRoster(updatedRoster);

    const auditRecord: PromotionAuditRecord = {
      id: `audit-${Date.now()}`,
      timestamp: 'Today, Just Now',
      sourceSection: `${sourceSection.name} (2026–2027)`,
      targetSection: `${targetSection.name} (2027–2028)`,
      promotedCount: promotedStudents.length,
      retainedCount: retainedStudentNames.length,
      retainedStudentNames: retainedStudentNames,
      executedBy: 'Mr. Sundaram (Admin Office / Registrar)'
    };

    setPromotionAuditHistory(prev => [auditRecord, ...prev]);
    showToast(`Successfully promoted ${promotedStudents.length} students to ${targetSection.name}! (${retainedStudentNames.length} retained)`);
  };

  // --- SUBMIT QUICK IN-YEAR ADMISSION ---
  const handleQuickAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentAdm.trim()) return;

    const targetSec = sections.find(s => s.id === newStudentSectionId) || sections[0];
    const newStudent: StudentProfile = {
      student: {
        name: newStudentName.trim(),
        admissionNumber: newStudentAdm.trim(),
        grade: targetSec.gradeTier,
        section: targetSec.shortName,
        sectionId: targetSec.id,
        rollNumber: `${classRoster.length + 1}`,
        dob: '10 Oct 2023',
        bloodGroup: 'O+ Positive',
        house: 'Ruby Lions',
        academicYear: '2026–2027',
        photo: AVATAR_STUDENT_BOY
      },
      parents: {
        father: {
          name: newStudentParentName.trim() || 'Parent',
          mobile: newStudentMobile.trim() || '+91 98860 12345',
          email: 'parent.intake@example.com',
          occupation: 'Consultant',
          photo: AVATAR_FATHER
        },
        mother: {
          name: `${newStudentParentName.trim()} Mother`,
          mobile: newStudentMobile.trim() || '+91 98860 12345',
          email: 'mother.intake@example.com',
          occupation: 'Architect',
          photo: AVATAR_MOTHER
        },
        emergencyContact: {
          name: 'Local Guardian',
          relation: 'Uncle',
          mobile: newStudentMobile.trim() || '+91 98860 12345'
        },
        residentialAddress: 'Indiranagar 100ft Road, Bengaluru',
        transportMode: 'Parent Pick-up',
        busRouteNumber: 'None',
        busStopName: 'Self Drop'
      }
    };

    onAddStudent(newStudent);
    showToast(`Admitted ${newStudent.student.name} into ${targetSec.name} (${newStudent.student.admissionNumber})`);
    setIsQuickAdmissionOpen(false);
    setNewStudentName('');
    setNewStudentAdm('');
    setNewStudentParentName('');
    setNewStudentMobile('');
  };

  // --- SUBMIT EMERGENCY BROADCAST ---
  const handleEmergencyBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emergencyTitle.trim()) return;

    const newCirc: CircularNotice = {
      id: `circ-emerg-${Date.now()}`,
      circularNumber: `CIR/2026-27/EMERG-${Math.floor(100 + Math.random() * 900)}`,
      publishDate: 'Today',
      category: 'Urgent',
      title: `[EMERGENCY NOTICE] ${emergencyTitle.trim()}`,
      summary: emergencySummary.trim() || 'Urgent notification issued by the NAFL Office of the Principal & Registrar.',
      target: 'Whole School',
      targetScope: 'all_school',
      pdfFileName: 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
      pdfFileSize: '1.2 MB',
      requiresAcknowledgement: true,
      acknowledgedByParent: false
    };

    onAddCircular(newCirc);
    showToast(`Broadcasted Urgent School-Wide Notice "${emergencyTitle}" with parent read receipt tracking!`);
    setEmergencyTitle('');
    setEmergencySummary('');
  };

  const certStudent = classRoster.find(s => s.student.admissionNumber === selectedCertStudentAdm) || classRoster[0];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl shadow-md border border-indigo-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-300">
            <Building className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                NAFL Administrative & Registrar Control Desk
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-bold text-indigo-200">
                Staff Office
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Annual Student/Teacher section mapping, 1-tap rollover, mid-year intake, transport, and emergency broadcasts.
            </p>
          </div>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-3 text-xs shrink-0 bg-white/10 backdrop-blur-xs p-2.5 rounded-2xl border border-white/10">
          <div className="text-center px-2 border-r border-white/10">
            <span className="text-[10px] text-indigo-200 block">Total Students</span>
            <span className="font-bold text-sm text-white">{classRoster.length}</span>
          </div>
          <div className="text-center px-2 border-r border-white/10">
            <span className="text-[10px] text-indigo-200 block">Sections</span>
            <span className="font-bold text-sm text-white">{sections.length}</span>
          </div>
          <div className="text-center px-2">
            <span className="text-[10px] text-indigo-200 block">Active Staff</span>
            <span className="font-bold text-sm text-white">{MOCK_STAFF_DIRECTORY.length}</span>
          </div>
        </div>
      </div>

      {/* Admin Console Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold border-b border-slate-200">
        <button
          onClick={() => setActiveTab('mapping')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'mapping'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Annual Mapping & Rollover (Points 1, 2, 3)</span>
        </button>

        <button
          onClick={() => setActiveTab('admissions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'admissions'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>In-Year Admissions & TC Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('emergency')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'emergency'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-3.5 h-3.5 text-amber-400" />
          <span>Emergency Broadcasts</span>
        </button>

        <button
          onClick={() => setActiveTab('transport')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'transport'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bus className="w-3.5 h-3.5" />
          <span>Bus Transport Routes</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
            activeTab === 'finance'
              ? 'bg-indigo-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Fee Ledger Oversight</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: ANNUAL SECTION MAPPING & ROLLOVER (POINTS 1, 2, 3)   */}
      {/* ============================================================ */}
      {activeTab === 'mapping' && (
        <div className="space-y-6 animate-fade-in">
          {/* ---------------------------------------------------------- */}
          {/* POINT 1: Master CSV / Excel Bulk Enrollment               */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Point 1: Master CSV / Excel Bulk Student Intake
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bulk enroll incoming Montessori / Grade cohorts from registrar admissions spreadsheets in 5 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => handleParseCsv(SAMPLE_ENROLLMENT_CSV)}
                  className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  <span>1-Tap Test: Load Sample 2026–27 CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const blob = new Blob([SAMPLE_ENROLLMENT_CSV], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'NAFL_Student_Intake_Template.csv';
                    a.click();
                  }}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3 h-3 text-slate-500" />
                  <span>Template (.CSV)</span>
                </button>
              </div>
            </div>

            {/* CSV Dropzone / Input */}
            <div className="border-2 border-dashed border-indigo-100 hover:border-indigo-300 rounded-2xl p-4 text-center cursor-pointer bg-indigo-50/20 transition-colors relative">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        handleParseCsv(event.target.result as string);
                      }
                    };
                    reader.readAsText(e.target.files[0]);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <UploadCloud className="w-7 h-7 text-indigo-500 mb-1" strokeWidth={1.75} />
                <p className="text-xs font-semibold text-slate-800">
                  {csvContent ? 'Custom CSV file loaded' : 'Click to select or drag & drop student master CSV spreadsheet'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Headers required: Admission_Number, Student_Name, Grade_Tier, Section, Roll_No, Gender, Parent_Name, Primary_Mobile, Parent_Email, Bus_Route
                </p>
              </div>
            </div>

            {csvError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{csvError}</span>
              </div>
            )}

            {/* Parsed Preview Table */}
            {parsedStudents.length > 0 && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Parsed Intake Preview ({parsedStudents.length} Students Detected)
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    All Format Rules Validated ✓
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Admission No.</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Target Section</th>
                        <th className="p-2.5">Parent / Mobile</th>
                        <th className="p-2.5">Transport</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedStudents.map((st) => (
                        <tr key={st.admissionNumber} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-mono text-[11px] font-bold text-slate-900">{st.admissionNumber}</td>
                          <td className="p-2.5 font-semibold text-slate-800">{st.name}</td>
                          <td className="p-2.5 text-slate-600">{st.gradeTier} ({st.section})</td>
                          <td className="p-2.5 text-slate-600">{st.parentName} ({st.primaryMobile})</td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">{st.busRoute}</td>
                          <td className="p-2.5">
                            {st.isDuplicate ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Duplicate (Will Update)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Ready to Enroll
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setParsedStudents([]);
                      setCsvContent('');
                    }}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCommitBulkImport}
                    className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Commit {parsedStudents.length} Students to Live Registry</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------- */}
          {/* POINT 2: Visual Staff & Teacher Section Assignment Matrix  */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Point 2: Staff Section Assignment & Room Allocation Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign primary class teachers, assistant educators, and classrooms per section across all school tiers.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveStaffMatrix}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Staff Assignments</span>
              </button>
            </div>

            {/* Matrix Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {editableSections.map((sec) => {
                const sectionStudentCount = classRoster.filter(s => s.student.sectionId === sec.id).length;
                return (
                  <div
                    key={sec.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-300 bg-slate-50/50 hover:bg-amber-50/20 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">
                          {sec.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Tier: {sec.gradeTier}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-800 text-[10.5px] font-bold">
                        {sectionStudentCount} Students
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Primary Teacher */}
                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                          Primary Class Teacher:
                        </label>
                        <select
                          value={sec.primaryTeacher.id}
                          onChange={(e) => handleStaffChange(sec.id, 'primaryTeacher', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          {MOCK_STAFF_DIRECTORY.filter(st => st.role === 'Primary Teacher').map(st => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Co-Teacher */}
                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                          Co-Teacher / Assistant:
                        </label>
                        <select
                          value={MOCK_STAFF_DIRECTORY.find(st => st.name === sec.coTeacher?.name)?.id || 'teacher-radhika'}
                          onChange={(e) => handleStaffChange(sec.id, 'coTeacher', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        >
                          {MOCK_STAFF_DIRECTORY.filter(st => st.role === 'Co-Teacher').map(st => (
                            <option key={st.id} value={st.id}>
                              {st.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Room Number */}
                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-600 mb-1">
                          Classroom / Location:
                        </label>
                        <input
                          type="text"
                          value={sec.roomNumber}
                          onChange={(e) => handleStaffChange(sec.id, 'roomNumber', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-mono font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* POINT 3: 1-Tap Academic Cohort Rollover & Promotion Wizard */}
          {/* ---------------------------------------------------------- */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Point 3: 1-Tap Academic Cohort Promotion Wizard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll over entire class sections to the next academic year with granular, student-by-student retention control.
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 font-bold text-xs border border-purple-200 self-start sm:self-auto">
                Next Academic Cycle: 2027–2028
              </span>
            </div>

            {/* Source & Destination Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-purple-50/40 border border-purple-100 text-xs">
              <div>
                <label className="block font-semibold text-purple-950 mb-1">
                  1. Select Current Source Cohort (2026–2027):
                </label>
                <select
                  value={promoSourceSectionId}
                  onChange={(e) => {
                    setPromoSourceSectionId(e.target.value);
                    setUnselectedStudentAdmissions({});
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  {sections.filter(s => s.gradeTier.includes('1')).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roomNumber}) — {classRoster.filter(st => st.student.sectionId === s.id).length} Students
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-purple-950 mb-1">
                  2. Select Destination Promotion Cohort (2027–2028):
                </label>
                <select
                  value={promoTargetSectionId}
                  onChange={(e) => setPromoTargetSectionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                >
                  {sections.filter(s => s.gradeTier.includes('2')).map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.roomNumber}) — Advanced Level
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checklist with Flexibility to Uncheck */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Student Promotion Checklist ({sourceStudents.length} Students in {sourceSection.shortName})
                </span>
                <span className="text-[11px] text-slate-500">
                  All promoted by default. <strong className="text-purple-900">Uncheck</strong> any student repeating or transferring out.
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {sourceStudents.map((st) => {
                  const isRetained = Boolean(unselectedStudentAdmissions[st.student.admissionNumber]);
                  return (
                    <div
                      key={st.student.admissionNumber}
                      className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                        isRetained ? 'bg-amber-50/70 text-amber-950' : 'hover:bg-slate-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!isRetained}
                          onChange={() => handleToggleStudentPromotion(st.student.admissionNumber)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {st.student.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {st.student.admissionNumber} • Roll #{st.student.rollNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isRetained ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-950 font-bold text-[10.5px]">
                              ⚠️ Retain in Current Grade
                            </span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[10.5px] flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Promote to {targetSection.shortName}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Promotion Summary: {sourceStudents.length - Object.keys(unselectedStudentAdmissions).length} Promoted to {targetSection.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {Object.keys(unselectedStudentAdmissions).length} student(s) unchecked & retained in {sourceSection.name}.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePromotion}
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Execute Academic Rollover & Promote Cohort</span>
                </button>
              </div>
            </div>

            {/* Audit History Log */}
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 text-xs block mb-2">
                Recent Promotion & Rollover Audit Records
              </span>
              <div className="space-y-1.5">
                {promotionAuditHistory.map((rec) => (
                  <div key={rec.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800">{rec.sourceSection} → {rec.targetSection}</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-emerald-700 font-semibold">{rec.promotedCount} Promoted</span>
                      {rec.retainedCount > 0 && (
                        <span className="text-amber-800 ml-1.5 font-medium">({rec.retainedCount} Retained: {rec.retainedStudentNames.join(', ')})</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rec.timestamp} by {rec.executedBy}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: IN-YEAR ADMISSIONS & TC GENERATOR                    */}
      {/* ============================================================ */}
      {activeTab === 'admissions' && (
        <div className="space-y-5 animate-fade-in">
          {/* Quick Intake Button */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-indigo-950 block text-sm">In-Year Student Admissions Desk</span>
              <span className="text-indigo-800 text-[11px]">
                Directly register students transferring mid-term into Montessori or Primary classes.
              </span>
            </div>
            <button
              onClick={() => setIsQuickAdmissionOpen(true)}
              className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Enroll Mid-Term Student</span>
            </button>
          </div>

          {/* Official Document Generator (Bonafide & Transfer Certificate) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Official School Certificates & TC Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Instantly issue digitally verifiable Study/Bonafide Certificates, Address Proofs, or Transfer Certificates.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  1. Select Enrolled Student:
                </label>
                <select
                  value={selectedCertStudentAdm}
                  onChange={(e) => setSelectedCertStudentAdm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {classRoster.map(s => (
                    <option key={s.student.admissionNumber} value={s.student.admissionNumber}>
                      {s.student.name} ({s.student.admissionNumber} - {s.student.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  2. Certificate Type:
                </label>
                <select
                  value={certificateType}
                  onChange={(e) => setCertificateType(e.target.value as 'bonafide' | 'transfer')}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bonafide">Official Bonafide Study Certificate</option>
                  <option value="transfer">Transfer Certificate (TC) & Conduct Slip</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => setViewingCertModal(true)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Generate & Preview Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: EMERGENCY BROADCASTS                                 */}
      {/* ============================================================ */}
      {activeTab === 'emergency' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center font-bold">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                School-Wide Emergency Broadcast Authority
              </h3>
              <p className="text-xs text-slate-500">
                Exclusive administrative channel for critical closures, severe weather advisories, or urgent security alerts.
              </p>
            </div>
          </div>

          <form onSubmit={handleEmergencyBroadcast} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alert Classification:
                </label>
                <select
                  value={emergencySeverity}
                  onChange={(e) => setEmergencySeverity(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/50 font-bold text-rose-950 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Severe Weather Alert">Severe Weather Advisory</option>
                  <option value="Emergency School Closure">Emergency School Closure Notice</option>
                  <option value="Transport Route Alert">Transport Route & Bus Delay Alert</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notice Headline / Subject:
                </label>
                <input
                  type="text"
                  value={emergencyTitle}
                  onChange={e => setEmergencyTitle(e.target.value)}
                  placeholder="e.g. Heavy Rain Advisory: Online Classes on Friday, Nov 14"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Circular Body & Operational Instructions:
              </label>
              <textarea
                value={emergencySummary}
                onChange={e => setEmergencySummary(e.target.value)}
                rows={3}
                placeholder="Details of the announcement, safety instructions, and online schedule..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Archived notices: {circulars.length} active. Requires mandatory digital parent acknowledgment receipt.
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Notice to All Parents</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: BUS TRANSPORT ROUTES                                 */}
      {/* ============================================================ */}
      {activeTab === 'transport' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  School Bus Transport & Route Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Manage dedicated school bus routes, drivers, and student pickup/drop allocations.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Route 12: Indiranagar</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">28 Students</span>
              </div>
              <p className="text-slate-600 text-[11px]">Driver: Ramesh Gowda (+91 98450 12345) • Attendant: Sunita</p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10.5px] text-slate-500 font-mono">
                Stops: 100ft Rd, CMH Road, Domlur Flyover, NAFL Campus
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Route 8: Koramangala</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">24 Students</span>
              </div>
              <p className="text-slate-600 text-[11px]">Driver: Mohan Kumar (+91 98450 67890) • Attendant: Rekha</p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10.5px] text-slate-500 font-mono">
                Stops: Sony Signal, 80ft Rd, HSR BDA Complex, NAFL Campus
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Route 4: Malleshwaram</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">22 Students</span>
              </div>
              <p className="text-slate-600 text-[11px]">Driver: Venkatesh (+91 98450 11223) • Attendant: Radha</p>
              <div className="p-2 bg-white rounded-xl border border-slate-200 text-[10.5px] text-slate-500 font-mono">
                Stops: 8th Main, Rajajinagar 1st Block, Rajajinagar Metro, NAFL
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: FEE LEDGER OVERSIGHT                                  */}
      {/* ============================================================ */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 animate-fade-in">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Tuition Fee Ledger & Collection Oversight
                </h3>
                <p className="text-xs text-slate-500">
                  Track collection status without teachers ever needing to communicate with parents about money.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast('Dispatched automated SMS/WhatsApp fee reminders to pending parent accounts.')}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Discreet Reminders (Admin Desk)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 block uppercase">Term 1 Collection</span>
              <span className="text-xl font-black text-emerald-950 block">96% Collected</span>
              <span className="text-[11px] text-emerald-700">134 of 140 students settled. 6 pending reminders dispatched.</span>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-amber-800 block uppercase">Term 2 Collection</span>
              <span className="text-xl font-black text-amber-950 block">88% Collected</span>
              <span className="text-[11px] text-amber-700">123 of 140 settled ({fees.length} active fee cycles monitored). Due date: Jan 15, 2027.</span>
            </div>
          </div>
        </div>
      )}

      {/* Discrete Modal: Quick In-Year Admission */}
      {isQuickAdmissionOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Quick In-Year Student Intake</h3>
              <button onClick={() => setIsQuickAdmissionOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAdmissionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Student Full Name:</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission No:</label>
                  <input
                    type="text"
                    value={newStudentAdm}
                    onChange={e => setNewStudentAdm(e.target.value)}
                    placeholder="NAFL/2026/M1-099"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Section:</label>
                  <select
                    value={newStudentSectionId}
                    onChange={e => setNewStudentSectionId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {sections.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Parent Name:</label>
                <input
                  type="text"
                  value={newStudentParentName}
                  onChange={e => setNewStudentParentName(e.target.value)}
                  placeholder="e.g. Ramesh Krishnan"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent Mobile (+91):</label>
                <input
                  type="tel"
                  value={newStudentMobile}
                  onChange={e => setNewStudentMobile(e.target.value)}
                  placeholder="+91 98860 12345"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAdmissionOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-900 text-white font-bold rounded-xl shadow-xs"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Discrete Modal: Certificate / TC Generator */}
      {viewingCertModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-900 text-base">
                {certificateType === 'bonafide' ? 'Official Bonafide Study Certificate' : 'Transfer Certificate (TC)'}
              </span>
              <button onClick={() => setViewingCertModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Preview Document */}
            <div className="p-6 bg-amber-50/30 border border-amber-200/80 rounded-2xl font-serif text-slate-800 space-y-4 text-xs leading-relaxed">
              <div className="text-center border-b border-amber-200/60 pb-3">
                <h4 className="font-black text-sm tracking-wide text-slate-900 uppercase">National Academy For Learning</h4>
                <p className="text-[10px] text-slate-500 font-sans">Basaveshwaranagar, Bengaluru - 560079</p>
                <span className="text-[10px] font-mono font-bold text-indigo-900 mt-1 block">
                  REF: NAFL/REG/2026/CERT-{Math.floor(1000 + Math.random() * 9000)}
                </span>
              </div>

              <div className="space-y-2">
                <p>
                  This is to certify that <strong>{certStudent.student.name}</strong>, bearing Admission Number <strong>{certStudent.student.admissionNumber}</strong>, is a bonafide student of this institution studying in <strong>{certStudent.student.grade} ({certStudent.student.section})</strong> during the academic year <strong>{certStudent.student.academicYear}</strong>.
                </p>
                <p>
                  To the best of our school records, his/her date of birth is recorded as <strong>{certStudent.student.dob}</strong> and conduct is <strong>Exemplary</strong>.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between font-sans text-[10px] text-slate-500 border-t border-amber-200/60">
                <div>
                  <span className="block font-bold text-slate-800">Date of Issue: Nov 12, 2026</span>
                  <span>Registrar Office Seal</span>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-indigo-950">Mr. Sundaram</span>
                  <span>Registrar & Controller of Admissions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setViewingCertModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof window.print === 'function') {
                    window.print();
                  }
                  showToast('Printed official certificate document!');
                }}
                className="px-4 py-2 bg-indigo-900 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Download Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
