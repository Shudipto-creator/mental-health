import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { Calendar, Users, Brain, Clock } from 'lucide-react';
import Scene3D from '../components/Scene3D';

const Dashboard = () => {
  const stats = [
    { icon: Calendar, label: 'Total Sessions', value: '12' },
    { icon: Clock, label: 'Hours Spent', value: '24' },
    { icon: Brain, label: 'Mood Score', value: '8.5' },
    { icon: Users, label: 'Counselors', value: '3' },
  ];

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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <motion.div
                key={label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">{label}</p>
                    <p className="text-xl md:text-2xl font-semibold text-white">{value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">Recent Sessions</h2>
              <div className="space-y-3 md:space-y-4">
                {[1, 2, 3].map((session) => (
                  <div key={session} className="flex items-center gap-4 p-3 md:p-4 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-white">Session #{session}</p>
                      <p className="text-xs md:text-sm text-gray-300">2 days ago • 45 minutes</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 relative overflow-hidden"
            >
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4">3D Visualization</h2>
              <div className="h-48 md:h-64">
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