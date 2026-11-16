import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudentProfileModal } from '../components/StudentProfileModal';
import { MOCK_STUDENT_PROFILE } from '../data/mockData';

describe('Suite 7: Student Profile & Escort Governance (Option B)', () => {
  it('renders student profile and authorized pickup escorts in 2-column grid', () => {
    render(
      <StudentProfileModal
        isOpen={true}
        onClose={() => {}}
        profile={MOCK_STUDENT_PROFILE}
        userRole="parent"
      />
    );

    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText('Roll #14')).toBeInTheDocument();
    expect(screen.getByText('Authorized Pickup & Drop Escorts (Gate Pass Active)')).toBeInTheDocument();
    expect(screen.getByText('Sunder Sharma')).toBeInTheDocument();
  });

  it('displays Parent Declared status badge with instant gate authorization notice', () => {
    render(
      <StudentProfileModal
        isOpen={true}
        onClose={() => {}}
        profile={MOCK_STUDENT_PROFILE}
        userRole="parent"
      />
    );

    const declaredBadges = screen.getAllByText('Parent Declared (Active)');
    expect(declaredBadges.length).toBeGreaterThan(0);
  });

  it('allows teacher to 1-tap stamp an escort as Verified by School', () => {
    const handleUpdateProfile = vi.fn();
    render(
      <StudentProfileModal
        isOpen={true}
        onClose={() => {}}
        profile={MOCK_STUDENT_PROFILE}
        userRole="teacher"
        onUpdateProfile={handleUpdateProfile}
      />
    );

    const acknowledgeBtns = screen.getAllByText('Acknowledge');
    expect(acknowledgeBtns.length).toBeGreaterThan(0);
    fireEvent.click(acknowledgeBtns[0]);

    expect(handleUpdateProfile).toHaveBeenCalled();
  });

  it('opens photo lightbox modal when clicking an avatar', () => {
    render(
      <StudentProfileModal
        isOpen={true}
        onClose={() => {}}
        profile={MOCK_STUDENT_PROFILE}
        userRole="parent"
      />
    );

    const avatarButtons = screen.getAllByTitle('Click to view enlarged photo');
    expect(avatarButtons.length).toBeGreaterThan(0);
    fireEvent.click(avatarButtons[0]);

    expect(screen.getByText('Close Preview')).toBeInTheDocument();
    expect(screen.getByText('Pass ID:')).toBeInTheDocument();
  });
});
