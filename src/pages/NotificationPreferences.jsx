import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useNotifications } from '../context/NotificationContext';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState({ ...preferences });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ArrowLeftIcon = getIcon('ArrowLeft');
  const BellIcon = getIcon('Bell');
  const MailIcon = getIcon('Mail');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CalendarIcon = getIcon('Calendar');
  const XCircleIcon = getIcon('XCircle');
  const LightbulbIcon = getIcon('Lightbulb');
  const BellOffIcon = getIcon('BellOff');

  // Handle toggle change
  const handleToggleChange = (key) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      updatePreferences(localPreferences);
      setIsSubmitting(false);
    }, 600);
  };

  // Toggle all notifications
  const toggleAll = (value) => {
    const allKeys = Object.keys(localPreferences);
    const newPreferences = {};
    
    allKeys.forEach(key => {
      newPreferences[key] = value;
    });
    
    setLocalPreferences(newPreferences);
    toast.info(value ? 'All notifications enabled' : 'All notifications disabled');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <div className="card mb-8">
          <div className="flex items-center mb-6">
            <BellIcon className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-2xl font-bold">Notification Preferences</h1>
          </div>
          
          <p className="text-surface-600 dark:text-surface-400 mb-8">
            Customize which email notifications you receive about your job applications and account activity.
          </p>
          
          <div className="flex justify-end gap-4 mb-6">
            <button
              type="button"
              onClick={() => toggleAll(true)}
              className="text-sm btn-outline py-1.5"
            >
              Enable all
            </button>
            <button
              type="button"
              onClick={() => toggleAll(false)}
              className="text-sm btn-outline py-1.5"
            >
              Disable all
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <NotificationOption
                id="applicationSubmission"
                title="Application Submission"
                description="Receive confirmation when you submit a job application"
                icon={<MailIcon className="h-6 w-6 text-primary" />}
                checked={localPreferences.applicationSubmission}
                onChange={() => handleToggleChange('applicationSubmission')}
              />
              
              <NotificationOption
                id="applicationReview"
                title="Application Review"
                description="Get notified when your application status changes to 'Under Review'"
                icon={<CheckCircleIcon className="h-6 w-6 text-accent" />}
                checked={localPreferences.applicationReview}
                onChange={() => handleToggleChange('applicationReview')}
              />
              
              <NotificationOption
                id="interviewInvitation"
                title="Interview Invitations"
                description="Receive alerts when you're invited to an interview"
                icon={<CalendarIcon className="h-6 w-6 text-secondary" />}
                checked={localPreferences.interviewInvitation}
                onChange={() => handleToggleChange('interviewInvitation')}
              />
              
              <NotificationOption
                id="applicationRejection"
                title="Application Rejection"
                description="Get notified when your application is not selected"
                icon={<XCircleIcon className="h-6 w-6 text-surface-500" />}
                checked={localPreferences.applicationRejection}
                onChange={() => handleToggleChange('applicationRejection')}
              />
              
              <NotificationOption
                id="jobRecommendations"
                title="Job Recommendations"
                description="Receive personalized job recommendations based on your profile"
                icon={<LightbulbIcon className="h-6 w-6 text-amber-500" />}
                checked={localPreferences.jobRecommendations}
                onChange={() => handleToggleChange('jobRecommendations')}
              />
              
              <NotificationOption
                id="marketingEmails"
                title="Marketing Emails"
                description="Stay updated with CareerLaunch news, tips, and promotions"
                icon={<BellOffIcon className="h-6 w-6 text-surface-500" />}
                checked={localPreferences.marketingEmails}
                onChange={() => handleToggleChange('marketingEmails')}
              />
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : "Save Preferences"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

// Notification option component
const NotificationOption = ({ id, title, description, icon, checked, onChange }) => {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1">{icon}</div>
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <label htmlFor={id} className="font-medium">{title}</label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={id}
              checked={checked}
              onChange={onChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-surface-300 dark:bg-surface-700 rounded-full peer peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/50 transition-colors">
              <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full transition-all transform peer-checked:translate-x-full"></div>
            </div>
          </label>
        </div>
        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export default NotificationPreferences;