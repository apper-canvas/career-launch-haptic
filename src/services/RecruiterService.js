// Simulated recruiter service
// In a real application, this would connect to a backend API

// Storage keys for localStorage
const JOBS_STORAGE_KEY = 'recruiter_jobs';
const APPLICANTS_STORAGE_KEY = 'recruiter_applicants';
const EMAIL_TEMPLATES_STORAGE_KEY = 'recruiter_email_templates';
const INTERVIEWS_STORAGE_KEY = 'recruiter_interviews';

// Sample data for initial load if none exists
const initialJobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    requirements: 'At least 5 years of experience with React, TypeScript, and modern web technologies...',
    postedDate: '2023-02-15T09:00:00Z',
    status: 'active',
    applicants: 12,
    industry: 'Technology',
    skillsRequired: ['React', 'TypeScript', 'CSS', 'HTML', 'JavaScript'],
    views: 345
  },
  {
    id: 'job-2',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full-time',
    salary: '$90,000 - $110,000',
    description: 'Join our creative team to design beautiful user interfaces...',
    requirements: 'Experience with Figma, Adobe XD, and user research methods...',
    postedDate: '2023-03-01T10:30:00Z',
    status: 'active',
    applicants: 27,
    industry: 'Design',
    skillsRequired: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'UX Research'],
    views: 422
  },
  {
    id: 'job-3',
    title: 'Data Scientist',
    company: 'DataInsights LLC',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    description: 'Help us analyze complex datasets and build predictive models...',
    requirements: 'Advanced degree in Statistics, Computer Science, or related field...',
    postedDate: '2023-02-25T14:15:00Z',
    status: 'active',
    applicants: 19,
    industry: 'Data Science',
    skillsRequired: ['Python', 'R', 'Machine Learning', 'SQL', 'Data Visualization'],
    views: 287
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    company: 'CloudSystems',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$115,000 - $140,000',
    description: 'Build and maintain our cloud infrastructure and deployment pipelines...',
    requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD pipelines...',
    postedDate: '2023-03-05T11:45:00Z',
    status: 'active',
    applicants: 8,
    industry: 'Technology',
    skillsRequired: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    views: 198
  },
  {
    id: 'job-5',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$125,000 - $155,000',
    description: 'Lead our product development from concept to launch...',
    requirements: 'At least 3 years of experience in product management in tech industry...',
    postedDate: '2023-03-10T08:30:00Z',
    status: 'draft',
    applicants: 0,
    industry: 'Product Management',
    skillsRequired: ['Product Strategy', 'Agile', 'User Stories', 'Market Research', 'Roadmapping'],
    views: 0
  }
];

const initialApplicants = [
  {
    id: 'app-1',
    jobId: 'job-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    resumeUrl: 'https://example.com/resumes/john-smith',
    appliedDate: '2023-03-01T09:15:00Z',
    status: 'review',
    notes: 'Strong candidate with excellent React experience',
    experience: 6,
    coverLetter: 'I am excited to apply for this position...',
    skills: ['React', 'TypeScript', 'Redux', 'HTML', 'CSS', 'JavaScript'],
    education: 'BS Computer Science, Stanford University',
    lastContactDate: '2023-03-05T14:30:00Z'
  },
  {
    id: 'app-2',
    jobId: 'job-1',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    phone: '555-987-6543',
    resumeUrl: 'https://example.com/resumes/emily-chen',
    appliedDate: '2023-03-02T11:20:00Z',
    status: 'interview',
    notes: 'Great portfolio, scheduled for technical interview',
    experience: 4,
    coverLetter: 'With my background in frontend development...',
    skills: ['React', 'Angular', 'Vue', 'CSS', 'JavaScript', 'Node.js'],
    education: 'MS Computer Engineering, MIT',
    lastContactDate: '2023-03-10T10:00:00Z'
  },
  {
    id: 'app-3',
    jobId: 'job-2',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-456-7890',
    resumeUrl: 'https://example.com/resumes/michael-brown',
    appliedDate: '2023-03-05T15:45:00Z',
    status: 'new',
    notes: 'Impressive portfolio of UX/UI work',
    experience: 3,
    coverLetter: 'I believe my design philosophy aligns well with...',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'UI Design', 'Wireframing', 'Prototyping'],
    education: 'BFA Graphic Design, RISD',
    lastContactDate: null
  },
  {
    id: 'app-4',
    jobId: 'job-2',
    name: 'Jessica Lee',
    email: 'jessica.lee@example.com',
    phone: '555-789-0123',
    resumeUrl: 'https://example.com/resumes/jessica-lee',
    appliedDate: '2023-03-06T09:30:00Z',
    status: 'offer',
    notes: 'Excellent candidate, preparing offer letter',
    experience: 7,
    coverLetter: 'Throughout my career in UX/UI design...',
    skills: ['UX Research', 'UI Design', 'Adobe XD', 'Figma', 'User Testing', 'Design Systems'],
    education: 'MS Human-Computer Interaction, Georgia Tech',
    lastContactDate: '2023-03-15T16:00:00Z'
  },
  {
    id: 'app-5',
    jobId: 'job-3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-234-5678',
    resumeUrl: 'https://example.com/resumes/robert-johnson',
    appliedDate: '2023-03-07T13:10:00Z',
    status: 'rejected',
    notes: 'Not enough experience with machine learning',
    experience: 2,
    coverLetter: 'I am passionate about data science and...',
    skills: ['Python', 'SQL', 'Data Analysis', 'Statistics', 'Excel'],
    education: 'BS Statistics, UCLA',
    lastContactDate: '2023-03-12T11:45:00Z'
  }
];

const initialEmailTemplates = [
  {
    id: 'template-1',
    name: 'Application Received',
    subject: 'We received your application',
    body: '<p>Dear {{candidateName}},</p><p>Thank you for applying to the {{position}} position at {{company}}. We have received your application and our hiring team is currently reviewing it.</p><p>We will be in touch soon with next steps.</p><p>Best regards,<br>{{recruiterName}}<br>{{company}} Recruiting Team</p>',
    isDefault: true,
    lastUpdated: '2023-01-15T10:00:00Z',
    category: 'application'
  },
  {
    id: 'template-2',
    name: 'Interview Invitation',
    subject: 'Invitation to Interview for {{position}}',
    body: '<p>Dear {{candidateName}},</p><p>We were impressed by your application for the {{position}} position and would like to invite you for an interview.</p><p>The interview will be conducted {{interviewFormat}} on {{interviewDate}} at {{interviewTime}}.</p><p>Please confirm your availability by replying to this email.</p><p>Best regards,<br>{{recruiterName}}<br>{{company}} Recruiting Team</p>',
    isDefault: true,
    lastUpdated: '2023-01-20T14:30:00Z',
    category: 'interview'
  },
  {
    id: 'template-3',
    name: 'Rejection Letter',
    subject: 'Update on your application for {{position}}',
    body: '<p>Dear {{candidateName}},</p><p>Thank you for your interest in the {{position}} position at {{company}}.</p><p>After careful consideration, we have decided to move forward with other candidates whose qualifications better match our current needs.</p><p>We appreciate your interest in joining our team and wish you success in your job search.</p><p>Best regards,<br>{{recruiterName}}<br>{{company}} Recruiting Team</p>',
    isDefault: true,
    lastUpdated: '2023-01-25T09:15:00Z',
    category: 'rejection'
  }
];

const initialInterviews = [
  {
    id: 'interview-1',
    applicantId: 'app-2',
    applicantName: 'Emily Chen',
    jobId: 'job-1',
    jobTitle: 'Senior Frontend Developer',
    date: '2023-03-15T14:00:00Z',
    duration: 60, // minutes
    type: 'Technical Interview',
    interviewers: ['Jane Doe', 'Mark Wilson'],
    location: 'Zoom Meeting',
    notes: 'Focus on React performance optimization and state management',
    status: 'scheduled'
  },
  {
    id: 'interview-2',
    applicantId: 'app-4',
    applicantName: 'Jessica Lee',
    jobId: 'job-2',
    jobTitle: 'UX/UI Designer',
    date: '2023-03-12T11:00:00Z',
    duration: 90, // minutes
    type: 'Portfolio Review',
    interviewers: ['Alex Thompson', 'Sarah Miller'],
    location: 'Office - Meeting Room 3',
    notes: 'Candidate to present case studies from previous work',
    status: 'completed',
    feedback: 'Excellent presentation skills and impressive portfolio. Strong design thinking.'
  }
];

// Initialize localStorage with sample data if empty
const initializeLocalStorage = () => {
  if (!localStorage.getItem(JOBS_STORAGE_KEY)) {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(initialJobs));
  }
  
  if (!localStorage.getItem(APPLICANTS_STORAGE_KEY)) {
    localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(initialApplicants));
  }
  
  if (!localStorage.getItem(EMAIL_TEMPLATES_STORAGE_KEY)) {
    localStorage.setItem(EMAIL_TEMPLATES_STORAGE_KEY, JSON.stringify(initialEmailTemplates));
  }
  
  if (!localStorage.getItem(INTERVIEWS_STORAGE_KEY)) {
    localStorage.setItem(INTERVIEWS_STORAGE_KEY, JSON.stringify(initialInterviews));
  }
};

// Call initialization
initializeLocalStorage();

export const RecruiterService = {
  // Jobs CRUD operations
  getJobs: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        resolve({
          jobs,
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === 'active').length
        });
      }, 500);
    });
  },
  
  createJob: async (jobData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        const newJob = {
          id: `job-${Date.now()}`,
          ...jobData,
          postedDate: new Date().toISOString(),
          applicants: 0,
          views: 0
        };
        
        jobs.push(newJob);
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
        resolve(newJob);
      }, 700);
    });
  },
  
  updateJob: async (jobId, jobData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex === -1) {
          reject(new Error('Job not found'));
          return;
        }
        
        const updatedJob = { ...jobs[jobIndex], ...jobData };
        jobs[jobIndex] = updatedJob;
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
        resolve(updatedJob);
      }, 600);
    });
  },
  
  deleteJob: async (jobId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const jobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex === -1) {
          reject(new Error('Job not found'));
          return;
        }
        
        jobs.splice(jobIndex, 1);
        localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
        resolve(true);
      }, 500);
    });
  },
  
  // Applicants operations
  getApplicants: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const applicants = JSON.parse(localStorage.getItem(APPLICANTS_STORAGE_KEY) || '[]');
        resolve({
          applicants,
          totalApplicants: applicants.length,
          newApplicants: applicants.filter(app => app.status === 'new').length
        });
      }, 500);
    });
  },
  
  updateApplicantStatus: async (applicantId, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const applicants = JSON.parse(localStorage.getItem(APPLICANTS_STORAGE_KEY) || '[]');
        const applicantIndex = applicants.findIndex(app => app.id === applicantId);
        
        if (applicantIndex === -1) {
          reject(new Error('Applicant not found'));
          return;
        }
        
        const updatedApplicant = { 
          ...applicants[applicantIndex], 
          status,
          lastContactDate: new Date().toISOString()
        };
        applicants[applicantIndex] = updatedApplicant;
        localStorage.setItem(APPLICANTS_STORAGE_KEY, JSON.stringify(applicants));
        resolve(updatedApplicant);
      }, 400);
    });
  },
  
  // Email templates operations
  getEmailTemplates: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const templates = JSON.parse(localStorage.getItem(EMAIL_TEMPLATES_STORAGE_KEY) || '[]');
        resolve(templates);
      }, 300);
    });
  },
  
  // Interviews operations
  getInterviews: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const interviews = JSON.parse(localStorage.getItem(INTERVIEWS_STORAGE_KEY) || '[]');
        resolve(interviews);
      }, 400);
    });
  },
  
  // Dashboard metrics
  getDashboardMetrics: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobs = JSON.parse(localStorage.getItem(JOBS_STORAGE_KEY) || '[]');
        const applicants = JSON.parse(localStorage.getItem(APPLICANTS_STORAGE_KEY) || '[]');
        
        // Calculate metrics
        const metrics = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === 'active').length,
          totalApplicants: applicants.length,
          newApplicants: applicants.filter(app => app.status === 'new').length,
          interviewsScheduled: applicants.filter(app => app.status === 'interview').length,
          offersExtended: applicants.filter(app => app.status === 'offer').length,
          conversionRate: applicants.length > 0 ? 
            (applicants.filter(app => ['interview', 'offer'].includes(app.status)).length / applicants.length * 100).toFixed(1) + '%' : 
            '0%',
          timeToHire: '18 days',
          // Application status distribution
          applicationStatusData: [
            { status: 'New', count: applicants.filter(app => app.status === 'new').length },
            { status: 'Review', count: applicants.filter(app => app.status === 'review').length },
            { status: 'Interview', count: applicants.filter(app => app.status === 'interview').length },
            { status: 'Offer', count: applicants.filter(app => app.status === 'offer').length },
            { status: 'Rejected', count: applicants.filter(app => app.status === 'rejected').length }
          ],
          // Job views by day (last 7 days)
          jobViewsData: [
            { date: '2023-03-10', views: 45 },
            { date: '2023-03-11', views: 52 },
            { date: '2023-03-12', views: 49 },
            { date: '2023-03-13', views: 68 },
            { date: '2023-03-14', views: 75 },
            { date: '2023-03-15', views: 87 },
            { date: '2023-03-16', views: 91 }
          ],
          // Top job listings by applicants
          topJobListings: jobs
            .sort((a, b) => b.applicants - a.applicants)
            .slice(0, 3)
            .map(job => ({
              id: job.id,
              title: job.title,
              company: job.company,
              applicants: job.applicants,
              views: job.views
            }))
        };
        
        resolve(metrics);
      }, 600);
    });
  }
};