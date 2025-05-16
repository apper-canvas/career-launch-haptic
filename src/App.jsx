import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { getIcon } from './utils/iconUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Component for the theme toggle
const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const SunIcon = getIcon('Sun');
  const MoonIcon = getIcon('Moon');

  return (
    <button 
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-surface-100 dark:bg-surface-800 shadow-soft hover:shadow-card transition-all"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? <SunIcon className="h-5 w-5 text-accent" /> : <MoonIcon className="h-5 w-5 text-primary" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

// Header component
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-surface-900/90 backdrop-blur-sm shadow-soft' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CareerLaunch
          </h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><a href="#" className="font-medium hover:text-primary transition-colors">Home</a></li>
            <li><a href="#jobs" className="font-medium hover:text-primary transition-colors">Find Jobs</a></li>
            <li><a href="#" className="font-medium hover:text-primary transition-colors">About</a></li>
          </ul>
        </nav>
        <div className="flex items-center">
          {/* Menu button for mobile */}
          <button className="md:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <span className="sr-only">Open menu</span>
            {(() => {
              const MenuIcon = getIcon('Menu');
              return <MenuIcon className="h-6 w-6" />;
            })()}
          </button>
        </div>
      </div>
    </header>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="bg-surface-100 dark:bg-surface-800 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">CareerLaunch</h3>
            <p className="text-surface-600 dark:text-surface-400">
              Find your dream job and manage all your applications in one place.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">Home</a></li>
              <li><a href="#jobs" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">Find Jobs</a></li>
              <li><a href="#" className="text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-surface-600 dark:text-surface-400">
              <p>CareerLaunch Inc.</p>
              <p>123 Job Street</p>
              <p>Career City, WK 12345</p>
              <p className="mt-2">contact@careerlaunch.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-surface-200 dark:border-surface-700 mt-8 pt-6 text-center text-surface-500 dark:text-surface-400">
          <p>© {new Date().getFullYear()} CareerLaunch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ThemeToggle />
      <Header />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-lg !font-medium !text-sm"
      />
    </div>
  );
}

export default App;