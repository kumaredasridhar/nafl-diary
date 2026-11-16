import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { TeacherArtefactUploader } from '../components/TeacherArtefactUploader';
import { MediaGalleryModule } from '../components/MediaGalleryModule';
import { CircularsModule } from '../components/CircularsModule';
import { MediaItem, CircularNotice } from '../data/mockData';

describe('Suite: Media & Circular Governance (Section Targeting, Edit & Retract Workflows)', () => {
  it('allows teacher to upload classroom video with target section restriction', () => {
    const handleAddMedia = vi.fn();
    const handleClose = vi.fn();

    render(
      <TeacherArtefactUploader
        isOpen={true}
        onClose={handleClose}
        initialType="video"
        activeSectionName="Mont 1A"
        onAddCircular={vi.fn()}
        onAddEvent={vi.fn()}
        onAddMedia={handleAddMedia}
      />
    );

    // Verify video tab is active and section selector is present
    expect(screen.getByText(/Upload Classroom Video Clip/i)).toBeInTheDocument();
    const sectionSelect = screen.getByLabelText(/Target Section \/ Audience/i);
    expect(sectionSelect).toBeInTheDocument();

    // Select Mont 1B
    fireEvent.change(sectionSelect, { target: { value: 'Mont 1B' } });

    // Set title and description
    const titleInput = screen.getByLabelText(/Video Title \/ Activity Name/i);
    fireEvent.change(titleInput, { target: { value: 'Mont 1B Rhythm Drumming Circle' } });

    // Click Publish Video
    const publishBtn = screen.getByRole('button', { name: /Publish Directly to Parents/i });
    fireEvent.click(publishBtn);

    // Verify callback was invoked with sectionId 'mont-1b'
    expect(handleAddMedia).toHaveBeenCalledTimes(1);
    const addedMedia: MediaItem = handleAddMedia.mock.calls[0][0];
    expect(addedMedia.type).toBe('video');
    expect(addedMedia.title).toBe('Mont 1B Rhythm Drumming Circle');
    expect(addedMedia.grade).toBe('Mont 1B');
    expect(addedMedia.sectionId).toBe('mont-1b');
  });

  it('allows teacher to edit classroom media items in MediaGalleryModule', () => {
    const handleUpdateMedia = vi.fn();
    const testMedia: MediaItem[] = [
      {
        id: 'med-test-1',
        type: 'video',
        title: 'Original Video Title',
        date: 'Today',
        grade: 'Mont 1A',
        sectionId: 'mont-1a',
        thumbnail: 'https://images.unsplash.com/photo-1',
        videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
        duration: '0:30',
        description: 'Original description'
      }
    ];

    render(
      <MediaGalleryModule
        media={testMedia}
        userRole="teacher"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
        onUpdateMedia={handleUpdateMedia}
        onDeleteMedia={vi.fn()}
      />
    );

    // Find and click the Edit button for the media card
    const editBtn = screen.getByTitle('Edit Media Details');
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);

    // Verify Edit Modal is displayed
    expect(screen.getByText(/Edit Classroom Media/i)).toBeInTheDocument();
    const titleField = screen.getByLabelText(/Media Title/i);
    fireEvent.change(titleField, { target: { value: 'Updated Video Title' } });

    // Save changes
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveBtn);

    expect(handleUpdateMedia).toHaveBeenCalledTimes(1);
    expect(handleUpdateMedia).toHaveBeenCalledWith(
      'med-test-1',
      expect.objectContaining({
        title: 'Updated Video Title',
        sectionId: 'mont-1a'
      })
    );
  });

  it('allows teacher to delete media item directly in own home section', () => {
    const handleDeleteMedia = vi.fn();
    const testMedia: MediaItem[] = [
      {
        id: 'med-test-2',
        type: 'video',
        title: 'Activity Video to Delete',
        date: 'Today',
        grade: 'Mont 1A',
        sectionId: 'mont-1a',
        thumbnail: 'https://images.unsplash.com/photo-1',
        videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
        duration: '0:30'
      }
    ];

    render(
      <MediaGalleryModule
        media={testMedia}
        userRole="teacher"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
        isCoveringTeacher={false}
        onDeleteMedia={handleDeleteMedia}
      />
    );

    const deleteBtn = screen.getByTitle('Delete Media');
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);

    expect(handleDeleteMedia).toHaveBeenCalledTimes(1);
    expect(handleDeleteMedia).toHaveBeenCalledWith('med-test-2');
  });

  it('triggers covering teacher soft guardrail when deleting media in covered section', () => {
    const handleDeleteMedia = vi.fn();
    const testMedia: MediaItem[] = [
      {
        id: 'med-test-3',
        type: 'video',
        title: 'Mont 1B Sandpaper Letters',
        date: 'Today',
        grade: 'Mont 1B',
        sectionId: 'mont-1b',
        thumbnail: 'https://images.unsplash.com/photo-1',
        videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
        duration: '0:30'
      }
    ];

    render(
      <MediaGalleryModule
        media={testMedia}
        userRole="teacher"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
        isCoveringTeacher={true}
        coveringTeacherName="Ms. Ananya"
        onDeleteMedia={handleDeleteMedia}
      />
    );

    const deleteBtn = screen.getByTitle('Delete Media');
    fireEvent.click(deleteBtn);

    // Modal opens asking for covering teacher confirmation
    expect(screen.getByText(/Covering Teacher Confirmation/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ms\. Ananya/i).length).toBeGreaterThan(0);
    expect(handleDeleteMedia).not.toHaveBeenCalled();

    // Confirm action
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Audit Stamp/i });
    fireEvent.click(confirmBtn);

    expect(handleDeleteMedia).toHaveBeenCalledWith('med-test-3');
  });

  it('allows teacher to retract circular notice with covering teacher guardrail', () => {
    const handleDeleteCircular = vi.fn();
    const testCirculars: CircularNotice[] = [
      {
        id: 'circ-test-1',
        circularNumber: 'CIR/2026-27/099',
        publishDate: 'Nov 12, 2026',
        category: 'Event',
        title: 'Special Sports Day Notice',
        summary: 'Trial athletic meet timings and bus routes.',
        target: 'Mont 1B',
        targetScope: 'section',
        targetSectionId: 'mont-1b',
        pdfFileName: 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
        pdfFileSize: '1.2 MB',
        requiresAcknowledgement: true,
        acknowledgedByParent: false
      }
    ];

    render(
      <CircularsModule
        circulars={testCirculars}
        onAcknowledge={vi.fn()}
        onDeleteCircular={handleDeleteCircular}
        userRole="teacher"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
        isCoveringTeacher={true}
        coveringTeacherName="Ms. Ananya"
      />
    );

    const retractBtn = screen.getByRole('button', { name: /Retract Notice/i });
    expect(retractBtn).toBeInTheDocument();
    fireEvent.click(retractBtn);

    // Covering Teacher guardrail modal opens
    expect(screen.getByText(/Covering Teacher Confirmation/i)).toBeInTheDocument();
    expect(handleDeleteCircular).not.toHaveBeenCalled();

    // Confirm retraction
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Audit Stamp/i });
    fireEvent.click(confirmBtn);

    expect(handleDeleteCircular).toHaveBeenCalledTimes(1);
    expect(handleDeleteCircular).toHaveBeenCalledWith('circ-test-1');
  });

  it('end-to-end integration: deleting a circular removes it from App state', () => {
    render(<App />);

    // Log out to access sign-in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Sign in as Teacher
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    // Navigate to Circulars tab
    const circularsTabs = screen.getAllByRole('button', { name: /Circulars/i });
    fireEvent.click(circularsTabs[0]);

    // Verify initial circular exists
    const sportsDayTitle = screen.getByText(/Annual Sports Day 2026 Schedule & Uniform Guidelines/i);
    expect(sportsDayTitle).toBeInTheDocument();

    // Find retract buttons
    const retractBtns = screen.getAllByRole('button', { name: /Retract Notice/i });
    expect(retractBtns.length).toBeGreaterThan(0);

    // Retract first circular
    fireEvent.click(retractBtns[0]);

    // Sports Day circular heading is removed from circulars list
    expect(screen.queryByRole('heading', { name: /Annual Sports Day 2026 Schedule & Uniform Guidelines/i })).not.toBeInTheDocument();

    // Retraction toast is shown
    expect(screen.getByText(/Retracted circular notice CIR\/2026-27\/024/i)).toBeInTheDocument();
  });
});
