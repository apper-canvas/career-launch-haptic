import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRecruiter } from '../../context/RecruiterContext';
import { getIcon } from '../../utils/iconUtils';
import { format } from 'date-fns';

// Components
import ApplicantList from '../../components/recruiter/ApplicantList';

const ApplicantTracking = () => {
  const { applicantsData, jobsData, fetchApplicants, fetchJobs } = useRecruiter();
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateDesc'); // dateDesc, dateAsc, nameAsc, nameDesc
  
  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const BriefcaseIcon = getIcon('Briefcase');
  const SortAscIcon = getIcon('SortAsc');
  
  // Filter and sort applicants
  useEffect(() => {
    if (!applicantsData.applicants) return;
    
    let result = [...applicantsData.applicants];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(applicant => applicant.status === statusFilter);
    }
    
    // Apply job filter
    if (jobFilter !== 'all') {
      result = result.filter(applicant => applicant.jobId === jobFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(applicant => 
        applicant.name.toLowerCase().includes(searchLower) ||
        applicant.email.toLowerCase().includes(searchLower) ||
        (applicant.skills && applicant.skills.some(skill => skill.toLowerCase().includes(searchLower)))
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'dateDesc':
        result.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
        break;
      case 'dateAsc':
        result.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
        break;
      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'nameDesc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredApplicants(result);
  }, [applicantsData.applicants, searchTerm, statusFilter, jobFilter, sortBy]);
  
  // Fetch applicants and jobs on component mount
  useEffect(() => {
    fetchApplicants();
    fetchJobs();
  }, [fetchApplicants, fetchJobs]);
  
  // Add job titles to applicants
  useEffect(() => {
    if (applicantsData.applicants && jobsData.jobs) {
      const applicantsWithJobTitles = applicantsData.applicants.map(applicant => {
        const job = jobsData.jobs.find(job => job.id === applicant.jobId);
        return {
          ...applicant,
          jobTitle: job ? job.title : 'Unknown Position'
        };
      });
      
      setFilteredApplicants(applicantsWithJobTitles);
    }
  }, [applicantsData.applicants, jobsData.jobs]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Applicant Tracking</h1>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-surface-400" />
            </div>
            <input
              type="text"
              placeholder="Search applicants..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-5 w-5 text-surface-400" />
            </div>
            <select
              className="input-field pl-10 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="review">Review</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          {/* Job Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BriefcaseIcon className="h-5 w-5 text-surface-400" />
            </div>
            <select
              className="input-field pl-10 appearance-none"
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              {jobsData.jobs && jobsData.jobs.map(job => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </div>
          
          {/* Sort By */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SortAscIcon className="h-5 w-5 text-surface-400" />
            </div>
            <select
              className="input-field pl-10 appearance-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dateDesc">Newest First</option>
              <option value="dateAsc">Oldest First</option>
              <option value="nameAsc">Name (A-Z)</option>
              <option value="nameDesc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Total Applicants</p>
            <p className="text-2xl font-bold text-primary">{applicantsData.totalApplicants}</p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">New</p>
            <p className="text-2xl font-bold text-blue-500">
              {applicantsData.applicants?.filter(app => app.status === 'new').length || 0}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">In Review</p>
            <p className="text-2xl font-bold text-yellow-500">
              {applicantsData.applicants?.filter(app => app.status === 'review').length || 0}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Interview</p>
            <p className="text-2xl font-bold text-purple-500">
              {applicantsData.applicants?.filter(app => app.status === 'interview').length || 0}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Offer</p>
            <p className="text-2xl font-bold text-green-500">
              {applicantsData.applicants?.filter(app => app.status === 'offer').length || 0}
            </p>
          </div>
        </div>
      </div>
      
      {/* Applicant List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          {filteredApplicants.length > 0 
            ? `${filteredApplicants.length} Applicants`
            : 'No applicants match your criteria'
          }
        </h2>
        <ApplicantList 
          applicants={filteredApplicants} 
          isLoading={applicantsData.isLoading}
        />
      </div>
    </div>
  );
};

export default ApplicantTracking;