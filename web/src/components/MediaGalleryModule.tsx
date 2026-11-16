import { useState } from 'react';
import { MediaItem } from '../data/mockData';
import { CoveringTeacherConfirmModal } from './CoveringTeacherConfirmModal';
import {
  Camera,
  Video,
  Download,
  Calendar,
  Play,
  Volume2,
  Sparkles,
  Layers,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Edit3,
  Trash2,
  Save
} from 'lucide-react';

interface MediaGalleryModuleProps {
  media: MediaItem[];
  userRole?: 'parent' | 'teacher';
  onOpenUploader?: (type: 'photos' | 'video') => void;
  onDeleteMedia?: (id: string) => void;
  onUpdateMedia?: (id: string, updates: Partial<MediaItem>) => void;
  activeSectionName?: string;
  activeSectionId?: string;
  isCoveringTeacher?: boolean;
  coveringTeacherName?: string;
}

const SAMPLE_ALBUM_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=85',
    caption: 'Montessori Sensorial: Fine-tuning grasp with wooden cylinder blocks',
  },
  {
    url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=85',
    caption: 'Morning Circle Time: Rhyme recitation and animal sound mimicry',
  },
  {
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=85',
    caption: 'Sensorial Room: Exploring primary and secondary color tablets',
  },
  {
    url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1000&q=85',
    caption: 'Practical Life: Grain spooning and bilateral eye-hand coordination',
  },
  {
    url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=85',
    caption: 'Outdoor Quad: Parachute ripple games and social peer bonding',
  },
  {
    url: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1000&q=85',
    caption: 'Art & Craft Corner: Finger printing and eco-clay sculpting',
  },
];

export const MediaGalleryModule = ({
  media,
  userRole = 'parent',
  onOpenUploader,
  onDeleteMedia,
  onUpdateMedia,
  activeSectionName = 'Mont 1A',
  activeSectionId = 'mont-1a',
  isCoveringTeacher = false,
  coveringTeacherName = 'Ms. Ananya',
}: MediaGalleryModuleProps) => {
  const isTeacher = userRole === 'teacher';
  const [filter, setFilter] = useState<'all' | 'booklet' | 'video' | 'photo'>('all');
  
  // Video Player state
  const [activeVideoModal, setActiveVideoModal] = useState<MediaItem | null>(null);
  
  // Photo Album Lightbox state
  const [activePhotoAlbumModal, setActivePhotoAlbumModal] = useState<MediaItem | null>(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);
  const [photoSavedToast, setPhotoSavedToast] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Media state
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editGrade, setEditGrade] = useState('');
  const [editDuration, setEditDuration] = useState('');

  // Covering Teacher guardrail confirmation state
  const [confirmAction, setConfirmAction] = useState<{
    actionTitle: string;
    onConfirm: () => void;
    auditStampMessage?: string;
  } | null>(null);

  const handleStartEditMedia = (item: MediaItem) => {
    setEditingMedia(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditGrade(item.grade || activeSectionName);
    setEditDuration(item.duration || '0:30');
  };

  const handleSaveEditMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;
    const derivedSectionId = editGrade === 'Mont 1A' ? 'mont-1a' : editGrade === 'Mont 1B' ? 'mont-1b' : editGrade === 'Mont 1C' ? 'mont-1c' : editGrade === 'Mont 1D' ? 'mont-1d' : undefined;
    onUpdateMedia?.(editingMedia.id, {
      title: editTitle.trim() || editingMedia.title,
      description: editDescription.trim(),
      grade: editGrade,
      sectionId: derivedSectionId,
      ...(editingMedia.type === 'video' ? { duration: editDuration.trim() || editingMedia.duration } : {})
    });
    setToastMessage(`Updated media item "${editTitle || editingMedia.title}"!`);
    setTimeout(() => setToastMessage(null), 3000);
    setEditingMedia(null);
  };

  const handleTriggerDeleteMedia = (item: MediaItem) => {
    const doDelete = () => {
      onDeleteMedia?.(item.id);
      setToastMessage(`Deleted media item "${item.title}"`);
      setTimeout(() => setToastMessage(null), 3000);
    };

    if (isCoveringTeacher) {
      setConfirmAction({
        actionTitle: `Delete Classroom Media: "${item.title}"`,
        auditStampMessage: `Deleting media item in ${activeSectionName} will be recorded under ${coveringTeacherName} (Covering Teacher).`,
        onConfirm: doDelete
      });
    } else {
      doDelete();
    }
  };

  const handleOpenVideo = (item: MediaItem) => {
    setActiveVideoModal(item);
  };

  const handleOpenPhotoAlbum = (item: MediaItem) => {
    setActivePhotoAlbumModal(item);
    setCurrentPhotoIdx(0);
  };

  const handleDownloadActivePhoto = () => {
    const activePhoto = SAMPLE_ALBUM_PHOTOS[currentPhotoIdx];
    const link = document.createElement('a');
    link.href = activePhoto.url;
    link.download = `NAFL_Mont1_Photo_${currentPhotoIdx + 1}.jpg`;
    link.target = '_blank';
    link.click();
    setPhotoSavedToast(`Downloaded Photo ${currentPhotoIdx + 1} of ${SAMPLE_ALBUM_PHOTOS.length}`);
    setTimeout(() => setPhotoSavedToast(null), 3000);
  };

  const sectionScopedMedia = media.filter(item => {
    if (!item.sectionId || item.grade === 'Mont 1') return true;
    return item.sectionId === activeSectionId || item.grade === activeSectionName;
  });

  const filteredMedia = sectionScopedMedia.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="space-y-4">
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Teacher Action Bar */}
      {isTeacher && (
        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div>
            <span className="font-bold text-amber-950 block">{activeSectionName} Class Media & Moments</span>
            <span className="text-[11px] text-amber-800">
              Verify published photo booklets, candids, and activity videos visible to {activeSectionName} parents.
            </span>
          </div>
          {onOpenUploader && (
            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                onClick={() => onOpenUploader('photos')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Upload Photos / Booklet</span>
              </button>
              <button
                onClick={() => onOpenUploader('video')}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <Video className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>Upload Video Clip</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter chips directly at top */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Media ({media.length})
        </button>
        <button
          onClick={() => setFilter('booklet')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'booklet'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Photo Booklets (PDF)
        </button>
        <button
          onClick={() => setFilter('video')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'video'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Activity Videos
        </button>
        <button
          onClick={() => setFilter('photo')}
          className={`px-3 py-1.5 rounded-xl transition-all ${
            filter === 'photo'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Ad-hoc Photos
        </button>
      </div>

      {/* Grid of media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Media Thumbnail Container */}
              <div
                className="relative h-44 w-full bg-slate-100 overflow-hidden cursor-pointer group"
                onClick={() => {
                  if (item.type === 'video') handleOpenVideo(item);
                  else if (item.pdfFileName) window.open(`/samples/${item.pdfFileName}`, '_blank');
                  else handleOpenPhotoAlbum(item);
                }}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Date & Type Tag */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-300" strokeWidth={1.75} />
                  <span>{item.date}</span>
                </div>

                {/* Badge based on type */}
                <div className="absolute top-3 right-3">
                  {item.type === 'video' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <Video className="w-3 h-3" strokeWidth={1.75} />
                      <span>Video {item.duration}</span>
                    </span>
                  )}
                  {item.type === 'booklet' && (
                    <span className="px-2.5 py-1 rounded-full bg-brand-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <Layers className="w-3 h-3" strokeWidth={1.75} />
                      <span>{item.itemCount} Photos Booklet</span>
                    </span>
                  )}
                  {item.type === 'photo' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                      <Camera className="w-3 h-3" strokeWidth={1.75} />
                      <span>{item.itemCount} Candid Photos</span>
                    </span>
                  )}
                </div>

                {/* Video Play Overlay */}
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform pl-0.5">
                      <Play className="w-5 h-5 fill-slate-900 text-slate-900" />
                    </div>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-4 sm:p-5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.highlights && item.highlights.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Booklet Highlights:
                    </span>
                    {item.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.75} />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 truncate">
                {isTeacher && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                    Live for Parents
                  </span>
                )}
                <span className="truncate">
                  {item.pdfFileName ? `${item.pdfFileName} (${item.pdfFileSize})` : `${item.grade} • Classroom Media`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isTeacher && (
                  <div className="flex items-center gap-1 mr-1">
                    <button
                      type="button"
                      onClick={() => handleStartEditMedia(item)}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                      title="Edit Media Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerDeleteMedia(item)}
                      className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 transition-colors shadow-2xs"
                      title="Delete Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {item.type === 'booklet' ? (
                  <button
                    onClick={() => window.open(`/samples/${item.pdfFileName || 'NAFL_Mont1_Classroom_Moments_Nov2026.pdf'}`, '_blank')}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>Download Booklet</span>
                  </button>
                ) : item.type === 'video' ? (
                  <button
                    onClick={() => handleOpenVideo(item)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Clip ({item.duration})</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenPhotoAlbum(item)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                  >
                    <Camera className="w-3.5 h-3.5" strokeWidth={1.75} />
                    <span>View Photos ({item.itemCount || 6})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Video Player Modal Simulation */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-slate-950 text-white rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">{activeVideoModal.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeVideoModal.grade} • Recorded on {activeVideoModal.date}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real HTML5 Video Player with Audio */}
            <div className="relative aspect-video bg-black flex flex-col justify-center overflow-hidden">
              <video
                key={activeVideoModal.id}
                src={activeVideoModal.videoUrl || '/samples/NAFL_Mont1_Music_Circle_Sample.mp4'}
                poster={activeVideoModal.thumbnail}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Metadata & Real Audio Track Details */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Real Audio Active • Nursery Rhymes & Action Music</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Duration: {activeVideoModal.duration}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                {activeVideoModal.description}
              </p>
            </div>

            {/* Modal Bottom Metadata */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">Teacher uploaded • Safe Child Data Governance (DPDP Compliant)</span>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors shrink-0"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Photo Album Lightbox Modal */}
      {activePhotoAlbumModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="bg-slate-950 text-white rounded-3xl max-w-4xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-sm sm:text-base text-white truncate">{activePhotoAlbumModal.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Photo {currentPhotoIdx + 1} of {SAMPLE_ALBUM_PHOTOS.length} • {activePhotoAlbumModal.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDownloadActivePhoto}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Save Photo</span>
                </button>
                <button
                  onClick={() => setActivePhotoAlbumModal(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Photo Toast Notification */}
            {photoSavedToast && (
              <div className="mx-4 mt-3 p-2.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{photoSavedToast}</span>
              </div>
            )}

            {/* Main Stage Image with Prev/Next Navigation */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[420px] max-h-[62vh] select-none">
              <img
                src={SAMPLE_ALBUM_PHOTOS[currentPhotoIdx].url}
                alt={SAMPLE_ALBUM_PHOTOS[currentPhotoIdx].caption}
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />

              {/* Prev Button */}
              <button
                onClick={() => setCurrentPhotoIdx(prev => (prev === 0 ? SAMPLE_ALBUM_PHOTOS.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPhotoIdx(prev => (prev === SAMPLE_ALBUM_PHOTOS.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Photo Caption Badge */}
              <div className="absolute bottom-3 left-4 right-4 text-center pointer-events-none">
                <span className="inline-block px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white text-xs sm:text-sm font-medium border border-white/10 shadow-lg">
                  {SAMPLE_ALBUM_PHOTOS[currentPhotoIdx].caption}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
              {SAMPLE_ALBUM_PHOTOS.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIdx(idx)}
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    currentPhotoIdx === idx
                      ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Edit Media Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Edit Classroom Media Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMedia} className="space-y-3.5 text-xs">
              <div>
                <label htmlFor="edit-media-title-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Media Title
                </label>
                <input
                  id="edit-media-title-input"
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-media-section-select" className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Class Section / Audience
                </label>
                <select
                  id="edit-media-section-select"
                  value={editGrade}
                  onChange={e => setEditGrade(e.target.value)}
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

              {editingMedia.type === 'video' && (
                <div>
                  <label htmlFor="edit-media-duration-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (e.g. 0:30)
                  </label>
                  <input
                    id="edit-media-duration-input"
                    type="text"
                    value={editDuration}
                    onChange={e => setEditDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>
              )}

              <div>
                <label htmlFor="edit-media-desc-input" className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Activity Highlights
                </label>
                <textarea
                  id="edit-media-desc-input"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-500"
                  placeholder="Details of the classroom activity..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
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
          targetSectionName={activeSectionName}
          primaryTeacherName={activeSectionName?.includes('1B') ? 'Ms. Shalini' : 'Ms. Ananya'}
          coveringTeacherName={coveringTeacherName}
          auditStampMessage={confirmAction.auditStampMessage}
        />
      )}
    </div>
  );
};
