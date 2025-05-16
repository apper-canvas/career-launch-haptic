import React from 'react';
import Chart from 'react-apexcharts';
import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';

const DashboardChart = ({ 
  title, 
  type = 'line', 
  data = [], 
  categories = [], 
  colors = ['#4361ee'], 
  height = 300,
  isLoading = false 
}) => {
  // Configure chart options based on the type
  const getChartOptions = () => {
    const baseOptions = {
      chart: {
        toolbar: {
          show: false
        },
        fontFamily: 'inherit',
        foreColor: '#64748b',
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            cssClass: 'text-xs font-normal'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            cssClass: 'text-xs font-normal'
          }
        }
      },
      colors: colors,
      tooltip: {
        theme: 'light',
        x: {
          show: true
        }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 2
      },
      legend: {
        position: 'top',
        fontFamily: 'inherit'
      }
    };

    return baseOptions;
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {isLoading ? (
        <div className="animate-pulse flex flex-col justify-center h-[280px]">
          <div className="h-44 bg-surface-200 dark:bg-surface-700 rounded"></div>
          <div className="mt-4 h-5 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
        </div>
      ) : (
        <Chart
          options={getChartOptions()}
          series={data}
          type={type}
          height={height}
        />
      )}
    </motion.div>
  );
};

export default DashboardChart;