import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import FormLayout from './FormLayout';
import './formStyles.css'; // Import custom styles for form elements

const commonStressors = [
  'Work/School',
  'Finances',
  'Relationships',
  'Family',
  'Health Issues',
  'Time Management',
  'Social Pressure',
  'Major Life Changes',
  'Other',
];

const stressSymptoms = [
  'Headaches',
  'Muscle Tension',
  'Fatigue',
  'Sleep Disturbances',
  'Digestive Issues',
  'Irritability',
  'Anxiety',
  'Difficulty Concentrating',
  'Mood Swings',
  'Other',
];

const copingMechanisms = [
  'Exercise',
  'Meditation/Mindfulness',
  'Deep Breathing',
  'Talking to Friends/Family',
  'Professional Help',
  'Hobbies',
  'Nature/Outdoors',
  'Music/Art',
  'None',
  'Other',
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'several_times_a_week', label: '3-5 times a week' },
  { value: 'weekly', label: '1-2 times a week' },
  { value: 'rarely', label: 'Rarely (few times a month)' },
  { value: 'never', label: 'Never' },
];

const qualityOptions = [
  { value: 'poor', label: 'Poor' },
  { value: 'fair', label: 'Fair' },
  { value: 'good', label: 'Good' },
  { value: 'excellent', label: 'Excellent' },
];

const StressForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    stress_level: 5,
    primary_stressors: [] as string[],
    stress_symptoms: [] as string[],
    coping_mechanisms: [] as string[],
    relaxation_frequency: '',
    support_system_quality: '',
    work_life_balance: '',
    other_stressor: '',
    other_symptom: '',
    other_coping: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>, 
    category: 'primary_stressors' | 'stress_symptoms' | 'coping_mechanisms'
  ) => {
    const { value, checked } = e.target;
    
    // Create a copy of the current selections
    let newSelections = [...formData[category]];
    
    if (value === 'None' && checked) {
      // If 'None' is selected, clear all other selections
      // Only apply this logic to coping_mechanisms if needed
      if (category === 'coping_mechanisms' || category === 'primary_stressors' || category === 'stress_symptoms') {
        newSelections = ['None'];
      }
    } else if (checked) {
      // If a non-None option is checked, add it and remove 'None' if present
      if (category === 'coping_mechanisms' || category === 'primary_stressors' || category === 'stress_symptoms') {
        newSelections = newSelections.filter(item => item !== 'None');
      }
      if (!newSelections.includes(value)) {
        newSelections.push(value);
      }
    } else {
      // If unchecked, just remove this value
      newSelections = newSelections.filter(item => item !== value);
    }
    
    // Update the state with the new selections
    setFormData({
      ...formData,
      [category]: newSelections,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      stress_level: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.relaxation_frequency || !formData.support_system_quality || !formData.work_life_balance) {
        throw new Error('Please fill in all required fields');
      }
      
      // Prepare data for submission
      const submissionData = {
        user_id: user.id,
        stress_level: formData.stress_level,
        primary_stressors: formData.primary_stressors.includes('Other') 
          ? [...formData.primary_stressors.filter(s => s !== 'Other'), formData.other_stressor]
          : formData.primary_stressors,
        stress_symptoms: formData.stress_symptoms.includes('Other') 
          ? [...formData.stress_symptoms.filter(s => s !== 'Other'), formData.other_symptom]
          : formData.stress_symptoms,
        coping_mechanisms: formData.coping_mechanisms.includes('Other') 
          ? [...formData.coping_mechanisms.filter(c => c !== 'Other'), formData.other_coping]
          : formData.coping_mechanisms,
        relaxation_frequency: formData.relaxation_frequency,
        support_system_quality: formData.support_system_quality,
        work_life_balance: formData.work_life_balance,
      };
      
      // Submit to Supabase
      const { error } = await supabase
        .from('stress_assessments')
        .insert([submissionData]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Database error: ' + error.message);
      }
      
      // Navigate to assessment summary page
      navigate('/assessment-summary');
    } catch (error: any) {
      console.error('Error submitting stress assessment:', error);
      // Use a more user-friendly error message
      const errorMessage = error.message || 'Failed to submit form. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Stress Assessment"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Save & Continue"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-white mb-2">
            Current stress level (1 = minimal, 10 = severe): {formData.stress_level}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.stress_level}
            onChange={handleSliderChange}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>10</span>
          </div>
        </div>
        
        <div>
          <label className="block text-white mb-2">Primary sources of stress (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonStressors.map(stressor => (
              <div key={stressor} className="flex items-center">
                <input
                  type="checkbox"
                  id={`stressor-${stressor}`}
                  value={stressor}
                  checked={formData.primary_stressors.includes(stressor)}
                  onChange={(e) => handleCheckboxChange(e, 'primary_stressors')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`stressor-${stressor}`} className="ml-2 text-white">
                  {stressor}
                </label>
              </div>
            ))}
          </div>
          
          {formData.primary_stressors.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_stressor"
                value={formData.other_stressor}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other stressor"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2">How does stress manifest for you? (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {stressSymptoms.map(symptom => (
              <div key={symptom} className="flex items-center">
                <input
                  type="checkbox"
                  id={`symptom-${symptom}`}
                  value={symptom}
                  checked={formData.stress_symptoms.includes(symptom)}
                  onChange={(e) => handleCheckboxChange(e, 'stress_symptoms')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`symptom-${symptom}`} className="ml-2 text-white">
                  {symptom}
                </label>
              </div>
            ))}
          </div>
          
          {formData.stress_symptoms.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_symptom"
                value={formData.other_symptom}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other symptoms"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2">Coping mechanisms you use (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {copingMechanisms.map(mechanism => (
              <div key={mechanism} className="flex items-center">
                <input
                  type="checkbox"
                  id={`coping-${mechanism}`}
                  value={mechanism}
                  checked={formData.coping_mechanisms.includes(mechanism)}
                  onChange={(e) => handleCheckboxChange(e, 'coping_mechanisms')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`coping-${mechanism}`} className="ml-2 text-white">
                  {mechanism}
                </label>
              </div>
            ))}
          </div>
          
          {formData.coping_mechanisms.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_coping"
                value={formData.other_coping}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other coping mechanisms"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2 font-medium">How often do you engage in relaxation activities? <span className="text-pink-400">*</span></label>
          <select
            name="relaxation_frequency"
            value={formData.relaxation_frequency}
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
            <option value="" disabled>Select frequency</option>
            {frequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-medium">Quality of your support system <span className="text-pink-400">*</span></label>
            <select
              name="support_system_quality"
              value={formData.support_system_quality}
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
                <option key={`support-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2 font-medium">Work-life balance <span className="text-pink-400">*</span></label>
            <select
              name="work_life_balance"
              value={formData.work_life_balance}
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
                <option key={`balance-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </FormLayout>
  );
};

export default StressForm;
