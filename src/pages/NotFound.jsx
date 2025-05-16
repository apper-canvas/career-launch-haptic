import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

export default function NotFound() {
  const navigate = useNavigate();
  const HomeIcon = getIcon('Home');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  
  // Automatically redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="w-64 h-64 relative mb-8"
      >
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10 rounded-full animate-ping-slow"></div>
        <div className="absolute inset-4 bg-primary/30 dark:bg-primary/20 rounded-full animate-ping-slower"></div>
        <div className="absolute inset-8 flex items-center justify-center bg-white dark:bg-surface-800 rounded-full shadow-lg">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            404
          </h1>
        </div>
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        Page Not Found
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-lg text-surface-600 dark:text-surface-400 max-w-md mb-8"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          to="/"
          className="btn-primary flex items-center justify-center gap-2"
        >
          <HomeIcon className="h-5 w-5" />
          Go to Homepage
        </Link>
        
        <button
          onClick={() => navigate(-1)}
          className="btn-outline flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back
        </button>
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-10 text-sm text-surface-500 dark:text-surface-500"
      >
        You'll be redirected to the homepage in a few seconds...
      </motion.p>
      
      <style jsx>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-ping-slower {
          animation: ping-slower 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          animation-delay: 1s;
        }
      `}</style>
    </motion.div>
  );
}