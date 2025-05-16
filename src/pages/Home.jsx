import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100
    }
  }
};

// Sample job data
const sampleJobs = [
  {
    id: 1,
    title: "UI/UX Designer",
    company: "CreativeTech Solutions",
    logo: "https://source.unsplash.com/100x100/?design",
    location: "Remote",
    type: "Full-time",
    salary: "$70,000 - $90,000",
    posted: "2 days ago",
    tags: ["Design", "UX Research", "Figma"]
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "WebWorks Inc.",
    logo: "https://source.unsplash.com/100x100/?code",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$85,000 - $110,000",
    posted: "5 days ago",
    tags: ["React", "JavaScript", "CSS"]
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "AnalyticsAI",
    logo: "https://source.unsplash.com/100x100/?data",
    location: "Boston, MA",
    type: "Contract",
    salary: "$95,000 - $120,000",
    posted: "1 week ago",
    tags: ["Python", "Machine Learning", "SQL"]
  },
  {
    id: 4,
    title: "Full Stack Engineer",
    company: "TechInnovate",
    logo: "https://source.unsplash.com/100x100/?tech",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$90,000 - $115,000",
    posted: "3 days ago",
    tags: ["Node.js", "React", "MongoDB"]
  }
];

// Job card component
const JobCard = ({ job }) => {
  const BookmarkIcon = getIcon('Bookmark');
  const MapPinIcon = getIcon('MapPin');
  const ClockIcon = getIcon('Clock');
  const BriefcaseIcon = getIcon('Briefcase');

  const [isSaved, setIsSaved] = useState(false);
  
  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved jobs' : 'Job saved successfully!');
  };

  const applyForJob = (e) => {
    e.preventDefault();
    toast.info('Application feature will be available soon!');
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="card group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
    >
      <button
        onClick={handleSave}
        className="absolute top-4 right-4 p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
        aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
      >
        <BookmarkIcon className={`h-5 w-5 ${isSaved ? 'text-primary fill-primary' : 'text-surface-500 dark:text-surface-400'}`} />
      </button>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-200 dark:bg-surface-700">
          <img src={job.logo} alt={`${job.company} logo`} className="h-full w-full object-cover" />
        </div>
        
        <div className="flex-grow">
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p className="text-surface-600 dark:text-surface-400 font-medium">{job.company}</p>
          
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
              <BriefcaseIcon className="h-4 w-4 mr-1" />
              <span>{job.type}</span>
            </div>
            
            <div className="flex items-center text-sm text-surface-500 dark:text-surface-400">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{job.posted}</span>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((tag, index) => (
              <span key={index} className="tag bg-primary/10 text-primary dark:bg-primary/20">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="mt-5 flex items-center justify-between">
            <div className="text-sm font-medium">{job.salary}</div>
            <button 
              onClick={applyForJob}
              className="btn-primary text-sm py-1.5 px-3"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Hero section
const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Your <span className="text-primary">Perfect</span> Career Opportunity
            </h1>
            <p className="text-xl text-surface-700 dark:text-surface-300 mb-8 max-w-lg">
              Search thousands of job listings, apply with ease, and track your applications all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#jobs" className="btn-primary text-lg py-3 px-6">Find Jobs</a>
              <a href="#how-it-works" className="btn-outline text-lg py-3 px-6">How It Works</a>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://source.unsplash.com/HcUDHJfd5GY/800x600"
                alt="People looking for jobs"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 h-24 w-24 bg-accent rounded-full opacity-60 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-primary rounded-full opacity-40 blur-xl"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative shapes */}
      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-1/3 bg-accent/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

// Home Page
export default function Home() {
  const SearchIcon = getIcon('Search');
  const MapPinIcon = getIcon('MapPin');
  const BriefcaseIcon = getIcon('Briefcase');
  const FilterIcon = getIcon('Filter');
  
  const [jobs, setJobs] = useState(sampleJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const filteredJobs = sampleJobs.filter(job => {
        const matchesSearch = searchTerm === "" || 
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
          
        const matchesLocation = location === "" || 
          job.location.toLowerCase().includes(location.toLowerCase());
          
        const matchesType = jobType === "" || 
          job.type === jobType;
          
        return matchesSearch && matchesLocation && matchesType;
      });
      
      setJobs(filteredJobs);
      setIsSearching(false);
      
      if (filteredJobs.length === 0) {
        toast.info("No jobs found matching your criteria. Try adjusting your search.");
      } else {
        toast.success(`Found ${filteredJobs.length} job${filteredJobs.length === 1 ? '' : 's'}`);
      }
    }, 800);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setLocation("");
    setJobType("");
    setJobs(sampleJobs);
  };
  
  return (
    <>
      <Hero />
      
      <motion.section
        id="jobs"
        className="py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Find Your Next Opportunity</h2>
              <p className="text-surface-600 dark:text-surface-400">Search and filter jobs that match your skills and preferences</p>
            </div>
            <button
              onClick={resetFilters}
              className="mt-4 md:mt-0 btn-outline text-sm"
            >
              Reset Filters
            </button>
          </div>
          
          <form onSubmit={handleSearch} className="mb-10">
            <div className="bg-white dark:bg-surface-800 p-4 md:p-6 rounded-xl shadow-soft">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Job title, company, or keyword"
                    className="input-field pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    className="input-field pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseIcon className="h-5 w-5 text-surface-400" />
                  </div>
                  <select
                    className="input-field pl-10 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20fill%3D%22%23CBD5E1%22%20d%3D%22M5.23%207.21L10%2011.97l4.77-4.76a1%201%200%20111.41%201.41l-5.47%205.48a1%201%200%2001-1.42%200L4.82%208.62a1%201%200%20111.41-1.41z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[right_0.5rem_center]"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                  >
                    <option value="">Any Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                  <FilterIcon className="h-5 w-5" />
                  <span className="text-sm">Filter by:</span>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="tag bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
                      Salary Range
                    </button>
                    <button type="button" className="tag bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
                      Experience Level
                    </button>
                    <button type="button" className="tag bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
                      Date Posted
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : "Search Jobs"}
                </button>
              </div>
            </div>
          </form>
          
          <div className="mb-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6"
            >
              {jobs.length > 0 ? (
                jobs.map(job => <JobCard key={job.id} job={job} />)
              ) : (
                <div className="text-center py-12">
                  <div className="bg-surface-100 dark:bg-surface-800 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                    {(() => {
                      const SearchXIcon = getIcon('SearchX');
                      return <SearchXIcon className="h-12 w-12 text-surface-400" />;
                    })()}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
                    We couldn't find any jobs matching your criteria. Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
          
          <div id="how-it-works" className="pt-12 pb-4">
            <h2 className="text-3xl font-bold mb-8 text-center">How CareerLaunch Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card text-center hover:shadow-lg transition-all duration-300">
                <div className="h-16 w-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const SearchIcon = getIcon('Search');
                    return <SearchIcon className="h-8 w-8 text-primary" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Browse thousands of jobs and filter by location, job type, and more to find your perfect match.
                </p>
              </div>
              
              <div className="card text-center hover:shadow-lg transition-all duration-300">
                <div className="h-16 w-16 bg-secondary/10 dark:bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const FileTextIcon = getIcon('FileText');
                    return <FileTextIcon className="h-8 w-8 text-secondary" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold mb-2">Apply Online</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Submit your applications with just a few clicks. Upload your resume and cover letter directly.
                </p>
              </div>
              
              <div className="card text-center hover:shadow-lg transition-all duration-300">
                <div className="h-16 w-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(() => {
                    const LineChartIcon = getIcon('LineChart');
                    return <LineChartIcon className="h-8 w-8 text-accent" />;
                  })()}
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Monitor the status of all your job applications in one place. Never miss an update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      <section className="bg-surface-100 dark:bg-surface-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Resume Builder & Application Tracker</h2>
          <MainFeature />
        </div>
      </section>
      
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Find Your Next Job?</h2>
          <p className="text-xl text-surface-700 dark:text-surface-300 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have found their dream jobs using CareerLaunch.
          </p>
          <a href="#jobs" className="btn-primary text-lg py-3 px-8">Start Searching</a>
        </div>
      </section>
    </>
  );
}