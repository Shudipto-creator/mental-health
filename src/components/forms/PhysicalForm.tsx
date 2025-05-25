import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import FormLayout from './FormLayout';
import './formStyles.css'; // Import custom styles for form elements

const exerciseFrequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'several_times_a_week', label: '3-5 times a week' },
  { value: 'weekly', label: '1-2 times a week' },
  { value: 'rarely', label: 'Rarely (few times a month)' },
  { value: 'never', label: 'Never' },
];

const exerciseIntensityOptions = [
  { value: 'low', label: 'Low (e.g., walking, gentle yoga)' },
  { value: 'moderate', label: 'Moderate (e.g., brisk walking, cycling)' },
  { value: 'high', label: 'High (e.g., running, HIIT, heavy lifting)' },
];

const commonConditions = [
  'Asthma',
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Arthritis',
  'Back Pain',
  'Obesity',
  'None',
  'Other',
];

const bodyParts = [
  'Head',
  'Neck',
  'Shoulders',
  'Arms',
  'Back (Upper)',
  'Back (Lower)',
  'Chest',
  'Abdomen',
  'Hips',
  'Legs',
  'Feet',
  'Joints',
  'None',
];

const PhysicalForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    height_cm: '',
    weight_kg: '',
    exercise_frequency: '',
    exercise_duration_minutes: '',
    exercise_intensity: '',
    physical_limitations: '',
    chronic_conditions: [] as string[],
    pain_areas: [] as string[],
    pain_intensity: 0,
    other_condition: '',
  });
  
  // Add custom styles for range input (slider)
  useEffect(() => {
    const applySliderStyles = () => {
      const sliders = document.querySelectorAll('input[type="range"]');
      sliders.forEach(slider => {
        const value = Number(slider.getAttribute('value'));
        const max = Number(slider.getAttribute('max'));
        const percentage = (value / max) * 100;
        (slider as HTMLElement).style.background = `linear-gradient(to right, #a855f7 0%, #a855f7 ${percentage}%, rgba(255, 255, 255, 0.2) ${percentage}%, rgba(255, 255, 255, 0.2) 100%)`;
      });
    };

    applySliderStyles();

    // Reapply styles when pain intensity changes
    const observer = new MutationObserver(applySliderStyles);
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
      observer.observe(slider, { attributes: true });
    });

    return () => observer.disconnect();
  }, [formData.pain_intensity]);

  // State declarations moved up to fix TypeScript errors
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'chronic_conditions' | 'pain_areas') => {
    const { value, checked } = e.target;
    
    // Create a copy of the current selections
    let newSelections = [...formData[category]];
    
    if (value === 'None' && checked) {
      // If 'None' is selected, clear all other selections
      newSelections = ['None'];
    } else if (checked) {
      // If a non-None option is checked, add it and remove 'None' if present
      newSelections = newSelections.filter(item => item !== 'None');
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
    
    // Log for debugging
    console.log(`Updated ${category}:`, newSelections);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      pain_intensity: parseInt(e.target.value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.height_cm || !formData.weight_kg || !formData.exercise_frequency) {
        throw new Error('Please fill in all required fields');
      }
      
      // Prepare data for submission
      const submissionData = {
        user_id: user.id,
        height_cm: parseFloat(formData.height_cm) || 0,
        weight_kg: parseFloat(formData.weight_kg) || 0,
        exercise_frequency: formData.exercise_frequency,
        exercise_duration_minutes: parseInt(formData.exercise_duration_minutes) || 0,
        exercise_intensity: formData.exercise_intensity || '',
        physical_limitations: formData.physical_limitations || '',
        chronic_conditions: formData.chronic_conditions.includes('Other') 
          ? [...formData.chronic_conditions.filter(c => c !== 'Other'), formData.other_condition]
          : formData.chronic_conditions,
        pain_areas: formData.pain_areas,
        pain_intensity: formData.pain_intensity,
      };
      
      // Submit to Supabase
      const { error } = await supabase
        .from('physical_assessments')
        .insert([submissionData]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Database error: ' + error.message);
      }
      
      // Navigate to next form
      navigate('/nutritional-assessment');
    } catch (error: any) {
      console.error('Error submitting physical assessment:', error);
      // Use a more user-friendly error message
      const errorMessage = error.message || 'Failed to submit form. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Physical Health Assessment"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Save & Continue"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-medium">Height (cm) <span className="text-pink-400">*</span></label>
            <input
              type="number"
              name="height_cm"
              value={formData.height_cm}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your height in cm"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2 font-medium">Weight (kg) <span className="text-pink-400">*</span></label>
            <input
              type="number"
              name="weight_kg"
              value={formData.weight_kg}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
              placeholder="Enter your weight in kg"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white mb-2 font-medium">How often do you exercise? <span className="text-pink-400">*</span></label>
          <select
            name="exercise_frequency"
            value={formData.exercise_frequency}
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
            {exerciseFrequencyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-white mb-2">Average exercise duration (minutes per session)</label>
          <input
            type="number"
            name="exercise_duration_minutes"
            value={formData.exercise_duration_minutes}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter duration in minutes"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Exercise intensity level</label>
          <select
            name="exercise_intensity"
            value={formData.exercise_intensity}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a78bfa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              paddingRight: '40px'
            }}
          >
            <option value="" disabled>Select intensity</option>
            {exerciseIntensityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-white mb-2">Do you have any physical limitations?</label>
          <textarea
            name="physical_limitations"
            value={formData.physical_limitations}
            onChange={handleInputChange}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            placeholder="Describe any physical limitations that affect your daily activities"
          />
        </div>
        
        <div>
          <label className="block text-white mb-2">Chronic health conditions (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonConditions.map(condition => (
              <div key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  id={`condition-${condition}`}
                  value={condition}
                  checked={formData.chronic_conditions.includes(condition)}
                  onChange={(e) => handleCheckboxChange(e, 'chronic_conditions')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`condition-${condition}`} className="ml-2 text-white">
                  {condition}
                </label>
              </div>
            ))}
          </div>
          
          {formData.chronic_conditions.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_condition"
                value={formData.other_condition}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other condition"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2">Areas where you experience pain (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {bodyParts.map(part => (
              <div key={part} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pain-${part}`}
                  value={part}
                  checked={formData.pain_areas.includes(part)}
                  onChange={(e) => handleCheckboxChange(e, 'pain_areas')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`pain-${part}`} className="ml-2 text-white">
                  {part}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {formData.pain_areas.length > 0 && !formData.pain_areas.includes('None') && (
          <div>
            <label className="block text-white mb-2">
              Pain intensity (1 = minimal, 10 = severe): {formData.pain_intensity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.pain_intensity}
              onChange={handleSliderChange}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
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
        )}
      </div>
    </FormLayout>
  );
};

export default PhysicalForm;
