import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { useNotifications } from '../context/NotificationContext';

const NotificationPreferences = () => {
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState({ ...preferences });
  const [expandedSections, setExpandedSections] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ArrowLeftIcon = getIcon('ArrowLeft');
  const BellIcon = getIcon('Bell');
  const MailIcon = getIcon('Mail');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CalendarIcon = getIcon('Calendar');
  const XCircleIcon = getIcon('XCircle');
  const LightbulbIcon = getIcon('Lightbulb');
  const BellOffIcon = getIcon('BellOff');
  const ChevronDownIcon = getIcon('ChevronDown');
  const ClockIcon = getIcon('Clock');
  const FilterIcon = getIcon('Filter');
  
  const navigate = useNavigate();

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Check if a section is expanded
  const isSectionExpanded = (sectionId) => {
    return !!expandedSections[sectionId];
  };

  // Handle notification toggle change
  const handleNotificationToggle = (notificationType) => {
    setLocalPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationType]: {
          ...prev.notifications[notificationType],
          enabled: !prev.notifications[notificationType].enabled
        }
      }
    }));
  };
  
  // Handle frequency change
  const handleFrequencyChange = (notificationType, frequency) => {
    setLocalPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [notificationType]: {
          ...prev.notifications[notificationType],
          frequency
        }
      }
    }));
    toast.info(`${notificationType} frequency set to ${frequency}`);
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

  // Handle delivery method change
  const handleMethodChange = (notificationType, method) => {
    setLocalPreferences(prev => {
      const currentMethods = prev.notifications[notificationType].methods || [];
      const updatedMethods = currentMethods.includes(method)
        ? currentMethods.filter(m => m !== method)
        : [...currentMethods, method];
      
      return {
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: {
            ...prev.notifications[notificationType],
            methods: updatedMethods
          }
        }
      };
    });
  };

  // Check if a delivery method is selected
  const isMethodSelected = (notificationType, method) => {
    return localPreferences.notifications[notificationType]?.methods?.includes(method) || false;
  };

  // Handle industry filter change
  const handleIndustryFilterChange = (industry) => {
    setLocalPreferences(prev => {
      const currentFilters = prev.categories.filterByIndustry || [];
      const updatedFilters = currentFilters.includes(industry)
        ? currentFilters.filter(i => i !== industry)
        : [...currentFilters, industry];
      
      return {
        ...prev,
        categories: {
          ...prev.categories,
          filterByIndustry: updatedFilters
        }
      };
    });
  };

  // Check if an industry filter is selected
  const isIndustrySelected = (industry) => {
    return localPreferences.categories.filterByIndustry?.includes(industry) || false;
  };

  // Toggle all notifications
  const toggleAll = (value) => {
    const notificationTypes = Object.keys(localPreferences.notifications);
    const updatedNotifications = {};
    
    notificationTypes.forEach(type => {
      updatedNotifications[type] = {
        ...localPreferences.notifications[type],
        enabled: value
      };
    });

    setLocalPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        ...updatedNotifications
      }
    }));

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
          <form onSubmit={handleSubmit} className="space-y-8">
          </div>
              <h3 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-4">
                Notification Types
              </h3>

              <div className="space-y-6">
                <NotificationOption
                  id="applicationSubmission"
                  title="Application Submission"
                  description="Receive confirmation when you submit a job application"
                  icon={<MailIcon className="h-6 w-6 text-primary" />}
                  checked={localPreferences.notifications.applicationSubmission.enabled}
                  onChange={() => handleNotificationToggle('applicationSubmission')}
                  onExpandToggle={() => toggleSection('applicationSubmission')}
                  isExpanded={isSectionExpanded('applicationSubmission')}
                >
                  <div className="mt-4 pl-10 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Frequency</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationSubmission"
                            checked={localPreferences.notifications.applicationSubmission.frequency === 'immediate'}
                            onChange={() => handleFrequencyChange('applicationSubmission', 'immediate')}
                            className="mr-2"
                          />
                          <span className="text-sm">Immediate</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationSubmission"
                            checked={localPreferences.notifications.applicationSubmission.frequency === 'daily'}
                            onChange={() => handleFrequencyChange('applicationSubmission', 'daily')}
                            className="mr-2"
                          />
                          <span className="text-sm">Daily digest</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationSubmission"
                            checked={localPreferences.notifications.applicationSubmission.frequency === 'weekly'}
                            onChange={() => handleFrequencyChange('applicationSubmission', 'weekly')}
                            className="mr-2"
                          />
                          <span className="text-sm">Weekly digest</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Delivery Method</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationSubmission', 'email')}
                            onChange={() => handleMethodChange('applicationSubmission', 'email')}
                            className="mr-2"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationSubmission', 'in-app')}
                            onChange={() => handleMethodChange('applicationSubmission', 'in-app')}
                            className="mr-2"
                          />
                          <span className="text-sm">In-app notification</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationSubmission', 'sms')}
                            onChange={() => handleMethodChange('applicationSubmission', 'sms')}
                            className="mr-2"
                          />
                          <span className="text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </NotificationOption>
                
                <NotificationOption
                  id="applicationReview"
                  title="Application Review"
                  description="Get notified when your application status changes to 'Under Review'"
                  icon={<CheckCircleIcon className="h-6 w-6 text-accent" />}
                  checked={localPreferences.notifications.applicationReview.enabled}
                  onChange={() => handleNotificationToggle('applicationReview')}
                  onExpandToggle={() => toggleSection('applicationReview')}
                  isExpanded={isSectionExpanded('applicationReview')}
                >
                  <div className="mt-4 pl-10 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Frequency</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationReview"
                            checked={localPreferences.notifications.applicationReview.frequency === 'immediate'}
                            onChange={() => handleFrequencyChange('applicationReview', 'immediate')}
                            className="mr-2"
                          />
                          <span className="text-sm">Immediate</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationReview"
                            checked={localPreferences.notifications.applicationReview.frequency === 'daily'}
                            onChange={() => handleFrequencyChange('applicationReview', 'daily')}
                            className="mr-2"
                          />
                          <span className="text-sm">Daily digest</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-applicationReview"
                            checked={localPreferences.notifications.applicationReview.frequency === 'weekly'}
                            onChange={() => handleFrequencyChange('applicationReview', 'weekly')}
                            className="mr-2"
                          />
                          <span className="text-sm">Weekly digest</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Delivery Method</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationReview', 'email')}
                            onChange={() => handleMethodChange('applicationReview', 'email')}
                            className="mr-2"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationReview', 'in-app')}
                            onChange={() => handleMethodChange('applicationReview', 'in-app')}
                            className="mr-2"
                          />
                          <span className="text-sm">In-app notification</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('applicationReview', 'sms')}
                            onChange={() => handleMethodChange('applicationReview', 'sms')}
                            className="mr-2"
                          />
                          <span className="text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </NotificationOption>
                
                <NotificationOption
                  id="interviewInvitation"
                  title="Interview Invitations"
                  description="Receive alerts when you're invited to an interview"
                  icon={<CalendarIcon className="h-6 w-6 text-secondary" />}
                  checked={localPreferences.notifications.interviewInvitation.enabled}
                  onChange={() => handleNotificationToggle('interviewInvitation')}
                  onExpandToggle={() => toggleSection('interviewInvitation')}
                  isExpanded={isSectionExpanded('interviewInvitation')}
                >
                  <div className="mt-4 pl-10 space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Frequency</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-interviewInvitation"
                            checked={localPreferences.notifications.interviewInvitation.frequency === 'immediate'}
                            onChange={() => handleFrequencyChange('interviewInvitation', 'immediate')}
                            className="mr-2"
                          />
                          <span className="text-sm">Immediate</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="freq-interviewInvitation"
                            checked={localPreferences.notifications.interviewInvitation.frequency === 'daily'}
                            onChange={() => handleFrequencyChange('interviewInvitation', 'daily')}
                            className="mr-2"
                          />
                          <span className="text-sm">Daily digest</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Delivery Method</p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('interviewInvitation', 'email')}
                            onChange={() => handleMethodChange('interviewInvitation', 'email')}
                            className="mr-2"
                          />
                          <span className="text-sm">Email</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('interviewInvitation', 'in-app')}
                            onChange={() => handleMethodChange('interviewInvitation', 'in-app')}
                            className="mr-2"
                          />
                          <span className="text-sm">In-app notification</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isMethodSelected('interviewInvitation', 'sms')}
                            onChange={() => handleMethodChange('interviewInvitation', 'sms')}
                            className="mr-2"
                          />
                          <span className="text-sm">SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </NotificationOption>
                checked={localPreferences.applicationSubmission}
                <NotificationOption
                  id="applicationRejection"
                  title="Application Rejection"
                  description="Get notified when your application is not selected"
                  icon={<XCircleIcon className="h-6 w-6 text-surface-500" />}
                  checked={localPreferences.notifications.applicationRejection.enabled}
                  onChange={() => handleNotificationToggle('applicationRejection')}
                />
                checked={localPreferences.applicationReview}
                <NotificationOption
                  id="jobRecommendations"
                  title="Job Recommendations"
                  description="Receive personalized job recommendations based on your profile"
                  icon={<LightbulbIcon className="h-6 w-6 text-amber-500" />}
                  checked={localPreferences.notifications.jobRecommendations.enabled}
                  onChange={() => handleNotificationToggle('jobRecommendations')}
                />
                checked={localPreferences.interviewInvitation}
                <NotificationOption
                  id="marketingEmails"
                  title="Marketing Emails"
                  description="Stay updated with CareerLaunch news, tips, and promotions"
                  icon={<BellOffIcon className="h-6 w-6 text-surface-500" />}
                  checked={localPreferences.notifications.marketingEmails.enabled}
                  onChange={() => handleNotificationToggle('marketingEmails')}
                />
              </div>
                checked={localPreferences.applicationRejection}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleSection('notificationSchedule')}
                >
                  <div className="flex items-center">
                    <ClockIcon className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">Notification Schedule</h3>
                  </div>
                  <ChevronDownIcon className={`h-5 w-5 transition-transform ${isSectionExpanded('notificationSchedule') ? 'rotate-180' : ''}`} />
                </button>
                
                {isSectionExpanded('notificationSchedule') && (
                  <div className="mt-4 space-y-4 pl-9">
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      Choose when you want to receive your notification digests.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Daily digest time</h4>
                      <select className="select w-full max-w-xs">
                        <option value="morning">Morning (8:00 AM)</option>
                        <option value="afternoon">Afternoon (1:00 PM)</option>
                        <option value="evening">Evening (6:00 PM)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Weekly digest day</h4>
                      <select className="select w-full max-w-xs">
                        <option value="monday">Monday</option>
                        <option value="wednesday">Wednesday</option>
                        <option value="friday">Friday</option>
                        <option value="sunday">Sunday</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
                checked={localPreferences.jobRecommendations}
              <div className="border-t border-surface-200 dark:border-surface-700 pt-6">
                <button
                  type="button"
                  className="flex items-center justify-between w-full text-left"
                  onClick={() => toggleSection('notificationCategories')}
                >
                  <div className="flex items-center">
                    <FilterIcon className="h-6 w-6 text-primary mr-3" />
                    <h3 className="text-lg font-semibold">Notification Categories</h3>
                  </div>
                  <ChevronDownIcon className={`h-5 w-5 transition-transform ${isSectionExpanded('notificationCategories') ? 'rotate-180' : ''}`} />
                </button>
                
                {isSectionExpanded('notificationCategories') && (
                  <div className="mt-4 space-y-4 pl-9">
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      Filter notifications by industry to receive more relevant updates.
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Industries</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Retail'].map(industry => (
                          <label key={industry} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isIndustrySelected(industry)}
                              onChange={() => handleIndustryFilterChange(industry)}
                              className="mr-2"
                            />
                            <span className="text-sm">{industry}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
const NotificationOption = ({
  id,
  title,
  description,
  icon,
  checked,
  onChange,
  onExpandToggle,
  isExpanded,
  children
}) => {
  return (
    <div className="flex flex-col">
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
        {onExpandToggle && (
          <button
            type="button"
            onClick={onExpandToggle}
            className="text-xs text-primary mt-1 flex items-center"
          >
            Customize
            <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
    </div>
    {children}
    </div>
  );
};

export default NotificationPreferences;