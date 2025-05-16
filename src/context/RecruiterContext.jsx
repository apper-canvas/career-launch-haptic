import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { RecruiterService } from '../services/RecruiterService';

// Create recruiter context
const RecruiterContext = createContext();

// Initial state for jobs data
const initialJobsState = {
  jobs: [],
  totalJobs: 0,
  activeJobs: 0,
  isLoading: false,
  error: null
};

// Initial state for applicants data
const initialApplicantsState = {
  applicants: [],
  totalApplicants: 0,
  newApplicants: 0,
  isLoading: false,
  error: null
};

// Initial state for email templates
const initialEmailTemplatesState = {
  templates: [],
  isLoading: false,
  error: null
};

// Initial state for interviews
const initialInterviewsState = {
  interviews: [],
  isLoading: false,
  error: null
};

export function RecruiterProvider({ children }) {
  const [jobsData, setJobsData] = useState(initialJobsState);
  const [applicantsData, setApplicantsData] = useState(initialApplicantsState);
  const [emailTemplates, setEmailTemplates] = useState(initialEmailTemplatesState);
  const [interviews, setInterviews] = useState(initialInterviewsState);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    isLoading: true,
    metrics: {}
  });

  // Fetch initial data
  useEffect(() => {
    fetchJobs();
    fetchApplicants();
    fetchEmailTemplates();
    fetchInterviews();
    fetchDashboardMetrics();
  }, []);

  // Jobs CRUD operations
  const fetchJobs = async () => {
    setJobsData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await RecruiterService.getJobs();
      setJobsData({
        jobs: data.jobs,
        totalJobs: data.totalJobs,
        activeJobs: data.activeJobs,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setJobsData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load jobs' 
      }));
      toast.error('Failed to load jobs');
    }
  };

  const createJob = async (jobData) => {
    try {
      const newJob = await RecruiterService.createJob(jobData);
      setJobsData(prev => ({
        ...prev,
        jobs: [newJob, ...prev.jobs],
        totalJobs: prev.totalJobs + 1,
        activeJobs: jobData.status === 'active' ? prev.activeJobs + 1 : prev.activeJobs
      }));
      toast.success('Job created successfully');
      return newJob;
    } catch (error) {
      toast.error('Failed to create job');
      throw error;
    }
  };

  const updateJob = async (jobId, jobData) => {
    try {
      const updatedJob = await RecruiterService.updateJob(jobId, jobData);
      setJobsData(prev => ({
        ...prev,
        jobs: prev.jobs.map(job => job.id === jobId ? updatedJob : job),
        activeJobs: calculateActiveJobs(prev.jobs.map(job => job.id === jobId ? updatedJob : job))
      }));
      toast.success('Job updated successfully');
      return updatedJob;
    } catch (error) {
      toast.error('Failed to update job');
      throw error;
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await RecruiterService.deleteJob(jobId);
      const jobToDelete = jobsData.jobs.find(job => job.id === jobId);
      setJobsData(prev => ({
        ...prev,
        jobs: prev.jobs.filter(job => job.id !== jobId),
        totalJobs: prev.totalJobs - 1,
        activeJobs: jobToDelete?.status === 'active' ? prev.activeJobs - 1 : prev.activeJobs
      }));
      toast.success('Job deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete job');
      throw error;
    }
  };

  // Helper function to calculate active jobs
  const calculateActiveJobs = (jobs) => {
    return jobs.filter(job => job.status === 'active').length;
  };

  // Applicants operations
  const fetchApplicants = async () => {
    setApplicantsData(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await RecruiterService.getApplicants();
      setApplicantsData({
        applicants: data.applicants,
        totalApplicants: data.totalApplicants,
        newApplicants: data.newApplicants,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setApplicantsData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load applicants' 
      }));
      toast.error('Failed to load applicants');
    }
  };

  const updateApplicantStatus = async (applicantId, status) => {
    try {
      const updatedApplicant = await RecruiterService.updateApplicantStatus(applicantId, status);
      setApplicantsData(prev => ({
        ...prev,
        applicants: prev.applicants.map(applicant => 
          applicant.id === applicantId ? updatedApplicant : applicant
        )
      }));
      toast.success(`Applicant status updated to ${status}`);
      return updatedApplicant;
    } catch (error) {
      toast.error('Failed to update applicant status');
      throw error;
    }
  };

  // Email templates operations
  const fetchEmailTemplates = async () => {
    setEmailTemplates(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const templates = await RecruiterService.getEmailTemplates();
      setEmailTemplates({
        templates,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setEmailTemplates(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load email templates' 
      }));
      toast.error('Failed to load email templates');
    }
  };

  // Interviews operations
  const fetchInterviews = async () => {
    setInterviews(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const interviews = await RecruiterService.getInterviews();
      setInterviews({
        interviews,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setInterviews(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to load interviews' 
      }));
      toast.error('Failed to load interviews');
    }
  };

  // Dashboard metrics
  const fetchDashboardMetrics = async () => {
    setDashboardMetrics({ isLoading: true, metrics: {} });
    try {
      const metrics = await RecruiterService.getDashboardMetrics();
      setDashboardMetrics({
        isLoading: false,
        metrics
      });
    } catch (error) {
      setDashboardMetrics({ isLoading: false, metrics: {} });
      toast.error('Failed to load dashboard metrics');
    }
  };

  return (
    <RecruiterContext.Provider value={{ 
      jobsData, 
      applicantsData, 
      emailTemplates, 
      interviews,
      dashboardMetrics,
      fetchJobs,
      createJob,
      updateJob,
      deleteJob,
      fetchApplicants,
      updateApplicantStatus,
      fetchEmailTemplates,
      fetchInterviews,
      fetchDashboardMetrics
    }}>
      {children}
    </RecruiterContext.Provider>
  );
}

export const useRecruiter = () => useContext(RecruiterContext);