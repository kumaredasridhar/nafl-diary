import { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Calendar,
  FileText,
  Camera,
  Video,
  Shirt,
  Package,
  CheckCircle,
  Sparkles,
  X
} from 'lucide-react';
import { CircularNotice, CalendarEvent, MediaItem, MonthlyLearningObjective } from '../data/mockData';

interface TeacherArtefactUploaderProps {
  onAddCircular: (circular: CircularNotice) => void;
  onAddEvent: (event: CalendarEvent) => void;
  onAddMedia?: (media: MediaItem) => void;
  onAddCurriculum?: (monthKey: string, objective: MonthlyLearningObjective) => void;
  onBackToParentView?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  initialType?: 'monthly_plan' | 'circular' | 'photos' | 'video' | 'calendar';
  activeSectionName?: string;
  isCoveringTeacher?: boolean;
  coveringTeacherName?: string;
}

export const TeacherArtefactUploader = ({
  onAddCircular,
  onAddEvent,
  onAddMedia,
  onAddCurriculum,
  onBackToParentView,
  isOpen,
  onClose,
  initialType = 'circular',
  activeSectionName = 'Mont 1A',
  isCoveringTeacher = false,
  coveringTeacherName = 'Ms. Ananya',
}: TeacherArtefactUploaderProps) => {
  const [selectedType, setSelectedType] = useState<'monthly_plan' | 'circular' | 'photos' | 'video' | 'calendar'>(initialType);
  const [fileName, setFileName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [targetGrade, setTargetGrade] = useState<string>(activeSectionName);
  const [requiresSignOff, setRequiresSignOff] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Video specific fields
  const [videoDuration, setVideoDuration] = useState<string>('0:30');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('/samples/NAFL_Mont1_Music_Circle_Sample.mp4');

  // Calendar specific fields (Fix 4: Wear, Bring details)
  const [eventDate, setEventDate] = useState<string>('2026-11-20');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('dress_up');
  const [dressUpPrompt, setDressUpPrompt] = useState<string>('Wear yellow or orange casual t-shirt with sports shoes');
  const [bringToSchool, setBringToSchool] = useState<string>('1 whole washed fruit for community fruit salad, labeled water bottle');
  const [eventDescription, setEventDescription] = useState<string>('Montessori 1A sensorial fruit salad preparation and color exploration.');

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  if (isOpen !== undefined && !isOpen) return null;

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
      if (selectedType === 'video') {
        const localBlob = URL.createObjectURL(file);
        setVideoUrl(localBlob);
      }
    }
  };

  const handleLoadSampleArtefact = (type: 'circular' | 'monthly_plan' | 'photos' | 'video' | 'calendar') => {
    if (type === 'circular') {
      setSelectedType('circular');
      setTitle('Annual Athletic Meet 2026 Schedule & Parent Consent');
      setFileName('CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf');
      setTargetGrade('Mont 1A');
      setRequiresSignOff(true);
    } else if (type === 'monthly_plan') {
      setSelectedType('monthly_plan');
      setTitle('December 2026: Winter Wonders, Numbers 1–10 & Phonics');
      setFileName('NAFL_Mont1_December_2026_Curriculum_Plan.pdf');
      setTargetGrade('Mont 1A');
    } else if (type === 'photos') {
      setSelectedType('photos');
      setTitle('November 2026: Community Helpers & Sensorial Moments');
      setFileName('NAFL_Mont1_Classroom_Moments_Nov2026.pdf');
      setTargetGrade('Mont 1A');
    } else if (type === 'video') {
      setSelectedType('video');
      setTitle('Music Circle: "The Wheels on the Bus" & Rhythm Clap');
      setFileName('NAFL_Mont1_Music_Circle_Sample.mp4');
      setVideoDuration('0:30');
      setVideoUrl('/samples/NAFL_Mont1_Music_Circle_Sample.mp4');
      setVideoDescription('Aarav and his classmates practicing vehicle action sounds and rhythmic clapping during morning circle time.');
      setTargetGrade('Mont 1A');
    } else if (type === 'calendar') {
      setSelectedType('calendar');
      setTitle('Mont 1A Community Fruit Salad Day');
      setEventDate('2026-11-20');
      setEventType('dress_up');
      setDressUpPrompt('Wear yellow or orange casual t-shirt with sports shoes');
      setBringToSchool('1 whole washed fruit for community fruit salad, labeled water bottle');
      setEventDescription('Children will participate in sensorial texture sorting, peeling soft fruits, and preparing a shared morning snack.');
      setTargetGrade('Mont 1A');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedType === 'circular') {
      const newCircular: CircularNotice = {
        id: `circ-${Date.now()}`,
        circularNumber: `CIR/2026-27/${Math.floor(Math.random() * 80 + 25)}`,
        title: title || 'NAFL Official Notice',
        publishDate: 'Today',
        category: 'Event',
        target: targetGrade,
        requiresAcknowledgement: requiresSignOff,
        acknowledgedByParent: false,
        summary: `Published directly from existing school artefact ${fileName || 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf'}.`,
        pdfFileName: fileName || 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
        pdfFileSize: '520 KB',
      };
      onAddCircular(newCircular);
      setSuccessMessage(`Successfully published circular "${newCircular.title}"!`);
    } else if (selectedType === 'monthly_plan') {
      if (onAddCurriculum) {
        const monthKey = '2026-12';
        const newCurriculum: MonthlyLearningObjective = {
          month: 'December 2026',
          grade: 'Montessori 1',
          themeTitle: title || 'December 2026: Winter Wonders, Numbers 1–10 & Phonics',
          themeDescription: 'Sensorial exploration of cold climate concepts, winter flora, and tactile Montessori counting 1 to 10.',
          objectives: [
            {
              area: 'Sensorial & Math',
              items: [
                'Montessori Number Rods 1–10 tactile counting',
                'Sandpaper numbers tracing with index finger',
                'Pairing counters with numeral cards'
              ]
            },
            {
              area: 'Language & Phonics',
              items: [
                'Sandpaper letter phonetic sounds: /c/, /k/, /e/, /h/',
                'Rhyming stories: "The Mitten" and "The Gingerbread Man"',
                'Picture-word association cards'
              ]
            },
            {
              area: 'Practical Life',
              items: [
                'Buttoning and zipping frames (winter coats practice)',
                'Spooning kidney beans and dry pouring',
                'Rolling floor mats neatly after individual work'
              ]
            }
          ],
          specialDates: [
            {
              date: '2026-12-18',
              day: 'Friday',
              title: 'Annual Sports Day & Winter Carnival',
              dressCode: 'House color sports kit with white canvas shoes.',
              bringItem: 'Water bottle labeled with child name'
            }
          ],
          pdfFileName: fileName || 'NAFL_Mont1_December_2026_Curriculum_Plan.pdf',
          pdfFileSize: '2.8 MB (3 pages)',
          uploadedAt: 'Today'
        };
        onAddCurriculum(monthKey, newCurriculum);
      }

      onAddEvent({
        id: `evt-${Date.now()}`,
        title: 'Annual Sports Day & Winter Carnival',
        date: '2026-12-18',
        type: 'dress_up',
        description: 'Assimilated from uploaded December Curriculum Deck.',
        dressUpPrompt: 'Wear Emerald Dragons house t-shirt with sports shoes',
        bringToSchool: 'Water bottle labeled with child name',
        targetGrades: [targetGrade]
      });

      setSuccessMessage(`Successfully updated December curriculum deck and added Sports Carnival to Calendar!`);
    } else if (selectedType === 'photos') {
      if (onAddMedia) {
        const derivedSectionId = targetGrade === 'Mont 1A' ? 'mont-1a' : targetGrade === 'Mont 1B' ? 'mont-1b' : targetGrade === 'Mont 1C' ? 'mont-1c' : targetGrade === 'Mont 1D' ? 'mont-1d' : undefined;
        const newMedia: MediaItem = {
          id: `med-${Date.now()}`,
          type: 'booklet',
          title: title || 'November 2026: Community Helpers & Sensorial Moments',
          date: 'November 2026',
          grade: targetGrade,
          sectionId: derivedSectionId,
          thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
          itemCount: 16,
          pdfFileName: fileName || 'NAFL_Mont1_Classroom_Moments_Nov2026.pdf',
          pdfFileSize: '3.1 MB',
          highlights: [
            'Montessori practical life grain spooning and balance',
            'Community helpers circle and animal sound rhymes'
          ]
        };
        onAddMedia(newMedia);
      }
      setSuccessMessage(`Successfully published photo booklet "${title || 'Monthly Booklet'}"!`);
    } else if (selectedType === 'video') {
      if (onAddMedia) {
        const derivedSectionId = targetGrade === 'Mont 1A' ? 'mont-1a' : targetGrade === 'Mont 1B' ? 'mont-1b' : targetGrade === 'Mont 1C' ? 'mont-1c' : targetGrade === 'Mont 1D' ? 'mont-1d' : undefined;
        const newMedia: MediaItem = {
          id: `med-vid-${Date.now()}`,
          type: 'video',
          title: title || 'Music Circle Activity Video',
          date: 'Today',
          grade: targetGrade,
          sectionId: derivedSectionId,
          thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
          videoUrl: videoUrl || '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
          duration: videoDuration || '0:30',
          description: videoDescription || 'Classroom activity recording uploaded by teacher.',
        };
        onAddMedia(newMedia);
      }
      setSuccessMessage(`Successfully uploaded classroom video "${title || 'Activity Video'}" for ${targetGrade} with audio!`);
    } else {
      // Fix 4: Calendar Date with Wear and Bring Details
      const newEvent: CalendarEvent = {
        id: `evt-${Date.now()}`,
        title: title || 'Mont 1A Class Special Event',
        date: eventDate,
        type: eventType,
        description: eventDescription || 'Classroom reminder published by class teacher.',
        dressUpPrompt: dressUpPrompt.trim() ? dressUpPrompt.trim() : undefined,
        bringToSchool: bringToSchool.trim() ? bringToSchool.trim() : undefined,
        targetGrades: [targetGrade]
      };
      onAddEvent(newEvent);
      setSuccessMessage(`Successfully added "${newEvent.title}" with wear & bring reminders to the Calendar!`);
    }

    setTimeout(() => {
      setSuccessMessage(null);
      if (onClose) onClose();
    }, 2000);

    setTitle('');
    setFileName('');
  };

  const content = (
    <div className="space-y-5">
      {/* 1-Tap Quick Fill Pills for Testing */}
      <div className="bg-gradient-to-r from-brand-50 to-indigo-50/60 p-3.5 rounded-2xl border border-brand-200/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span>1-Tap Test: Load Sample NAFL Content</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => handleLoadSampleArtefact('circular')}
            className={`p-2 bg-white rounded-xl text-left border transition-all shadow-2xs group ${selectedType === 'circular' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-brand-400'}`}
          >
            <span className="font-bold text-[11px] text-slate-900 block truncate">
              📄 Circular
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Sports Day Notice
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleArtefact('monthly_plan')}
            className={`p-2 bg-white rounded-xl text-left border transition-all shadow-2xs group ${selectedType === 'monthly_plan' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-brand-400'}`}
          >
            <span className="font-bold text-[11px] text-slate-900 block truncate">
              📑 Dec Curriculum
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Winter Wonders Deck
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleArtefact('photos')}
            className={`p-2 bg-white rounded-xl text-left border transition-all shadow-2xs group ${selectedType === 'photos' ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-brand-400'}`}
          >
            <span className="font-bold text-[11px] text-slate-900 block truncate">
              📸 Photo Booklet
            </span>
            <span className="text-[9.5px] text-slate-500 block truncate">
              Nov Candids PDF
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleArtefact('video')}
            className={`p-2 bg-white rounded-xl text-left border transition-all shadow-2xs group ${selectedType === 'video' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-rose-400'}`}
          >
            <span className="font-bold text-[11px] text-rose-950 block truncate">
              🎥 Activity Video
            </span>
            <span className="text-[9.5px] text-rose-600 block truncate">
              Music Circle (MP4)
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleLoadSampleArtefact('calendar')}
            className={`p-2 bg-white rounded-xl text-left border transition-all shadow-2xs group ${selectedType === 'calendar' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 hover:border-purple-400'}`}
          >
            <span className="font-bold text-[11px] text-purple-950 block truncate">
              👗 Dress-up Date
            </span>
            <span className="text-[9.5px] text-purple-600 block truncate">
              Wear & Bring Details
            </span>
          </button>
        </div>
      </div>

      {isCoveringTeacher && (
        <div className="p-3 bg-amber-500/10 border border-amber-300 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
            <span>Covering Teacher Broadcast: Content will be published to {activeSectionName} with audit record ({coveringTeacherName} - Covering Teacher).</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-bold uppercase tracking-wide shrink-0">
            Covering
          </span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.75} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handlePublish} className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            1. Select Upload Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'circular', label: 'Circular', icon: FileText, desc: 'Requires parent signs' },
              { id: 'monthly_plan', label: 'Curriculum Deck', icon: Calendar, desc: 'Themes & objectives' },
              { id: 'photos', label: 'Photo Booklet', icon: Camera, desc: 'PDF collages' },
              { id: 'video', label: 'Activity Video', icon: Video, desc: 'Classroom clip + audio' },
              { id: 'calendar', label: 'Class Date', icon: Shirt, desc: 'Wear & bring prompts' },
            ].map(item => {
              const Icon = item.icon;
              const isSelected = selectedType === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setSelectedType(item.id as any)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20 text-brand-900'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} strokeWidth={1.75} />
                  <div>
                    <span className="font-bold text-xs block leading-tight">{item.label}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Category Inputs */}
        {selectedType === 'calendar' ? (
          /* FIX 4: Dedicated Form for Class Date with Wear & Bring Prompts */
          <div className="space-y-3.5 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-900 block">
              2. Class Event, Dress-Up & What to Bring Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event / Activity Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Community Helpers Dress-Up Day"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Type
                </label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="dress_up">🟣 Dress-Up Day</option>
                  <option value="event">🎉 Special Celebration / Activity</option>
                  <option value="holiday">🏖️ School Holiday / Closure</option>
                  <option value="exam">📝 Term Assessment</option>
                  <option value="ptm">🤝 Parent-Teacher Meeting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Section
                </label>
                <select
                  value={targetGrade}
                  onChange={e => setTargetGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Mont 1A">Montessori 1A (Room 104)</option>
                  <option value="Mont 1B">Montessori 1B (Room 106)</option>
                  <option value="Mont 1C">Montessori 1C (Room 108)</option>
                  <option value="Mont 1D">Montessori 1D (Room 110)</option>
                  <option value="Mont 1">Montessori 1 (All Sections)</option>
                  <option value="Whole School">Whole School</option>
                </select>
              </div>
            </div>

            {/* Wear & Bring Prompts (Purple & Green cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                  <Shirt className="w-3.5 h-3.5 text-purple-600" />
                  <span>What to Wear Prompt (Optional)</span>
                </label>
                <input
                  type="text"
                  value={dressUpPrompt}
                  onChange={e => setDressUpPrompt(e.target.value)}
                  placeholder="e.g. Yellow / Orange casual T-shirt with sports shoes"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-purple-200 bg-white focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Package className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What to Bring Prompt (Optional)</span>
                </label>
                <input
                  type="text"
                  value={bringToSchool}
                  onChange={e => setBringToSchool(e.target.value)}
                  placeholder="e.g. 1 whole washed fruit, labeled water bottle"
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-emerald-200 bg-white focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Teacher Instructions / Notes for Parents
              </label>
              <textarea
                value={eventDescription}
                onChange={e => setEventDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                placeholder="Details of the classroom activity..."
              />
            </div>
          </div>
        ) : selectedType === 'video' ? (
          /* FIX 2: Dedicated Video Upload Form */
          <div className="space-y-3.5 bg-rose-50/40 p-4 rounded-2xl border border-rose-200">
            <span className="text-xs font-bold text-rose-950 block">
              2. Upload Classroom Video Clip (MP4 / MOV)
            </span>

            {/* Video File Dropzone */}
            <div className="border-2 border-dashed border-rose-200 hover:border-rose-400 rounded-2xl p-5 text-center cursor-pointer bg-white transition-colors relative">
              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <Video className="w-8 h-8 text-rose-500 mb-1.5" strokeWidth={1.75} />
                <p className="text-xs font-semibold text-slate-800">
                  {fileName ? fileName : 'Click to select or drag & drop video clip (MP4 / MOV)'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Safe classroom activity recording with audio (DPDP compliant)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label htmlFor="video-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Video Title / Activity Name
                </label>
                <input
                  id="video-title-input"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Music Circle: Animal Sounds & Rhymes"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="video-duration-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration (e.g. 0:30)
                </label>
                <input
                  id="video-duration-input"
                  type="text"
                  value={videoDuration}
                  onChange={e => setVideoDuration(e.target.value)}
                  placeholder="0:30"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="video-target-section-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Target Section / Audience
              </label>
              <select
                id="video-target-section-select"
                value={targetGrade}
                onChange={e => setTargetGrade(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              >
                <option value="Mont 1A">Montessori 1A (Room 104)</option>
                <option value="Mont 1B">Montessori 1B (Room 106)</option>
                <option value="Mont 1C">Montessori 1C (Room 108)</option>
                <option value="Mont 1D">Montessori 1D (Room 110)</option>
                <option value="Mont 1">Montessori 1 (All Sections)</option>
                <option value="Whole School">Whole School</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Description / Audio Note
              </label>
              <textarea
                value={videoDescription}
                onChange={e => setVideoDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                placeholder="Describe what the children were learning during this video clip..."
              />
            </div>
          </div>
        ) : (
          /* Document Dropzone for Circulars, Curriculum Slides & Booklets */
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                2. Choose Existing PDF / Slides File
              </label>
              <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 rounded-2xl p-5 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  onChange={handleSimulatedUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-brand-500 mb-1.5" strokeWidth={1.75} />
                  <p className="text-xs font-semibold text-slate-800">
                    {fileName ? fileName : 'Click to select or drag & drop existing PDF file'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Upload existing NAFL slide deck or circular without re-typing
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. December Learning Pack or Field Trip Notice"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Section
                </label>
                <select
                  value={targetGrade}
                  onChange={e => setTargetGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 bg-white"
                >
                  <option value="Mont 1A">Montessori 1A (Room 104)</option>
                  <option value="Mont 1B">Montessori 1B (Room 106)</option>
                  <option value="Mont 1C">Montessori 1C (Room 108)</option>
                  <option value="Mont 1D">Montessori 1D (Room 110)</option>
                  <option value="Mont 1">Montessori 1 (All Sections)</option>
                  <option value="Whole School">Whole School</option>
                </select>
              </div>
            </div>

            {selectedType === 'circular' && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="signoff"
                  checked={requiresSignOff}
                  onChange={e => setRequiresSignOff(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                />
                <label htmlFor="signoff" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Require digital signature / acknowledgement checkbox from parents
                </label>
              </div>
            )}
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose || onBackToParentView}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all"
          >
            <FileCheck2 className="w-4 h-4" strokeWidth={1.75} />
            <span>Publish Directly to Parents</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (isOpen !== undefined) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl border border-brand-200 bg-brand-50/70 text-brand-600 flex items-center justify-center font-bold">
                <UploadCloud className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                  Teacher Artefact & Publishing Desk
                </h2>
                <p className="text-xs text-slate-500">
                  Publish notices, slide decks, activity videos, and class dates directly to Mont 1A parents
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return <div className="max-w-3xl mx-auto">{content}</div>;
};
