import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

interface FormLayoutProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  backLink?: string;
}

const FormLayout: React.FC<FormLayoutProps> = ({
  title,
  children,
  onSubmit,
  isSubmitting,
  submitButtonText = 'Submit',
  backLink = '/dashboard',
}) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mt-12 lg:mt-0 relative"
        >
          <div className="bg-black/60 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                <Link 
                  to={backLink}
                  className="p-2 mr-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <h2 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </h2>
              </div>
              
              <form onSubmit={onSubmit} className="space-y-6">
                {children}
                
                <div className="flex justify-end mt-8">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </div>
                    ) : submitButtonText}
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FormLayout;
