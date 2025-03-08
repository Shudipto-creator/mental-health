import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, User, BookOpen, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const links = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'Chat' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/resources', icon: BookOpen, label: 'Resources' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={{ width: 256 }}
        animate={{ width: isExpanded ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed lg:static top-0 bottom-0 left-0 bg-black/50 backdrop-blur-lg border-r border-white/10 flex flex-col z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Toggle Expand Button (Desktop Only) */}
        <button
          onClick={toggleExpanded}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-purple-500 rounded-full items-center justify-center cursor-pointer z-50"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-white" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white" />
          )}
        </button>

        <div className={`flex items-center gap-2 mb-8 mt-12 lg:mt-0 px-4 ${!isExpanded && 'justify-center'}`}>
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
            <span className="text-purple-400 font-bold">SR</span>
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-semibold text-white whitespace-nowrap overflow-hidden"
              >
                Mental Health
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          {links.map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} onClick={() => setIsOpen(false)}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  location.pathname === to
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-300 hover:bg-white/5'
                } ${!isExpanded && 'justify-center'}`}
                title={!isExpanded ? label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`flex items-center gap-2 p-3 text-gray-300 hover:bg-white/5 rounded-lg mt-auto mx-4 mb-4 ${!isExpanded && 'justify-center'}`}
          title={!isExpanded ? 'Logout' : undefined}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </>
  );
};

export default Sidebar;