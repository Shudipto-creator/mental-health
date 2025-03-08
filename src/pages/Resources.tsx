import React from 'react';
import { motion } from 'framer-motion';
import { Book, Video, FileText, Link as LinkIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Scene3D from '../components/Scene3D';

const Resources = () => {
  const resources = [
    {
      category: 'Articles',
      icon: FileText,
      items: [
        {
          title: 'Understanding Anxiety',
          description: 'Learn about the common causes and symptoms of anxiety.',
          link: '#'
        },
        {
          title: 'Stress Management Techniques',
          description: 'Effective strategies for managing academic stress.',
          link: '#'
        },
        {
          title: 'Healthy Sleep Habits',
          description: 'Tips for maintaining a healthy sleep schedule.',
          link: '#'
        }
      ]
    },
    {
      category: 'Videos',
      icon: Video,
      items: [
        {
          title: 'Meditation Basics',
          description: 'A beginner\'s guide to meditation practice.',
          link: '#'
        },
        {
          title: 'Breathing Exercises',
          description: 'Simple breathing techniques for stress relief.',
          link: '#'
        }
      ]
    },
    {
      category: 'External Resources',
      icon: LinkIcon,
      items: [
        {
          title: 'Student Support Services',
          description: 'Access university counseling services.',
          link: '#'
        },
        {
          title: 'Crisis Helpline',
          description: '24/7 support for emergency situations.',
          link: '#'
        }
      ]
    }
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
          <div className="flex items-center gap-4 mb-6 md:mb-8 mt-12 lg:mt-0">
            <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-lg rounded-lg flex items-center justify-center border border-white/10">
              <Book className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Resources</h1>
              <p className="text-sm md:text-base text-gray-300">Helpful materials for mental wellness</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {resources.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <category.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-lg md:text-xl font-semibold text-white">{category.category}</h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.a
                      key={item.title}
                      href={item.link}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-purple-500/20 transition-colors border border-white/5"
                    >
                      <h3 className="font-medium text-white text-sm md:text-base">{item.title}</h3>
                      <p className="text-xs md:text-sm text-gray-300 mt-1">{item.description}</p>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 md:mt-8 h-48 md:h-64 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden"
          >
            <Scene3D />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;