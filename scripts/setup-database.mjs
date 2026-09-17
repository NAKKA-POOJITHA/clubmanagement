// Database Setup & Seeding Script for Centralized Technical Clubs Management System
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.local if present
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpapvtthlzralwkjaalf.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

console.log('Connecting to Supabase at:', SUPABASE_URL);

async function setup() {
  try {
    console.log('--- Testing Supabase Connection ---');
    const { data: test, error: testErr } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (testErr) {
      console.log('Note: profiles table might need to be created via SQL Editor if direct DDL is restricted:', testErr.message);
    } else {
      console.log('Supabase tables verified and accessible!');
    }

    console.log('--- Seeding Super Admin & Faculty Account ---');
    const superAdminEmail = 'poojithampc10@gmail.com';
    const superAdminName = 'Nakka Poojitha';

    // Check or invite user
    let superAdminId = 'a0000000-0000-0000-0000-000000000001';
    try {
      const { data: usersData } = await supabase.auth.admin.listUsers();
      const existingUser = usersData?.users?.find(u => u.email === superAdminEmail);
      if (existingUser) {
        superAdminId = existingUser.id;
        console.log('Found existing auth user for Super Admin:', superAdminId);
      } else {
        // Create or invite
        const { data: created, error: createErr } = await supabase.auth.admin.createUser({
          email: superAdminEmail,
          email_confirm: true,
          user_metadata: { full_name: superAdminName, role: 'super_admin' },
          password: 'Password@123'
        });
        if (created?.user) {
          superAdminId = created.user.id;
          console.log('Created Super Admin user account:', superAdminId);
        } else if (createErr) {
          console.log('Auth createUser notice:', createErr.message);
        }
      }
    } catch (authErr) {
      console.log('Auth admin operation notice:', authErr.message);
    }

    // Upsert Profile
    const { error: profErr } = await supabase.from('profiles').upsert({
      id: superAdminId,
      full_name: superAdminName,
      email: superAdminEmail,
      role: 'super_admin',
      department: 'Computer Science & Engineering',
      academic_year: 'Faculty / Administration',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 9876543210'
    });
    if (profErr) {
      console.log('Profile upsert note:', profErr.message);
    } else {
      console.log('Super Admin profile seeded successfully!');
    }

    // Seed Demo Users for easy judging / testing
    const demoProfiles = [
      {
        id: 'a0000000-0000-0000-0000-000000000002',
        full_name: 'Aarav Sharma',
        email: 'aarav.student@college.edu',
        role: 'student',
        department: 'Information Technology',
        academic_year: '3rd Year (2024-2028)',
        photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        phone: '+91 9876500001'
      },
      {
        id: 'a0000000-0000-0000-0000-000000000003',
        full_name: 'Ananya Verma',
        email: 'ananya.member@college.edu',
        role: 'club_member',
        department: 'Computer Science & Engineering',
        academic_year: '2nd Year (2025-2029)',
        photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone: '+91 9876500002'
      },
      {
        id: 'a0000000-0000-0000-0000-000000000004',
        full_name: 'Rohan Deshmukh',
        email: 'rohan.admin@college.edu',
        role: 'club_admin',
        department: 'Electronics & Communication',
        academic_year: '4th Year (2023-2027)',
        photo_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        phone: '+91 9876500003'
      },
      {
        id: 'a0000000-0000-0000-0000-000000000005',
        full_name: 'Dr. Rajeshwari Kulkarni',
        email: 'rajeshwari.faculty@college.edu',
        role: 'faculty_coordinator',
        department: 'Computer Science & Engineering',
        academic_year: 'Faculty Coordinator',
        photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        phone: '+91 9876500004'
      },
      {
        id: 'a0000000-0000-0000-0000-000000000006',
        full_name: 'Prof. Suresh Nair',
        email: 'suresh.dept@college.edu',
        role: 'department_admin',
        department: 'Computer Science & Engineering',
        academic_year: 'Head of Department',
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+91 9876500005'
      }
    ];

    for (const p of demoProfiles) {
      await supabase.from('profiles').upsert(p);
    }
    console.log('Demo stakeholder profiles seeded!');

    // Seed Clubs
    const clubs = [
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        name: 'AI & Robotics Innovation Lab',
        description: 'Pioneering cutting-edge research in Machine Learning, Computer Vision, Autonomous Systems, and Humanoid Robotics.',
        domain: 'Artificial Intelligence & Robotics',
        status: 'active',
        coordinator_id: superAdminId
      },
      {
        id: 'c0000000-0000-0000-0000-000000000002',
        name: 'Web & Mobile Full-Stack Guild',
        description: 'Building modern, scalable web applications, mobile platforms, API microservices, and decentralized web architectures.',
        domain: 'Full-Stack Web & Mobile Engineering',
        status: 'active',
        coordinator_id: 'a0000000-0000-0000-0000-000000000005'
      },
      {
        id: 'c0000000-0000-0000-0000-000000000003',
        name: 'Cyber Security & Ethical Hacking Club',
        description: 'Dedicated to offensive/defensive cybersecurity, penetration testing, CTF competitions, cryptography, and network defense.',
        domain: 'Cybersecurity & InfoSec',
        status: 'active',
        coordinator_id: 'a0000000-0000-0000-0000-000000000005'
      },
      {
        id: 'c0000000-0000-0000-0000-000000000004',
        name: 'Cloud & DevOps Guild',
        description: 'Mastering Kubernetes, Terraform, AWS/GCP cloud architectures, continuous integration pipelines, and infrastructure as code.',
        domain: 'Cloud Architecture & DevOps',
        status: 'active',
        coordinator_id: superAdminId
      },
      {
        id: 'c0000000-0000-0000-0000-000000000005',
        name: 'Design & UI/UX Guild',
        description: 'Crafting world-class digital user experiences, design systems, interactive prototypes, user research, and accessibility standards.',
        domain: 'Product Design & UI/UX',
        status: 'active',
        coordinator_id: 'a0000000-0000-0000-0000-000000000005'
      }
    ];

    for (const c of clubs) {
      await supabase.from('clubs').upsert(c);
    }
    console.log('5 Technical Clubs seeded!');

    // Seed Events
    const events = [
      {
        id: 'e0000000-0000-0000-0000-000000000001',
        club_id: 'c0000000-0000-0000-0000-000000000001',
        title: 'Neural Networks & Deep Learning Masterclass',
        description: 'Hands-on intensive masterclass on building CNNs and Transformer models from scratch using PyTorch with live GPU workstations.',
        event_type: 'Workshop',
        venue: 'Turing Advanced Computing Lab - Block C',
        start_time: new Date(Date.now() + 86400000 * 2).toISOString(),
        end_time: new Date(Date.now() + 86400000 * 2 + 14400000).toISOString(),
        capacity: 80,
        eligibility: 'All Engineering & CS Students (Years 1-4)',
        registration_deadline: new Date(Date.now() + 86400000).toISOString(),
        status: 'published',
        poster_url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
        created_by: superAdminId
      },
      {
        id: 'e0000000-0000-0000-0000-000000000002',
        club_id: 'c0000000-0000-0000-0000-000000000002',
        title: 'HackNext 2026: 24-Hour Full-Stack Hackathon',
        description: 'Annual flagship hackathon building AI-powered web applications with cash prizes, mentor guidance, and internship fast-tracks.',
        event_type: 'Hackathon',
        venue: 'Main Innovation Center Auditorium',
        start_time: new Date(Date.now() + 86400000 * 5).toISOString(),
        end_time: new Date(Date.now() + 86400000 * 6).toISOString(),
        capacity: 150,
        eligibility: 'Inter-College Teams (2-4 Members)',
        registration_deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
        status: 'published',
        poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
        created_by: 'a0000000-0000-0000-0000-000000000004'
      },
      {
        id: 'e0000000-0000-0000-0000-000000000003',
        club_id: 'c0000000-0000-0000-0000-000000000003',
        title: 'CyberShield CTF: Live Capture The Flag',
        description: 'Real-time cybersecurity CTF challenge covering Web Exploitation, Cryptography, Reverse Engineering, and Network Forensics.',
        event_type: 'Competition',
        venue: 'Cyber Defense Center & Online',
        start_time: new Date(Date.now() + 86400000 * 8).toISOString(),
        end_time: new Date(Date.now() + 86400000 * 8 + 21600000).toISOString(),
        capacity: 100,
        eligibility: 'Open to All Enrolled Students',
        registration_deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
        status: 'published',
        poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
        created_by: superAdminId
      }
    ];

    for (const ev of events) {
      await supabase.from('events').upsert(ev);
    }
    console.log('Events seeded!');

    // Seed Tools Directory
    const tools = [
      {
        name: 'Visual Studio Code',
        category: 'IDE & Editors',
        purpose: 'Standard extensible code editor with integrated terminal, debugging, and extensions.',
        platform: 'Cross-platform (Win/macOS/Linux)',
        license: 'Free / MIT',
        official_link: 'https://code.visualstudio.com'
      },
      {
        name: 'Postman',
        category: 'API Testing & Design',
        purpose: 'Collaborative platform for API lifecycle design, mocking, automated testing, and docs.',
        platform: 'Cross-platform / Web',
        license: 'Freemium',
        official_link: 'https://www.postman.com'
      },
      {
        name: 'Docker Desktop',
        category: 'DevOps & Containers',
        purpose: 'Containerization tool for packaging and running reproducible application environments.',
        platform: 'Win/macOS/Linux',
        license: 'Free for Education',
        official_link: 'https://www.docker.com'
      },
      {
        name: 'Figma',
        category: 'UI/UX Design',
        purpose: 'Industry-standard collaborative vector design and interactive prototyping suite.',
        platform: 'Web / Desktop',
        license: 'Free Education Plan',
        official_link: 'https://www.figma.com'
      },
      {
        name: 'Wireshark',
        category: 'Cybersecurity & Networks',
        purpose: 'World’s foremost network protocol analyzer for packet inspection and security audits.',
        platform: 'Cross-platform',
        license: 'Open Source / GPL',
        official_link: 'https://www.wireshark.org'
      },
      {
        name: 'Supabase',
        category: 'Backend & Database',
        purpose: 'Open-source Firebase alternative with Postgres, Auth, Realtime, and Instant APIs.',
        platform: 'Cloud / Self-Hosted',
        license: 'Open Source / Apache 2.0',
        official_link: 'https://supabase.com'
      }
    ];

    for (const t of tools) {
      await supabase.from('tools_directory').upsert(t, { onConflict: 'name' });
    }
    console.log('Tools directory seeded!');

    console.log('Database seeding process completed!');
  } catch (err) {
    console.error('Setup error:', err);
  }
}

setup();
