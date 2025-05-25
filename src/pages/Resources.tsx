import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Video, FileText, Link as LinkIcon, Search, ExternalLink, Tag, Filter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Scene3D from '../components/Scene3D';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredResources, setFilteredResources] = useState<any[]>([]);
  
  const resources = [
    {
      category: 'Articles',
      icon: FileText,
      tag: 'reading',
      items: [
        {
          title: 'Understanding Anxiety',
          description: 'Learn about the common causes and symptoms of anxiety.',
          link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
          tags: ['anxiety', 'mental health', 'education']
        },
        {
          title: 'Stress Management Techniques',
          description: 'Effective strategies for managing academic stress.',
          link: 'https://www.apa.org/topics/stress/managing-stress',
          tags: ['stress', 'academic', 'coping']
        },
        {
          title: 'Healthy Sleep Habits',
          description: 'Tips for maintaining a healthy sleep schedule.',
          link: 'https://www.sleepfoundation.org/sleep-hygiene',
          tags: ['sleep', 'health', 'habits']
        }
      ]
    },
    {
      category: 'Videos',
      icon: Video,
      tag: 'watching',
      items: [
        {
          title: 'Meditation Basics',
          description: 'A beginner\'s guide to meditation practice.',
          link: 'https://www.youtube.com/watch?v=inpok4MKVLM',
          tags: ['meditation', 'mindfulness', 'beginners']
        },
        {
          title: 'Breathing Exercises',
          description: 'Simple breathing techniques for stress relief.',
          link: 'https://www.youtube.com/watch?v=acUZdGd_3Gk',
          tags: ['breathing', 'stress relief', 'anxiety']
        }
      ]
    },
    {
      category: 'External Resources',
      icon: LinkIcon,
      tag: 'support',
      items: [
        {
          title: 'Student Support Services',
          description: 'Access university counseling services.',
          link: 'https://www.activeminds.org/programs/chapter-network/',
          tags: ['university', 'counseling', 'support']
        },
        {
          title: 'Crisis Helpline',
          description: '24/7 support for emergency situations.',
          link: 'https://988lifeline.org/',
          tags: ['crisis', 'emergency', 'helpline']
        }
      ]
    },
    {
      category: 'Books',
      icon: Book,
      tag: 'reading',
      items: [
        {
          title: 'The Anxiety and Phobia Workbook',
          description: 'Practical techniques for managing anxiety and phobias.',
          link: 'https://www.amazon.com/Anxiety-Phobia-Workbook-Edmund-Bourne/dp/1684034833/',
          tags: ['anxiety', 'self-help', 'workbook']
        },
        {
          title: 'Why We Sleep',
          description: 'Exploring the science behind sleep and dreams.',
          link: 'https://www.amazon.com/Why-We-Sleep-Unlocking-Dreams/dp/1501144316/',
          tags: ['sleep', 'science', 'health']
        },
        {
          title: 'Atomic Habits',
          description: 'Building good habits and breaking bad ones.',
          link: 'https://www.amazon.com/Atomic-Habits-Proven-Build-Break/dp/0735211299/',
          tags: ['habits', 'productivity', 'self-improvement']
        }
      ]
    }
  ];
  
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];
  const allTags = new Set<string>();
  
  resources.forEach(category => {
    category.items.forEach(item => {
      if (item.tags) {
        item.tags.forEach((tag: string) => allTags.add(tag));
      }
    });
  });
  
  const tags = Array.from(allTags).sort();

  // Filter resources based on search term and category
  useEffect(() => {
    let results = resources;
    
    if (selectedCategory !== 'All') {
      results = results.filter(resource => resource.category === selectedCategory);
    }
    
    if (searchTerm) {
      results = results.map(category => {
        const filteredItems = category.items.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.tags && item.tags.some((tag: string) => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
        );
        
        return {
          ...category,
          items: filteredItems
        };
      }).filter(category => category.items.length > 0);
    }
    
    setFilteredResources(results);
  }, [searchTerm, selectedCategory, resources]);
  
  // Function to open links in a new tab
  const openResource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8 mt-12 lg:mt-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-lg rounded-lg flex items-center justify-center border border-white/10">
                <Book className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">Resources</h1>
                <p className="text-sm md:text-base text-gray-300">Helpful materials for mental wellness</p>
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 bg-black/50 backdrop-blur-lg rounded-lg border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-black/50 text-gray-300 hover:bg-black/70'}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((category, index) => (
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
                    {category.items.map((item: any) => (
                      <motion.div
                        key={item.title}
                        onClick={() => openResource(item.link)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-lg hover:bg-purple-500/20 transition-colors border border-white/5 cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-white text-sm md:text-base">{item.title}</h3>
                          <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-xs md:text-sm text-gray-300 mt-1">{item.description}</p>
                        
                        {item.tags && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag: string) => (
                              <span 
                                key={tag} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-900/50 text-purple-200 border border-purple-800/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSearchTerm(tag);
                                }}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-black/50 backdrop-blur-lg p-6 rounded-xl border border-white/10 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <Search className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                  <p className="text-gray-300">Try adjusting your search or category filter</p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                  >
                    Clear filters
                  </button>
                </motion.div>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 md:mt-8"
          >
            <div className="bg-black/50 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-400" />
                Browse by Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1.5 rounded-full text-sm bg-black/50 text-gray-300 hover:bg-purple-600 hover:text-white transition-colors border border-white/10"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-6 md:mt-8 h-48 md:h-64 bg-black/50 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
              <Scene3D />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;