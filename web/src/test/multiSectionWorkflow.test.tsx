import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { RequestsModule } from '../components/RequestsModule';
import { CircularsModule } from '../components/CircularsModule';
import { MediaGalleryModule } from '../components/MediaGalleryModule';
import {
  MOCK_LEAVE_REQUESTS,
  MOCK_PTM_SLOTS,
  MOCK_CIRCULARS,
  MOCK_MEDIA
} from '../data/mockData';

describe('Suite: Multiple Class Sections Management & Student/Teacher Assignments', () => {
  it('renders section switcher and switches active class section for teachers', () => {
    render(<App />);

    // Log out to access sign-in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Sign in as Teacher
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    // Initial state: Mont 1A (Room 104, Ms. Ananya)
    expect(screen.getAllByText(/Montessori 1A/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Room 104/i).length).toBeGreaterThan(0);

    // Verify section switch buttons have been removed to reduce clutter
    expect(screen.queryByRole('button', { name: /^Mont 1B$/i })).not.toBeInTheDocument();

    // Verify top-right dropdown exists and contains all 4 Mont 1 sections
    const sectionSelect = screen.getByTitle('Switch Active Class Section');
    expect(sectionSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Mont 1A/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Mont 1B/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Mont 1C/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Mont 1D/i })).toBeInTheDocument();

    // Verify cross-grade boundary: Mont 2 sections are NOT exposed to Mont 1 teachers
    expect(screen.queryByRole('option', { name: /Mont 2A/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /Mont 2B/i })).not.toBeInTheDocument();

    // Switch section to Mont 1B via top-right dropdown
    fireEvent.change(sectionSelect, { target: { value: 'mont-1b' } });

    // Active section state switches to Mont 1B (Room 106, Ms. Shalini)
    expect(screen.getAllByText(/Montessori 1B/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Room 106/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ms\. Shalini/i).length).toBeGreaterThan(0);
  });

  it('scopes attendance snapshot and PTM schedule to the selected class section', () => {
    const handleAddPtmSlot = vi.fn();

    const { rerender } = render(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onAddPtmSlot={handleAddPtmSlot}
        userRole="teacher"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
      />
    );

    // Mont 1A Attendance Snapshot
    expect(screen.getByText(/Mont 1A Daily Attendance Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Ms\. Ananya \(Room 104\)/i)).toBeInTheDocument();

    // Switch to PTM tab in Mont 1A
    const ptmTabBtn = screen.getByRole('button', { name: /My PTM Schedule/i });
    fireEvent.click(ptmTabBtn);

    expect(screen.getByText(/Mont 1A PTM Schedule:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Room 104 \(Mont 1A Classroom\)/i).length).toBeGreaterThan(0);

    // Re-render as Mont 1B
    rerender(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onAddPtmSlot={handleAddPtmSlot}
        userRole="teacher"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
      />
    );

    // Mont 1B Attendance Snapshot & PTM
    expect(screen.getByText(/Mont 1B PTM Schedule:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Room 106 \(Mont 1B Classroom\)/i).length).toBeGreaterThan(0);

    // Switch back to leave tab to verify Mont 1B attendance
    const leaveTabBtn = screen.getByRole('button', { name: /Leave Approvals \(Mont 1B\)/i });
    fireEvent.click(leaveTabBtn);
    expect(screen.getByText(/Mont 1B Daily Attendance Snapshot/i)).toBeInTheDocument();
    expect(screen.getByText(/Ms\. Shalini \(Room 106\)/i)).toBeInTheDocument();
  });

  it('enforces targeted notice distribution: parents do not receive foreign section notices', () => {
    // Parent of Aarav (Mont 1A)
    render(
      <CircularsModule
        circulars={MOCK_CIRCULARS}
        onAcknowledge={vi.fn()}
        userRole="parent"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
      />
    );

    // Parent sees School-Wide notices
    expect(screen.getByText(/Annual Sports Day 2026 Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Advisory on Seasonal Flu/i)).toBeInTheDocument();

    // Parent sees Grade-Tier Mont 1 notices
    expect(screen.getByText(/Educational Field Visit to the Fire Station/i)).toBeInTheDocument();

    // Parent sees Mont 1A Section notice
    expect(screen.getByText(/Mont 1A Community Fruit Salad Day/i)).toBeInTheDocument();

    // Parent does NOT see Mont 1B Section notice
    expect(screen.queryByText(/Mont 1B Eco-Clay Modeling/i)).not.toBeInTheDocument();
  });

  it('scopes media gallery videos and booklets to the active class section', () => {
    const { rerender } = render(
      <MediaGalleryModule
        media={MOCK_MEDIA}
        userRole="parent"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
      />
    );

    // Mont 1A parent sees Mont 1A video
    expect(screen.getByText(/Music Circle: "The Wheels on the Bus"/i)).toBeInTheDocument();
    // Mont 1A parent sees grade-wide Mont 1 booklet
    expect(screen.getByText(/Dusshera Celebrations & Sensorial Sensations/i)).toBeInTheDocument();
    // Mont 1A parent does NOT see Mont 1B video
    expect(screen.queryByText(/Mont 1B Music Circle: "Five Little Ducks"/i)).not.toBeInTheDocument();

    // Switch to Mont 1B
    rerender(
      <MediaGalleryModule
        media={MOCK_MEDIA}
        userRole="parent"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
      />
    );

    // Mont 1B parent sees Mont 1B video
    expect(screen.getByText(/Mont 1B Music Circle: "Five Little Ducks"/i)).toBeInTheDocument();
    // Mont 1B parent does NOT see Mont 1A video
    expect(screen.queryByText(/Music Circle: "The Wheels on the Bus"/i)).not.toBeInTheDocument();
  });

  it('filters class roster directory by active section for teachers', () => {
    render(<App />);

    // Log out to access sign-in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Sign in as Teacher
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    // Open Class Roster directory modal
    const rosterBtn = screen.getByTitle(/Class Roster & Student Directory/i);
    fireEvent.click(rosterBtn);

    // In Mont 1A: Aarav Sharma is present, Diya Sen (Mont 1B) is not
    expect(screen.getAllByText('Aarav Sharma').length).toBeGreaterThan(0);
    expect(screen.queryByText('Diya Sen')).not.toBeInTheDocument();

    // Close modal
    const closeBtns = screen.getAllByRole('button');
    const closeBtn = closeBtns.find(b => b.querySelector('svg.lucide-x'));
    if (closeBtn) fireEvent.click(closeBtn);

    // Switch section to Mont 1B via top-right dropdown
    const sectionSelect = screen.getByTitle('Switch Active Class Section');
    fireEvent.change(sectionSelect, { target: { value: 'mont-1b' } });

    // Open Class Roster directory modal again
    fireEvent.click(rosterBtn);

    // In Mont 1B: Diya Sen is present, Aarav Sharma (Mont 1A) is not
    expect(screen.getAllByText('Diya Sen').length).toBeGreaterThan(0);
    expect(screen.queryByText('Aarav Sharma')).not.toBeInTheDocument();
  });

  it('strictly isolates section switching to teacher grade tier and blocks cross-level switching', () => {
    render(<App />);

    // Log out to access sign-in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Sign in as Teacher (Ms. Ananya, Mont 1)
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    const sectionSelect = screen.getByTitle('Switch Active Class Section') as HTMLSelectElement;
    expect(sectionSelect).toBeInTheDocument();

    // Verify exactly the 4 Mont 1 sections are options
    const options = Array.from(sectionSelect.options).map(o => o.value);
    expect(options).toEqual(['mont-1a', 'mont-1b', 'mont-1c', 'mont-1d']);
    expect(options).not.toContain('mont-2a');
    expect(options).not.toContain('mont-2b');

    // Select Mont 1C
    fireEvent.change(sectionSelect, { target: { value: 'mont-1c' } });
    expect(screen.getAllByText(/Montessori 1C/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Room 108/i).length).toBeGreaterThan(0);
  });
});
