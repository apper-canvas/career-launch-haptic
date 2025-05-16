// Simulated notification service
// In a real application, this would connect to a backend API

// Store notifications in localStorage for persistence
const STORAGE_KEY = 'notifications';

// Sample email templates for different notification types
const EMAIL_TEMPLATES = {
  applicationSubmission: {
    subject: 'Your application has been submitted',
    template: (data) => `
      <h2>Application Submitted Successfully</h2>
      <p>Dear ${data.userName || 'User'},</p>
      <p>Your application for the position of <strong>${data.jobTitle}</strong> at <strong>${data.company}</strong> has been successfully submitted.</p>
      <p>We'll keep you updated as your application progresses.</p>
      <p>Application Reference: ${data.applicationId || 'N/A'}</p>
      <p>Best regards,<br/>CareerLaunch Team</p>
    `
  },
  applicationReview: {
    subject: 'Your application is being reviewed',
    template: (data) => `
      <h2>Application Under Review</h2>
      <p>Dear ${data.userName || 'User'},</p>
      <p>Your application for <strong>${data.jobTitle}</strong> at <strong>${data.company}</strong> is now being reviewed by the hiring team.</p>
      <p>We'll notify you of any updates or decisions.</p>
      <p>Application Reference: ${data.applicationId || 'N/A'}</p>
      <p>Best regards,<br/>CareerLaunch Team</p>
    `
  },
  interviewInvitation: {
    subject: 'You\'ve been invited for an interview',
    template: (data) => `
      <h2>Interview Invitation</h2>
      <p>Dear ${data.userName || 'User'},</p>
      <p>Congratulations! You've been selected for an interview for the <strong>${data.jobTitle}</strong> position at <strong>${data.company}</strong>.</p>
      <p>Interview Details:</p>
      <ul>
        <li>Date: ${data.interviewDate || 'To be scheduled'}</li>
        <li>Type: ${data.interviewType || 'To be determined'}</li>
      </ul>
      <p>Please confirm your availability by responding to this email or through the CareerLaunch platform.</p>
      <p>Best regards,<br/>CareerLaunch Team</p>
    `
  },
  applicationRejection: {
    subject: 'Update on your job application',
    template: (data) => `
      <h2>Application Update</h2>
      <p>Dear ${data.userName || 'User'},</p>
      <p>Thank you for applying for the <strong>${data.jobTitle}</strong> position at <strong>${data.company}</strong>.</p>
      <p>After careful consideration, the hiring team has decided to move forward with other candidates whose qualifications more closely match their current needs.</p>
      <p>We appreciate your interest and encourage you to apply for future positions that match your skills and experience.</p>
      <p>Best regards,<br/>CareerLaunch Team</p>
    `
  }
};

export const NotificationService = {
  // Get all notifications
  getNotifications: async () => {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const storedNotifications = localStorage.getItem(STORAGE_KEY);
        resolve(storedNotifications ? JSON.parse(storedNotifications) : []);
      }, 300);
    });
  },

  // Send a new notification
  sendNotification: async (type, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate notification content based on type
        const template = EMAIL_TEMPLATES[type] || { subject: 'Notification', template: () => 'Notification content' };

        // Get user preferences from localStorage
        const preferencesStr = localStorage.getItem('notificationPreferences');
        let notificationPrefs = {};
        
        if (preferencesStr) {
          try {
            const preferences = JSON.parse(preferencesStr);
            notificationPrefs = preferences.notifications[type] || {};
          } catch (error) {
            console.error('Error parsing notification preferences', error);
          }
        }
        
        const newNotification = {
          id: Date.now().toString(),
          type,
          title: template.subject,
          content: template.template(data),
          timestamp: new Date().toISOString(),
          read: false,
          data,
          // Add preferences info to determine how this should be delivered
          frequency: notificationPrefs.frequency || 'immediate',
          methods: notificationPrefs.methods || ['email', 'in-app']
        };

        // Get existing notifications and add the new one
        const storedNotifications = localStorage.getItem(STORAGE_KEY);
        const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
        notifications.unshift(newNotification);
        
        // Store updated notifications
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        
        // Simulate different notification delivery methods based on preferences
        if (newNotification.methods.includes('email')) {
          console.log(`Email notification sent: ${type}`, {
            to: 'user@example.com',
            subject: newNotification.title,
            body: newNotification.content,
            frequency: newNotification.frequency
          });
        }

        if (newNotification.methods.includes('sms')) {
          console.log(`SMS notification sent: ${type}`, {
            to: '+1234567890',
            message: `${newNotification.title}: You have a new notification regarding your job application.`,
            frequency: newNotification.frequency
          });
        }

        // In-app notifications are always stored regardless of method preferences
        // as they're managed through the notifications array

        resolve(newNotification);
      }, 800);
    });
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedNotifications = localStorage.getItem(STORAGE_KEY);
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          const updatedNotifications = notifications.map(notification => 
            notification.id === notificationId ? { ...notification, read: true } : notification
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
        }
        resolve(true);
      }, 200);
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedNotifications = localStorage.getItem(STORAGE_KEY);
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
        }
        resolve(true);
      }, 300);
    });
  }
};