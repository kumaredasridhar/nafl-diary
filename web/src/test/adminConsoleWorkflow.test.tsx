import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { AdminConsoleModule } from '../components/AdminConsoleModule';
import {
  MOCK_SECTIONS,
  MOCK_CLASS_ROSTER,
  MOCK_CIRCULARS,
  MOCK_FEES
} from '../data/mockData';

describe('Suite L: Admin Assistant & Registrar Operations (Annual Mapping & In-Year Admin)', () => {
  it('enables 1-tap Admin Office login and defaults directly into the Admin Desk', () => {
    render(<App />);

    // Sign out from default session
    const signOutBtn = screen.getByTitle('Sign Out');
    fireEvent.click(signOutBtn);

    // Sign in using 1-tap Admin Office button
    const adminSignInBtn = screen.getByText(/👨‍💼 Admin Office/i);
    fireEvent.click(adminSignInBtn);

    // Header displays Admin Desk role and Mr. Sundaram
    expect(screen.getAllByText(/Mr\. Sundaram/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Admin Desk/i).length).toBeGreaterThan(0);

    // Directly active on Admin Desk console
    expect(screen.getByText(/NAFL Administrative & Registrar Control Desk/i)).toBeInTheDocument();
    expect(screen.getByText(/Staff Office/i)).toBeInTheDocument();
  });

  it('Point 1: loads, parses, and commits master CSV student intake spreadsheet', () => {
    const handleUpdateRoster = vi.fn();

    render(
      <AdminConsoleModule
        sections={MOCK_SECTIONS}
        onUpdateSections={vi.fn()}
        classRoster={MOCK_CLASS_ROSTER}
        onUpdateClassRoster={handleUpdateRoster}
        onAddStudent={vi.fn()}
        circulars={MOCK_CIRCULARS}
        onAddCircular={vi.fn()}
        fees={MOCK_FEES}
      />
    );

    // Initial state: no CSV parsed table
    expect(screen.queryByText(/Parsed Intake Preview/i)).not.toBeInTheDocument();

    // Click 1-tap test load sample CSV button
    const loadSampleBtn = screen.getByRole('button', { name: /1-Tap Test: Load Sample 2026–27 CSV/i });
    fireEvent.click(loadSampleBtn);

    // Parsed table appears with 4 students detected
    expect(screen.getByText(/Parsed Intake Preview \(4 Students Detected\)/i)).toBeInTheDocument();
    expect(screen.getByText(/All Format Rules Validated ✓/i)).toBeInTheDocument();

    // Verify sample students in table
    expect(screen.getByText('NAFL/2026/M1-091')).toBeInTheDocument();
    expect(screen.getByText('Devansh Hegde')).toBeInTheDocument();
    expect(screen.getByText('NAFL/2026/M1-092')).toBeInTheDocument();
    expect(screen.getByText('Anika Sen')).toBeInTheDocument();

    // Click Commit button
    const commitBtn = screen.getByRole('button', { name: /Commit 4 Students to Live Registry/i });
    fireEvent.click(commitBtn);

    // Verify callback was called with 4 newly enrolled students prepended
    expect(handleUpdateRoster).toHaveBeenCalledTimes(1);
    const updatedList = handleUpdateRoster.mock.calls[0][0];
    expect(updatedList.length).toBe(MOCK_CLASS_ROSTER.length + 4);
    expect(updatedList[0].student.admissionNumber).toBe('NAFL/2026/M1-091');
    expect(updatedList[0].student.name).toBe('Devansh Hegde');

    // Success toast appears
    expect(screen.getByText(/Successfully enrolled 4 students into NAFL Student Registry!/i)).toBeInTheDocument();
  });

  it('Point 2: modifies staff section assignment matrix and room allocations', () => {
    const handleUpdateSections = vi.fn();

    render(
      <AdminConsoleModule
        sections={MOCK_SECTIONS}
        onUpdateSections={handleUpdateSections}
        classRoster={MOCK_CLASS_ROSTER}
        onUpdateClassRoster={vi.fn()}
        onAddStudent={vi.fn()}
        circulars={MOCK_CIRCULARS}
        onAddCircular={vi.fn()}
        fees={MOCK_FEES}
      />
    );

    // Verify Mont 1A card exists
    expect(screen.getByText('Montessori 1A')).toBeInTheDocument();

    // Locate Mont 1A classroom room input
    const roomInputs = screen.getAllByDisplayValue('Room 104');
    expect(roomInputs.length).toBeGreaterThan(0);
    fireEvent.change(roomInputs[0], { target: { value: 'Room 104-East' } });

    // Save staff matrix
    const saveMatrixBtn = screen.getByRole('button', { name: /Save Staff Assignments/i });
    fireEvent.click(saveMatrixBtn);

    expect(handleUpdateSections).toHaveBeenCalledTimes(1);
    const savedSections = handleUpdateSections.mock.calls[0][0];
    const mont1A = savedSections.find((s: any) => s.id === 'mont-1a');
    expect(mont1A.roomNumber).toBe('Room 104-East');

    expect(screen.getByText(/Saved updated staff and room allocations across all class sections!/i)).toBeInTheDocument();
  });

  it('Point 3: executes cohort rollover with student retention flexibility and audit logging', () => {
    const handleUpdateRoster = vi.fn();

    render(
      <AdminConsoleModule
        sections={MOCK_SECTIONS}
        onUpdateSections={vi.fn()}
        classRoster={MOCK_CLASS_ROSTER}
        onUpdateClassRoster={handleUpdateRoster}
        onAddStudent={vi.fn()}
        circulars={MOCK_CIRCULARS}
        onAddCircular={vi.fn()}
        fees={MOCK_FEES}
      />
    );

    // Source cohort has 4 students in mock data (Mont 1A)
    const mont1AStudents = MOCK_CLASS_ROSTER.filter(s => s.student.sectionId === 'mont-1a');
    expect(mont1AStudents.length).toBe(4);

    // Target student to retain: first student (Aarav Sharma)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4);

    // Initially all 4 are checked for promotion
    expect(checkboxes[0]).toBeChecked();

    // Uncheck first student to retain
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();

    // Retain indicator appears
    expect(screen.getByText(/⚠️ Retain in Current Grade/i)).toBeInTheDocument();
    expect(screen.getByText(/Promotion Summary: 3 Promoted to Montessori 2A/i)).toBeInTheDocument();
    expect(screen.getByText(/1 student\(s\) unchecked & retained in Montessori 1A\./i)).toBeInTheDocument();

    // Click execute rollover button
    const rolloverBtn = screen.getByRole('button', { name: /Execute Academic Rollover & Promote Cohort/i });
    fireEvent.click(rolloverBtn);

    // Callback called with updated roster
    expect(handleUpdateRoster).toHaveBeenCalledTimes(1);
    const updatedRoster = handleUpdateRoster.mock.calls[0][0];
    const retainedStudent = updatedRoster.find((s: any) => s.student.admissionNumber === mont1AStudents[0].student.admissionNumber);
    expect(retainedStudent.student.academicYear).toBe('2027–2028 (Retained)');

    // Promoted student verified
    const promotedStudent = updatedRoster.find((s: any) => s.student.admissionNumber === mont1AStudents[1].student.admissionNumber);
    expect(promotedStudent.student.grade).toBe('Montessori 2');
    expect(promotedStudent.student.sectionId).toBe('mont-2a');

    // Audit log records entry
    expect(screen.getByText(/Successfully promoted 3 students to Montessori 2A! \(1 retained\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Today, Just Now by Mr. Sundaram \(Admin Office \/ Registrar\)/i)).toBeInTheDocument();
  });

  it('performs in-year mid-term student admission and certificate generation', () => {
    const handleAddStudent = vi.fn();

    render(
      <AdminConsoleModule
        sections={MOCK_SECTIONS}
        onUpdateSections={vi.fn()}
        classRoster={MOCK_CLASS_ROSTER}
        onUpdateClassRoster={vi.fn()}
        onAddStudent={handleAddStudent}
        circulars={MOCK_CIRCULARS}
        onAddCircular={vi.fn()}
        fees={MOCK_FEES}
      />
    );

    // Switch to In-Year Admissions & TC Generator tab
    const admissionsTab = screen.getByRole('button', { name: /In-Year Admissions & TC Generator/i });
    fireEvent.click(admissionsTab);

    // Open quick intake form
    const enrollBtn = screen.getByRole('button', { name: /Enroll Mid-Term Student/i });
    fireEvent.click(enrollBtn);

    expect(screen.getByText('Quick In-Year Student Intake')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Maya Krishnan/i), { target: { value: 'Devika Menon' } });
    fireEvent.change(screen.getByPlaceholderText(/NAFL\/2026\/M1-099/i), { target: { value: 'NAFL/2026/M1-095' } });
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Ramesh Krishnan/i), { target: { value: 'Girish Menon' } });
    fireEvent.change(screen.getByPlaceholderText(/\+91 98860 12345/i), { target: { value: '+91 98860 99887' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /^Enroll Student$/i });
    fireEvent.click(submitBtn);

    expect(handleAddStudent).toHaveBeenCalledTimes(1);
    const added = handleAddStudent.mock.calls[0][0];
    expect(added.student.name).toBe('Devika Menon');
    expect(added.student.admissionNumber).toBe('NAFL/2026/M1-095');

    // Test Certificate Generation
    const previewCertBtn = screen.getByRole('button', { name: /Generate & Preview Document/i });
    fireEvent.click(previewCertBtn);

    // Document letterhead preview
    expect(screen.getAllByText(/National Academy For Learning/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Official Bonafide Study Certificate/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Registrar & Controller of Admissions/i)).toBeInTheDocument();
    expect(screen.getByText(/Exemplary/i)).toBeInTheDocument();

    // Close preview
    const closeBtn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Registrar & Controller of Admissions/i)).not.toBeInTheDocument();
  });

  it('publishes school-wide emergency notices, monitors transport, and oversees fee ledger', () => {
    const handleAddCircular = vi.fn();

    render(
      <AdminConsoleModule
        sections={MOCK_SECTIONS}
        onUpdateSections={vi.fn()}
        classRoster={MOCK_CLASS_ROSTER}
        onUpdateClassRoster={vi.fn()}
        onAddStudent={vi.fn()}
        circulars={MOCK_CIRCULARS}
        onAddCircular={handleAddCircular}
        fees={MOCK_FEES}
      />
    );

    // 1. Emergency Broadcasts Tab
    const emergencyTab = screen.getByRole('button', { name: /Emergency Broadcasts/i });
    fireEvent.click(emergencyTab);

    expect(screen.getByText(/School-Wide Emergency Broadcast Authority/i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Heavy Rain Advisory/i), {
      target: { value: 'Bengaluru Civic Weather Warning' }
    });
    fireEvent.change(screen.getByPlaceholderText(/Details of the announcement/i), {
      target: { value: 'Online classes will be conducted due to heavy downpours.' }
    });

    const broadcastBtn = screen.getByRole('button', { name: /Broadcast Notice to All Parents/i });
    fireEvent.click(broadcastBtn);

    expect(handleAddCircular).toHaveBeenCalledTimes(1);
    const dispatchedCirc = handleAddCircular.mock.calls[0][0];
    expect(dispatchedCirc.category).toBe('Urgent');
    expect(dispatchedCirc.targetScope).toBe('all_school');
    expect(dispatchedCirc.requiresAcknowledgement).toBe(true);

    // 2. Bus Transport Routes Tab
    const transportTab = screen.getByRole('button', { name: /Bus Transport Routes/i });
    fireEvent.click(transportTab);

    expect(screen.getByText('Route 12: Indiranagar')).toBeInTheDocument();
    expect(screen.getByText('Route 8: Koramangala')).toBeInTheDocument();
    expect(screen.getByText('Route 4: Malleshwaram')).toBeInTheDocument();
    expect(screen.getByText(/Ramesh Gowda/i)).toBeInTheDocument();

    // 3. Fee Ledger Tab
    const feeTab = screen.getByRole('button', { name: /Fee Ledger Oversight/i });
    fireEvent.click(feeTab);

    expect(screen.getByText('96% Collected')).toBeInTheDocument();
    expect(screen.getByText('88% Collected')).toBeInTheDocument();

    const sendNudgesBtn = screen.getByRole('button', { name: /Send Discreet Reminders/i });
    fireEvent.click(sendNudgesBtn);

    expect(screen.getByText(/Dispatched automated SMS\/WhatsApp fee reminders to pending parent accounts\./i)).toBeInTheDocument();
  });
});
