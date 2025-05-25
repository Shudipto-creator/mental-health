import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import FormLayout from './FormLayout';
import './formStyles.css'; // Import custom styles for form elements

const dietTypes = [
  { value: 'omnivore', label: 'Omnivore (meat and plants)' },
  { value: 'pescatarian', label: 'Pescatarian (fish and plants)' },
  { value: 'vegetarian', label: 'Vegetarian (no meat)' },
  { value: 'vegan', label: 'Vegan (no animal products)' },
  { value: 'keto', label: 'Keto (low carb, high fat)' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'gluten_free', label: 'Gluten-free' },
  { value: 'dairy_free', label: 'Dairy-free' },
  { value: 'other', label: 'Other' },
];

const commonAllergies = [
  'Dairy',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soy',
  'None',
  'Other',
];

const dietaryRestrictions = [
  'Gluten',
  'Dairy',
  'Sugar',
  'Processed Foods',
  'Red Meat',
  'Alcohol',
  'Caffeine',
  'None',
  'Other',
];

const consumptionLevels = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'high', label: 'High' },
];

const NutritionalForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    meals_per_day: '',
    water_intake_liters: '',
    diet_type: '',
    food_allergies: [] as string[],
    dietary_restrictions: [] as string[],
    supplement_use: false,
    supplement_details: '',
    caffeine_consumption: '',
    alcohol_consumption: '',
    other_diet_type: '',
    other_allergies: '',
    other_restrictions: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'food_allergies' | 'dietary_restrictions') => {
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
      if (!formData.meals_per_day || !formData.water_intake_liters || !formData.diet_type ||
          !formData.caffeine_consumption || !formData.alcohol_consumption) {
        throw new Error('Please fill in all required fields');
      }
      
      // Prepare data for submission
      const submissionData = {
        user_id: user.id,
        meals_per_day: parseInt(formData.meals_per_day) || 0,
        water_intake_liters: parseFloat(formData.water_intake_liters) || 0,
        diet_type: formData.diet_type === 'other' ? formData.other_diet_type : formData.diet_type,
        food_allergies: formData.food_allergies.includes('Other') 
          ? [...formData.food_allergies.filter(a => a !== 'Other'), formData.other_allergies]
          : formData.food_allergies,
        dietary_restrictions: formData.dietary_restrictions.includes('Other') 
          ? [...formData.dietary_restrictions.filter(r => r !== 'Other'), formData.other_restrictions]
          : formData.dietary_restrictions,
        supplement_use: formData.supplement_use,
        supplement_details: formData.supplement_details || '',
        caffeine_consumption: formData.caffeine_consumption,
        alcohol_consumption: formData.alcohol_consumption,
      };
      
      // Submit to Supabase
      const { error } = await supabase
        .from('nutritional_assessments')
        .insert([submissionData]);
      
      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Database error: ' + error.message);
      }
      
      // Navigate to next form
      navigate('/sleep-assessment');
    } catch (error: any) {
      console.error('Error submitting nutritional assessment:', error);
      // Use a more user-friendly error message
      const errorMessage = error.message || 'Failed to submit form. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormLayout
      title="Nutritional Assessment"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitButtonText="Save & Continue"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-medium">How many meals do you eat per day? <span className="text-pink-400">*</span></label>
            <input
              type="number"
              name="meals_per_day"
              value={formData.meals_per_day}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
              placeholder="Number of meals"
              min="1"
              max="10"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2 font-medium">Daily water intake (liters) <span className="text-pink-400">*</span></label>
            <input
              type="number"
              name="water_intake_liters"
              value={formData.water_intake_liters}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400"
              placeholder="Liters of water"
              step="0.1"
              min="0"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white mb-2 font-medium">Diet type <span className="text-pink-400">*</span></label>
          <select
            name="diet_type"
            value={formData.diet_type}
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
            <option value="" disabled>Select diet type</option>
            {dietTypes.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {formData.diet_type === 'other' && (
            <div className="mt-2">
              <input
                type="text"
                name="other_diet_type"
                value={formData.other_diet_type}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify your diet type"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2">Food allergies (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {commonAllergies.map(allergy => (
              <div key={allergy} className="flex items-center">
                <input
                  type="checkbox"
                  id={`allergy-${allergy}`}
                  value={allergy}
                  checked={formData.food_allergies.includes(allergy)}
                  onChange={(e) => handleCheckboxChange(e, 'food_allergies')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`allergy-${allergy}`} className="ml-2 text-white">
                  {allergy}
                </label>
              </div>
            ))}
          </div>
          
          {formData.food_allergies.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_allergies"
                value={formData.other_allergies}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other allergies"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-white mb-2">Dietary restrictions (select all that apply)</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {dietaryRestrictions.map(restriction => (
              <div key={restriction} className="flex items-center">
                <input
                  type="checkbox"
                  id={`restriction-${restriction}`}
                  value={restriction}
                  checked={formData.dietary_restrictions.includes(restriction)}
                  onChange={(e) => handleCheckboxChange(e, 'dietary_restrictions')}
                  className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
                />
                <label htmlFor={`restriction-${restriction}`} className="ml-2 text-white">
                  {restriction}
                </label>
              </div>
            ))}
          </div>
          
          {formData.dietary_restrictions.includes('Other') && (
            <div className="mt-2">
              <input
                type="text"
                name="other_restrictions"
                value={formData.other_restrictions}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Specify other restrictions"
              />
            </div>
          )}
        </div>
        
        <div>
          <div className="mb-2">
            <input
              type="checkbox"
              id="supplement_use"
              name="supplement_use"
              checked={formData.supplement_use}
              onChange={handleToggleChange}
              className="w-5 h-5 rounded border-white/30 bg-black/30 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 focus:ring-offset-transparent cursor-pointer"
            />
            <label htmlFor="supplement_use" className="ml-2 text-white">
              Do you take any supplements or vitamins?
            </label>
          </div>
          
          {formData.supplement_use && (
            <textarea
              name="supplement_details"
              value={formData.supplement_details}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
              placeholder="Please list the supplements you take and how often"
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2 font-medium">Caffeine consumption <span className="text-pink-400">*</span></label>
            <select
              name="caffeine_consumption"
              value={formData.caffeine_consumption}
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
              <option value="" disabled>Select level</option>
              {consumptionLevels.map(option => (
                <option key={`caffeine-${option.value}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white mb-2 font-medium">Alcohol consumption <span className="text-pink-400">*</span></label>
            <select
              name="alcohol_consumption"
              value={formData.alcohol_consumption}
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
              <option value="" disabled>Select level</option>
              {consumptionLevels.map(option => (
                <option key={`alcohol-${option.value}`} value={option.value}>
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

export default NutritionalForm;
