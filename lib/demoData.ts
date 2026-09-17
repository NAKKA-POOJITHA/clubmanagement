// Centralized Demo & Initial Seed Data Store for Pragati University

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'club_member' | 'club_admin' | 'faculty_coordinator' | 'department_admin' | 'super_admin';
  department: string;
  academic_year: string;
  photo_url: string;
  phone: string;
  membership_number?: string;
  points?: number;
  club_id?: string;
  assigned_club?: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  domain: string;
  category: 'Technical' | 'Apex Council' | 'Non-Technical' | 'Specialized';
  logo: string;
  cover_url: string;
  status: 'active' | 'inactive';
  coordinator_name: string;
  members_count: number;
  events_count: number;
  projects_count: number;
  established: string;
  tags: string[];
}

export interface EventItem {
  id: string;
  club_id: string;
  club_name: string;
  title: string;
  description: string;
  event_type: 'Workshop' | 'Hackathon' | 'Competition' | 'Seminar' | 'Bootcamp' | 'Social Impact' | string;
  venue: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count: number;
  eligibility: string;
  registration_deadline: string;
  status: 'published' | 'draft' | 'completed' | 'Upcoming' | string;
  poster_url: string;
  tag_color: string;
  speaker?: string;
  slug?: string;
  // Aliases for backwards compatibility with legacy modules
  category?: string;
  date?: string;
  time?: string;
  seats_total?: number;
  seats_filled?: number;
  registered_users_count?: number;
  banner_url?: string;
  points?: number;
  is_registration_open?: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  club_name: string;
  club_id: string;
  description: string;
  domain: string;
  tech_stack: string[];
  team?: string[];
  submitted_by: string;
  student_id?: string;
  student_email?: string;
  github_url: string;
  demo_url?: string;
  live_url?: string;
  status: 'draft' | 'pending_review' | 'changes_requested' | 'rejected' | 'approved';
  publication_status: 'private' | 'showcased' | 'unpublished';
  rating: number;
  remarks?: string;
  review_feedback?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  showcased_at?: string;
  upvotes: number;
  date: string;
  image: string;
}

export interface RoadmapStage {
  stage: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  duration: string;
  badge: string;
  skills: string[];
  resources: { title: string; type: 'Video' | 'Documentation' | 'Hands-on' | 'Quiz'; duration: string; completed?: boolean }[];
}

export interface RoadmapItem {
  id: string;
  technology: string;
  domain: string;
  icon: string;
  color: string;
  stages: RoadmapStage[];
}

export interface CertificateRecord {
  id: string;
  certificate_number: string;
  student_name: string;
  student_email: string;
  student_id?: string;
  user_id?: string;
  event_id?: string;
  event_title: string;
  club_name: string;
  issue_date: string;
  attendance_status?: 'Attended' | 'Absent' | 'Registered';
  verification_status?: 'Verified' | 'Pending' | 'Revoked';
  qr_code_url?: string;
  status: 'Valid' | 'Revoked';
}

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  purpose: string;
  platform: string;
  license: string;
  official_link: string;
  recommended_stage: string;
  icon: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  club_name: string;
  event_name: string;
  image_url: string;
  date: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  club_name: string;
  category: 'Notice' | 'Alert' | 'Recruitment' | 'Achievement';
  important: boolean;
  date: string;
}

export interface AuditLogItem {
  id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  target: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Info';
}

export interface ClubMembershipRecord {
  id: string;
  clubId: string;
  clubName: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  department: string;
  year: string;
  status: 'Active' | 'Pending' | 'Alumnus';
  joinedDate: string;
  role: 'Member' | 'Lead' | 'Officer' | 'Coordinator';
  hasDigitalPass: boolean;
}

export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  clubId: string;
  clubName: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  department: string;
  status: 'registered' | 'waitlisted' | 'cancelled';
  registeredAt: string;
  attended?: boolean;
  certificateIssued?: boolean;
}

export interface AttendanceRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  clubId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  timestamp: string;
  method: 'qr' | 'manual';
  status: 'Attended' | 'Absent';
  markedBy: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'club' | 'certificate' | 'project' | 'attendance' | 'announcement';
  timestamp: string;
  read: boolean;
  link?: string;
}

export type AuditLog = AuditLogItem;
export type RoadmapTrack = RoadmapItem;
export type ToolResource = ToolItem;

export interface CouncilMember {
  sNo: number;
  rollNo: string;
  name: string;
  yearSection: string;
  role: string;
  department: string;
  category: 'Core Leadership' | 'Media & Design' | 'Technical Wing' | 'Event Operations' | 'Documentation & Records';
  avatar: string;
  email: string;
  phone?: string;
  status: 'Approved' | 'Active';
}

// 1. Stakeholder Profiles
export const DEMO_PROFILES: Record<string, Profile> = {
  super_admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    full_name: 'Bathina Surya Abhilash',
    email: '24A31A05KF@pragati.ac.in',
    role: 'super_admin',
    department: 'Computer Science & Engineering',
    academic_year: 'President - Computer Science Executive Council (CSEC)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876543210',
    membership_number: '24A31A05KF',
    points: 1540
  },
  student: {
    id: 'a0000000-0000-0000-0000-000000000002',
    full_name: 'Vasamsetti Jahnavi Devi',
    email: '25A31A05ET@pragati.ac.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    academic_year: 'Deputy President - CSEC (II-D)',
    photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876500001',
    membership_number: '25A31A05ET',
    points: 820
  },
  club_member: {
    id: 'a0000000-0000-0000-0000-000000000003',
    full_name: 'Naga Sharmila Patchari',
    email: '24A31A05EB@pragati.ac.in',
    role: 'club_member',
    department: 'Computer Science & Engineering',
    academic_year: 'Secretary - CSEC (III-E)',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876500002',
    membership_number: '24A31A05EB',
    points: 680
  },
  club_admin: {
    id: 'a0000000-0000-0000-0000-000000000004',
    full_name: 'Nakka Poojitha',
    email: '24A31A05JO@pragati.ac.in',
    role: 'club_admin',
    department: 'Computer Science & Engineering',
    academic_year: 'Chief – Technical Coordinator (III-F)',
    photo_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876500003',
    membership_number: '24A31A05JO',
    points: 1250
  },
  faculty_coordinator: {
    id: 'a0000000-0000-0000-0000-000000000005',
    full_name: 'Dr. A. Avinash',
    email: 'a.avinash@pragati.ac.in',
    role: 'faculty_coordinator',
    department: 'Computer Science & Engineering',
    academic_year: 'Faculty Coordinator - Computer Science Executive Council (CSEC)',
    photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876500004',
    points: 1480
  },
  department_admin: {
    id: 'a0000000-0000-0000-0000-000000000006',
    full_name: 'Prof. Suresh Nair',
    email: 'suresh.dept@college.edu',
    role: 'department_admin',
    department: 'Dean of Student Affairs',
    academic_year: 'Dean - Student Affairs & Technical Council',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    phone: '+91 9876500005',
    points: 1100
  }
};

// 2. Pragati University Technical & Non-Technical Clubs
export const DEMO_CLUBS: Club[] = [
  {
    id: 'c-csec',
    name: 'Computer Science Executive Council (CSEC)',
    slug: 'csec-council',
    description: 'The Apex Governing Body of Pragati University comprising 24 student officers and faculty leadership. Oversees, sanctions, schedules, and coordinates all technical clubs, hackathons, and administrative approvals.',
    domain: 'Central Governance & Inter-Club Coordination',
    category: 'Apex Council',
    logo: '/images/csec_council_logo.png',
    cover_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80',
    status: 'active',
    coordinator_name: 'Dr. A. Avinash (Faculty Coordinator) & Bathina Surya Abhilash (President)',
    members_count: 520,
    events_count: 42,
    projects_count: 65,
    established: '2001',
    tags: ['Council Governance', 'Approvals', 'Symposiums', 'All Clubs Oversight', '24 Officers']
  },
  {
    id: 'c-pragsoft',
    name: 'PRAGSOFT — Premier Technical Coding Club',
    slug: 'pragsoft',
    description: 'The flagship technical coding club of Pragati University. Organizes 24-hour hackathons, algorithmic coding competitions, competitive programming camps, and full-stack software development.',
    domain: 'Competitive Programming & Software Engineering',
    category: 'Technical',
    logo: '/images/pragsoft_logo.png',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    status: 'active',
    coordinator_name: 'Rohan Deshmukh & Dr. Rajeshwari Kulkarni',
    members_count: 285,
    events_count: 28,
    projects_count: 48,
    established: '2015',
    tags: ['Coding Competitions', 'DSA', 'Next.js', 'Hackathons', 'LeetCode Sprint']
  },

  {
    id: 'c-arvr',
    name: 'AR/VR & Metaverse Club',
    slug: 'arvr-club',
    description: 'Pioneering Spatial Computing, Unity/Unreal Engine 3D world creation, Oculus VR simulations, and Augmented Reality interactive applications for industrial and educational use.',
    domain: 'Augmented & Virtual Reality / Spatial Computing',
    category: 'Technical',
    logo: '🥽',
    cover_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=1200&auto=format&fit=crop&q=80',
    status: 'active',
    coordinator_name: 'Nakka Poojitha',
    members_count: 165,
    events_count: 16,
    projects_count: 22,
    established: '2022',
    tags: ['Unity 3D', 'Unreal Engine', 'Meta Quest', 'ARKit', 'Metaverse']
  },
  {
    id: 'c-rotaract',
    name: 'Rotaract Club of Pragati Surampalem Central (Non-Technical)',
    slug: 'rotaract',
    description: 'Premier non-technical student organization fostering youth leadership, public speaking, community service, social impact initiatives, blood donation drives, and cultural exchange.',
    domain: 'Leadership, Youth Development & Social Impact',
    category: 'Non-Technical',
    logo: '/images/rotaract_logo.png',
    cover_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
    status: 'active',
    coordinator_name: 'Mr. Y. Manas Kumar',
    members_count: 310,
    events_count: 22,
    projects_count: 14,
    established: '2008',
    tags: ['Youth Leadership', 'Community Outreach', 'Social Impact', 'Public Speaking']
  }
];

// 3. Events

export const DEMO_EVENTS: EventItem[] = [
  {
    id: 'e-csec-quantathon',
    club_id: 'c-csec',
    club_name: 'Computer Science Executive Council (CSEC)',
    title: 'QUANTATHON 2K26: Ideas in Superposition',
    description: 'Team-based quantum and emerging tech idea presentation event organized by the Computer Science Executive Council (CSEC), Pragati University. Participants explore and present breakthrough concepts inspired by Quantum Computing, Quantum Technology (|ψ⟩ = α|0⟩ + β|1⟩), and Emerging Frontiers before an esteemed faculty jury. Highlights include Merit Certificates for Winners, E-Certificates for all participants, and incubation pathways.',
    event_type: 'Competition',
    venue: 'Main Block, Pragati University, Surampalem, Andhra Pradesh',
    start_time: '2026-09-15T09:00:00Z',
    end_time: '2026-09-15T16:00:00Z',
    capacity: 150,
    registered_count: 138,
    eligibility: 'Team Size: 3 Members | Open Domain – Quantum & Emerging Technologies | All Pragati Students',
    registration_deadline: '2026-09-14T23:59:00Z',
    status: 'published',
    poster_url: '/images/events/quantathon_2k26_poster.jpg',
    tag_color: 'bg-tag-violet text-primary-700 font-bold',
    speaker: 'Dr. A. Avinash (Faculty Coordinator), B. Surya Abhilash (President) & Dr. D. V. Manjula (CSE HOD)'
  },
  {
    id: 'e-pragsoft-1',
    club_id: 'c-pragsoft',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    title: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    description: 'Flagship speed-coding competition on algorithms, dynamic programming, and graph data structures with instant automated test runner judge.',
    event_type: 'Competition',
    venue: 'Pragati Central Computer Center - Lab 1 & 2',
    start_time: '2026-09-24T10:00:00Z',
    end_time: '2026-09-24T16:00:00Z',
    capacity: 120,
    registered_count: 112,
    eligibility: 'All Engineering Students (CSE, IT, ECE, EEE)',
    registration_deadline: '2026-09-23T18:00:00Z',
    status: 'published',
    poster_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    tag_color: 'bg-tag-blue text-primary-700',
    speaker: 'Rohan Deshmukh (Lead Problem Setter)'
  },
  {
    id: 'e-arvr-1',
    club_id: 'c-arvr',
    club_name: 'AR/VR & Metaverse Club',
    title: 'Immersive Spatial Computing in Unity 3D & Meta Quest',
    description: 'Hands-on masterclass building interactive 3D spatial scenes, physics interactions, and deploying to Meta Quest VR headsets.',
    event_type: 'Workshop',
    venue: 'Pragati Advanced Technology Hub (PATHUB)',
    start_time: '2026-09-28T09:30:00Z',
    end_time: '2026-09-28T15:30:00Z',
    capacity: 60,
    registered_count: 54,
    eligibility: 'Open to All Enrolled Pragati Students',
    registration_deadline: '2026-09-27T20:00:00Z',
    status: 'published',
    poster_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop&q=80',
    tag_color: 'bg-tag-violet text-primary-700',
    speaker: 'Nakka Poojitha (VR Lab Lead)'
  },
  {
    id: 'e-rotaract-1',
    club_id: 'c-rotaract',
    club_name: 'Rotaract Club of Pragati (Non-Technical)',
    title: 'Youth Leadership Summit & Public Speaking Conclave',
    description: 'Keynote panel on professional communication, team leadership, career roadmap, and community development projects.',
    event_type: 'Social Impact',
    venue: 'Pragati University Main Auditorium',
    start_time: '2026-10-02T10:00:00Z',
    end_time: '2026-10-02T14:00:00Z',
    capacity: 250,
    registered_count: 220,
    eligibility: 'All University Students & Faculty',
    registration_deadline: '2026-10-01T18:00:00Z',
    status: 'published',
    poster_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&auto=format&fit=crop&q=80',
    tag_color: 'bg-tag-pink text-pink-700',
    speaker: 'Distinguished Rotary Governors'
  },
  {
    id: 'e-csec-1',
    club_id: 'c-csec',
    club_name: 'Computer Science Executive Council (CSEC)',
    title: 'PRAGATI HACK-A-THON 2026: 36-Hour National Innovation Sprint',
    description: 'University-wide flagship hackathon organized by CSEC with participation from 40+ colleges. Over ₹1,00,000 in cash prizes and startup incubation grants.',
    event_type: 'Hackathon',
    venue: 'Pragati Innovation Complex & PATHUB',
    start_time: '2026-10-15T09:00:00Z',
    end_time: '2026-10-16T21:00:00Z',
    capacity: 300,
    registered_count: 280,
    eligibility: 'Teams of 2-4 Members',
    registration_deadline: '2026-10-10T23:59:00Z',
    status: 'published',
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    tag_color: 'bg-tag-teal text-emerald-800',
    speaker: 'Industry Technical Directors & CSEC Board'
  }
];

// 4. Projects
export const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'PragCode: Real-Time Collaborative Algorithmic Code Editor',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    club_id: 'c-pragsoft',
    description: 'Distributed web-based collaborative IDE with real-time operational transformation, WebSockets, multi-language compiler sandbox, and LeetCode problem test cases.',
    domain: 'Software Engineering & Compilers',
    tech_stack: ['Next.js', 'Docker', 'WebSockets', 'Go', 'Monaco Editor'],
    team: ['Rohan Deshmukh', 'Ananya Verma', 'Jason Ranti'],
    submitted_by: 'Rohan Deshmukh',
    student_id: '24A31A05EB',
    student_email: 'rohan.deshmukh@pragati.ac.in',
    github_url: 'https://github.com/pragsoft/pragcode-ide',
    demo_url: 'https://pragcode.pragati.ac.in',
    live_url: 'https://pragcode.pragati.ac.in',
    status: 'pending_review',
    publication_status: 'private',
    rating: 0,
    remarks: 'Submitted for PRAGSOFT Club Admin review',
    review_feedback: '',
    upvotes: 215,
    date: '2026-09-14',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p2',
    title: 'Pragati Spatial Metaverse Campus Tour in VR',
    club_name: 'AR/VR & Metaverse Club',
    club_id: 'c-arvr',
    description: 'Full 1:1 digital twin of Pragati University campus with interactive classrooms, virtual laboratory equipment simulation, and multi-user spatial avatars.',
    domain: 'Spatial Computing & VR',
    tech_stack: ['Unity 3D', 'C#', 'Meta Quest SDK', 'Photon PUN', 'Blender'],
    team: ['Nakka Poojitha', 'Aarav Sharma'],
    submitted_by: 'Nakka Poojitha',
    student_id: '24A31A05JO',
    student_email: '24A31A05JO@pragati.ac.in',
    github_url: 'https://github.com/pragati-arvr/campus-metaverse',
    demo_url: 'https://metaverse.pragati.ac.in',
    live_url: 'https://metaverse.pragati.ac.in',
    status: 'approved',
    publication_status: 'showcased',
    rating: 9.9,
    remarks: 'Remarkable photorealistic 3D asset optimization and fluid VR locomotion.',
    review_feedback: 'Outstanding technical execution. Ready for university showcase.',
    reviewed_by: 'Nakka Poojitha (Club Lead)',
    reviewed_at: '2026-08-30',
    showcased_at: '2026-09-01',
    upvotes: 260,
    date: '2026-08-28',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p3',
    title: 'Rotaract BloodBridge: Real-Time Emergency Donor Matrix',
    club_name: 'Rotaract Club of Pragati (Non-Technical)',
    club_id: 'c-rotaract',
    description: 'Geo-spatial mobile portal connecting verified blood donors with Kakinada and Rajahmundry hospital trauma centers in real time.',
    domain: 'Healthcare & Social Impact',
    tech_stack: ['Flutter', 'Supabase', 'Leaflet GPS', 'SMS Gateway'],
    team: ['Vikram Paul', 'Pooja Reddy'],
    submitted_by: 'Vikram Paul',
    github_url: 'https://github.com/rotaract-pragati/bloodbridge',
    demo_url: 'https://bloodbridge.pragati.ac.in',
    live_url: 'https://bloodbridge.pragati.ac.in',
    status: 'approved',
    publication_status: 'showcased',
    rating: 9.5,
    remarks: 'Direct social impact with over 500+ verified campus donors onboarded.',
    review_feedback: 'Approved for public impact showcase.',
    reviewed_by: 'Mr. Y. Manas Kumar',
    reviewed_at: '2026-09-03',
    showcased_at: '2026-09-04',
    upvotes: 180,
    date: '2026-09-02',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p4',
    title: 'AlgoGrader: Automated Multi-Language Sandbox Judge',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    club_id: 'c-pragsoft',
    description: 'High-throughput code evaluation microservice with Docker container cgroup limits, memory isolation, and sub-millisecond execution telemetry.',
    domain: 'Software Engineering & Compilers',
    tech_stack: ['Go', 'Docker', 'gRPC', 'Redis', 'PostgreSQL'],
    team: ['Vasamsetti Jahnavi Devi'],
    submitted_by: 'Vasamsetti Jahnavi Devi',
    student_id: '25A31A05ET',
    student_email: 'student@pragati.ac.in',
    github_url: 'https://github.com/pragsoft/algograder-engine',
    demo_url: 'https://judge.pragsoft.pragati.ac.in',
    live_url: 'https://judge.pragsoft.pragati.ac.in',
    status: 'changes_requested',
    publication_status: 'private',
    rating: 7.5,
    remarks: 'Needs container security hardening before public release.',
    review_feedback: 'Please update the container memory limits to 128MB per execution and add automated test runners for Python 3.12 and Rust.',
    reviewed_by: 'Rohan Deshmukh (PRAGSOFT Admin)',
    reviewed_at: '2026-09-12',
    upvotes: 145,
    date: '2026-09-10',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'p5',
    title: 'PathFinder: Interactive Graph Algorithms Visualizer',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    club_id: 'c-pragsoft',
    description: 'Canvas-based step-by-step visual exploration of Dijkstra, A-Star, Bellman-Ford, and Prim Minimal Spanning Tree algorithms with maze generators.',
    domain: 'Algorithms & Visualization',
    tech_stack: ['React', 'TypeScript', 'HTML5 Canvas', 'TailwindCSS'],
    team: ['Jason Ranti'],
    submitted_by: 'Jason Ranti',
    student_id: '24A31A05IR',
    student_email: 'jason.ranti@pragati.ac.in',
    github_url: 'https://github.com/pragsoft/pathfinder-viz',
    demo_url: 'https://pathfinder.pragsoft.pragati.ac.in',
    live_url: 'https://pathfinder.pragsoft.pragati.ac.in',
    status: 'approved',
    publication_status: 'private',
    rating: 9.2,
    remarks: 'Approved by PRAGSOFT Club Admin. Ready to be showcased on public portal.',
    review_feedback: 'Excellent interactive animations and clean algorithmic implementation.',
    reviewed_by: 'Rohan Deshmukh (PRAGSOFT Admin)',
    reviewed_at: '2026-09-15',
    upvotes: 190,
    date: '2026-09-11',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80'
  }
];

// 5. Roadmaps
export const DEMO_ROADMAPS: RoadmapItem[] = [
  {
    id: 'r-dsa',
    technology: 'PRAGSOFT Competitive Programming & DSA',
    domain: 'Algorithms & Problem Solving',
    icon: '💻',
    color: 'from-purple-500 to-indigo-600',
    stages: [
      {
        stage: 'Beginner',
        title: 'Time Complexity, Arrays, Strings & Recursion',
        description: 'Big-O notation, two-pointer techniques, sliding window patterns, and binary search.',
        duration: '4 Weeks',
        badge: 'PRAGSOFT Algorithm Novice',
        skills: ['Time & Space Complexity', 'Two Pointers', 'Binary Search', 'Sliding Window'],
        resources: [
          { title: 'Asymptotic Analysis & Big-O Masterclass', type: 'Video', duration: '45 mins' },
          { title: 'Array Manipulation & 50 Curated Practice Problems', type: 'Hands-on', duration: '4 hours' }
        ]
      },
      {
        stage: 'Intermediate',
        title: 'Trees, Graphs, BFS/DFS & Dynamic Programming',
        description: 'Binary trees, shortest path Dijkstra, topological sort, memoization, and tabulations.',
        duration: '6 Weeks',
        badge: 'PRAGSOFT Code Specialist',
        skills: ['Tree Traversals', 'Graph Adjacency Lists', 'Dijkstra / Bellman-Ford', '0/1 Knapsack DP'],
        resources: [
          { title: 'Graph Traversal Patterns & Cycle Detection', type: 'Video', duration: '1.2 hours' },
          { title: 'Dynamic Programming Patterns in LeetCode Hard', type: 'Hands-on', duration: '6 hours' }
        ]
      },
      {
        stage: 'Advanced',
        title: 'Segment Trees, Trie & Distributed System Competitions',
        description: 'Range query data structures, bitmask DP, and competitive contest optimization.',
        duration: '8 Weeks',
        badge: 'PRAGSOFT Grandmaster Badge',
        skills: ['Segment Trees', 'Trie / Suffix Automata', 'Bitmask DP', 'Competitive Contest Math'],
        resources: [
          { title: 'Advanced Range Queries with Lazy Propagation', type: 'Documentation', duration: '1.5 hours' }
        ]
      }
    ]
  },
  {
    id: 'r-arvr',
    technology: 'AR/VR Spatial Computing & Metaverse',
    domain: 'Immersive Technologies',
    icon: '🥽',
    color: 'from-blue-500 to-cyan-600',
    stages: [
      {
        stage: 'Beginner',
        title: 'Unity 3D Engine Essentials & C# Scripting',
        description: 'Transforms, vectors, physics colliders, rigidbodies, and spatial audio.',
        duration: '4 Weeks',
        badge: 'VR Apprentice Badge',
        skills: ['Unity Editor Layout', 'C# Scripting for Games', '3D Coordinate Systems', 'Lighting & PBR Materials'],
        resources: [
          { title: 'Introduction to Unity 3D & Component Architecture', type: 'Video', duration: '50 mins' },
          { title: 'Build Your First 3D Virtual Room', type: 'Hands-on', duration: '3 hours' }
        ]
      },
      {
        stage: 'Intermediate',
        title: 'XR Interaction Toolkit & Meta Quest Deployment',
        description: 'Hand tracking, ray interactor, grab physics, and building APKs for Meta Quest standalone.',
        duration: '6 Weeks',
        badge: 'XR Developer Badge',
        skills: ['XR Interaction Toolkit', 'Teleportation & Continuous Locomotion', 'Hand Tracking Gestures', 'Android XR Build'],
        resources: [
          { title: 'XR Interaction Toolkit v3 Setup & Grip Controllers', type: 'Video', duration: '1.2 hours' },
          { title: 'Deploying Standalone APKs on Meta Quest 3', type: 'Hands-on', duration: '4 hours' }
        ]
      }
    ]
  }
];

// 6. Tools
export const DEMO_TOOLS: ToolItem[] = [
  {
    id: 't1',
    name: 'Visual Studio Code',
    category: 'IDE & Code Editors',
    purpose: 'Standard extensible code editor with integrated terminal, Git control, and debugging plugins.',
    platform: 'Win / macOS / Linux',
    license: 'Free / Open Source (MIT)',
    official_link: 'https://code.visualstudio.com',
    recommended_stage: 'Beginner',
    icon: '💻'
  },
  {
    id: 't2',
    name: 'Unity 3D Hub & Editor',
    category: 'AR/VR & Game Engine',
    purpose: 'Real-time 3D development platform for VR simulations, AR applications, and metaverse world design.',
    platform: 'Win / macOS',
    license: 'Free Student License',
    official_link: 'https://unity.com',
    recommended_stage: 'Beginner',
    icon: '🥽'
  },
  {
    id: 't3',
    name: 'Postman API Suite',
    category: 'API Testing & Design',
    purpose: 'Design, mock, inspect, and automate test suites for REST, GraphQL, and WebSocket endpoints.',
    platform: 'Web & Desktop',
    license: 'Freemium',
    official_link: 'https://www.postman.com',
    recommended_stage: 'Beginner',
    icon: '🚀'
  },
  {
    id: 't4',
    name: 'Docker Desktop',
    category: 'DevOps & Containers',
    purpose: 'Container engine for building, sharing, and running lightweight reproducible microservices.',
    platform: 'Cross-platform',
    license: 'Free for Education',
    official_link: 'https://www.docker.com',
    recommended_stage: 'Intermediate',
    icon: '🐳'
  },
  {
    id: 't5',
    name: 'Figma Design Suite',
    category: 'Product Design',
    purpose: 'Collaborative UI/UX wireframing, design tokens management, and high-fidelity interactive prototyping.',
    platform: 'Browser & Desktop',
    license: 'Free Educational License',
    official_link: 'https://www.figma.com',
    recommended_stage: 'Beginner',
    icon: '🎨'
  },
  {
    id: 't6',
    name: 'Supabase Platform',
    category: 'Backend & Database',
    purpose: 'Postgres database with instant REST/GraphQL APIs, Auth, Realtime listeners, and Storage.',
    platform: 'Cloud / Self-Hosted',
    license: 'Open Source (Apache 2.0)',
    official_link: 'https://supabase.com',
    recommended_stage: 'Beginner',
    icon: '⚡'
  }
];

// 7. Certificates
export const DEMO_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'cert-quantathon-01',
    certificate_number: 'PRAG-CERT-2026-QUANTUM-8841',
    student_name: 'Bathina Surya Abhilash',
    student_email: '24A31A05KF@pragati.ac.in',
    student_id: '24A31A05KF',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    event_id: 'evt-quantathon-2026',
    event_title: 'QUANTATHON 2K26: Ideas in Superposition',
    club_name: 'Computer Science Executive Council (CSEC)',
    issue_date: '15 Sep 2026',
    attendance_status: 'Attended',
    verification_status: 'Verified',
    status: 'Valid'
  },
  {
    id: 'cert-001',
    certificate_number: 'PRAG-CERT-2026-6792',
    student_name: 'Vasamsetti Jahnavi Devi',
    student_email: 'student@pragati.ac.in',
    student_id: '25A31A05ET',
    user_id: 'a0000000-0000-0000-0000-000000000002',
    event_id: 'evt-1',
    event_title: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    club_name: 'PRAGSOFT',
    issue_date: '09 Sep 2026',
    attendance_status: 'Attended',
    verification_status: 'Verified',
    status: 'Valid'
  },
  {
    id: 'cert-002',
    certificate_number: 'PRAG-CERT-2026-VR-7712',
    student_name: 'Nakka Poojitha',
    student_email: '24A31A05JO@pragati.ac.in',
    student_id: '24A31A05JO',
    user_id: 'a0000000-0000-0000-0000-000000000001-alt',
    event_id: 'evt-vr-01',
    event_title: 'Immersive Spatial Computing in Unity 3D & Meta Quest',
    club_name: 'AR/VR & Metaverse Club',
    issue_date: '15 Jul 2026',
    attendance_status: 'Attended',
    verification_status: 'Verified',
    status: 'Valid'
  }
];

// 8. Announcements
export const DEMO_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-quantathon',
    title: '⚛️ QUANTATHON 2K26 — Ideas in Superposition (CSEC Council)',
    content: 'Unleash your ideas and explore quantum frontiers! 3-member team idea presentation event on 15th Sept 2026 at Main Block. Merit certificates for winners & E-certificates for all participants.',
    club_name: 'Computer Science Executive Council (CSEC)',
    category: 'Alert',
    important: true,
    date: '2026-09-15'
  },
  {
    id: 'ann-1',
    title: 'PRAGSOFT CodeSprint 2026 Registrations Opened with ₹50,000 Cash Pool!',
    content: 'All B.Tech students can register on the portal. Problem setting by Google Summer of Code alumni.',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    category: 'Alert',
    important: true,
    date: '2026-09-15'
  },
  {
    id: 'ann-2',
    title: 'CSEC Council Announces Annual Technical Symposium Date: Oct 15-16',
    content: 'The Computer Science Executive Council has sanctioned the schedule for all 4 technical and non-technical clubs.',
    club_name: 'Computer Science Executive Council (CSEC)',
    category: 'Notice',
    important: true,
    date: '2026-09-12'
  },
  {
    id: 'ann-3',
    title: 'AR/VR Club Receives 10 New Meta Quest 3 Headsets at PATHUB',
    content: 'Workstation slots are open for students working on spatial computing and metaverse digital twin projects.',
    club_name: 'AR/VR & Metaverse Club',
    category: 'Achievement',
    important: false,
    date: '2026-09-08'
  }
];

// 8.5 Event Gallery
export const DEMO_GALLERY: GalleryItem[] = [
  {
    id: 'g-quantathon-poster',
    title: 'QUANTATHON 2K26: Ideas in Superposition — Official Poster',
    club_name: 'Computer Science Executive Council (CSEC)',
    event_name: 'QUANTATHON 2K26 (Sept 15, 2026)',
    date: '2026-09-15',
    image_url: '/images/events/quantathon_2k26_poster.jpg'
  },
  {
    id: 'g-ideathon-panel',
    title: 'Idea Presentation Before Faculty Evaluation Panel (Dr. A. Avinash & Jury)',
    club_name: 'Computer Science Executive Council (CSEC)',
    event_name: 'Sustainable Ideathon & QUANTATHON Pitch',
    date: '2026-09-16',
    image_url: '/images/events/csec_ideathon_evaluation_panel.png'
  },
  {
    id: 'g-ideathon-stage',
    title: 'Student Team Pitching Sustainable Engineering Ideas on Stage',
    club_name: 'Computer Science Executive Council (CSEC)',
    event_name: 'Engineers Day Ideathon Showcase',
    date: '2026-09-16',
    image_url: '/images/events/csec_ideathon_presentation.jpg'
  },
  {
    id: 'g-ideathon-audience',
    title: 'Main Block Classroom Session & Interactive Audience Q&A',
    club_name: 'Computer Science Executive Council (CSEC)',
    event_name: 'Ideathon & Technical Conclave',
    date: '2026-09-16',
    image_url: '/images/events/csec_ideathon_classroom_audience.png'
  },
  {
    id: 'g-ideathon-group',
    title: 'CSEC Council Officers & Ideathon Participants Grand Group Photo',
    club_name: 'Computer Science Executive Council (CSEC)',
    event_name: 'Valedictory & Merit Felicitation',
    date: '2026-09-16',
    image_url: '/images/events/csec_ideathon_group_participants.png'
  },
  {
    id: 'g-pragsoft-hack',
    title: 'PRAGSOFT 24-Hour Code Marathon & Automated Sandbox Testing',
    club_name: 'PRAGSOFT — Premier Technical Coding Club',
    event_name: 'CodeSprint 2026',
    date: '2026-08-20',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'g-arvr-metaverse',
    title: 'PATHUB Spatial Computing Laboratory & Meta Quest VR Deployment',
    club_name: 'AR/VR & Metaverse Club',
    event_name: 'Spatial Computing Workshop',
    date: '2026-07-15',
    image_url: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop&q=80'
  }
];

// 9. Audit Logs
export const DEMO_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-101',
    actor_name: 'Nakka Poojitha',
    actor_role: 'Super Admin / CSEC President',
    action: 'Sanctioned Club Event Proposal',
    target: 'PRAGSOFT CodeSprint 2026',
    timestamp: '2026-09-16 19:45',
    status: 'Success'
  },
  {
    id: 'log-102',
    actor_name: 'Dr. Rajeshwari Kulkarni',
    actor_role: 'Faculty Coordinator / HOD',
    action: 'Approved Executive Team Tenure',
    target: 'PRAGSOFT: Lead Architect (2026-27)',
    timestamp: '2026-09-16 18:20',
    status: 'Success'
  },
  {
    id: 'log-103',
    actor_name: 'Rohan Deshmukh',
    actor_role: 'Club Admin',
    action: 'Generated Event Poster & Circular',
    target: 'Algorithmic Coding Championship',
    timestamp: '2026-09-16 16:10',
    status: 'Info'
  }
];

// 10. Official Computer Science Executive Council (CSEC) 24-Member Student Committee
export const CSEC_COUNCIL_ROSTER: CouncilMember[] = [
  {
    sNo: 1,
    rollNo: '24A31A05KF',
    name: 'Bathina Surya Abhilash',
    yearSection: 'III-F',
    role: 'President',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05KF@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 2,
    rollNo: '25A31A05ET',
    name: 'Vasamsetti Jahnavi Devi',
    yearSection: 'II-D',
    role: 'Deputy President',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05ET@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 3,
    rollNo: '24A31A05IM',
    name: 'Rasamsetti Jishnu Tej',
    yearSection: 'III-E',
    role: 'Vice President',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05IM@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 4,
    rollNo: '25A31A05FC',
    name: 'Duggirala Hemanth',
    yearSection: 'II-D',
    role: 'Deputy Vice President',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05FC@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 5,
    rollNo: '24A31A05EB',
    name: 'Naga Sharmila Patchari',
    yearSection: 'III-E',
    role: 'Secretary',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05EB@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 6,
    rollNo: '25A31A05JX',
    name: 'Vadlakattu Lasya Rithika',
    yearSection: 'II-F',
    role: 'Deputy Secretary',
    department: 'Computer Science & Engineering',
    category: 'Core Leadership',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05JX@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 7,
    rollNo: '24A31A05KO',
    name: 'Ganapathula Teja Sri Santosh',
    yearSection: 'III-F',
    role: 'Chief – Media Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Media & Design',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05KO@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 8,
    rollNo: '25A31A05S3',
    name: 'Kolati Nithya Sumania',
    yearSection: 'II-F',
    role: 'Media Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Media & Design',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05S3@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 9,
    rollNo: '25A31A05S7',
    name: 'Pokala Sathya Lakshmi Pavan',
    yearSection: 'III-A',
    role: 'Media Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Media & Design',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05S7@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 10,
    rollNo: '25A31A05IK',
    name: 'Pasagadugula Bala Ganesh',
    yearSection: 'II-E',
    role: 'Media Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Media & Design',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05IK@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 11,
    rollNo: '24A31A05JO',
    name: 'Nakka Poojitha',
    yearSection: 'III-F',
    role: 'Chief – Technical Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Technical Wing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05JO@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 12,
    rollNo: '24A31A05IE',
    name: 'Challla Pradeep',
    yearSection: 'III-E',
    role: 'Technical Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Technical Wing',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05IE@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 13,
    rollNo: '25A31A05DW',
    name: 'Bevura Prasanthi',
    yearSection: 'II-D',
    role: 'Technical Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Technical Wing',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05DW@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 14,
    rollNo: '25A31A05JL',
    name: 'Koppisetti Sai Venkata Tulaja Sureshna',
    yearSection: 'II-F',
    role: 'Technical Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Technical Wing',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05JL@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 15,
    rollNo: '25A31A05JE',
    name: 'Doddipalla Jaya Naga Sai Sri',
    yearSection: 'II-F',
    role: 'Technical Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Technical Wing',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05JE@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 16,
    rollNo: '24A31A05KQ',
    name: 'Kantipudi Venkata Siva',
    yearSection: 'III-F',
    role: 'Chief – Event Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05KQ@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 17,
    rollNo: '24A31A05EK',
    name: 'Nadimpalli Susmitha Devi',
    yearSection: 'III-D',
    role: 'Event Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05EK@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 18,
    rollNo: '25A31A0517',
    name: 'Manne Harshitha Sri',
    yearSection: 'II-A',
    role: 'Event Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
    email: '25A31A0517@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 19,
    rollNo: '25A31A0535',
    name: 'Kapu Manikanta',
    yearSection: 'II-A',
    role: 'Event Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
    email: '25A31A0535@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 20,
    rollNo: '25A31A0567',
    name: 'Akkireddi Krishna Sai Manasa',
    yearSection: 'II-A',
    role: 'Event Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Event Operations',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    email: '25A31A0567@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 21,
    rollNo: '24A31A05FX',
    name: 'Polaki Kesava Datta',
    yearSection: 'III-D',
    role: 'Chief – Documentation Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Documentation & Records',
    avatar: 'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=200&auto=format&fit=crop&q=80',
    email: '24A31A05FX@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 22,
    rollNo: '25A31A0523',
    name: 'Poyyala Swaroopa',
    yearSection: 'II-A',
    role: 'Documentation Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Documentation & Records',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    email: '25A31A0523@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 23,
    rollNo: '25A31A05FD',
    name: 'Ganapathula Supradeep',
    yearSection: 'II-D',
    role: 'Documentation Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Documentation & Records',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05FD@pragati.ac.in',
    status: 'Approved'
  },
  {
    sNo: 24,
    rollNo: '25A31A05GD',
    name: 'Tayva Kishore',
    yearSection: 'II-D',
    role: 'Documentation Coordinator',
    department: 'Computer Science & Engineering',
    category: 'Documentation & Records',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    email: '25A31A05GD@pragati.ac.in',
    status: 'Approved'
  }
];

export const DEMO_MEMBERSHIPS: ClubMembershipRecord[] = [
  {
    id: 'mem-1',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000002',
    studentName: 'Vasamsetti Jahnavi Devi',
    studentEmail: '25A31A05ET@pragati.ac.in',
    rollNumber: '25A31A05ET',
    department: 'Computer Science & Engineering',
    year: '2nd Year (2025-2029)',
    status: 'Active',
    joinedDate: '2025-08-15',
    role: 'Member',
    hasDigitalPass: true
  },
  {
    id: 'mem-2',
    clubId: 'c-arvr',
    clubName: 'AR/VR & Spatial Computing Club',
    userId: 'a0000000-0000-0000-0000-000000000002',
    studentName: 'Vasamsetti Jahnavi Devi',
    studentEmail: '25A31A05ET@pragati.ac.in',
    rollNumber: '25A31A05ET',
    department: 'Computer Science & Engineering',
    year: '2nd Year (2025-2029)',
    status: 'Active',
    joinedDate: '2025-09-01',
    role: 'Member',
    hasDigitalPass: true
  },
  {
    id: 'mem-3',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000001',
    studentName: 'Bathina Surya Abhilash',
    studentEmail: '24A31A05KF@pragati.ac.in',
    rollNumber: '24A31A05KF',
    department: 'Computer Science & Engineering',
    year: '3rd Year (2024-2028)',
    status: 'Active',
    joinedDate: '2024-08-10',
    role: 'Officer',
    hasDigitalPass: true
  },
  {
    id: 'mem-4',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000004',
    studentName: 'Nakka Poojitha',
    studentEmail: '24A31A05JO@pragati.ac.in',
    rollNumber: '24A31A05JO',
    department: 'Computer Science & Engineering',
    year: '3rd Year (2024-2028)',
    status: 'Active',
    joinedDate: '2024-08-12',
    role: 'Coordinator',
    hasDigitalPass: true
  },
  {
    id: 'mem-5',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-anitha',
    studentName: 'Anitha Muddurthi',
    studentEmail: 'anitha.m@pragati.ac.in',
    rollNumber: '24A31A05A1',
    department: 'Information Technology',
    year: '3rd Year (2024-2028)',
    status: 'Active',
    joinedDate: '2024-09-01',
    role: 'Member',
    hasDigitalPass: true
  },
  {
    id: 'mem-6',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-rahul',
    studentName: 'Rahul Kumar Varma',
    studentEmail: 'rahul.k@pragati.ac.in',
    rollNumber: '25A31A05B8',
    department: 'Artificial Intelligence & DS',
    year: '2nd Year (2025-2029)',
    status: 'Active',
    joinedDate: '2025-09-10',
    role: 'Member',
    hasDigitalPass: true
  },
  {
    id: 'mem-7',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-priya',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.s@pragati.ac.in',
    rollNumber: '26A31A05C4',
    department: 'Computer Science & Engineering',
    year: '1st Year (2026-2030)',
    status: 'Pending',
    joinedDate: '2026-09-14',
    role: 'Member',
    hasDigitalPass: false
  },
  {
    id: 'mem-8',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-saiteja',
    studentName: 'K. Sai Teja',
    studentEmail: 'saiteja.k@pragati.ac.in',
    rollNumber: '24A31A05D9',
    department: 'Electronics & Communication',
    year: '3rd Year (2024-2028)',
    status: 'Active',
    joinedDate: '2024-08-20',
    role: 'Member',
    hasDigitalPass: true
  }
];

export const DEMO_REGISTRATIONS: EventRegistrationRecord[] = [
  {
    id: 'reg-cs-jahnavi',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000002',
    studentName: 'Vasamsetti Jahnavi Devi',
    studentEmail: '25A31A05ET@pragati.ac.in',
    rollNumber: '25A31A05ET',
    department: 'Computer Science & Engineering',
    status: 'registered',
    registeredAt: '2026-09-10',
    attended: true,
    certificateIssued: true
  },
  {
    id: 'reg-cs-surya',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000001',
    studentName: 'Bathina Surya Abhilash',
    studentEmail: '24A31A05KF@pragati.ac.in',
    rollNumber: '24A31A05KF',
    department: 'Computer Science & Engineering',
    status: 'registered',
    registeredAt: '2026-09-10',
    attended: true,
    certificateIssued: false
  },
  {
    id: 'reg-cs-poojitha',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'a0000000-0000-0000-0000-000000000004',
    studentName: 'Nakka Poojitha',
    studentEmail: '24A31A05JO@pragati.ac.in',
    rollNumber: '24A31A05JO',
    department: 'Computer Science & Engineering',
    status: 'registered',
    registeredAt: '2026-09-10',
    attended: true,
    certificateIssued: false
  },
  {
    id: 'reg-cs-anitha',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-anitha',
    studentName: 'Anitha Muddurthi',
    studentEmail: 'anitha.m@pragati.ac.in',
    rollNumber: '24A31A05A1',
    department: 'Information Technology',
    status: 'registered',
    registeredAt: '2026-09-11',
    attended: true,
    certificateIssued: false
  },
  {
    id: 'reg-cs-rahul',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    clubName: 'PRAGSOFT — Premier Technical Coding Club',
    userId: 'u-rahul',
    studentName: 'Rahul Kumar Varma',
    studentEmail: 'rahul.k@pragati.ac.in',
    rollNumber: '25A31A05B8',
    department: 'Artificial Intelligence & DS',
    status: 'registered',
    registeredAt: '2026-09-11',
    attended: false,
    certificateIssued: false
  },
  {
    id: 'reg-quant-jahnavi',
    eventId: 'e-quantathon-2026',
    eventTitle: 'QUANTATHON 2K26: Ideas in Superposition',
    clubId: 'c-csec',
    clubName: 'Computer Science Executive Council (CSEC)',
    userId: 'a0000000-0000-0000-0000-000000000002',
    studentName: 'Vasamsetti Jahnavi Devi',
    studentEmail: '25A31A05ET@pragati.ac.in',
    rollNumber: '25A31A05ET',
    department: 'Computer Science & Engineering',
    status: 'registered',
    registeredAt: '2026-09-14',
    attended: false,
    certificateIssued: false
  },
  {
    id: 'reg-quant-surya',
    eventId: 'e-quantathon-2026',
    eventTitle: 'QUANTATHON 2K26: Ideas in Superposition',
    clubId: 'c-csec',
    clubName: 'Computer Science Executive Council (CSEC)',
    userId: 'a0000000-0000-0000-0000-000000000001',
    studentName: 'Bathina Surya Abhilash',
    studentEmail: '24A31A05KF@pragati.ac.in',
    rollNumber: '24A31A05KF',
    department: 'Computer Science & Engineering',
    status: 'registered',
    registeredAt: '2026-09-14',
    attended: false,
    certificateIssued: false
  }
];

export const DEMO_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-cs-jahnavi',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    userId: 'a0000000-0000-0000-0000-000000000002',
    studentName: 'Vasamsetti Jahnavi Devi',
    studentEmail: '25A31A05ET@pragati.ac.in',
    rollNumber: '25A31A05ET',
    timestamp: '2026-09-12T10:15:00Z',
    method: 'qr',
    status: 'Attended',
    markedBy: 'Nakka Poojitha (Club Admin)'
  },
  {
    id: 'att-cs-surya',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    userId: 'a0000000-0000-0000-0000-000000000001',
    studentName: 'Bathina Surya Abhilash',
    studentEmail: '24A31A05KF@pragati.ac.in',
    rollNumber: '24A31A05KF',
    timestamp: '2026-09-12T10:18:00Z',
    method: 'qr',
    status: 'Attended',
    markedBy: 'Nakka Poojitha (Club Admin)'
  },
  {
    id: 'att-cs-poojitha',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    userId: 'a0000000-0000-0000-0000-000000000004',
    studentName: 'Nakka Poojitha',
    studentEmail: '24A31A05JO@pragati.ac.in',
    rollNumber: '24A31A05JO',
    timestamp: '2026-09-12T10:05:00Z',
    method: 'qr',
    status: 'Attended',
    markedBy: 'Dr. Rajeshwari Kulkarni (Faculty)'
  },
  {
    id: 'att-cs-anitha',
    eventId: 'e-pragsoft-1',
    eventTitle: 'CodeSprint 2026: Inter-Departmental Coding Championship',
    clubId: 'c-pragsoft',
    userId: 'u-anitha',
    studentName: 'Anitha Muddurthi',
    studentEmail: 'anitha.m@pragati.ac.in',
    rollNumber: '24A31A05A1',
    timestamp: '2026-09-12T10:20:00Z',
    method: 'qr',
    status: 'Attended',
    markedBy: 'Nakka Poojitha (Club Admin)'
  }
];

export const DEMO_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'a0000000-0000-0000-0000-000000000002',
    title: 'Registration Confirmed',
    message: 'Your registration for QUANTATHON 2K26 is verified. Your digital QR pass is ready.',
    type: 'event',
    timestamp: 'Just now',
    read: false,
    link: '/dashboard/student?tab=events'
  },
  {
    id: 'notif-2',
    userId: 'a0000000-0000-0000-0000-000000000002',
    title: 'Certificate Issued',
    message: 'Certificate PRAG-CERT-2026-6792 for CodeSprint 2026 is available for download.',
    type: 'certificate',
    timestamp: 'Yesterday',
    read: false,
    link: '/dashboard/student?tab=certificates'
  }
];
