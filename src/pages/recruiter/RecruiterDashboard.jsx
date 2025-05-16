import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useRecruiter } from '../../context/RecruiterContext';
import { getIcon } from '../../utils/iconUtils';

// Components
import MetricsCard from '../../components/recruiter/MetricsCard';
import ApplicantList from '../../components/recruiter/ApplicantList';
import DashboardChart from '../../components/recruiter/DashboardChart';

const RecruiterDashboard = () => {
  const { 
    jobsData, 
    applicantsData, 
    dashboardMetrics,
    fetchDashboardMetrics
  } = useRecruiter();

  useEffect(() => {
    // Refresh dashboard metrics
    fetchDashboardMetrics();
    
    // Poll for updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardMetrics();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchDashboardMetrics]);

  // Icons
  const BriefcaseIcon = getIcon('Briefcase');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const BarChartIcon = getIcon('BarChart');
  
  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Prepare chart data
  const prepareStatusChartData = () => {
    if (!dashboardMetrics.metrics.applicationStatusData) return [];
    
    return [{
      name: 'Applicants',
      data: dashboardMetrics.metrics.applicationStatusData.map(item => item.count)
    }];
  };
  
  const prepareJobViewsChartData = () => {
    if (!dashboardMetrics.metrics.jobViewsData) return [];
    
    return [{
      name: 'Views',
      data: dashboardMetrics.metrics.jobViewsData.map(item => item.views)
    }];
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
        <div className="flex gap-3">
          <Link to="/recruiter/jobs" className="btn-outline">
            Manage Jobs
          </Link>
          <Link to="/recruiter/applicants" className="btn-primary">
            View Applicants
          </Link>
        </div>
      </div>
      
      {/* Key Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <MetricsCard 
          title="Active Jobs" 
          value={dashboardMetrics.metrics.activeJobs || 0}
          icon="Briefcase"
          trend={true}
          trendValue="+3 this week"
          trendDirection="up"
          color="primary"
          isLoading={dashboardMetrics.isLoading}
        />
        
        <MetricsCard 
          title="Total Applicants" 
          value={dashboardMetrics.metrics.totalApplicants || 0}
          icon="Users"
          trend={true}
          trendValue="+12 this week"
          trendDirection="up"
          color="secondary"
          isLoading={dashboardMetrics.isLoading}
        />
        
        <MetricsCard 
          title="Interviews Scheduled" 
          value={dashboardMetrics.metrics.interviewsScheduled || 0}
          icon="Calendar"
          trend={true}
          trendValue="+5 this week"
          trendDirection="up"
          color="accent"
          isLoading={dashboardMetrics.isLoading}
        />
        
        <MetricsCard 
          title="Conversion Rate" 
          value={dashboardMetrics.metrics.conversionRate || '0%'}
          icon="TrendingUp"
          trend={true}
          trendValue="+2.5% this month"
          trendDirection="up"
          color="green-500"
          isLoading={dashboardMetrics.isLoading}
        />
      </motion.div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DashboardChart
          title="Application Status Distribution"
          type="bar"
          data={prepareStatusChartData()}
          categories={dashboardMetrics.metrics.applicationStatusData?.map(item => item.status) || []}
          colors={['#4361ee']}
          isLoading={dashboardMetrics.isLoading}
        />
        
        <DashboardChart
          title="Job Views (Last 7 Days)"
          type="line"
          data={prepareJobViewsChartData()}
          categories={dashboardMetrics.metrics.jobViewsData?.map(item => 
            format(new Date(item.date), 'MMM d')
          ) || []}
          colors={['#ef476f']}
          isLoading={dashboardMetrics.isLoading}
        />
      </div>
      
      {/* Recent Applicants & Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applicants */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Applicants</h2>
            <Link to="/recruiter/applicants" className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          <ApplicantList 
            applicants={applicantsData.applicants} 
            isLoading={applicantsData.isLoading}
            compact={true}
          />
        </div>
        
        {/* Top Performing Jobs */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Top Performing Jobs</h2>
            <Link to="/recruiter/jobs" className="text-primary hover:text-primary-dark text-sm font-medium">
              View All
            </Link>
          </div>
          
          {dashboardMetrics.isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white dark:bg-surface-800 p-4 rounded-lg">
                  <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                    <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardMetrics.metrics.topJobListings?.map((job) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-surface-800 p-4 rounded-lg shadow-sm hover:shadow-card transition-shadow"
                >
                  <Link to={`/recruiter/jobs`} className="block">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-surface-500 dark:text-surface-400 text-sm mb-2">{job.company}</p>
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4 text-primary" />
                        <span>{job.applicants} applicants</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChartIcon className="h-4 w-4 text-secondary" />
                        <span>{job.views} views</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {(!dashboardMetrics.metrics.topJobListings || dashboardMetrics.metrics.topJobListings.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-surface-500 dark:text-surface-400">No job data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;