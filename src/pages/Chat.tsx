import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Loader, X, ClipboardCheck, Activity, Coffee, Heart } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { generateAIResponse } from '../lib/groq';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

const Chat = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showAssessmentPopup, setShowAssessmentPopup] = useState(false);
  const [assessmentStatus, setAssessmentStatus] = useState({
    physical: false,
    nutritional: false,
    sleep: false,
    stress: false,
    total: 0
  });

  useEffect(() => {
    if (user) {
      // Check if there's a session ID in the URL query parameters
      const params = new URLSearchParams(location.search);
      const sessionParam = params.get('session');
      
      if (sessionParam) {
        // If there's a session ID in the URL, use that
        setSessionId(sessionParam);
        // Remove the session parameter from the URL
        navigate('/chat', { replace: true });
      } else {
        // Otherwise, create or get a session as usual
        createOrGetSession();
      }
      
      // Check if user has completed any assessments
      checkAssessmentStatus();
    }
  }, [user, location]);

  useEffect(() => {
    if (sessionId) {
      loadMessages();
      subscribeToMessages();
    }
  }, [sessionId]);

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel(`messages:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`,
      }, payload => {
        const newMessage = payload.new as Message;
        setMessages(current => {
          const exists = current.some(msg => msg.id === newMessage.id);
          if (!exists) {
            return [...current, newMessage];
          }
          return current;
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createOrGetSession = async () => {
    try {
      const { data: existingSession, error: fetchError } = await supabase
        .from('chat_sessions')
        .select()
        .eq('user_id', user?.id)
        .is('ended_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingSession) {
        setSessionId(existingSession.id);
        return;
      }

      const { data: newSession, error: createError } = await supabase
        .from('chat_sessions')
        .insert([{ user_id: user?.id }])
        .select()
        .single();

      if (createError) throw createError;
      setSessionId(newSession.id);
    } catch (error: any) {
      console.error('Error with chat session:', error);
      setError('Failed to start chat session. Please try refreshing the page.');
    }
  };

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setError(null);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages. Please try refreshing the page.');
    }
  };

  const checkAssessmentStatus = async () => {
    if (!user) return;
    
    try {
      // Check physical assessment
      const { data: physical } = await supabase
        .from('physical_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Check nutritional assessment
      const { data: nutritional } = await supabase
        .from('nutritional_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Check sleep assessment
      const { data: sleep } = await supabase
        .from('sleep_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      // Check stress assessment
      const { data: stress } = await supabase
        .from('stress_assessments')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const hasPhysical = !!physical;
      const hasNutritional = !!nutritional;
      const hasSleep = !!sleep;
      const hasStress = !!stress;
      
      const totalCompleted = [hasPhysical, hasNutritional, hasSleep, hasStress].filter(Boolean).length;
      
      setAssessmentStatus({
        physical: hasPhysical,
        nutritional: hasNutritional,
        sleep: hasSleep,
        stress: hasStress,
        total: totalCompleted
      });
      
      // Only show popup if no assessments completed
      // We'll set the state but not automatically show the popup
      // It will only appear when the user tries to send a message
      if (totalCompleted === 0) {
        // Don't automatically show popup, just track the status
        // setShowAssessmentPopup(true); - removed automatic popup
      }
    } catch (error) {
      console.error('Error checking assessment status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !sessionId) return;
    
    // If user has completed no assessments, show popup
    if (assessmentStatus.total === 0) {
      setShowAssessmentPopup(true);
      return;
    }

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          content: userMessage,
          role: 'user'
        }])
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      const updatedMessages = [...messages, userMessageData];
      setMessages(updatedMessages);

      let aiResponse;
      try {
        aiResponse = await generateAIResponse(
          userMessage, 
          sessionId,
          updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
            created_at: msg.created_at
          }))
        );
      } catch (error) {
        if (retryCount < 2) {
          setRetryCount(count => count + 1);
          aiResponse = await generateAIResponse(
            userMessage, 
            sessionId,
            updatedMessages.map(msg => ({
              role: msg.role,
              content: msg.content,
              created_at: msg.created_at
            }))
          );
        } else {
          throw error;
        }
      }

      const { data: aiMessageData, error: aiMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionId,
          content: aiResponse,
          role: 'assistant'
        }])
        .select()
        .single();

      if (aiMessageError) throw aiMessageError;

      setMessages([...updatedMessages, aiMessageData]);
      setRetryCount(0);
      inputRef.current?.focus();
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-black to-pink-900">
        <p className="text-white">Please log in to access the chat.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg p-4 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {/* Assessment Popup */}
        <AnimatePresence>
          {showAssessmentPopup && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowAssessmentPopup(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} 
                animate={{ scale: 1, y: 0 }} 
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gradient-to-br from-purple-900/90 to-black/90 p-6 md:p-8 rounded-xl border border-purple-500/30 shadow-2xl max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-full shadow-lg">
                    <ClipboardCheck className="w-8 h-8 text-white" />
                  </div>
                  
                  <button 
                    onClick={() => setShowAssessmentPopup(false)}
                    className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Complete Your Health Assessment
                    </h2>
                    <p className="text-gray-300 mb-6">
                      For the best personalized mental health counseling experience, we recommend completing at least one health assessment first.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <AssessmentCard 
                      title="Physical Health"
                      description="Exercise, pain, and physical conditions"
                      icon={<Activity className="w-5 h-5" />}
                      completed={assessmentStatus.physical}
                      link="/physical-assessment"
                    />
                    <AssessmentCard 
                      title="Nutrition"
                      description="Diet, water intake, and supplements"
                      icon={<Coffee className="w-5 h-5" />}
                      completed={assessmentStatus.nutritional}
                      link="/nutritional-assessment"
                    />
                    <AssessmentCard 
                      title="Sleep"
                      description="Sleep patterns and quality"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>}
                      completed={assessmentStatus.sleep}
                      link="/sleep-assessment"
                    />
                    <AssessmentCard 
                      title="Stress"
                      description="Stress levels and coping mechanisms"
                      icon={<Heart className="w-5 h-5" />}
                      completed={assessmentStatus.stress}
                      link="/stress-assessment"
                    />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link 
                      to="/assessment-summary"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium text-center hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Go to Assessments
                    </Link>
                    <button 
                      onClick={() => setShowAssessmentPopup(false)}
                      className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all"
                    >
                      Continue to Chat
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 p-4 md:p-6 overflow-auto relative"
        >
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`${
                    msg.role === 'assistant' 
                      ? 'bg-black/50 backdrop-blur-lg' 
                      : 'bg-purple-500/20 backdrop-blur-lg ml-auto'
                  } p-4 rounded-lg border border-white/10 max-w-[90%] md:max-w-[80%]`}
                >
                  <p className="text-white whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {msg.role === 'assistant' ? 'AI Assistant' : 'You'} • {
                      format(new Date(msg.created_at), 'h:mm a')
                    }
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border-t border-white/10 bg-black/50 backdrop-blur-lg relative"
        >
          {/* Emoji Picker with Close Button */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-full left-0 md:left-auto right-0 md:right-auto mb-2 w-full md:w-auto"
              >
                <div className="relative">
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="absolute right-2 top-2 p-1 rounded-full bg-white/10 text-white/60 hover:text-white/90 z-10"
                  >
                    <X size={16} />
                  </button>
                  <Picker 
                    data={data} 
                    onEmojiSelect={onEmojiSelect} 
                    theme="dark"
                    previewPosition="none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 md:gap-4">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Smile size={24} />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

// Assessment Card component for the popup
interface AssessmentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  link: string;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ title, description, icon, completed, link }) => {
  return (
    <Link to={link} className="block">
      <div className={`p-4 rounded-lg border transition-all ${completed ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
        <div className="flex items-start">
          <div className={`p-2 rounded-lg mr-3 ${completed ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
            {icon}
          </div>
          <div>
            <h3 className="text-white font-medium flex items-center">
              {title}
              {completed && <span className="ml-2 text-xs bg-green-500/30 text-green-300 px-2 py-0.5 rounded-full">Completed</span>}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Chat;