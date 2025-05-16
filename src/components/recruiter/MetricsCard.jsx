import React from 'react';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';

const MetricsCard = ({ title, value, icon, trend, trendValue, trendDirection, color = 'primary', isLoading = false }) => {
  const IconComponent = getIcon(icon);
  
  const trendColorClass = trendDirection === 'up' ? 'text-green-500' : 'text-red-500';
  const TrendIcon = getIcon(trendDirection === 'up' ? 'TrendingUp' : 'TrendingDown');
  
  // Card variants for framer-motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="card relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoading ? (
        <div className="animate-pulse h-24 flex flex-col justify-center">
          <div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold mb-2">{value}</h3>
            {trend && (
              <div className="flex items-center gap-1">
                <TrendIcon className={`h-4 w-4 ${trendColorClass}`} />
                <span className={`text-xs font-medium ${trendColorClass}`}>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`flex-shrink-0 p-3 rounded-full bg-${color}-light/10 text-${color}`}>
            <IconComponent className="h-6 w-6" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MetricsCard;