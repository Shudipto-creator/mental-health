import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Loader, X } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
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
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      createOrGetSession();
    }
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || isLoading) return;

    const userMessage = message;
    setMessage('');
    setIsLoading(true);
    setError(null);
    setShowEmojiPicker(false);

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
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 animate-pulse pointer-events-none" />
        {error && (
          <div className="bg-red-500/10 backdrop-blur-lg p-4 text-red-200 text-sm">
            {error}
          </div>
        )}
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

export default Chat;