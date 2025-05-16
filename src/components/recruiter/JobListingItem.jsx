import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../../utils/iconUtils';

const statusColors = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  paused: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
};

const JobListingItem = ({ job, onEdit, onView, onDelete }) => {
  const MapPinIcon = getIcon('MapPin');
  const UsersIcon = getIcon('Users');
  const EyeIcon = getIcon('Eye');
  const CalendarIcon = getIcon('Calendar');
  const PencilIcon = getIcon('Pencil');
  const TrashIcon = getIcon('Trash');
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-surface-800 rounded-lg p-5 shadow-sm hover:shadow-card transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{job.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[job.status]}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>
      <p className="text-surface-600 dark:text-surface-400 mb-3">{job.company}</p>
      <div className="flex flex-wrap gap-3 mb-4 text-sm text-surface-500 dark:text-surface-400">
        <div className="flex items-center"><MapPinIcon className="h-4 w-4 mr-1" />{job.location}</div>
        <div className="flex items-center"><UsersIcon className="h-4 w-4 mr-1" />{job.applicants} applicants</div>
        <div className="flex items-center"><EyeIcon className="h-4 w-4 mr-1" />{job.views} views</div>
        <div className="flex items-center"><CalendarIcon className="h-4 w-4 mr-1" />Posted {formatDate(job.postedDate)}</div>
      </div>
      <div className="flex justify-end space-x-2">
        <button onClick={() => onView(job)} className="btn-outline py-1 px-3">View</button>
        <button onClick={() => onEdit(job)} className="btn-outline py-1 px-3 flex items-center"><PencilIcon className="h-4 w-4 mr-1" />Edit</button>
        <button onClick={() => onDelete(job)} className="btn-outline py-1 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"><TrashIcon className="h-4 w-4 mr-1" />Delete</button>
      </div>
    </motion.div>
  );
};

export default JobListingItem;