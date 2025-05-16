import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRecruiter } from '../../context/RecruiterContext';
import { getIcon } from '../../utils/iconUtils';
import { format, parseISO, isToday, isAfter, isBefore, addDays } from 'date-fns';
import { toast } from 'react-toastify';

const InterviewScheduler = () => {
  const { interviews, fetchInterviews, applicantsData, fetchApplicants } = useRecruiter();
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  
  // Icons
  const CalendarIcon = getIcon('Calendar');
  const ClockIcon = getIcon('Clock');
  const UserIcon = getIcon('User');
  const BriefcaseIcon = getIcon('Briefcase');
  const VideoIcon = getIcon('Video');
  const CheckIcon = getIcon('Check');
  const XIcon = getIcon('X');
  
  // Fetch interviews and applicants on component mount
  useEffect(() => {
    fetchInterviews();
    fetchApplicants();
  }, [fetchInterviews, fetchApplicants]);
  
  // Filter interviews based on date filter
  useEffect(() => {
    if (!interviews.interviews) return;
    
    let result = [...interviews.interviews];
    
    switch (dateFilter) {
      case 'today':
        result = result.filter(interview => isToday(parseISO(interview.date)));
        break;
      case 'upcoming':
        result = result.filter(interview => isAfter(parseISO(interview.date), new Date()));
        break;
      case 'past':
        result = result.filter(interview => isBefore(parseISO(interview.date), new Date()));
        break;
      case 'week':
        result = result.filter(interview => {
          const interviewDate = parseISO(interview.date);
          return isAfter(interviewDate, new Date()) && isBefore(interviewDate, addDays(new Date(), 7));
        });
        break;
      default:
        break;
    }
    
    // Sort by date (closest first)
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    setFilteredInterviews(result);
  }, [interviews.interviews, dateFilter]);
  
  // Format date and time
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const formatTime = (dateString) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      return 'Invalid time';
    }
  };
  
  // Mark interview as completed
  const markAsCompleted = (interviewId) => {
    // This would normally connect to RecruiterService
    
    // Simulate updating the interview
    const updatedInterviews = interviews.interviews.map(interview => 
      interview.id === interviewId ? { ...interview, status: 'completed' } : interview
    );
    
    // Update local state
    interviews.interviews = updatedInterviews;
    toast.success('Interview marked as completed');
    fetchInterviews(); // Refresh interviews
  };
  
  // Cancel interview
  const cancelInterview = (interviewId) => {
    // This would normally connect to RecruiterService
    
    // Simulate updating the interview
    const updatedInterviews = interviews.interviews.map(interview => 
      interview.id === interviewId ? { ...interview, status: 'cancelled' } : interview
    );
    
    // Update local state
    interviews.interviews = updatedInterviews;
    toast.success('Interview cancelled');
    fetchInterviews(); // Refresh interviews
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Interview Scheduler</h1>
        <button className="btn-primary">Schedule Interview</button>
      </div>
      
      {/* Date Filters */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dateFilter === 'today' 
              ? 'bg-primary text-white' 
              : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
          onClick={() => setDateFilter('today')}
        >
          Today
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dateFilter === 'upcoming' 
              ? 'bg-primary text-white' 
              : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
          onClick={() => setDateFilter('upcoming')}
        >
          All Upcoming
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dateFilter === 'week' 
              ? 'bg-primary text-white' 
              : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
          onClick={() => setDateFilter('week')}
        >
          Next 7 Days
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            dateFilter === 'past' 
              ? 'bg-primary text-white' 
              : 'bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700'
          }`}
          onClick={() => setDateFilter('past')}
        >
          Past Interviews
        </button>
      </div>
      
      {/* Interviews List */}
      <div className="space-y-4">
        {interviews.isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-surface-800 rounded-lg p-5">
                <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-1/4 mb-3"></div>
                <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-2/3 mb-3"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full mb-3"></div>
                <div className="flex justify-end">
                  <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-20 ml-2"></div>
                  <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-20 ml-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredInterviews.length > 0 ? (
          filteredInterviews.map(interview => (
            <motion.div 
              key={interview.id}
              className={`bg-white dark:bg-surface-800 rounded-lg p-5 shadow-sm ${
                interview.status === 'completed' ? 'border-l-4 border-green-500' : 
                interview.status === 'cancelled' ? 'border-l-4 border-red-500' : ''
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-1 text-primary text-sm font-medium mb-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(interview.date)}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{interview.type}</h3>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-surface-500" />
                  <span className="text-surface-600 dark:text-surface-400">
                    {formatTime(interview.date)} ({interview.duration} mins)
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-4 w-4 mr-2 text-surface-500" />
                    <span className="font-medium">Candidate:</span>
                    <span className="ml-2">{interview.applicantName}</span>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="h-4 w-4 mr-2 text-surface-500" />
                    <span className="font-medium">Position:</span>
                    <span className="ml-2">{interview.jobTitle}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <VideoIcon className="h-4 w-4 mr-2 text-surface-500" />
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{interview.location}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-surface-500" />
                    <span className="font-medium">Interviewers:</span>
                    <span className="ml-2">{interview.interviewers.join(', ')}</span>
                  </div>
                </div>
              </div>
              
              {interview.notes && (
                <div className="mb-4 bg-surface-50 dark:bg-surface-700/30 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1">Notes:</p>
                  <p>{interview.notes}</p>
                </div>
              )}
              
              {interview.status === 'completed' && interview.feedback && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 p-3 rounded-lg text-sm">
                  <p className="font-medium mb-1 text-green-700 dark:text-green-400">Feedback:</p>
                  <p>{interview.feedback}</p>
                </div>
              )}
              
              {interview.status !== 'completed' && interview.status !== 'cancelled' && (
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => cancelInterview(interview.id)}
                    className="btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </button>
                  <button 
                    onClick={() => markAsCompleted(interview.id)}
                    className="btn-outline text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Mark Completed
                  </button>
                </div>
              )}
              
              {interview.status === 'completed' && (
                <div className="flex justify-end">
                  <span className="text-green-500 flex items-center">
                    <CheckIcon className="h-4 w-4 mr-1" />
                    Completed
                  </span>
                </div>
              )}
              
              {interview.status === 'cancelled' && (
                <div className="flex justify-end">
                  <span className="text-red-500 flex items-center">
                    <XIcon className="h-4 w-4 mr-1" />
                    Cancelled
                  </span>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-surface-800 rounded-lg">
            <p className="text-lg text-surface-500 dark:text-surface-400">
              No interviews found for the selected filter
            </p>
            <button className="btn-primary mt-4">Schedule New Interview</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewScheduler;