
// React imports
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Activity, Utensils, Moon, HeartPulse } from 'lucide-react';
import Scene3D from '../components/Scene3D';

const Dashboard = () => {
  // Stats section removed as requested
  
  // No custom styles needed anymore

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto relative"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 mt-12 lg:mt-0">Welcome Back</h1>

          <div className="grid grid-cols-1 gap-4 md:gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10"
            >
              <div className="mb-6">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Health Assessments</h2>
                <p className="text-gray-300 mb-4">Complete these assessments to help our AI better understand your health needs.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Link to="/physical-assessment">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Activity className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Physical Health</p>
                        <p className="text-xs text-gray-400">Exercise, pain, conditions</p>
                      </div>
                    </motion.div>
                  </Link>
                  
                  <Link to="/nutritional-assessment">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Utensils className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Nutrition</p>
                        <p className="text-xs text-gray-400">Diet, allergies, hydration</p>
                      </div>
                    </motion.div>
                  </Link>
                  
                  <Link to="/sleep-assessment">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Moon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Sleep</p>
                        <p className="text-xs text-gray-400">Quality, patterns, habits</p>
                      </div>
                    </motion.div>
                  </Link>
                  
                  <Link to="/stress-assessment">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <HeartPulse className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Stress</p>
                        <p className="text-xs text-gray-400">Stressors, symptoms, coping</p>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </div>
              
              {/* Assessment Summary Component */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Assessment Summary</h2>
                <div className="mt-4">
                  <Link to="/assessment-summary">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm font-medium"
                    >
                      View Assessment Summary
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 relative overflow-hidden"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">3D Visualization</h2>
              <div className="h-64 md:h-80">
                <Scene3D />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;