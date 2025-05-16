import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../../utils/iconUtils';

const JobForm = ({ job = null, onSubmit, onCancel }) => {
  // Initial form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: '',
    industry: '',
    skillsRequired: [],
    status: 'draft'
  });
  
  // For skills input
  const [skillInput, setSkillInput] = useState('');
  
  // Form validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  
  // Job types options
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote'];
  
  // Status options
  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'closed', label: 'Closed' }
  ];
  
  // Industry options
  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 
    'Design', 'Sales', 'Customer Service', 'Engineering', 'Data Science',
    'Product Management', 'Human Resources', 'Administrative', 'Legal', 'Consulting'
  ];

  // If editing an existing job, populate the form
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        salary: job.salary || '',
        description: job.description || '',
        requirements: job.requirements || '',
        industry: job.industry || '',
        skillsRequired: job.skillsRequired || [],
        status: job.status || 'draft'
      });
    }
  }, [job]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Add a skill to the list
  const addSkill = () => {
    if (skillInput.trim() && !formData.skillsRequired.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };
  
  // Handle skill input keypress (add on Enter)
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };
  
  // Remove a skill from the list
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(skill => skill !== skillToRemove)
    }));
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    
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
      await onSubmit(formData);
      toast.success(job ? 'Job updated successfully' : 'Job created successfully');
    } catch (error) {
      toast.error(job ? 'Failed to update job' : 'Failed to create job');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Job Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. Senior Frontend Developer"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Company*</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`input-field ${errors.company ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. TechCorp Inc."
          />
          {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Location*</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`input-field ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g. San Francisco, CA"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Job Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="select"
          >
            {jobTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Salary Range</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. $80,000 - $100,000"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Industry*</label>
        <select
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          className={`select ${errors.industry ? 'border-red-500 focus:ring-red-500' : ''}`}
        >
          <option value="">Select Industry</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Required Skills</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            className="input-field flex-1"
            placeholder="e.g. React"
          />
          <button
            type="button"
            onClick={addSkill}
            className="btn-primary py-1"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skillsRequired.map(skill => (
            <div key={skill} className="bg-surface-100 dark:bg-surface-700 px-3 py-1 rounded-full flex items-center gap-1">
              <span>{skill}</span>
              <button 
                type="button" 
                onClick={() => removeSkill(skill)}
                className="text-surface-500 hover:text-red-500"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Job Description*</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`input-field min-h-[120px] ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="Provide a detailed description of the job..."
        ></textarea>
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Requirements*</label>
        <textarea
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          className={`input-field min-h-[120px] ${errors.requirements ? 'border-red-500 focus:ring-red-500' : ''}`}
          placeholder="List the job requirements..."
        ></textarea>
        {errors.requirements && <p className="text-red-500 text-xs mt-1">{errors.requirements}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map(option => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={formData.status === option.value}
                onChange={handleChange}
                className="mr-2"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
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
          {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
};

export default JobForm;