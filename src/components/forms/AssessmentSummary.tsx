import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Send, Loader, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../Sidebar';
import './assessmentStyles.css'; // Import custom CSS for animations

interface Assessment {
  id: string;
  created_at: string;
  [key: string]: any;
}

const AssessmentSummary: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [assessments, setAssessments] = useState<{
    physical: Assessment | null;
    nutritional: Assessment | null;
    sleep: Assessment | null;
    stress: Assessment | null;
  }>({
    physical: null,
    nutritional: null,
    sleep: null,
    stress: null,
  });
  
  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);
  
  const fetchAssessments = async () => {
    setIsLoading(true);
    
    try {
      // Fetch the latest assessment of each type
      const tables = [
        { name: 'physical_assessments', key: 'physical' },
        { name: 'nutritional_assessments', key: 'nutritional' },
        { name: 'sleep_assessments', key: 'sleep' },
        { name: 'stress_assessments', key: 'stress' },
      ];
      
      const results: { [key: string]: Assessment | null } = {
        physical: null,
        nutritional: null,
        sleep: null,
        stress: null,
      };
      
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table.name)
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error(`Error fetching ${table.name}:`, error);
        }
        
        results[table.key] = data || null;
      }
      
      setAssessments(results as any);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendToChat = async () => {
    if (!user) return;
    
    setIsSending(true);
    
    try {
      // Create a new chat session
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: user.id }])
        .select()
        .single();
        
      if (sessionError) throw sessionError;
      
      const sessionId = sessionData.id;
      
      // Prepare the assessment data as a formatted message
      const assessmentSummary = formatAssessmentData();
      
      // Send the assessment data as a system message
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          content: assessmentSummary,
          role: 'system',
        }]);
        
      if (messageError) throw messageError;
      
      // Navigate to the chat page
      navigate(`/chat?session=${sessionId}`);
    } catch (error) {
      console.error('Error sending assessment data to chat:', error);
      alert('Failed to send data to chat. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  const formatAssessmentData = () => {
    // Create a formatted string of all assessment data for the AI
    let summary = '### Health Assessment Data\n\n';
    
    if (assessments.physical) {
      summary += '**Physical Assessment**\n';
      summary += `- Height: ${assessments.physical.height_cm} cm\n`;
      summary += `- Weight: ${assessments.physical.weight_kg} kg\n`;
      summary += `- Exercise Frequency: ${formatValue(assessments.physical.exercise_frequency)}\n`;
      summary += `- Exercise Duration: ${assessments.physical.exercise_duration_minutes} minutes\n`;
      summary += `- Exercise Intensity: ${formatValue(assessments.physical.exercise_intensity)}\n`;
      summary += `- Physical Limitations: ${assessments.physical.physical_limitations || 'None reported'}\n`;
      summary += `- Chronic Conditions: ${formatArray(assessments.physical.chronic_conditions)}\n`;
      summary += `- Pain Areas: ${formatArray(assessments.physical.pain_areas)}\n`;
      if (!assessments.physical.pain_areas.includes('None')) {
        summary += `- Pain Intensity: ${assessments.physical.pain_intensity}/10\n`;
      }
      summary += '\n';
    }
    
    if (assessments.nutritional) {
      summary += '**Nutritional Assessment**\n';
      summary += `- Meals Per Day: ${assessments.nutritional.meals_per_day}\n`;
      summary += `- Water Intake: ${assessments.nutritional.water_intake_liters} liters\n`;
      summary += `- Diet Type: ${formatValue(assessments.nutritional.diet_type)}\n`;
      summary += `- Food Allergies: ${formatArray(assessments.nutritional.food_allergies)}\n`;
      summary += `- Dietary Restrictions: ${formatArray(assessments.nutritional.dietary_restrictions)}\n`;
      summary += `- Supplement Use: ${assessments.nutritional.supplement_use ? 'Yes' : 'No'}\n`;
      if (assessments.nutritional.supplement_use) {
        summary += `- Supplement Details: ${assessments.nutritional.supplement_details}\n`;
      }
      summary += `- Caffeine Consumption: ${formatValue(assessments.nutritional.caffeine_consumption)}\n`;
      summary += `- Alcohol Consumption: ${formatValue(assessments.nutritional.alcohol_consumption)}\n`;
      summary += '\n';
    }
    
    if (assessments.sleep) {
      summary += '**Sleep Assessment**\n';
      summary += `- Average Sleep Hours: ${assessments.sleep.average_sleep_hours} hours\n`;
      summary += `- Sleep Quality: ${formatValue(assessments.sleep.sleep_quality)}\n`;
      summary += `- Consistent Bedtime: ${assessments.sleep.bedtime_consistency ? 'Yes' : 'No'}\n`;
      summary += `- Difficulty Falling Asleep: ${assessments.sleep.falling_asleep_difficulty ? 'Yes' : 'No'}\n`;
      summary += `- Difficulty Staying Asleep: ${assessments.sleep.staying_asleep_difficulty ? 'Yes' : 'No'}\n`;
      summary += `- Difficulty Waking Up: ${assessments.sleep.waking_up_difficulty ? 'Yes' : 'No'}\n`;
      summary += `- Sleep Aids Use: ${assessments.sleep.sleep_aids_use ? 'Yes' : 'No'}\n`;
      if (assessments.sleep.sleep_aids_use) {
        summary += `- Sleep Aids Details: ${assessments.sleep.sleep_aids_details}\n`;
      }
      summary += `- Sleep Environment Quality: ${formatValue(assessments.sleep.sleep_environment_quality)}\n`;
      summary += '\n';
    }
    
    if (assessments.stress) {
      summary += '**Stress Assessment**\n';
      summary += `- Stress Level: ${assessments.stress.stress_level}/10\n`;
      summary += `- Primary Stressors: ${formatArray(assessments.stress.primary_stressors)}\n`;
      summary += `- Stress Symptoms: ${formatArray(assessments.stress.stress_symptoms)}\n`;
      summary += `- Coping Mechanisms: ${formatArray(assessments.stress.coping_mechanisms)}\n`;
      summary += `- Relaxation Frequency: ${formatValue(assessments.stress.relaxation_frequency)}\n`;
      summary += `- Support System Quality: ${formatValue(assessments.stress.support_system_quality)}\n`;
      summary += `- Work-Life Balance: ${formatValue(assessments.stress.work_life_balance)}\n`;
    }
    
    return summary;
  };
  
  const formatValue = (value: string) => {
    if (!value) return 'Not specified';
    
    // Replace underscores with spaces and capitalize first letter of each word
    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const formatArray = (arr: string[] | null) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };
  
  const getCompletionStatus = () => {
    let completed = 0;
    let total = 4;
    
    if (assessments.physical) completed++;
    if (assessments.nutritional) completed++;
    if (assessments.sleep) completed++;
    if (assessments.stress) completed++;
    
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };
  
  const status = getCompletionStatus();
  
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-4 md:p-8 overflow-auto relative flex flex-col justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
          
          <div className="relative flex flex-col items-center z-10">
            {/* Animated brain icon */}
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-30 animate-pulse"></div>
              <div className="relative w-24 h-24 flex items-center justify-center bg-black/40 backdrop-blur-lg rounded-full border border-white/10 shadow-xl brain-pulse">
                <svg className="w-12 h-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            
            {/* Loading text */}
            <h2 className="text-2xl font-bold shimmer-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
              Loading Assessment Data
            </h2>
            
            {/* Loading animation */}
            <div className="flex space-x-2 mb-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 loading-dot loading-dot-${i+1}`}
                ></div>
              ))}
            </div>
            
            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full loading-progress-bar"></div>
            </div>
            
            <p className="text-gray-400 text-sm">Retrieving your health assessment data...</p>
          </div>
          
          {/* No inline styles needed - using external CSS file */}
        </div>
      </div>
    );
  }
  
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
                  to="/dashboard"
                  className="p-2 mr-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <h2 className="text-xl md:text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Assessment Summary
                </h2>
              </div>
        
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-medium">Completion Status</span>
                  <span className="text-white bg-white/10 px-3 py-1 rounded-full text-sm">
                    {status.completed}/{status.total} completed
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
              </div>
        
              <div className="space-y-4 mb-8">
                <AssessmentCard 
                  title="Physical Health"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>}
                  completed={!!assessments.physical}
                  lastUpdated={assessments.physical?.created_at}
                  editLink="/physical-assessment"
                />
                
                <AssessmentCard 
                  title="Nutrition"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>}
                  completed={!!assessments.nutritional}
                  lastUpdated={assessments.nutritional?.created_at}
                  editLink="/nutritional-assessment"
                />
                
                <AssessmentCard 
                  title="Sleep"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>}
                  completed={!!assessments.sleep}
                  lastUpdated={assessments.sleep?.created_at}
                  editLink="/sleep-assessment"
                />
                
                <AssessmentCard 
                  title="Stress"
                  icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>}
                  completed={!!assessments.stress}
                  lastUpdated={assessments.stress?.created_at}
                  editLink="/stress-assessment"
                />
              </div>
        
              {status.completed === 0 && (
                <div className="mb-6 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-pink-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-medium">No assessments completed</h3>
                      <p className="text-gray-300 text-sm mt-1">Please complete at least one assessment before sending to the chatbot.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={sendToChat}
                  disabled={status.completed === 0 || isSending}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-lg ${
                    status.completed === 0
                      ? 'bg-gray-600/50 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-purple-900/30'
                  }`}
                >
                  {isSending ? (
                    <div className="flex items-center">
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Send size={18} />
                      Send to Chatbot
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface AssessmentCardProps {
  title: string;
  icon: React.ReactNode;
  completed: boolean;
  lastUpdated?: string;
  editLink: string;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ 
  title, 
  icon,
  completed, 
  lastUpdated,
  editLink,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-5 rounded-lg bg-black/40 border border-white/10 shadow-lg transition-all"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-lg bg-purple-500/20 text-purple-400">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{title} Assessment</h3>
            {completed ? (
              <p className="text-sm text-gray-300">Last updated: {formatDate(lastUpdated)}</p>
            ) : (
              <p className="text-sm text-gray-400">Not completed yet</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {completed ? (
            <div className="flex items-center mr-4">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-400 text-sm">Completed</span>
            </div>
          ) : (
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2"></div>
              <span className="text-gray-400 text-sm">Pending</span>
            </div>
          )}
          
          <Link
            to={editLink}
            className={`px-4 py-2 text-sm rounded-lg transition-all ${completed ? 
              'bg-white/10 hover:bg-white/20 text-white' : 
              'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/20'}`}
          >
            {completed ? 'Update' : 'Complete'}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AssessmentSummary;
