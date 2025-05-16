import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

// Component for application status tracking
export default function MainFeature() {
  // State for managing applications
  const [applications, setApplications] = useState([
    { 
      id: 1, 
      jobTitle: "UI/UX Designer", 
      company: "CreativeTech Solutions", 
      dateApplied: "2023-04-15", 
      status: "interview", 
      notes: "Interview scheduled for next week"
    },
    { 
      id: 2, 
      jobTitle: "Frontend Developer", 
      company: "WebWorks Inc.", 
      dateApplied: "2023-04-10", 
      status: "applied", 
      notes: ""
    },
    { 
      id: 3, 
      jobTitle: "Product Designer", 
      company: "InnovateCo", 
      dateApplied: "2023-04-05", 
      status: "rejected", 
      notes: "Will apply again in 3 months"
    }
  ]);
  
  // State for form inputs
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'resume'
  const [newApplication, setNewApplication] = useState({
    jobTitle: "",
    company: "",
    dateApplied: new Date().toISOString().split('T')[0],
    status: "applied",
    notes: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resume, setResume] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    summary: "Passionate professional with 5+ years of experience in web development and design.",
    skills: ["JavaScript", "React", "UI/UX Design", "HTML/CSS", "Responsive Design"]
  });
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Helper functions for status display
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'interview': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'offer': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-200';
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'applied': return 'Applied';
      case 'interview': return 'Interview';
      case 'offer': return 'Offer Received';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };
  
  // Form submit handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newApplication.jobTitle || !newApplication.company || !newApplication.dateApplied) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (editMode) {
      // Update existing application
      const updatedApplications = applications.map(app => 
        app.id === editId ? { ...newApplication, id: editId } : app
      );
      setApplications(updatedApplications);
      toast.success("Application updated successfully!");
    } else {
      // Add new application
      const newId = applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1;
      setApplications([...applications, { ...newApplication, id: newId }]);
      toast.success("New application added!");
    }
    
    // Reset form
    setNewApplication({
      jobTitle: "",
      company: "",
      dateApplied: new Date().toISOString().split('T')[0],
      status: "applied",
      notes: ""
    });
    setEditMode(false);
    setEditId(null);
  };
  
  const handleEdit = (id) => {
    const appToEdit = applications.find(app => app.id === id);
    if (appToEdit) {
      setNewApplication({ ...appToEdit });
      setEditMode(true);
      setEditId(id);
      // Scroll to form
      document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleDelete = (id) => {
    setApplications(applications.filter(app => app.id !== id));
    toast.success("Application removed");
    
    // If deleting the one being edited, reset form
    if (editId === id) {
      setNewApplication({
        jobTitle: "",
        company: "",
        dateApplied: new Date().toISOString().split('T')[0],
        status: "applied",
        notes: ""
      });
      setEditMode(false);
      setEditId(null);
    }
  };
  
  const handleResumeSubmit = (e) => {
    e.preventDefault();
    toast.success("Resume updated successfully!");
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type.includes('document')) {
        setResumeFile(file);
        toast.success("Resume uploaded successfully!");
      } else {
        toast.error("Please upload a PDF or Document file");
      }
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  // Icon components
  const ClipboardIcon = getIcon('Clipboard');
  const FileTextIcon = getIcon('FileText');
  const PlusIcon = getIcon('Plus');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const SaveIcon = getIcon('Save');
  const UploadIcon = getIcon('Upload');
  
  return (
    <div className="relative">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-surface-800 p-1 rounded-full shadow-soft inline-flex">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === 'applications'
                ? 'bg-primary text-white shadow-soft'
                : 'hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <ClipboardIcon className="h-5 w-5 mr-2" />
            <span>Applications</span>
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeTab === 'resume'
                ? 'bg-primary text-white shadow-soft'
                : 'hover:bg-surface-100 dark:hover:bg-surface-700'
            }`}
          >
            <FileTextIcon className="h-5 w-5 mr-2" />
            <span>Resume</span>
          </button>
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === 'applications' ? (
          <motion.div
            key="applications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Application Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Your Applications</h3>
                    <button 
                      onClick={() => {
                        setEditMode(false);
                        setEditId(null);
                        setNewApplication({
                          jobTitle: "",
                          company: "",
                          dateApplied: new Date().toISOString().split('T')[0],
                          status: "applied",
                          notes: ""
                        });
                        document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary py-1.5 px-3 text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      <span>Add New</span>
                    </button>
                  </div>
                  
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.map((app) => (
                        <div 
                          key={app.id} 
                          className={`p-4 rounded-lg border ${
                            editId === app.id 
                              ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                              : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
                          } transition-all duration-200`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                              <h4 className="font-semibold text-lg">{app.jobTitle}</h4>
                              <p className="text-surface-600 dark:text-surface-400">{app.company}</p>
                              <div className="flex flex-wrap gap-3 mt-2">
                                <span className="text-sm text-surface-500 dark:text-surface-400">
                                  Applied: {new Date(app.dateApplied).toLocaleDateString()}
                                </span>
                                <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                                  {getStatusLabel(app.status)}
                                </span>
                              </div>
                              {app.notes && (
                                <p className="mt-3 text-sm text-surface-600 dark:text-surface-400 border-l-2 border-surface-300 dark:border-surface-600 pl-3 italic">
                                  {app.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2">
                              <button 
                                onClick={() => handleEdit(app.id)} 
                                className="btn-outline p-2 text-sm"
                                aria-label="Edit application"
                              >
                                <EditIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDelete(app.id)} 
                                className="btn-outline p-2 text-sm text-secondary hover:text-secondary-dark"
                                aria-label="Delete application"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-surface-100 dark:bg-surface-700 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <ClipboardIcon className="h-8 w-8 text-surface-400" />
                      </div>
                      <h4 className="text-lg font-medium mb-2">No applications yet</h4>
                      <p className="text-surface-600 dark:text-surface-400 mb-4">
                        Start tracking your job applications by adding your first one.
                      </p>
                      <button 
                        onClick={() => document.getElementById('application-form').scrollIntoView({ behavior: 'smooth' })}
                        className="btn-primary py-2 px-4"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Your First Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div id="application-form">
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6 sticky top-20">
                  <h3 className="text-xl font-semibold mb-4">
                    {editMode ? "Edit Application" : "Add New Application"}
                  </h3>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                          Job Title*
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          className="input-field"
                          placeholder="e.g. Frontend Developer"
                          value={newApplication.jobTitle}
                          onChange={(e) => setNewApplication({ ...newApplication, jobTitle: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-1">
                          Company*
                        </label>
                        <input
                          type="text"
                          id="company"
                          className="input-field"
                          placeholder="e.g. Acme Inc."
                          value={newApplication.company}
                          onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="dateApplied" className="block text-sm font-medium mb-1">
                          Date Applied*
                        </label>
                        <input
                          type="date"
                          id="dateApplied"
                          className="input-field"
                          value={newApplication.dateApplied}
                          onChange={(e) => setNewApplication({ ...newApplication, dateApplied: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium mb-1">
                          Status
                        </label>
                        <select
                          id="status"
                          className="input-field"
                          value={newApplication.status}
                          onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
                        >
                          <option value="applied">Applied</option>
                          <option value="interview">Interview Scheduled</option>
                          <option value="offer">Offer Received</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium mb-1">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          rows="3"
                          className="input-field"
                          placeholder="Any additional notes about this application..."
                          value={newApplication.notes}
                          onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                        ></textarea>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-2">
                        {editMode && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditMode(false);
                              setEditId(null);
                              setNewApplication({
                                jobTitle: "",
                                company: "",
                                dateApplied: new Date().toISOString().split('T')[0],
                                status: "applied",
                                notes: ""
                              });
                            }}
                            className="btn-outline"
                          >
                            Cancel
                          </button>
                        )}
                        <button type="submit" className="btn-primary">
                          <SaveIcon className="h-4 w-4 mr-2" />
                          {editMode ? "Update Application" : "Save Application"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Resume Builder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6">
                  <h3 className="text-xl font-semibold mb-6">Resume Preview</h3>
                  
                  <div className="border border-surface-200 dark:border-surface-700 rounded-lg p-6 bg-white dark:bg-surface-900">
                    <div className="mb-6 text-center border-b border-surface-200 dark:border-surface-700 pb-4">
                      <h4 className="text-2xl font-bold mb-1">{resume.name}</h4>
                      <div className="text-surface-600 dark:text-surface-400">
                        <p>{resume.email} | {resume.phone}</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-3">Summary</h5>
                      <p>{resume.summary}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-3">Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {resume.skills.map((skill, index) => (
                          <span key={index} className="tag bg-primary/10 text-primary dark:bg-primary/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-lg font-semibold border-b border-surface-200 dark:border-surface-700 pb-2 mb-3">Experience & Education</h5>
                      <p className="text-surface-600 dark:text-surface-400 italic">
                        [Your experience and education will appear here when added...]
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Upload Resume</h3>
                    <div className="border-2 border-dashed border-surface-300 dark:border-surface-700 rounded-lg p-8 text-center">
                      <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-surface-400" />
                      
                      <h4 className="font-medium mb-2">
                        {resumeFile ? `Uploaded: ${resumeFile.name}` : "Upload your resume"}
                      </h4>
                      
                      <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                        Supported formats: PDF, DOC, DOCX
                      </p>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                      
                      <button
                        onClick={triggerFileInput}
                        className="btn-primary"
                      >
                        <UploadIcon className="h-5 w-5 mr-2" />
                        {resumeFile ? "Replace Resume" : "Upload Resume"}
                      </button>
                      
                      {resumeFile && (
                        <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                          Resume uploaded successfully! It will be used for your job applications.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white dark:bg-surface-800 rounded-xl shadow-soft p-6 sticky top-20">
                  <h3 className="text-xl font-semibold mb-4">Edit Resume Details</h3>
                  <form onSubmit={handleResumeSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="input-field"
                          value={resume.name}
                          onChange={(e) => setResume({ ...resume, name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="input-field"
                          value={resume.email}
                          onChange={(e) => setResume({ ...resume, email: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="input-field"
                          value={resume.phone}
                          onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="summary" className="block text-sm font-medium mb-1">
                          Professional Summary
                        </label>
                        <textarea
                          id="summary"
                          rows="3"
                          className="input-field"
                          value={resume.summary}
                          onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Skills (comma separated)
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          value={resume.skills.join(", ")}
                          onChange={(e) => setResume({ ...resume, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s) })}
                          placeholder="e.g. JavaScript, React, UI/UX Design"
                        />
                      </div>
                      
                      <div className="flex justify-end pt-2">
                        <button type="submit" className="btn-primary">
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}