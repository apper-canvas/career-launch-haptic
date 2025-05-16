import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { NotificationService } from '../services/NotificationService';

// Create notification context
const NotificationContext = createContext();

// Default notification preferences
const defaultPreferences = {
  notifications: {
    applicationSubmission: {
      enabled: true,
      frequency: 'immediate', // immediate, daily, weekly
      methods: ['email', 'in-app'] // email, in-app, sms
    },
    applicationReview: {
      enabled: true,
      frequency: 'immediate',
      methods: ['email', 'in-app']
    },
    interviewInvitation: {
      enabled: true,
      frequency: 'immediate',
      methods: ['email', 'in-app', 'sms']
    },
    applicationRejection: {
      enabled: false,
      frequency: 'daily',
      methods: ['email']
    },
    jobRecommendations: {
      enabled: true,
      frequency: 'weekly',
      methods: ['email']
    },
    marketingEmails: {
      enabled: false,
      frequency: 'weekly',
      methods: ['email']
    }
  },
  categories: {
    filterByIndustry: [] // empty array means all industries
  }
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState(() => {
    // Load preferences from localStorage if available
    const savedPreferences = localStorage.getItem('notificationPreferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Load notifications on initial render
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications from service
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a notification
  const sendNotification = async (type, data) => {
    // Check if this type of notification is enabled in preferences
    const notificationPrefs = preferences.notifications?.[type];
    if (!notificationPrefs?.enabled) {
      return false;
    }
    
    setIsLoading(true);
    try {
      const newNotification = await NotificationService.sendNotification(type, data);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.success('Notification sent successfully');
      return true;
    } catch (error) {
      toast.error('Failed to send notification');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update notification preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prevPreferences => {
      const updatedPreferences = { ...prevPreferences, ...newPreferences };
      localStorage.setItem('notificationPreferences', JSON.stringify(updatedPreferences));
      toast.success('Notification preferences updated successfully');
      return updatedPreferences;
    });
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to mark notification as read');
      console.error(error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
      console.error(error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, preferences, isLoading, sendNotification, updatePreferences, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);