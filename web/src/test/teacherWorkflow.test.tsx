import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TeacherArtefactUploader } from '../components/TeacherArtefactUploader';
import { RequestsModule } from '../components/RequestsModule';
import { MediaGalleryModule } from '../components/MediaGalleryModule';
import { App } from '../App';
import { MOCK_MEDIA, MOCK_PTM_SLOTS, MOCK_LEAVE_REQUESTS } from '../data/mockData';

describe('Suite: Teacher Video Upload, Real HTML5 Video Player, Wear/Bring Prompts & PTM Slot Governance', () => {
  it('allows teacher to upload classroom activity video clips with duration and description', () => {
    const handleAddMedia = vi.fn();
    const handleClose = vi.fn();

    render(
      <TeacherArtefactUploader
        isOpen={true}
        onClose={handleClose}
        initialType="video"
        onAddMedia={handleAddMedia}
        onAddCircular={vi.fn()}
        onAddEvent={vi.fn()}
      />
    );

    // Verify video uploader UI elements
    expect(screen.getByText(/Upload Classroom Video Clip/i)).toBeInTheDocument();
    expect(screen.getByText(/Safe classroom activity recording with audio/i)).toBeInTheDocument();

    // 1-Tap Sample Video loader button
    const sampleBtn = screen.getByText('🎥 Activity Video');
    expect(sampleBtn).toBeInTheDocument();
    fireEvent.click(sampleBtn);

    // Form inputs populated
    expect(screen.getByDisplayValue(/Music Circle/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('0:30')).toBeInTheDocument();

    // Submit the video form
    const publishBtn = screen.getByRole('button', { name: /Publish Directly to Parents/i });
    fireEvent.click(publishBtn);

    // Verify onAddMedia was invoked with video metadata and videoUrl
    expect(handleAddMedia).toHaveBeenCalledTimes(1);
    const uploadedMedia = handleAddMedia.mock.calls[0][0];
    expect(uploadedMedia.type).toBe('video');
    expect(uploadedMedia.duration).toBe('0:30');
    expect(uploadedMedia.videoUrl).toContain('NAFL_Mont1_Music_Circle_Sample.mp4');
  });

  it('allows teacher to add class dates with explicit What to Wear and What to Bring prompts', () => {
    const handleAddEvent = vi.fn();
    const handleClose = vi.fn();

    render(
      <TeacherArtefactUploader
        isOpen={true}
        onClose={handleClose}
        initialType="calendar"
        onAddEvent={handleAddEvent}
        onAddCircular={vi.fn()}
      />
    );

    // Verify calendar uploader with wear & bring prompts
    expect(screen.getByText(/Class Event, Dress-Up & What to Bring Details/i)).toBeInTheDocument();
    expect(screen.getByText(/What to Wear Prompt/i)).toBeInTheDocument();
    expect(screen.getByText(/What to Bring Prompt/i)).toBeInTheDocument();

    // Use 1-Tap preset for dress-up date
    const dressUpPresetBtn = screen.getByText('👗 Dress-up Date');
    fireEvent.click(dressUpPresetBtn);

    // Prompts should be populated
    expect(screen.getByDisplayValue(/yellow or orange casual t-shirt/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/1 whole washed fruit/i)).toBeInTheDocument();

    // Submit class date
    const saveEventBtn = screen.getByRole('button', { name: /Publish Directly to Parents/i });
    fireEvent.click(saveEventBtn);

    expect(handleAddEvent).toHaveBeenCalledTimes(1);
    const createdEvent = handleAddEvent.mock.calls[0][0];
    expect(createdEvent.dressUpPrompt).toContain('yellow or orange');
    expect(createdEvent.bringToSchool).toContain('washed fruit');
  });

  it('renders authentic HTML5 video element with audio metadata in MediaGalleryModule', () => {
    render(
      <MediaGalleryModule
        media={MOCK_MEDIA}
        userRole="parent"
      />
    );

    const playBtns = screen.getAllByText(/Play Clip/i);
    fireEvent.click(playBtns[0]);

    // Check video element exists with sample MP4
    const videoEl = document.querySelector('video');
    expect(videoEl).toBeInTheDocument();
    expect(videoEl?.getAttribute('src')).toContain('.mp4');
    expect(videoEl).toHaveAttribute('controls');

    // Check real audio badge
    expect(screen.getByText(/Real Audio Active • Nursery Rhymes & Action Music/i)).toBeInTheDocument();
  });

  it('allows teacher to manage PTM slots: Add Slot, Block Slot, and Delete Slot', () => {
    const handleAddPtmSlot = vi.fn();
    const handleUpdatePtmSlot = vi.fn();
    const handleDeletePtmSlot = vi.fn();

    render(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onAddPtmSlot={handleAddPtmSlot}
        onUpdatePtmSlot={handleUpdatePtmSlot}
        onDeletePtmSlot={handleDeletePtmSlot}
        userRole="teacher"
      />
    );

    // Switch to PTM tab
    const ptmTabBtn = screen.getByRole('button', { name: /My PTM Schedule/i });
    fireEvent.click(ptmTabBtn);

    // Verify teacher governance controls
    expect(screen.getByText(/Add PTM Slot/i)).toBeInTheDocument();
    expect(screen.getByText(/Mont 1A PTM Schedule:/i)).toBeInTheDocument();

    // 1. Test Add PTM Slot
    fireEvent.click(screen.getByText(/Add PTM Slot/i));
    expect(screen.getByText(/Add New PTM Developmental Slot/i)).toBeInTheDocument();

    const saveSlotBtn = screen.getByRole('button', { name: /Open Slot for Parents/i });
    fireEvent.click(saveSlotBtn);

    expect(handleAddPtmSlot).toHaveBeenCalledTimes(1);
    const addedSlot = handleAddPtmSlot.mock.calls[0][0];
    expect(addedSlot.teacherName).toBe('Ms. Ananya');
    expect(addedSlot.status).toBe('Available');

    // 2. Test Block toggle on an available slot
    const blockBtns = screen.getAllByRole('button', { name: /^Block$/i });
    expect(blockBtns.length).toBeGreaterThan(0);
    fireEvent.click(blockBtns[0]);
    expect(handleUpdatePtmSlot).toHaveBeenCalledWith(expect.any(String), { status: 'Blocked' });

    // 3. Test Delete Slot
    const deleteBtns = screen.getAllByTitle(/Delete Slot/i);
    expect(deleteBtns.length).toBeGreaterThan(0);
    fireEvent.click(deleteBtns[0]);
    expect(handleDeletePtmSlot).toHaveBeenCalledTimes(1);
  });

  it('confirms the redundant Teacher Artefact upload banner is completely removed from Teacher view', () => {
    render(<App />);

    // Log out first to access the sign in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Instant 1-Tap sign in as Teacher
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    // Verify teacher is logged in
    expect(screen.getByText(/Ms\. Ananya \(Teacher\)/i)).toBeInTheDocument();

    // Ensure the old redundant top banner is not rendered in Teacher view
    expect(screen.queryByText(/Teacher Class Desk: Mont 1A/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Direct Artefact Assimilation/i)).not.toBeInTheDocument();
  });
});
