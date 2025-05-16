import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecruiter } from '../../context/RecruiterContext';
import { getIcon } from '../../utils/iconUtils';
import { toast } from 'react-toastify';

// Components
import JobListingItem from '../../components/recruiter/JobListingItem';
import JobForm from '../../components/recruiter/JobForm';

const JobManagement = () => {
  const { jobsData, fetchJobs, createJob, updateJob, deleteJob } = useRecruiter();
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  
  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  
  // Filtering jobs based on search term and status
  useEffect(() => {
    if (!jobsData.jobs) return;
    
    let result = [...jobsData.jobs];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(job => job.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredJobs(result);
  }, [jobsData.jobs, searchTerm, statusFilter]);
  
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);
  
  // Handle create job submission
  const handleCreateJob = async (jobData) => {
    try {
      await createJob(jobData);
      setIsCreateModalOpen(false);
      toast.success('Job created successfully');
    } catch (error) {
      toast.error('Failed to create job');
    }
  };
  
  // Handle edit job submission
  const handleUpdateJob = async (jobData) => {
    try {
      await updateJob(currentJob.id, jobData);
      setIsEditModalOpen(false);
      setCurrentJob(null);
      toast.success('Job updated successfully');
    } catch (error) {
      toast.error('Failed to update job');
    }
  };
  
  // Handle job delete
  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(currentJob.id);
      setIsDeleteModalOpen(false);
      setCurrentJob(null);
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };
  
  // Open edit modal
  const handleEditJob = (job) => {
    setCurrentJob(job);
    setIsEditModalOpen(true);
  };
  
  // Open view modal
  const handleViewJob = (job) => {
    setCurrentJob(job);
    setIsViewModalOpen(true);
  };
  
  // Open delete confirmation modal
  const handleDeleteJob = (job) => {
    setCurrentJob(job);
    setIsDeleteModalOpen(true);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Job
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FilterIcon className="h-5 w-5 text-surface-400" />
          </div>
          <select
            className="input-field pl-10 appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Total Jobs</p>
            <p className="text-2xl font-bold text-primary">{jobsData.totalJobs}</p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Active Jobs</p>
            <p className="text-2xl font-bold text-green-500">{jobsData.activeJobs}</p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Draft Jobs</p>
            <p className="text-2xl font-bold text-yellow-500">
              {jobsData.jobs.filter(job => job.status === 'draft').length}
            </p>
          </div>
          <div className="text-center p-2">
            <p className="text-surface-500 dark:text-surface-400 text-sm">Closed Jobs</p>
            <p className="text-2xl font-bold text-surface-500">
              {jobsData.jobs.filter(job => job.status === 'closed').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Job Listings */}
      {jobsData.isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-surface-800 rounded-lg p-5">
              <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3"></div>
              <div className="flex gap-3 mb-4">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-20 ml-2"></div>
                <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-20 ml-2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobListingItem 
                key={job.id} 
                job={job} 
                onEdit={handleEditJob}
                onView={handleViewJob}
                onDelete={handleDeleteJob}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-lg">
              <p className="text-lg text-surface-500 dark:text-surface-400">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No jobs match your search criteria' 
                  : 'No jobs found. Create your first job posting!'}
              </p>
              <button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="btn-primary mt-4"
              >
                <PlusIcon className="h-5 w-5 mr-2 inline-block" /> Create Job
              </button>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Create Job Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <div className="bg-white dark:bg-surface-800 px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">Create New Job</h3>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <JobForm 
                    onSubmit={handleCreateJob}
                    onCancel={() => setIsCreateModalOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Job Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentJob && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <div className="bg-white dark:bg-surface-800 px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">Edit Job</h3>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <JobForm 
                    job={currentJob}
                    onSubmit={handleUpdateJob}
                    onCancel={() => setIsEditModalOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentJob && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <motion.div 
                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-surface-800 shadow-xl rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h3 className="text-lg font-medium leading-6 text-surface-900 dark:text-white mb-2">
                  Confirm Deletion
                </h3>
                <p className="mb-4 text-surface-500 dark:text-surface-400">
                  Are you sure you want to delete the job posting "{currentJob.title}"? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn bg-red-500 hover:bg-red-600 text-white focus:ring-red-500/50"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobManagement;