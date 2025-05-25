import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import FormLayout from './FormLayout';
import './formStyles.css'; // Import custom styles for form elements

const qualityOptions = [
  { value: 'poor', label: 'Poor' },
  { value: 'fair', label: 'Fair' },
  { value: 'good', label: 'Good' },
  { value: 'excellent', label: 'Excellent' },
];

const SleepForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    average_sleep_hours: '',
    sleep_quality: '',
    bedtime_consistency: false,
    falling_asleep_difficulty: false,
    staying_asleep_difficulty: false,
    waking_up_difficulty: false,
    sleep_aids_use: false,
    sleep_aids_details: '',
    sleep_environment_quality: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.average_sleep_hours || !formData.sleep_quality || !formData.sleep_environment_quality) {
        throw new Error('Please fill in all required fields');
      }
      
      // Prepare data for submission
      const submissionData = {
        user_id: user.id,
        average_sleep_hours: parseFloat(formData.average_sleep_hours) || 0,
        sleep_quality: formData.sleep_quality,
        bedtime_consistency: formData.bedtime_consistency,
        falling_asleep_difficulty: formData.falling_asleep_difficulty,
        staying_asleep_difficulty: formData.staying_asleep_difficulty,
        waking_up_difficulty: formData.waking_up_difficulty,
        sleep_aids_use: formData.sleep_aids_use,
        sleep_aids_details: formData.sleep_aids_details || '',
        sleep_environment_quality: formData.sleep_environment_quality,
      };
      
      // Submit to Supabase
      const { error } = await supabase
        .from('sleep_assessments')
        .insert([submissionData]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Database error: ' + error.message);
      }
      
      // Navigate to next form
      navigate('/stress-assessment');
    } catch (error: any) {
      console.error('Error submitting sleep assessment:', error);
      // Use a more user-friendly error message
      const errorMessage = error.message || 'Failed to submit form. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Sleep Assessment"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Save & Continue"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-white mb-2 font-medium">Average hours of sleep per night <span className="text-pink-400">*</span></label>
          <input
            type="number"
            name="average_sleep_hours"
            value={formData.average_sleep_hours}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
            placeholder="Hours of sleep"
            step="0.5"
            min="0"
            max="24"
            required
          />
        </div>
        
        <div>
          <label className="block text-white mb-2 font-medium">Overall sleep quality <span className="text-pink-400">*</span></label>
          <select
            name="sleep_quality"
            value={formData.sleep_quality}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
            required
          >
            <option value="" disabled>Select quality</option>
            {qualityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-3">
          <label className="block text-white mb-2">Sleep patterns (check all that apply)</label>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="bedtime_consistency"
              name="bedtime_consistency"
              checked={formData.bedtime_consistency}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="bedtime_consistency" className="ml-2 text-white">
              I go to bed at a consistent time each night
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="falling_asleep_difficulty"
              name="falling_asleep_difficulty"
              checked={formData.falling_asleep_difficulty}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="falling_asleep_difficulty" className="ml-2 text-white">
              I have difficulty falling asleep
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="staying_asleep_difficulty"
              name="staying_asleep_difficulty"
              checked={formData.staying_asleep_difficulty}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="staying_asleep_difficulty" className="ml-2 text-white">
              I wake up during the night and have trouble going back to sleep
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="waking_up_difficulty"
              name="waking_up_difficulty"
              checked={formData.waking_up_difficulty}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="waking_up_difficulty" className="ml-2 text-white">
              I have difficulty waking up in the morning
            </label>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="sleep_aids_use"
              name="sleep_aids_use"
              checked={formData.sleep_aids_use}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="sleep_aids_use" className="ml-2 text-white">
              Do you use sleep aids (medication, supplements, etc.)?
            </label>
          </div>
          
          {formData.sleep_aids_use && (
            <textarea
              name="sleep_aids_details"
              value={formData.sleep_aids_details}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Please describe what sleep aids you use and how often"
            />
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2 font-medium">Sleep environment quality <span className="text-pink-400">*</span></label>
          <select
            name="sleep_environment_quality"
            value={formData.sleep_environment_quality}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
            required
          >
            <option value="" disabled>Select quality</option>
            {qualityOptions.map(option => (
              <option key={`env-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-gray-400 text-sm mt-1">
            Consider factors like noise, light, temperature, comfort of bed, etc.
          </p>
        </div>
      </div>
    </FormLayout>
  );
};

export default SleepForm;
