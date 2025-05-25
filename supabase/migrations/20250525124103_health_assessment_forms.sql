/*
  # Health Assessment Forms

  1. Changes
    - Create tables for physical_assessments, nutritional_assessments, sleep_assessments, and stress_assessments
    - Add RLS policies for each table
    - Create triggers for updated_at

  2. Security
    - Enable RLS
    - Add policies for authenticated users
    - Ensure proper user_id handling
*/

-- Physical Assessment Table
CREATE TABLE physical_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  height_cm numeric,
  weight_kg numeric,
  exercise_frequency text, -- e.g., 'daily', 'weekly', 'rarely', 'never'
  exercise_duration_minutes integer,
  exercise_intensity text, -- e.g., 'low', 'moderate', 'high'
  physical_limitations text,
  chronic_conditions text[],
  pain_areas text[],
  pain_intensity integer, -- Scale 1-10
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Nutritional Assessment Table
CREATE TABLE nutritional_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  meals_per_day integer,
  water_intake_liters numeric,
  diet_type text, -- e.g., 'omnivore', 'vegetarian', 'vegan', 'keto', etc.
  food_allergies text[],
  dietary_restrictions text[],
  supplement_use boolean,
  supplement_details text,
  caffeine_consumption text, -- e.g., 'none', 'low', 'moderate', 'high'
  alcohol_consumption text, -- e.g., 'none', 'occasional', 'regular', 'heavy'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sleep Assessment Table
CREATE TABLE sleep_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  average_sleep_hours numeric,
  sleep_quality text, -- e.g., 'poor', 'fair', 'good', 'excellent'
  bedtime_consistency boolean,
  falling_asleep_difficulty boolean,
  staying_asleep_difficulty boolean,
  waking_up_difficulty boolean,
  sleep_aids_use boolean,
  sleep_aids_details text,
  sleep_environment_quality text, -- e.g., 'poor', 'fair', 'good', 'excellent'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stress Assessment Table
CREATE TABLE stress_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  stress_level integer, -- Scale 1-10
  primary_stressors text[],
  stress_symptoms text[],
  coping_mechanisms text[],
  relaxation_frequency text, -- e.g., 'daily', 'weekly', 'rarely', 'never'
  support_system_quality text, -- e.g., 'poor', 'fair', 'good', 'excellent'
  work_life_balance text, -- e.g., 'poor', 'fair', 'good', 'excellent'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE physical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutritional_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stress_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for physical_assessments
CREATE POLICY "Users can read own physical assessments"
  ON physical_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own physical assessments"
  ON physical_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own physical assessments"
  ON physical_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for nutritional_assessments
CREATE POLICY "Users can read own nutritional assessments"
  ON nutritional_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own nutritional assessments"
  ON nutritional_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutritional assessments"
  ON nutritional_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for sleep_assessments
CREATE POLICY "Users can read own sleep assessments"
  ON sleep_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep assessments"
  ON sleep_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep assessments"
  ON sleep_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for stress_assessments
CREATE POLICY "Users can read own stress assessments"
  ON stress_assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stress assessments"
  ON stress_assessments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own stress assessments"
  ON stress_assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at for all tables
CREATE TRIGGER set_physical_assessments_updated_at
  BEFORE UPDATE ON physical_assessments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_nutritional_assessments_updated_at
  BEFORE UPDATE ON nutritional_assessments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_sleep_assessments_updated_at
  BEFORE UPDATE ON sleep_assessments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_stress_assessments_updated_at
  BEFORE UPDATE ON stress_assessments
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
