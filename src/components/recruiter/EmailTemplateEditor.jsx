import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

const EmailTemplateEditor = ({ template = null, onSave, onCancel }) => {
  // Initial form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    category: 'application',
    isDefault: false
  });
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Placeholder variables for the email
  const placeholderVariables = [
    { name: 'candidateName', description: 'Candidate\'s full name' },
    { name: 'position', description: 'Job position title' },
    { name: 'company', description: 'Company name' },
    { name: 'recruiterName', description: 'Recruiter\'s name' },
    { name: 'interviewDate', description: 'Interview date (if applicable)' },
    { name: 'interviewTime', description: 'Interview time (if applicable)' },
    { name: 'interviewFormat', description: 'Interview format (e.g., video, in-person)' }
  ];
  
  // Email categories
  const categories = [
    { value: 'application', label: 'Application' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'rejection', label: 'Rejection' },
    { value: 'follow-up', label: 'Follow Up' }
  ];

  // If editing an existing template, populate the form
  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        subject: template.subject || '',
        body: template.body || '',
        category: template.category || 'application',
        isDefault: template.isDefault || false
      });
    }
  }, [template]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Insert a placeholder variable at the cursor position
  const insertVariable = (variable) => {
    setFormData(prev => ({
      ...prev,
      body: prev.body + `{{${variable}}}`
    }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Template name is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.body.trim()) newErrors.body = 'Email body is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(template ? 'Template updated successfully' : 'Template created successfully');
    } catch (error) {
      toast.error(template ? 'Failed to update template' : 'Failed to create template');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Template Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. Application Confirmation"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Subject Line*</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={`input-field ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="e.g. Your application has been received"
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Email Body*</label>
          <div className="text-xs text-surface-500">Insert variable: 
            <select
              className="ml-2 p-1 border rounded text-xs bg-surface-50 dark:bg-surface-700"
              onChange={(e) => {
                if (e.target.value) {
                  insertVariable(e.target.value);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Select...</option>
              {placeholderVariables.map(variable => (
                <option key={variable.name} value={variable.name}>{variable.name}</option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          className={`input-field min-h-[300px] font-mono text-sm ${errors.body ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Enter the email content here. Use HTML for formatting."
        ></textarea>
        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
        <div className="mt-2 p-3 bg-surface-50 dark:bg-surface-700 rounded-lg text-sm">
          <p className="font-medium mb-1">Available Variables:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {placeholderVariables.map(variable => (
              <li key={variable.name} className="text-xs">
                <span className="font-mono bg-surface-200 dark:bg-surface-600 px-1 rounded">{`{{${variable.name}}}`}</span>
                <span className="text-surface-500 ml-1">({variable.description})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="checkbox"
        />
        <label htmlFor="isDefault" className="ml-2">
          Set as default template for this category
        </label>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
        </button>
      </div>
    </form>
  );
};

export default EmailTemplateEditor;