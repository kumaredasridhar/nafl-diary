import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../components/Header';
import { CalendarModule } from '../components/CalendarModule';
import { CircularsModule } from '../components/CircularsModule';
import { ReferenceModal } from '../components/ReferenceModal';
import { MediaGalleryModule } from '../components/MediaGalleryModule';
import { RequestsModule } from '../components/RequestsModule';
import {
  MOCK_EVENTS,
  MOCK_CURRICULUM_BY_MONTH,
  MOCK_CIRCULARS,
  MOCK_FEES,
  MOCK_MEDIA,
  MOCK_LEAVE_REQUESTS,
  MOCK_PTM_SLOTS
} from '../data/mockData';

const MOCK_CURRICULUM_NOV = MOCK_CURRICULUM_BY_MONTH['2026-11'];

describe('Suite 1: Header Branding & Proportion', () => {
  it('renders NAFL and properly proportioned National Academy For Learning text', () => {
    render(
      <Header
        activeChild="Aarav Sharma"
        onOpenFeedback={() => {}}
        onOpenReference={() => {}}
        onOpenProfile={() => {}}
        userSession={{ role: 'parent', name: 'Rajesh Sharma', identifier: 'NAFL-2026-084', childName: 'Aarav', grade: 'Mont 1A' }}
        onLogout={() => {}}
      />
    );

    expect(screen.getByText('NAFL')).toBeInTheDocument();
    const fullName = screen.getByText('National Academy For Learning');
    expect(fullName).toBeInTheDocument();
    expect(fullName.className).toContain('font-semibold');
  });
});

describe('Suite 2: Calendar & .ics Export', () => {
  it('does NOT render redundant Official NAFL Academic Calendar title', () => {
    render(
      <CalendarModule
        events={MOCK_EVENTS}
        curriculum={MOCK_CURRICULUM_NOV}
        userRole="parent"
      />
    );

    expect(screen.queryByText('Official NAFL Academic Calendar 2026–2027')).not.toBeInTheDocument();
    expect(screen.getByText('Export Phone Calendar (.ics)')).toBeInTheDocument();
    expect(screen.getByText('Syncs with Apple Calendar, Google Calendar & Outlook')).toBeInTheDocument();
  });

  it('triggers .ics file download when clicking export button', () => {
    // Mock URL and document.createElement
    const createObjectURL = vi.fn().mockReturnValue('blob:test');
    const revokeObjectURL = vi.fn();
    window.URL.createObjectURL = createObjectURL;
    window.URL.revokeObjectURL = revokeObjectURL;

    render(
      <CalendarModule
        events={MOCK_EVENTS}
        curriculum={MOCK_CURRICULUM_NOV}
        userRole="parent"
      />
    );

    const exportBtn = screen.getByText('Export Phone Calendar (.ics)');
    fireEvent.click(exportBtn);

    expect(createObjectURL).toHaveBeenCalled();
    expect(screen.getByText(/Downloaded NAFL_Academic_Calendar_2026_27.ics/i)).toBeInTheDocument();
  });
});

describe('Suite 3: Circulars & Acknowledgements', () => {
  it('allows parent to acknowledge and digitally sign circular', () => {
    const handleAcknowledge = vi.fn();
    render(
      <CircularsModule
        circulars={MOCK_CIRCULARS}
        onAcknowledge={handleAcknowledge}
        userRole="parent"
      />
    );

    const signBtns = screen.getAllByText('Acknowledge & Sign Receipt');
    expect(signBtns.length).toBeGreaterThan(0);
    fireEvent.click(signBtns[0]);
    expect(handleAcknowledge).toHaveBeenCalled();
  });

  it('shows section compliance tracker in teacher role', () => {
    render(
      <CircularsModule
        circulars={MOCK_CIRCULARS}
        onAcknowledge={() => {}}
        userRole="teacher"
      />
    );

    expect(screen.getByText(/Mont 1A Section Compliance & Circulars/i)).toBeInTheDocument();
    expect(screen.getAllByText('Mont 1A Signed').length).toBeGreaterThan(0);
  });
});

describe('Suite 4: Media Gallery & Multimedia Stubs', () => {
  it('opens interactive video player modal when Play Clip is clicked', () => {
    render(
      <MediaGalleryModule
        media={MOCK_MEDIA}
        userRole="parent"
      />
    );

    const playBtns = screen.getAllByText(/Play Clip/i);
    expect(playBtns.length).toBeGreaterThan(0);
    fireEvent.click(playBtns[0]);

    expect(screen.getByText('Close Player')).toBeInTheDocument();
    expect(screen.getByText(/Real Audio Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Nursery Rhymes & Action Music/i)).toBeInTheDocument();
  });

  it('opens interactive photo album lightbox when View Photos is clicked', () => {
    render(
      <MediaGalleryModule
        media={MOCK_MEDIA}
        userRole="parent"
      />
    );

    const viewPhotoBtns = screen.getAllByText(/View Photos/i);
    expect(viewPhotoBtns.length).toBeGreaterThan(0);
    fireEvent.click(viewPhotoBtns[0]);

    expect(screen.getByText(/Save Photo/i)).toBeInTheDocument();
    expect(screen.getByText(/Photo 1 of/i)).toBeInTheDocument();
  });
});

describe('Suite 5: School Reference & Fee Receipt Modal', () => {
  it('opens authentic Official NAFL Tuition Fee Receipt modal with itemized breakdown', () => {
    render(
      <ReferenceModal
        isOpen={true}
        onClose={() => {}}
        fees={MOCK_FEES}
        userRole="parent"
      />
    );

    const receiptBtns = screen.getAllByText(/View \/ Download Receipt/i);
    expect(receiptBtns.length).toBeGreaterThan(0);
    fireEvent.click(receiptBtns[0]);

    expect(screen.getByText('OFFICIAL TUITION FEE RECEIPT')).toBeInTheDocument();
    expect(screen.getByText('PAID & RECONCILED')).toBeInTheDocument();
    expect(screen.getByText('Print Official Copy')).toBeInTheDocument();
  });
});

describe('Suite 6: Requests Module & Certificate Generator', () => {
  it('generates authentic Bonafide Certificate with printable letterhead', () => {
    render(
      <RequestsModule
        leaveRequests={MOCK_LEAVE_REQUESTS}
        onApplyLeave={() => {}}
        ptmSlots={MOCK_PTM_SLOTS}
        onBookPtmSlot={() => {}}
        userRole="parent"
      />
    );

    // Switch to certificates tab
    const certTab = screen.getByText('Official Letters');
    fireEvent.click(certTab);

    // Click generate certificate
    const genBtn = screen.getByText('Generate / View Certificate');
    fireEvent.click(genBtn);

    expect(screen.getByText('Official Bonafide / Study Certificate')).toBeInTheDocument();
    expect(screen.getByText(/TO WHOMSOEVER IT MAY CONCERN/i)).toBeInTheDocument();
    expect(screen.getByText('Print Official Certificate')).toBeInTheDocument();
  });
});
