import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { RequestsModule } from '../components/RequestsModule';
import { StudentProfileModal } from '../components/StudentProfileModal';
import {
  MOCK_LEAVE_REQUESTS,
  MOCK_PTM_SLOTS,
  MOCK_CLASS_ROSTER,
  MOCK_STUDENT_PROFILE
} from '../data/mockData';

describe('Suite: Covering Teacher Mode & Soft Guardrails', () => {
  it('auto-defaults to home section on teacher login and activates covering mode on section switch', () => {
    render(<App />);

    // Log out to access sign-in screen
    const logoutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(logoutBtn);

    // Sign in as Teacher
    const teacherSignInBtn = screen.getByText(/👩‍🏫 Teacher/i);
    fireEvent.click(teacherSignInBtn);

    // Initial state: Mont 1A is home section
    expect(screen.getAllByText(/Montessori 1A/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Home Section \(Your Class\)/i).length).toBeGreaterThan(0);

    // Switch section to Mont 1B via top-right dropdown
    const sectionSelect = screen.getByTitle('Switch Active Class Section');
    fireEvent.change(sectionSelect, { target: { value: 'mont-1b' } });

    // Active section state switches to Mont 1B and activates Covering Teacher Mode
    expect(screen.getAllByText(/Montessori 1B/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Covering Teacher Mode \(Primary: Ms\. Shalini\)/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^Covering$/i).length).toBeGreaterThan(0);
  });

  it('triggers soft guardrail confirmation modal when approving cross-section leave request', () => {
    const handleApproveLeave = vi.fn();

    render(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={vi.fn()}
        userRole="teacher"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
        isCoveringTeacher={true}
        coveringTeacherName="Ms. Ananya"
      />
    );

    // Shows covering banner in leave tab
    expect(screen.getByText(/Covering Teacher Mode active for Mont 1B/i)).toBeInTheDocument();

    // Find pending leave for Diya Sen (Mont 1B)
    const approveBtn = screen.getByRole('button', { name: /Approve/i });
    fireEvent.click(approveBtn);

    // Confirmation modal appears
    expect(screen.getByText(/Covering Teacher Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Approve Leave Application for Diya Sen/i)).toBeInTheDocument();
    expect(screen.getByText(/Target Section/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ms\. Shalini/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ms\. Ananya/i).length).toBeGreaterThan(0);

    // Click Cancel -> callback NOT called
    const cancelBtns = screen.getAllByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtns[0]);
    expect(handleApproveLeave).not.toHaveBeenCalled();

    // Click Approve again and Confirm
    fireEvent.click(approveBtn);
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Audit Stamp/i });
    fireEvent.click(confirmBtn);

    // Callback invoked with covering teacher audit stamp
    expect(handleApproveLeave).toHaveBeenCalledWith(
      'leave-b01',
      expect.stringContaining('Covering Teacher (Ms. Ananya)')
    );
  });

  it('bypasses covering confirmation modal in home section (direct approval)', () => {
    const handleApproveLeave = vi.fn();
    const pendingMont1aLeaves = [
      {
        id: 'leave-1a-test',
        studentName: 'Aarav Sharma',
        grade: 'Mont 1A',
        sectionId: 'mont-1a',
        type: 'Medical / Illness' as const,
        startDate: '2026-11-25',
        endDate: '2026-11-26',
        numberOfDays: 2,
        reason: 'Pediatrician advised 2 days rest',
        status: 'Pending' as const,
        submittedOn: '24 Nov 2026'
      }
    ];

    render(
      <RequestsModule
        leaveRequests={pendingMont1aLeaves}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={vi.fn()}
        userRole="teacher"
        activeSectionName="Mont 1A"
        activeSectionId="mont-1a"
        isCoveringTeacher={false}
        coveringTeacherName="Ms. Ananya"
      />
    );

    // In Mont 1A, no covering banner
    expect(screen.queryByText(/Covering Teacher Mode active for Mont 1A/i)).not.toBeInTheDocument();

    // Click Approve on pending leave
    const approveBtn = screen.getByRole('button', { name: /Approve/i });
    fireEvent.click(approveBtn);

    // No modal shown, directly approved as Class Teacher
    expect(screen.queryByText(/Covering Teacher Confirmation/i)).not.toBeInTheDocument();
    expect(handleApproveLeave).toHaveBeenCalledWith(
      'leave-1a-test',
      expect.stringContaining('Approved by Class Teacher')
    );
  });

  it('triggers soft guardrail confirmation modal on cross-section PTM slot deletion', () => {
    const handleDeletePtmSlot = vi.fn();

    render(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={vi.fn()}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={vi.fn()}
        onDeletePtmSlot={handleDeletePtmSlot}
        userRole="teacher"
        activeSectionName="Mont 1B"
        activeSectionId="mont-1b"
        isCoveringTeacher={true}
        coveringTeacherName="Ms. Ananya"
      />
    );

    // Switch to PTM tab
    const ptmTabBtn = screen.getByRole('button', { name: /My PTM Schedule/i });
    fireEvent.click(ptmTabBtn);

    // Find delete button on open slot
    const deleteBtns = screen.getAllByTitle(/Delete Slot/i);
    expect(deleteBtns.length).toBeGreaterThan(0);
    fireEvent.click(deleteBtns[0]);

    // Confirmation modal appears
    expect(screen.getByText(/Covering Teacher Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete PTM Slot/i)).toBeInTheDocument();

    // Confirm
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Audit Stamp/i });
    fireEvent.click(confirmBtn);
    expect(handleDeletePtmSlot).toHaveBeenCalled();
  });

  it('triggers soft guardrail when stamping escort verification in cross-section roster', () => {
    const handleUpdateProfile = vi.fn();
    const diyaSenProfile = MOCK_CLASS_ROSTER.find(s => s.student.admissionNumber === 'NAFL/2026/M1-061')!;
    const mont1bStudentWithDeclaredEscort = {
      ...diyaSenProfile,
      parents: {
        ...diyaSenProfile.parents,
        authorizedGuardians: [
          {
            id: 'g-test-1',
            name: 'Sunil Sen',
            relation: 'Grandfather',
            mobile: '+91 98450 11223',
            photo: 'data:image/svg+xml;base64,sample',
            authorizationType: 'Pickup & Drop' as const,
            gatePassId: 'NAFL-GP-2026-050A',
            status: 'parent_declared' as const,
            verified: false
          }
        ]
      }
    };

    render(
      <StudentProfileModal
        isOpen={true}
        onClose={vi.fn()}
        profile={MOCK_STUDENT_PROFILE}
        onUpdateProfile={handleUpdateProfile}
        userRole="teacher"
        classRoster={[mont1bStudentWithDeclaredEscort]}
        isCoveringTeacher={true}
        coveringTeacherName="Ms. Ananya"
        activeSectionName="Mont 1B"
      />
    );

    // Click "Acknowledge" stamp
    const stampBtn = screen.getByRole('button', { name: /Acknowledge/i });
    fireEvent.click(stampBtn);

    // Guardrail modal appears
    expect(screen.getByText(/Covering Teacher Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Verify Pickup Escort: Sunil Sen/i)).toBeInTheDocument();

    // Confirm
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Audit Stamp/i });
    fireEvent.click(confirmBtn);

    // Profile updated with covering teacher audit stamp
    expect(handleUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        parents: expect.objectContaining({
          authorizedGuardians: expect.arrayContaining([
            expect.objectContaining({
              status: 'verified',
              verifiedBy: 'Ms. Ananya (Covering Teacher)'
            })
          ])
        })
      })
    );
  });
});
