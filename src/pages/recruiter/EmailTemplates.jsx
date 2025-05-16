import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecruiter } from '../../context/RecruiterContext';
import { getIcon } from '../../utils/iconUtils';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

// Components
import EmailTemplateEditor from '../../components/recruiter/EmailTemplateEditor';

const EmailTemplates = () => {
  const { emailTemplates, fetchEmailTemplates } = useRecruiter();
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // Icons
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const PlusIcon = getIcon('Plus');
  const PencilIcon = getIcon('Pencil');
  const EyeIcon = getIcon('Eye');
  const TrashIcon = getIcon('Trash');
  const XIcon = getIcon('X');
  const ClockIcon = getIcon('Clock');
  const TagIcon = getIcon('Tag');
  const CheckIcon = getIcon('Check');
  
  // Filter templates based on search term and category
  useEffect(() => {
    if (!emailTemplates.templates) return;
    
    let result = [...emailTemplates.templates];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(template => template.category === categoryFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(template => 
        template.name.toLowerCase().includes(searchLower) ||
        template.subject.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredTemplates(result);
  }, [emailTemplates.templates, searchTerm, categoryFilter]);
  
  // Fetch templates on component mount
  useEffect(() => {
    fetchEmailTemplates();
  }, [fetchEmailTemplates]);
  
  // Handle template save (create or update)
  const handleSaveTemplate = async (templateData) => {
    // This would normally connect to RecruiterService to save the template
    toast.success('Template saved successfully');
    
    // Simulate adding a new template or updating existing one
    if (currentTemplate) {
      // Update existing template
      const updatedTemplates = emailTemplates.templates.map(template => 
        template.id === currentTemplate.id ? { 
          ...template, 
          ...templateData, 
          lastUpdated: new Date().toISOString() 
        } : template
      );
      
      // Update local state
      emailTemplates.templates = updatedTemplates;
      setIsEditModalOpen(false);
    } else {
      // Create new template
      const newTemplate = {
        id: `template-${Date.now()}`,
        ...templateData,
        lastUpdated: new Date().toISOString()
      };
      
      // Update local state
      emailTemplates.templates = [...emailTemplates.templates, newTemplate];
      setIsCreateModalOpen(false);
    }
    
    setCurrentTemplate(null);
    fetchEmailTemplates(); // Refresh templates
  };
  
  // Handle template delete
  const handleDeleteTemplate = (templateId) => {
    // This would normally connect to RecruiterService to delete the template
    
    // Simulate deleting a template
    emailTemplates.templates = emailTemplates.templates.filter(template => template.id !== templateId);
    toast.success('Template deleted successfully');
    fetchEmailTemplates(); // Refresh templates
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Get category label
  const getCategoryLabel = (category) => {
    const categories = {
      'application': 'Application',
      'interview': 'Interview',
      'offer': 'Offer',
      'rejection': 'Rejection',
      'follow-up': 'Follow Up'
    };
    return categories[category] || 'Unknown';
  };
  
  // Get category color class
  const getCategoryColorClass = (category) => {
    const colorClasses = {
      'application': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'interview': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'offer': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'rejection': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'follow-up': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colorClasses[category] || 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" /> Create Template
        </button>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-56">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FilterIcon className="h-5 w-5 text-surface-400" />
          </div>
          <select
            className="input-field pl-10 appearance-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="application">Application</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejection">Rejection</option>
            <option value="follow-up">Follow Up</option>
          </select>
        </div>
      </div>
      
      {/* Template Listings */}
      {emailTemplates.isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-surface-800 rounded-lg p-5">
              <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-3"></div>
              <div className="flex gap-3 mb-4">
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <motion.div 
              key={template.id}
              className="bg-white dark:bg-surface-800 rounded-lg p-5 shadow-sm hover:shadow-card transition-shadow relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {template.isDefault && (
                <div className="absolute top-3 right-3 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium flex items-center">
                  <CheckIcon className="h-3 w-3 mr-1" />
                  Default
                </div>
              )}
              
              <h3 className="font-semibold text-lg mb-2 pr-20">{template.name}</h3>
              <p className="text-surface-600 dark:text-surface-400 text-sm mb-3">{template.subject}</p>
              
              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1 text-surface-500" />
                  <span className="text-surface-500 dark:text-surface-400">
                    Updated {formatDate(template.lastUpdated)}
                  </span>
                </div>
                <div className="flex items-center">
                  <TagIcon className="h-3 w-3 mr-1 text-surface-500" />
                  <span className={`px-2 py-0.5 rounded-full ${getCategoryColorClass(template.category)}`}>
                    {getCategoryLabel(template.category)}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => {
                    setCurrentTemplate(template);
                    setIsPreviewModalOpen(true);
                  }}
                  className="btn-outline py-1 px-2 flex items-center text-xs"
                >
                  <EyeIcon className="h-3 w-3 mr-1" />Preview
                </button>
                <button 
                  onClick={() => {
                    setCurrentTemplate(template);
                    setIsEditModalOpen(true);
                  }}
                  className="btn-outline py-1 px-2 flex items-center text-xs"
                >
                  <PencilIcon className="h-3 w-3 mr-1" />Edit
                </button>
                <button 
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="btn-outline py-1 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center text-xs"
                  disabled={template.isDefault}
                >
                  <TrashIcon className="h-3 w-3 mr-1" />Delete
                </button>
              </div>
            </motion.div>
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white dark:bg-surface-800 rounded-lg">
              <p className="text-lg text-surface-500 dark:text-surface-400">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No templates match your search criteria' 
                  : 'No templates found. Create your first email template!'}
              </p>
              <button 
                onClick={() => setIsCreateModalOpen(true)} 
                className="btn-primary mt-4"
              >
                <PlusIcon className="h-5 w-5 mr-2 inline-block" /> Create Template
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Create Template Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <div className="bg-white dark:bg-surface-800 px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">Create Email Template</h3>
                    <button
                      onClick={() => setIsCreateModalOpen(false)}
                      className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <EmailTemplateEditor 
                    onSave={handleSaveTemplate}
                    onCancel={() => setIsCreateModalOpen(false)}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Edit Template Modal */}
      <AnimatePresence>
        {isEditModalOpen && currentTemplate && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <motion.div 
                className="inline-block align-bottom bg-white dark:bg-surface-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
              >
                <div className="bg-white dark:bg-surface-800 px-4 pt-5 pb-4 sm:p-6">
                  <div className="flex justify-between items-start mb-5">
                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">Edit Email Template</h3>
                    <button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setCurrentTemplate(null);
                      }}
                      className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <EmailTemplateEditor 
                    template={currentTemplate}
                    onSave={handleSaveTemplate}
                    onCancel={() => {
                      setIsEditModalOpen(false);
                      setCurrentTemplate(null);
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Preview Template Modal */}
      <AnimatePresence>
        {isPreviewModalOpen && currentTemplate && (
          <motion.div 
            className="fixed inset-0 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-black opacity-50"></div>
              </div>
              
              <motion.div 
                className="inline-block w-full max-w-3xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-surface-800 shadow-xl rounded-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium leading-6 text-surface-900 dark:text-white">
                    Preview: {currentTemplate.name}
                  </h3>
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      setCurrentTemplate(null);
                    }}
                    className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center text-sm text-surface-600 dark:text-surface-400 mb-2">
                    <span className="font-semibold mr-1">To:</span>
                    <span>candidate@example.com</span>
                  </div>
                  <div className="flex items-center text-sm text-surface-600 dark:text-surface-400 mb-2">
                    <span className="font-semibold mr-1">From:</span>
                    <span>recruiter@company.com</span>
                  </div>
                  <div className="flex items-center text-sm text-surface-600 dark:text-surface-400 mb-4">
                    <span className="font-semibold mr-1">Subject:</span>
                    <span>{currentTemplate.subject}</span>
                  </div>
                  <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: currentTemplate.body
                          .replace(/{{candidateName}}/g, 'John Smith')
                          .replace(/{{position}}/g, 'Senior Frontend Developer')
                          .replace(/{{company}}/g, 'TechCorp Inc.')
                          .replace(/{{recruiterName}}/g, 'Jane Doe')
                          .replace(/{{interviewDate}}/g, 'June 15, 2023')
                          .replace(/{{interviewTime}}/g, '10:00 AM')
                          .replace(/{{interviewFormat}}/g, 'via Zoom') 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setIsPreviewModalOpen(false);
                      setCurrentTemplate(null);
                    }}
                    className="btn-outline"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmailTemplates;