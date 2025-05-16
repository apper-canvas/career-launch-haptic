import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const BellIcon = getIcon('Bell');
  const CheckIcon = getIcon('Check');
  const MailIcon = getIcon('Mail');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CalendarIcon = getIcon('Calendar');
  const XCircleIcon = getIcon('XCircle');
  const SettingsIcon = getIcon('Settings');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'applicationSubmission':
        return <MailIcon className="h-5 w-5 text-primary" />;
      case 'applicationReview':
        return <CheckCircleIcon className="h-5 w-5 text-accent" />;
      case 'interviewInvitation':
        return <CalendarIcon className="h-5 w-5 text-secondary" />;
      case 'applicationRejection':
        return <XCircleIcon className="h-5 w-5 text-surface-500" />;
      default:
        return <BellIcon className="h-5 w-5 text-primary" />;
    }
  };

  // Format notification time
  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'MMM d, h:mm a');
    } catch (error) {
      return 'Unknown time';
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell icon with notification indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center bg-secondary text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-xl shadow-lg border border-surface-200 dark:border-surface-700 z-50"
          >
            <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary flex items-center hover:text-primary-dark"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-surface-500 dark:text-surface-400">
                  <div className="mb-3 flex justify-center">
                    <BellIcon className="h-8 w-8 text-surface-400" />
                  </div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul>
                  {notifications.map(notification => (
                    <li key={notification.id} className={`border-b border-surface-200 dark:border-surface-700 last:border-b-0 ${!notification.read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                      <button 
                        onClick={() => handleNotificationClick(notification)}
                        className="p-4 w-full text-left flex items-start gap-3 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">{notification.data?.jobTitle} at {notification.data?.company}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-500 mt-1">{formatTime(notification.timestamp)}</div>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link to="/notification-preferences" className="block p-3 text-center text-sm font-medium text-primary hover:text-primary-dark border-t border-surface-200 dark:border-surface-700">
              <SettingsIcon className="h-4 w-4 inline mr-1" /> Manage notification settings
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;