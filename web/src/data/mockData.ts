import {
  AVATAR_STUDENT_BOY,
  AVATAR_STUDENT_GIRL,
  AVATAR_FATHER,
  AVATAR_MOTHER,
  AVATAR_GRANDFATHER,
  AVATAR_GRANDMOTHER,
  AVATAR_DRIVER
} from './avatarIcons';

export interface ClassSection {
  id: string; // e.g. 'mont-1a', 'mont-1b', 'mont-2a'
  name: string; // e.g. 'Montessori 1A', 'Montessori 1B'
  shortName: string; // e.g. 'Mont 1A', 'Mont 1B'
  gradeTier: string; // e.g. 'Montessori 1', 'Montessori 2'
  roomNumber: string; // e.g. 'Room 104', 'Room 106'
  primaryTeacher: {
    id: string;
    name: string; // e.g. 'Ms. Ananya', 'Ms. Shalini'
    email: string;
  };
  coTeacher?: {
    name: string;
  };
  studentCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  type: 'holiday' | 'event' | 'dress_up' | 'ptm' | 'exam';
  description?: string;
  dressUpPrompt?: string;
  bringToSchool?: string;
  targetGrades: string[];
}

export interface MonthlyLearningObjective {
  month: string;
  grade: string;
  themeTitle: string;
  themeDescription: string;
  objectives: {
    area: string;
    items: string[];
  }[];
  specialDates: {
    date: string;
    day: string;
    title: string;
    dressCode?: string;
    bringItem?: string;
  }[];
  pdfFileName: string;
  pdfFileSize: string;
  uploadedAt: string;
}

export interface CircularNotice {
  id: string;
  circularNumber: string;
  title: string;
  publishDate: string;
  category: 'Urgent' | 'General' | 'Event' | 'Field Trip';
  target: string;
  targetScope?: 'all_school' | 'grade_tier' | 'section';
  targetSectionId?: string; // e.g. 'mont-1a', 'mont-1b'
  requiresAcknowledgement: boolean;
  acknowledgedByParent: boolean;
  acknowledgedAt?: string;
  summary: string;
  pdfFileName: string;
  pdfFileSize: string;
}

export interface MonthlyPhotoCollage {
  id: string;
  month: string;
  grade: string;
  title: string;
  coverImage: string;
  photoCount: number;
  pdfFileName: string;
  pdfFileSize: string;
  highlights: string[];
}

export interface MediaItem {
  id: string;
  type: 'booklet' | 'photo' | 'video';
  title: string;
  date: string;
  grade: string;
  sectionId?: string; // e.g. 'mont-1a', 'mont-1b'
  thumbnail: string;
  itemCount?: number;
  duration?: string; // e.g. "0:48"
  videoUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  highlights?: string[];
  description?: string;
}

export interface AuthorizedGuardian {
  id: string;
  name: string;
  relation: string; // e.g. 'Grandfather', 'Uncle', 'Family Driver', 'Daycare Nanny'
  mobile: string;
  photo: string;
  authorizationType: 'Pickup & Drop' | 'Pickup Only' | 'Emergency Only';
  gatePassId: string; // e.g. 'NAFL-GP-2026-042A'
  status: 'verified' | 'parent_declared' | 'query_raised';
  verified?: boolean;
  declaredBy?: string; // e.g. 'Rajesh Sharma (Father)'
  declaredAt?: string; // e.g. '12 Nov 2026, 09:30 AM'
  verifiedBy?: string; // e.g. 'Ms. Ananya (Class Teacher)'
  verifiedAt?: string; // e.g. '02 Jun 2026'
  queryReason?: string; // e.g. 'Please confirm driver license plate'
}

export interface StudentProfile {
  student: {
    name: string;
    admissionNumber: string;
    grade: string;
    section: string;
    sectionId?: string; // e.g. 'mont-1a', 'mont-1b'
    rollNumber: string;
    dob: string;
    bloodGroup: string;
    house: string;
    academicYear: string;
    photo?: string;
  };
  parents: {
    father: {
      name: string;
      mobile: string;
      email: string;
      occupation: string;
      photo?: string;
    };
    mother: {
      name: string;
      mobile: string;
      email: string;
      occupation: string;
      photo?: string;
    };
    emergencyContact: {
      name: string;
      relation: string;
      mobile: string;
      photo?: string;
    };
    authorizedGuardians?: AuthorizedGuardian[];
    residentialAddress: string;
    transportMode: string;
    busRouteNumber?: string;
    busStopName?: string;
  };
}

export interface FeedbackItem {
  id: string;
  recipient: 'Teacher' | 'Principal' | 'Parent';
  senderRole: 'parent' | 'teacher';
  senderName: string;
  category: 'Academic Progress' | 'Behavioral Note' | 'General' | 'Appreciation' | 'Infrastructure';
  date: string;
  title: string;
  message: string;
  requiresAcknowledgement: boolean;
  acknowledged: boolean;
  acknowledgedAt?: string;
  reply?: string;
  replyAuthor?: string;
  replyDate?: string;
}

export interface FeeRecord {
  id: string;
  termTitle: string;
  academicYear: string;
  amount: string;
  status: 'Paid' | 'Upcoming' | 'Overdue';
  paidOn?: string;
  dueDate?: string;
  receiptNumber?: string;
  receiptFileName?: string;
}

export interface LeaveRequest {
  id: string;
  studentName: string;
  grade: string;
  sectionId?: string; // e.g. 'mont-1a', 'mont-1b'
  type: 'Medical / Illness' | 'Family Travel' | 'Urgent Event';
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedOn: string;
  reviewedBy?: string;
  teacherRemarks?: string;
}

export interface PtmSlot {
  id: string;
  date: string;
  timeSlot: string;
  teacherName: string;
  grade: string;
  sectionId?: string; // e.g. 'mont-1a', 'mont-1b'
  status: 'Available' | 'Booked' | 'Completed' | 'Blocked';
  bookedByStudentId?: string;
  location?: string;
}

export const MOCK_EVENTS: CalendarEvent[] = [
  // June 2026
  {
    id: 'e-jun-1',
    title: 'School Reopens for Academic Year 2026–27',
    date: '2026-06-08',
    type: 'event',
    description: 'Welcome back circle and settling-in orientation for Montessori children.',
    targetGrades: ['All']
  },
  {
    id: 'e-jun-2',
    title: 'Bakrid (Eid al-Adha)',
    date: '2026-06-17',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-jun-3',
    title: 'Mont 1 Parent Orientation Meeting',
    date: '2026-06-26',
    type: 'ptm',
    description: 'Montessori classroom methodology and daily routine walkthrough with teachers.',
    targetGrades: ['Mont 1']
  },

  // July 2026
  {
    id: 'e-jul-1',
    title: 'Muharram',
    date: '2026-07-17',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-jul-2',
    title: 'Green Day & Monsoon Nature Walk',
    date: '2026-07-24',
    type: 'dress_up',
    description: 'Sensorial exploration of green plants, leaves, and monsoon rain songs.',
    dressUpPrompt: 'Dress up in shades of green',
    bringToSchool: 'Bring one green vegetable or fruit (cucumber/green apple)',
    targetGrades: ['Mont 1', 'Mont 2']
  },

  // August 2026
  {
    id: 'e-aug-1',
    title: 'Independence Day Celebration',
    date: '2026-08-14',
    type: 'dress_up',
    description: 'Flag hoisting ceremony, patriotic songs, and tricolor craft display.',
    dressUpPrompt: 'Traditional Indian attire (Orange, White, or Green)',
    bringToSchool: 'One small tricolor hand flag',
    targetGrades: ['All']
  },
  {
    id: 'e-aug-2',
    title: 'Independence Day',
    date: '2026-08-15',
    type: 'holiday',
    description: 'National Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-aug-3',
    title: 'Raksha Bandhan',
    date: '2026-08-19',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-aug-4',
    title: 'Janmashtami Celebration',
    date: '2026-08-25',
    type: 'dress_up',
    description: 'Flute decoration craft and peacock feather activity.',
    dressUpPrompt: 'Traditional Krishna / Radha or bright festive wear',
    bringToSchool: 'Small clay pot or peacock feather prop',
    targetGrades: ['Mont 1', 'Mont 2']
  },
  {
    id: 'e-aug-5',
    title: 'Janmashtami',
    date: '2026-08-26',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },

  // September 2026
  {
    id: 'e-sep-1',
    title: 'Teachers\' Day Appreciation Circle',
    date: '2026-09-04',
    type: 'event',
    description: 'Children present handmade flower cards to Montessori aunties.',
    bringToSchool: 'One fresh flower from home garden',
    targetGrades: ['All']
  },
  {
    id: 'e-sep-2',
    title: 'Eid-e-Milad',
    date: '2026-09-16',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-sep-3',
    title: 'Grandparents\' Day Celebration',
    date: '2026-09-18',
    type: 'dress_up',
    description: 'Grandparents join grandchildren in classroom for storytelling and songs.',
    dressUpPrompt: 'Formal school uniform with polished black shoes',
    bringToSchool: 'Handmade portrait of grandparents',
    targetGrades: ['Mont 1', 'Mont 2']
  },

  // October 2026
  {
    id: 'e-oct-1',
    title: 'Gandhi Jayanti',
    date: '2026-10-02',
    type: 'holiday',
    description: 'National Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-oct-2',
    title: 'Dussehra & Autumn Vacation',
    date: '2026-10-19',
    endDate: '2026-10-24',
    type: 'holiday',
    description: 'School closed for Dussehra festival. Reopens on Monday, Oct 26.',
    targetGrades: ['All']
  },
  {
    id: 'e-oct-3',
    title: 'Diya Painting & Rangoli Workshop',
    date: '2026-10-29',
    type: 'dress_up',
    description: 'Clay modeling and non-toxic paint exploration for Diwali.',
    dressUpPrompt: 'Comfortable craft clothes (aprons provided in school)',
    bringToSchool: 'Small natural clay diya to paint',
    targetGrades: ['Mont 1', 'Mont 2']
  },

  // November 2026 (Current)
  {
    id: 'e-nov-1',
    title: 'Children\'s Day Celebration',
    date: '2026-11-14',
    type: 'dress_up',
    description: 'A fun day celebrating childhood with storytelling, games, and music.',
    dressUpPrompt: 'Dress up in bright traditional or party attire',
    bringToSchool: 'Bring a favorite healthy snack to share with friends',
    targetGrades: ['Mont 1', 'Mont 2', 'Grade 1', 'Grade 2']
  },
  {
    id: 'e-nov-2',
    title: 'Community Helpers Day',
    date: '2026-11-20',
    type: 'dress_up',
    description: 'Children learn about real-world heroes who help our society.',
    dressUpPrompt: 'Dress up as any helper: Doctor, Firefighter, Nurse, Chef, Police, or Teacher',
    bringToSchool: 'One simple cardboard prop matching the costume',
    targetGrades: ['Mont 1', 'Mont 2']
  },
  {
    id: 'e-nov-3',
    title: 'Guru Nanak Jayanti',
    date: '2026-11-24',
    type: 'holiday',
    description: 'School Holiday',
    targetGrades: ['All']
  },
  {
    id: 'e-nov-4',
    title: 'Show & Tell: Wheels on the Go',
    date: '2026-11-27',
    type: 'event',
    description: 'Expressive speaking activity focused on modes of transport.',
    bringToSchool: 'Bring one small toy vehicle (Air, Land, or Water)',
    targetGrades: ['Mont 1']
  },

  // December 2026
  {
    id: 'e-dec-1',
    title: 'Parent-Teacher Meeting (PTM Term 1)',
    date: '2026-12-05',
    type: 'ptm',
    description: 'One-on-one developmental and milestone review with class teacher.',
    targetGrades: ['Mont 1', 'Mont 2']
  },
  {
    id: 'e-dec-2',
    title: 'Christmas & Winter Carol Circle',
    date: '2026-12-18',
    type: 'dress_up',
    description: 'Sing-along songs, gingerbread cookie craft, and holiday gift exchange.',
    dressUpPrompt: 'Red, white, or green festive winter attire',
    bringToSchool: 'Small wrapped book or stationery gift for secret Santa',
    targetGrades: ['Mont 1', 'Mont 2']
  },
  {
    id: 'e-dec-3',
    title: 'Winter Vacation Begins',
    date: '2026-12-23',
    endDate: '2027-01-03',
    type: 'holiday',
    description: 'Winter vacation. School reopens on Monday, January 4, 2027.',
    targetGrades: ['All']
  }
];

export const MOCK_CURRICULUM_BY_MONTH: Record<string, MonthlyLearningObjective> = {
  '2026-06': {
    month: 'June 2026',
    grade: 'Montessori 1',
    themeTitle: 'Settling In & Grace and Courtesy',
    themeDescription: 'Gentle separation from home, learning classroom ground rules, mat rolling, walking on the line, and self-help routines.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_June2026_Settling_Pack.pdf',
    pdfFileSize: '1.8 MB (3 slides)',
    uploadedAt: '05 Jun 2026'
  },
  '2026-07': {
    month: 'July 2026',
    grade: 'Montessori 1',
    themeTitle: 'Primary Colors & Geometric Shapes',
    themeDescription: 'Sensorial color box 1 (Red, Blue, Yellow) pairing, geometric cabinet presentation circles, and monsoon poems.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_July2026_Sensorial_Colors.pdf',
    pdfFileSize: '2.1 MB (4 slides)',
    uploadedAt: '01 Jul 2026'
  },
  '2026-08': {
    month: 'August 2026',
    grade: 'Montessori 1',
    themeTitle: 'Indian Heritage, Shapes & National Symbols',
    themeDescription: 'Discovering the tricolor flag, national bird and animal, tactile sandpaper shapes, and Independence Day songs.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_August2026_Heritage_Pack.pdf',
    pdfFileSize: '2.5 MB (4 slides)',
    uploadedAt: '01 Aug 2026'
  },
  '2026-09': {
    month: 'September 2026',
    grade: 'Montessori 1',
    themeTitle: 'My Family & The Five Senses',
    themeDescription: 'Sensorial smelling jars, rough and smooth boards, family tree photo exploration, and honoring grandparents.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_September2026_Family_Senses.pdf',
    pdfFileSize: '2.0 MB (4 slides)',
    uploadedAt: '01 Sep 2026'
  },
  '2026-10': {
    month: 'October 2026',
    grade: 'Montessori 1',
    themeTitle: 'Festivals of Light & Autumn Colors',
    themeDescription: 'Exploring autumn leaves, Diya clay pinching, sound cylinders pairing, and foundational phonics sounds.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_October2026_Festivals_Pack.pdf',
    pdfFileSize: '2.2 MB (4 slides)',
    uploadedAt: '01 Oct 2026'
  },
  '2026-11': {
    month: 'November 2026',
    grade: 'Montessori 1',
    themeTitle: 'Community Helpers & Transportation',
    themeDescription: 'Exploring real-world heroes (doctors, firefighters, chefs, teachers) and discovering land, water, and air transport vehicles.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_Nov2026_Curriculum_Slides.pdf',
    pdfFileSize: '2.4 MB (4 slides)',
    uploadedAt: '01 Nov 2026'
  },
  '2026-12': {
    month: 'December 2026',
    grade: 'Montessori 1',
    themeTitle: 'Winter Wonders & Polar Animals',
    themeDescription: 'Exploring cold climate animals (penguins, polar bears), sensorial cotton snow textures, number rods 1–10, and holiday cheer.',
    objectives: [],
    specialDates: [],
    pdfFileName: 'NAFL_Mont1_Dec2026_Winter_Wonders.pdf',
    pdfFileSize: '2.6 MB (4 slides)',
    uploadedAt: '01 Dec 2026'
  }
};

export const MOCK_SECTIONS: ClassSection[] = [
  {
    id: 'mont-1a',
    name: 'Montessori 1A',
    shortName: 'Mont 1A',
    gradeTier: 'Montessori 1',
    roomNumber: 'Room 104',
    primaryTeacher: {
      id: 'teacher-ananya',
      name: 'Ms. Ananya',
      email: 'ananya@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Radhika'
    },
    studentCount: 24
  },
  {
    id: 'mont-1b',
    name: 'Montessori 1B',
    shortName: 'Mont 1B',
    gradeTier: 'Montessori 1',
    roomNumber: 'Room 106',
    primaryTeacher: {
      id: 'teacher-shalini',
      name: 'Ms. Shalini',
      email: 'shalini@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Meera'
    },
    studentCount: 22
  },
  {
    id: 'mont-1c',
    name: 'Montessori 1C',
    shortName: 'Mont 1C',
    gradeTier: 'Montessori 1',
    roomNumber: 'Room 108',
    primaryTeacher: {
      id: 'teacher-priya',
      name: 'Ms. Priya',
      email: 'priya@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Vandana'
    },
    studentCount: 23
  },
  {
    id: 'mont-1d',
    name: 'Montessori 1D',
    shortName: 'Mont 1D',
    gradeTier: 'Montessori 1',
    roomNumber: 'Room 110',
    primaryTeacher: {
      id: 'teacher-tanvi',
      name: 'Ms. Tanvi',
      email: 'tanvi@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Sunita'
    },
    studentCount: 24
  },
  {
    id: 'mont-2a',
    name: 'Montessori 2A',
    shortName: 'Mont 2A',
    gradeTier: 'Montessori 2',
    roomNumber: 'Room 201',
    primaryTeacher: {
      id: 'teacher-deepa',
      name: 'Ms. Deepa',
      email: 'deepa@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Kavitha'
    },
    studentCount: 25
  },
  {
    id: 'mont-2b',
    name: 'Montessori 2B',
    shortName: 'Mont 2B',
    gradeTier: 'Montessori 2',
    roomNumber: 'Room 203',
    primaryTeacher: {
      id: 'teacher-archana',
      name: 'Ms. Archana',
      email: 'archana@nafl.in'
    },
    coTeacher: {
      name: 'Ms. Rohini'
    },
    studentCount: 24
  }
];

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Primary Teacher' | 'Co-Teacher' | 'Subject Specialist' | 'Administrator';
  gradeTier?: string;
  phone?: string;
}

export const MOCK_STAFF_DIRECTORY: StaffMember[] = [
  { id: 'teacher-ananya', name: 'Ms. Ananya', email: 'ananya@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10001' },
  { id: 'teacher-shalini', name: 'Ms. Shalini', email: 'shalini@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10002' },
  { id: 'teacher-priya', name: 'Ms. Priya', email: 'priya@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10003' },
  { id: 'teacher-tanvi', name: 'Ms. Tanvi', email: 'tanvi@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10004' },
  { id: 'teacher-deepa', name: 'Ms. Deepa', email: 'deepa@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 2', phone: '+91 98450 10005' },
  { id: 'teacher-archana', name: 'Ms. Archana', email: 'archana@nafl.in', role: 'Primary Teacher', gradeTier: 'Montessori 2', phone: '+91 98450 10006' },
  { id: 'teacher-radhika', name: 'Ms. Radhika', email: 'radhika@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10007' },
  { id: 'teacher-meera', name: 'Ms. Meera', email: 'meera@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10008' },
  { id: 'teacher-vandana', name: 'Ms. Vandana', email: 'vandana@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10009' },
  { id: 'teacher-sunita', name: 'Ms. Sunita', email: 'sunita@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 1', phone: '+91 98450 10010' },
  { id: 'teacher-kavitha', name: 'Ms. Kavitha', email: 'kavitha@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 2', phone: '+91 98450 10011' },
  { id: 'teacher-rohini', name: 'Ms. Rohini', email: 'rohini@nafl.in', role: 'Co-Teacher', gradeTier: 'Montessori 2', phone: '+91 98450 10012' },
  { id: 'admin-sundaram', name: 'Mr. Sundaram', email: 'registrar@nafl.in', role: 'Administrator', phone: '+91 98450 99999' }
];

export const SAMPLE_ENROLLMENT_CSV = `Admission_Number,Student_Name,Grade_Tier,Section,Roll_No,Gender,Parent_Name,Primary_Mobile,Parent_Email,Bus_Route
NAFL/2026/M1-091,Devansh Hegde,Montessori 1,Section A,25,Boy,Praveen Hegde,+91 98451 22334,praveen.hegde@example.com,Route 12
NAFL/2026/M1-092,Anika Sen,Montessori 1,Section B,23,Girl,Subhash Sen,+91 98802 33445,subhash.sen@example.com,Self Drop
NAFL/2026/M1-093,Reyansh Varma,Montessori 1,Section C,24,Boy,Vikram Varma,+91 98452 44556,vikram.varma@example.com,Route 8
NAFL/2026/M1-094,Tara Pillai,Montessori 1,Section D,25,Girl,Arun Pillai,+91 98803 55667,arun.pillai@example.com,Parent Drop`;

export const MOCK_STUDENT_PROFILE: StudentProfile = {
  student: {
    name: 'Aarav Sharma',
    admissionNumber: 'NAFL/2026/M1-042',
    grade: 'Montessori 1',
    section: 'Section A',
    sectionId: 'mont-1a',
    rollNumber: '14',
    dob: '18 May 2023',
    bloodGroup: 'O+ Positive',
    house: 'Emerald Dragons',
    academicYear: '2026–2027',
    photo: AVATAR_STUDENT_BOY
  },
  parents: {
    father: {
      name: 'Rajesh Sharma',
      mobile: '+91 98860 12345',
      email: 'rajesh.sharma@example.com',
      occupation: 'Software Engineering Director',
      photo: AVATAR_FATHER
    },
    mother: {
      name: 'Priya Sharma',
      mobile: '+91 98860 67890',
      email: 'priya.sharma@example.com',
      occupation: 'Architect & Interior Designer',
      photo: AVATAR_MOTHER
    },
    emergencyContact: {
      name: 'Kavita Sharma',
      relation: 'Grandmother',
      mobile: '+91 94480 11223',
      photo: AVATAR_GRANDMOTHER
    },
    authorizedGuardians: [
      {
        id: 'g-01',
        name: 'Sunder Sharma',
        relation: 'Grandfather',
        mobile: '+91 94480 99887',
        photo: AVATAR_GRANDFATHER,
        authorizationType: 'Pickup & Drop',
        gatePassId: 'NAFL-GP-2026-042A',
        status: 'verified',
        verified: true,
        verifiedBy: 'Ms. Ananya (Class Teacher)',
        verifiedAt: '02 Jun 2026'
      },
      {
        id: 'g-02',
        name: 'Ramesh Kumar',
        relation: 'Designated Family Driver',
        mobile: '+91 98451 22334',
        photo: AVATAR_DRIVER,
        authorizationType: 'Pickup Only',
        gatePassId: 'NAFL-GP-2026-042B',
        status: 'parent_declared',
        verified: false,
        declaredBy: 'Rajesh Sharma (Father)',
        declaredAt: '12 Nov 2026, 09:30 AM'
      }
    ],
    residentialAddress: 'Flat 402, Green View Apts, 12th Cross, Indiranagar, Bengaluru - 560038',
    transportMode: 'School Bus (Route 12)',
    busRouteNumber: 'Route 12 (Indiranagar - NAFL)',
    busStopName: '100 Feet Road Junction'
  }
};

export const MOCK_CLASS_ROSTER: StudentProfile[] = [
  MOCK_STUDENT_PROFILE,
  {
    student: {
      name: 'Ananya Rao',
      admissionNumber: 'NAFL/2026/M1-008',
      grade: 'Montessori 1',
      section: 'Section A',
      sectionId: 'mont-1a',
      rollNumber: '03',
      dob: '12 Aug 2023',
      bloodGroup: 'B+ Positive',
      house: 'Ruby Lions',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_GIRL
    },
    parents: {
      father: {
        name: 'Vikram Rao',
        mobile: '+91 98860 22334',
        email: 'vikram.rao@example.com',
        occupation: 'Cardiologist',
        photo: AVATAR_FATHER
      },
      mother: {
        name: 'Deepa Rao',
        mobile: '+91 98860 44556',
        email: 'deepa.rao@example.com',
        occupation: 'Lawyer',
        photo: AVATAR_MOTHER
      },
      emergencyContact: {
        name: 'Sunder Rao',
        relation: 'Grandfather',
        mobile: '+91 94480 99887',
        photo: AVATAR_GRANDFATHER
      },
      authorizedGuardians: [
        {
          id: 'g-11',
          name: 'Sunder Rao',
          relation: 'Grandfather',
          mobile: '+91 94480 99887',
          photo: AVATAR_GRANDFATHER,
          authorizationType: 'Pickup & Drop',
          gatePassId: 'NAFL-GP-2026-008A',
          status: 'verified',
          verified: true,
          verifiedBy: 'Ms. Ananya (Class Teacher)',
          verifiedAt: '02 Jun 2026'
        }
      ],
      residentialAddress: '32, Palm Meadows, Whitefield, Bengaluru',
      transportMode: 'Parent Pick-up',
      busRouteNumber: 'None',
      busStopName: 'Self Drop'
    }
  },
  {
    student: {
      name: 'Kabir Nair',
      admissionNumber: 'NAFL/2026/M1-055',
      grade: 'Montessori 1',
      section: 'Section A',
      sectionId: 'mont-1a',
      rollNumber: '19',
      dob: '04 Mar 2023',
      bloodGroup: 'A+ Positive',
      house: 'Sapphire Sharks',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_BOY
    },
    parents: {
      father: {
        name: 'Suresh Nair',
        mobile: '+91 98450 11223',
        email: 'suresh.nair@example.com',
        occupation: 'Financial Consultant'
      },
      mother: {
        name: 'Meera Nair',
        mobile: '+91 98450 44556',
        email: 'meera.nair@example.com',
        occupation: 'Professor'
      },
      emergencyContact: {
        name: 'Lakshmi Nair',
        relation: 'Aunt',
        mobile: '+91 94490 77665'
      },
      residentialAddress: '55, Defence Colony, Indiranagar, Bengaluru',
      transportMode: 'School Bus (Route 12)',
      busRouteNumber: 'Route 12',
      busStopName: 'Defence Colony Main Gate'
    }
  },
  {
    student: {
      name: 'Diya Patel',
      admissionNumber: 'NAFL/2026/M1-029',
      grade: 'Montessori 1',
      section: 'Section A',
      sectionId: 'mont-1a',
      rollNumber: '11',
      dob: '29 Nov 2023',
      bloodGroup: 'O- Negative',
      house: 'Topaz Tigers',
      academicYear: '2026–2027',
      photo: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=400&q=80'
    },
    parents: {
      father: {
        name: 'Amit Patel',
        mobile: '+91 98800 33445',
        email: 'amit.patel@example.com',
        occupation: 'Entrepreneur'
      },
      mother: {
        name: 'Sneha Patel',
        mobile: '+91 98800 66778',
        email: 'sneha.patel@example.com',
        occupation: 'HR Director'
      },
      emergencyContact: {
        name: 'Bhavna Patel',
        relation: 'Grandmother',
        mobile: '+91 94481 22334'
      },
      residentialAddress: '108, Prestige Enclave, Koramangala, Bengaluru',
      transportMode: 'School Bus (Route 08)',
      busRouteNumber: 'Route 08',
      busStopName: 'Sony World Junction'
    }
  },
  // Section B Students (Montessori 1B - Room 106 - Ms. Shalini)
  {
    student: {
      name: 'Diya Sen',
      admissionNumber: 'NAFL/2026/M1-061',
      grade: 'Montessori 1',
      section: 'Section B',
      sectionId: 'mont-1b',
      rollNumber: '04',
      dob: '14 Jun 2023',
      bloodGroup: 'B+ Positive',
      house: 'Ruby Lions',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_GIRL
    },
    parents: {
      father: {
        name: 'Rajat Sen',
        mobile: '+91 98860 77112',
        email: 'rajat.sen@example.com',
        occupation: 'Senior Data Scientist',
        photo: AVATAR_FATHER
      },
      mother: {
        name: 'Sunita Sen',
        mobile: '+91 98860 77113',
        email: 'sunita.sen@example.com',
        occupation: 'Pediatrician',
        photo: AVATAR_MOTHER
      },
      emergencyContact: {
        name: 'Anirban Sen',
        relation: 'Grandfather',
        mobile: '+91 94480 33441',
        photo: AVATAR_GRANDFATHER
      },
      authorizedGuardians: [
        {
          id: 'g-b01',
          name: 'Anirban Sen',
          relation: 'Grandfather',
          mobile: '+91 94480 33441',
          photo: AVATAR_GRANDFATHER,
          authorizationType: 'Pickup & Drop',
          gatePassId: 'NAFL-GP-2026-061A',
          status: 'verified',
          verified: true,
          verifiedBy: 'Ms. Shalini (Class Teacher)',
          verifiedAt: '03 Jun 2026'
        }
      ],
      residentialAddress: '14, RMV 2nd Stage, Bengaluru',
      transportMode: 'Parent Pick-up',
      busRouteNumber: 'None',
      busStopName: 'Self Drop'
    }
  },
  {
    student: {
      name: 'Kabir Patel',
      admissionNumber: 'NAFL/2026/M1-068',
      grade: 'Montessori 1',
      section: 'Section B',
      sectionId: 'mont-1b',
      rollNumber: '09',
      dob: '22 Sep 2023',
      bloodGroup: 'O+ Positive',
      house: 'Sapphire Sharks',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_BOY
    },
    parents: {
      father: {
        name: 'Rakesh Patel',
        mobile: '+91 98450 66778',
        email: 'rakesh.patel@example.com',
        occupation: 'Civil Engineer',
        photo: AVATAR_FATHER
      },
      mother: {
        name: 'Neha Patel',
        mobile: '+91 98450 88990',
        email: 'neha.patel@example.com',
        occupation: 'College Lecturer',
        photo: AVATAR_MOTHER
      },
      emergencyContact: {
        name: 'Hansa Patel',
        relation: 'Grandmother',
        mobile: '+91 94490 22119',
        photo: AVATAR_GRANDMOTHER
      },
      residentialAddress: '88, Malleshwaram 15th Cross, Bengaluru',
      transportMode: 'School Bus (Route 04)',
      busRouteNumber: 'Route 04',
      busStopName: 'Malleshwaram Circle'
    }
  },
  {
    student: {
      name: 'Ishaan Rao',
      admissionNumber: 'NAFL/2026/M1-073',
      grade: 'Montessori 1',
      section: 'Section B',
      sectionId: 'mont-1b',
      rollNumber: '15',
      dob: '07 Jan 2023',
      bloodGroup: 'A- Negative',
      house: 'Topaz Tigers',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_BOY
    },
    parents: {
      father: {
        name: 'Arvind Rao',
        mobile: '+91 98860 33221',
        email: 'arvind.rao@example.com',
        occupation: 'Product Designer'
      },
      mother: {
        name: 'Pooja Rao',
        mobile: '+91 98860 55443',
        email: 'pooja.rao@example.com',
        occupation: 'Cybersecurity Analyst'
      },
      emergencyContact: {
        name: 'Raghavendra Rao',
        relation: 'Uncle',
        mobile: '+91 94480 88776'
      },
      residentialAddress: '23, Rajajinagar 3rd Block, Bengaluru',
      transportMode: 'School Bus (Route 04)',
      busRouteNumber: 'Route 04',
      busStopName: 'Rajajinagar ESI'
    }
  },
  {
    student: {
      name: 'Meera Nair',
      admissionNumber: 'NAFL/2026/M1-080',
      grade: 'Montessori 1',
      section: 'Section B',
      sectionId: 'mont-1b',
      rollNumber: '18',
      dob: '19 Dec 2023',
      bloodGroup: 'AB+ Positive',
      house: 'Emerald Dragons',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_GIRL
    },
    parents: {
      father: {
        name: 'Madhavan Nair',
        mobile: '+91 98450 12987',
        email: 'madhavan.nair@example.com',
        occupation: 'Biotech Scientist'
      },
      mother: {
        name: 'Geetha Nair',
        mobile: '+91 98450 34876',
        email: 'geetha.nair@example.com',
        occupation: 'High School Educator'
      },
      emergencyContact: {
        name: 'Subramanian Nair',
        relation: 'Grandfather',
        mobile: '+91 94490 66554'
      },
      residentialAddress: '67, Basaveshwarnagar 4th Block, Bengaluru',
      transportMode: 'Parent Pick-up',
      busRouteNumber: 'None',
      busStopName: 'Self Drop'
    }
  },
  {
    student: {
      name: 'Ayaan Merchant',
      admissionNumber: 'NAFL/2026/M1-071',
      grade: 'Montessori 1',
      section: 'Section C',
      sectionId: 'mont-1c',
      rollNumber: '08',
      dob: '14 Jan 2023',
      bloodGroup: 'B+ Positive',
      house: 'Topaz Tigers',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_BOY
    },
    parents: {
      father: {
        name: 'Farhan Merchant',
        mobile: '+91 98801 11223',
        email: 'farhan.merchant@example.com',
        occupation: 'Architect'
      },
      mother: {
        name: 'Zoya Merchant',
        mobile: '+91 98801 33445',
        email: 'zoya.merchant@example.com',
        occupation: 'Graphic Designer'
      },
      emergencyContact: {
        name: 'Iqbal Merchant',
        relation: 'Grandfather',
        mobile: '+91 94481 99001'
      },
      residentialAddress: '18, Richmond Town, Bengaluru',
      transportMode: 'Parent Pick-up',
      busRouteNumber: 'None',
      busStopName: 'Self Drop'
    }
  },
  {
    student: {
      name: 'Rhea Chawla',
      admissionNumber: 'NAFL/2026/M1-081',
      grade: 'Montessori 1',
      section: 'Section D',
      sectionId: 'mont-1d',
      rollNumber: '11',
      dob: '22 Apr 2023',
      bloodGroup: 'O+ Positive',
      house: 'Emerald Dragons',
      academicYear: '2026–2027',
      photo: AVATAR_STUDENT_GIRL
    },
    parents: {
      father: {
        name: 'Kunal Chawla',
        mobile: '+91 98440 55667',
        email: 'kunal.chawla@example.com',
        occupation: 'VP Product'
      },
      mother: {
        name: 'Simran Chawla',
        mobile: '+91 98440 77889',
        email: 'simran.chawla@example.com',
        occupation: 'Author & Columnist'
      },
      emergencyContact: {
        name: 'Harbans Chawla',
        relation: 'Grandfather',
        mobile: '+91 94490 22331'
      },
      residentialAddress: '44, Koramangala 3rd Block, Bengaluru',
      transportMode: 'School Bus (Route 8)',
      busRouteNumber: 'Route 8 (Koramangala - NAFL)',
      busStopName: 'Sony World Signal'
    }
  }
];

export const MOCK_MONTHLY_OBJECTIVES: MonthlyLearningObjective = {
  month: 'November 2026',
  grade: 'Montessori 1',
  themeTitle: 'Community Helpers & Transportation',
  themeDescription: 'This month, our little learners explore the people who keep our city safe and healthy, while discovering land, water, and air transport.',
  objectives: [
    {
      area: 'Language & Phonics',
      items: [
        'Sandpaper letters: Introductions to sounds /s/, /a/, /t/, /p/',
        'Vocabulary expansion: Fire station, Stethoscope, Traffic signals, Anchor',
        'Rhymes: "The Wheels on the Bus", "Miss Polly had a Dolly"'
      ]
    },
    {
      area: 'Math & Sensorial',
      items: [
        'Number rods 1 to 5 (counting and associating quantities)',
        'Pink Tower and Broad Stair variations',
        'Sorting transport vehicles by color and size'
      ]
    },
    {
      area: 'Practical Life Exercises',
      items: [
        'Buttoning and unbuttoning frames',
        'Pouring grains using small glass jugs',
        'Folding napkins into triangles'
      ]
    }
  ],
  specialDates: [
    {
      date: 'Nov 14 (Fri)',
      day: 'Children\'s Day',
      title: 'Fun & Games Fiesta',
      dressCode: 'Bright Party Wear',
      bringItem: '1 dry snack item to share'
    },
    {
      date: 'Nov 20 (Thu)',
      day: 'Helper Day',
      title: 'Community Heroes Dress-up',
      dressCode: 'Helper costume (Doctor/Firefighter/Chef/Police)',
      bringItem: 'Simple tool or prop'
    },
    {
      date: 'Nov 27 (Fri)',
      day: 'Show & Tell',
      title: 'Modes of Transport',
      dressCode: 'Standard Uniform',
      bringItem: '1 small toy car/airplane/boat'
    }
  ],
  pdfFileName: 'NAFL_Mont1_Nov2026_Curriculum_Slides.pdf',
  pdfFileSize: '2.4 MB (4 slides)',
  uploadedAt: '01 Nov 2026, 09:30 AM'
};

export const MOCK_CIRCULARS: CircularNotice[] = [
  {
    id: 'circ-104',
    circularNumber: 'CIR/2026-27/024',
    title: 'Annual Sports Day 2026 Schedule & Uniform Guidelines',
    publishDate: '08 Nov 2026',
    category: 'Event',
    target: 'Mont 1 & Mont 2',
    targetScope: 'all_school',
    requiresAcknowledgement: true,
    acknowledgedByParent: false,
    summary: 'Details regarding event timings at the sports ground, required white sports shoes, house color t-shirts, and pick-up protocol.',
    pdfFileName: 'Circular_024_Sports_Day_Schedule.pdf',
    pdfFileSize: '480 KB'
  },
  {
    id: 'circ-103',
    circularNumber: 'CIR/2026-27/023',
    title: 'Educational Field Visit to the Fire Station',
    publishDate: '02 Nov 2026',
    category: 'Field Trip',
    target: 'Mont 1',
    targetScope: 'grade_tier',
    requiresAcknowledgement: true,
    acknowledgedByParent: true,
    acknowledgedAt: '03 Nov 2026 at 07:15 PM',
    summary: 'Consent form and guidelines for the supervised field visit to the local Fire Brigade station on Nov 18th.',
    pdfFileName: 'Circular_023_Fire_Station_Consent.pdf',
    pdfFileSize: '320 KB'
  },
  {
    id: 'circ-105',
    circularNumber: 'CIR/2026-27/025',
    title: 'Mont 1A Community Fruit Salad Day & Sensorial Sorting',
    publishDate: '10 Nov 2026',
    category: 'Event',
    target: 'Mont 1A',
    targetScope: 'section',
    targetSectionId: 'mont-1a',
    requiresAcknowledgement: true,
    acknowledgedByParent: false,
    summary: 'Montessori 1A section specific activity: Children will prepare and share a community morning snack with yellow/orange dress theme.',
    pdfFileName: 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
    pdfFileSize: '380 KB'
  },
  {
    id: 'circ-106',
    circularNumber: 'CIR/2026-27/026',
    title: 'Mont 1B Eco-Clay Modeling & Sensory Textures Workshop',
    publishDate: '10 Nov 2026',
    category: 'Event',
    target: 'Mont 1B',
    targetScope: 'section',
    targetSectionId: 'mont-1b',
    requiresAcknowledgement: false,
    acknowledgedByParent: false,
    summary: 'Montessori 1B section workshop: Handbuilding pinch pots and textured tiles with Ms. Shalini in Room 106.',
    pdfFileName: 'CIR_2026_27_025_Annual_Athletic_Meet_2026.pdf',
    pdfFileSize: '350 KB'
  },
  {
    id: 'circ-102',
    circularNumber: 'CIR/2026-27/021',
    title: 'Advisory on Seasonal Flu & Health Precautions',
    publishDate: '24 Oct 2026',
    category: 'General',
    target: 'Whole School',
    targetScope: 'all_school',
    requiresAcknowledgement: false,
    acknowledgedByParent: true,
    acknowledgedAt: '24 Oct 2026 at 08:30 PM',
    summary: 'Preventive measures against viral fever; request to keep unwell children at home until 24 hours fever-free.',
    pdfFileName: 'Circular_021_Health_Advisory.pdf',
    pdfFileSize: '210 KB'
  }
];

export const MOCK_PHOTOS: MonthlyPhotoCollage[] = [
  {
    id: 'photo-oct-2026',
    month: 'October 2026',
    grade: 'Mont 1',
    title: 'Dusshera Celebrations & Sensorial Sensations',
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    photoCount: 18,
    pdfFileName: 'NAFL_Mont1_October_Classroom_Moments.pdf',
    pdfFileSize: '8.1 MB',
    highlights: [
      'Children exploring color tablets in Montessori sensorial room',
      'Traditional storytelling session by Ms. Ananya',
      'Clay diya modeling and natural flower rangoli crafting'
    ]
  },
  {
    id: 'photo-sep-2026',
    month: 'September 2026',
    grade: 'Mont 1',
    title: 'Grandparents Day & Water Play Exploration',
    coverImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    photoCount: 24,
    pdfFileName: 'NAFL_Mont1_September_Highlights.pdf',
    pdfFileSize: '11.4 MB',
    highlights: [
      'Grandparents participating in music and nursery rhyme circles',
      'Outdoor bubble blowing and water pouring coordination activities'
    ]
  }
];

export const MOCK_MEDIA: MediaItem[] = [
  {
    id: 'media-v1',
    type: 'video',
    title: 'Music Circle: "The Wheels on the Bus" & Rhythm Clap',
    date: '07 Nov 2026',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
    duration: '0:30',
    description: 'Aarav and his classmates practicing vehicle action sounds during morning circle time.'
  },
  {
    id: 'media-v-b1',
    type: 'video',
    title: 'Mont 1B Music Circle: "Five Little Ducks" & Animal Mimicry',
    date: '06 Nov 2026',
    grade: 'Mont 1B',
    sectionId: 'mont-1b',
    thumbnail: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
    duration: '0:30',
    description: 'Montessori 1B children singing action rhymes with Ms. Shalini in Room 106.'
  },
  {
    id: 'media-b1',
    type: 'booklet',
    title: 'October 2026: Dusshera Celebrations & Sensorial Sensations',
    date: 'October 2026',
    grade: 'Mont 1',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80',
    itemCount: 18,
    pdfFileName: 'NAFL_Mont1_October_Classroom_Moments.pdf',
    pdfFileSize: '8.1 MB',
    highlights: [
      'Children exploring color tablets in Montessori sensorial room',
      'Clay diya modeling and flower petal rangoli'
    ]
  },
  {
    id: 'media-v2',
    type: 'video',
    title: 'Practical Life: Grain Spooning & Water Pouring Focus',
    date: '03 Nov 2026',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    thumbnail: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80',
    videoUrl: '/samples/NAFL_Mont1_Music_Circle_Sample.mp4',
    duration: '0:30',
    description: 'Fine motor coordination exercise with glass jugs and chickpea grains.'
  },
  {
    id: 'media-p1',
    type: 'photo',
    title: 'Ad-hoc: Clay Diya Crafting & Handprints',
    date: '29 Oct 2026',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    itemCount: 8,
    description: 'Candid photos of children working with natural clay and safe tempera paints.'
  },
  {
    id: 'media-b2',
    type: 'booklet',
    title: 'September 2026: Grandparents Day & Water Play Highlights',
    date: 'September 2026',
    grade: 'Mont 1',
    thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    itemCount: 24,
    pdfFileName: 'NAFL_Mont1_September_Highlights.pdf',
    pdfFileSize: '11.4 MB',
    highlights: [
      'Grandparents musical circle',
      'Outdoor bubble blowing and water pouring'
    ]
  }
];

export const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: 'fb-01',
    recipient: 'Parent',
    senderRole: 'teacher',
    senderName: 'Ms. Ananya (Class Teacher)',
    category: 'Academic Progress',
    date: '09 Nov 2026',
    title: 'Wonderful progress with Montessori Sandpaper letters!',
    message: 'Aarav showed tremendous curiosity during the sandpaper sound tracing today for /s/ and /t/. He eagerly helped his peers put the cards back in the tray. Keep encouraging the sound games at home!',
    requiresAcknowledgement: true,
    acknowledged: false
  },
  {
    id: 'fb-02',
    recipient: 'Teacher',
    senderRole: 'parent',
    senderName: 'Rajesh Sharma (Father)',
    category: 'General',
    date: '28 Oct 2026',
    title: 'Query regarding snack schedule during sports practice',
    message: 'Hello Ma\'am, on sports practice days, should we pack an additional fruit/electrolyte snack in the second tiffin?',
    requiresAcknowledgement: false,
    acknowledged: true,
    acknowledgedAt: '28 Oct 2026 at 04:15 PM',
    reply: 'Yes, Mr. Sharma! An extra fruit snack or sliced cucumber is highly recommended on Wednesdays and Fridays.',
    replyAuthor: 'Ms. Ananya (Class Teacher)',
    replyDate: '28 Oct 2026 at 04:45 PM'
  },
  {
    id: 'fb-03',
    recipient: 'Principal',
    senderRole: 'parent',
    senderName: 'Priya Sharma (Mother)',
    category: 'Appreciation',
    date: '15 Oct 2026',
    title: 'Gratitude for the Grandparents Day celebration',
    message: 'We wanted to express our heartfelt appreciation to the entire Montessori department for organizing Grandparents Day. Aarav\'s grandparents were deeply moved by the warmth and musical performances.',
    requiresAcknowledgement: false,
    acknowledged: true,
    acknowledgedAt: '16 Oct 2026 at 11:00 AM',
    reply: 'Thank you Mrs. Sharma! Our Mont team cherishes these intergenerational bonds.',
    replyAuthor: 'Office of the Principal, NAFL',
    replyDate: '16 Oct 2026 at 11:30 AM'
  }
];

export const MOCK_FEES: FeeRecord[] = [
  {
    id: 'fee-01',
    termTitle: 'Term 1 Tuition & Montessori Material Fee',
    academicYear: '2026–2027',
    amount: '₹48,500',
    status: 'Paid',
    paidOn: '15 May 2026',
    receiptNumber: 'NAFL-REC-2026-8921',
    receiptFileName: 'Fee_Receipt_Term1_Aarav_Sharma.pdf'
  },
  {
    id: 'fee-02',
    termTitle: 'Term 2 Tuition & Activity Fee',
    academicYear: '2026–2027',
    amount: '₹48,500',
    status: 'Paid',
    paidOn: '10 Oct 2026',
    receiptNumber: 'NAFL-REC-2026-9450',
    receiptFileName: 'Fee_Receipt_Term2_Aarav_Sharma.pdf'
  },
  {
    id: 'fee-03',
    termTitle: 'Term 3 Tuition Fee',
    academicYear: '2026–2027',
    amount: '₹48,500',
    status: 'Upcoming',
    dueDate: '15 Jan 2027'
  }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-01',
    studentName: 'Aarav Sharma',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    type: 'Medical / Illness',
    startDate: '2026-10-27',
    endDate: '2026-10-28',
    numberOfDays: 2,
    reason: 'Mild fever and cough as per pediatrician advice to rest.',
    status: 'Approved',
    submittedOn: '27 Oct 2026, 07:15 AM',
    reviewedBy: 'Ms. Ananya',
    teacherRemarks: 'Approved. Hope Aarav feels better soon!'
  },
  {
    id: 'leave-b01',
    studentName: 'Diya Sen',
    grade: 'Mont 1B',
    sectionId: 'mont-1b',
    type: 'Family Travel',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    numberOfDays: 2,
    reason: 'Attending family ceremonies in Mysore with parents.',
    status: 'Pending',
    submittedOn: '11 Nov 2026, 06:30 PM'
  }
];

export const MOCK_PTM_SLOTS: PtmSlot[] = [
  // Montessori 1A Slots (Room 104 - Ms. Ananya)
  {
    id: 'ptm-01',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:00 AM – 09:15 AM',
    teacherName: 'Ms. Ananya',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    location: 'Room 104 (Mont 1A Classroom)',
    status: 'Booked',
    bookedByStudentId: 'NAFL/2026/M1-042'
  },
  {
    id: 'ptm-02',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:15 AM – 09:30 AM',
    teacherName: 'Ms. Ananya',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    location: 'Room 104 (Mont 1A Classroom)',
    status: 'Available'
  },
  {
    id: 'ptm-03',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:30 AM – 09:45 AM',
    teacherName: 'Ms. Ananya',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    location: 'Room 104 (Mont 1A Classroom)',
    status: 'Available'
  },
  {
    id: 'ptm-04',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '10:00 AM – 10:15 AM',
    teacherName: 'Ms. Ananya',
    grade: 'Mont 1A',
    sectionId: 'mont-1a',
    location: 'Room 104 (Mont 1A Classroom)',
    status: 'Available'
  },
  // Montessori 1B Slots (Room 106 - Ms. Shalini)
  {
    id: 'ptm-b01',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:00 AM – 09:15 AM',
    teacherName: 'Ms. Shalini',
    grade: 'Mont 1B',
    sectionId: 'mont-1b',
    location: 'Room 106 (Mont 1B Classroom)',
    status: 'Available'
  },
  {
    id: 'ptm-b02',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:15 AM – 09:30 AM',
    teacherName: 'Ms. Shalini',
    grade: 'Mont 1B',
    sectionId: 'mont-1b',
    location: 'Room 106 (Mont 1B Classroom)',
    status: 'Booked',
    bookedByStudentId: 'NAFL/2026/M1-061'
  },
  {
    id: 'ptm-b03',
    date: '05 Dec 2026 (Saturday)',
    timeSlot: '09:30 AM – 09:45 AM',
    teacherName: 'Ms. Shalini',
    grade: 'Mont 1B',
    sectionId: 'mont-1b',
    location: 'Room 106 (Mont 1B Classroom)',
    status: 'Available'
  }
];
