import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { useRecruiter } from '../../context/RecruiterContext';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const applicantStatusColors = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  offer: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  hired: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200'
};

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'review', label: 'Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' }
];

const ApplicantList = ({ applicants, isLoading, compact = false }) => {
  const { updateApplicantStatus } = useRecruiter();
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  
  // Icons
  const UserIcon = getIcon('User');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const FileTextIcon = getIcon('FileText');
  const ClockIcon = getIcon('Clock');
  const TagIcon = getIcon('Tag');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  
  // Open applicant detail modal
  const handleViewApplicant = (applicant) => {
    setCurrentApplicant(applicant);
    setIsViewModalOpen(true);
  };
  
  // Open status change modal
  const handleOpenStatusModal = (applicant, e) => {
    e.stopPropagation();
    setCurrentApplicant(applicant);
    setStatusModalOpen(true);
  };
  
  // Update applicant status
  const handleStatusChange = async (status) => {
    try {
      await updateApplicantStatus(currentApplicant.id, status);
      setStatusModalOpen(false);
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        {[...Array(compact ? 3 : 5)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-surface-800 rounded-lg p-4 mb-3">
            <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-surface-500 dark:text-surface-400">No applicants found</p>
      </div>
    );
  }

  // Define how many applicants to show in compact mode
  const displayApplicants = compact ? applicants.slice(0, 5) : applicants;

  return (
    <>
      <div className="space-y-3">
        {displayApplicants.map((applicant) => (
          <motion.div
            key={applicant.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-sm hover:shadow-card transition-shadow cursor-pointer"
            onClick={() => handleViewApplicant(applicant)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-lg">{applicant.name}</h4>
                <p className="text-surface-500 dark:text-surface-400 text-sm">{applicant.jobTitle}</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    <span>Applied {formatDate(applicant.appliedDate)}</span>
                  </div>
                  {!compact && (
                    <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                      <MailIcon className="h-3 w-3 mr-1" />
                      <span>{applicant.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span 
                  className={`text-xs px-2 py-1 rounded-full font-medium ${applicantStatusColors[applicant.status]}`}
                  onClick={(e) => handleOpenStatusModal(applicant, e)}
                >
                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </span>
                {!compact && (
                  <button 
                    className="p-1 text-surface-500 hover:text-primary transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleOpenStatusModal(applicant, e); }}
                    aria-label="Change status"
                  >
                    {getIcon('MoreVertical')({ className: "h-4 w-4" })}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {compact && applicants.length > 5 && (
        <div className="text-center mt-4">
          <a href="/recruiter/applicants" className="text-primary hover:text-primary-dark transition-colors text-sm font-medium">
            View all {applicants.length} applicants
          </a>
        </div>
      )}
      
      {/* Applicant Detail Modal - Would be implemented with proper component in full app */}
      {isViewModalOpen && currentApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{currentApplicant.name}</h3>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">Applicant Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <span>{currentApplicant.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <span>{currentApplicant.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <span>Applied on {formatDate(currentApplicant.appliedDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <span>{currentApplicant.experience} years of experience</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-4">Application Status</h4>
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${applicantStatusColors[currentApplicant.status]}`}>
                      {currentApplicant.status.charAt(0).toUpperCase() + currentApplicant.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <TagIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <span>Job: {currentApplicant.jobTitle || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <FileTextIcon className="h-4 w-4 mr-2 text-surface-500" />
                      <a 
                        href={currentApplicant.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Resume
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {currentApplicant.skills.map((skill, index) => (
                    <span key={index} className="bg-surface-100 dark:bg-surface-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Notes</h4>
                <p className="bg-surface-50 dark:bg-surface-700/50 p-3 rounded-lg">
                  {currentApplicant.notes || 'No notes available'}
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="btn-outline"
                >
                  Close
                </button>
                <button 
                  onClick={(e) => {
                    setIsViewModalOpen(false);
                    handleOpenStatusModal(currentApplicant, e);
                  }}
                  className="btn-primary"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Change Modal */}
      {statusModalOpen && currentApplicant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Update Status</h3>
                <button 
                  onClick={() => setStatusModalOpen(false)}
                  className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <p className="mb-4">
                Change status for <span className="font-semibold">{currentApplicant.name}</span>
              </p>
              
              <div className="space-y-2 mb-6">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusChange(option.value)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      currentApplicant.status === option.value 
                        ? 'bg-primary text-white' 
                        : 'bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600'
                    }`}
                  >
                    <span>{option.label}</span>
                    {currentApplicant.status === option.value && (
                      <CheckIcon className="h-5 w-5" />
                    )}
                  </button>
                ))}
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setStatusModalOpen(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicantList;