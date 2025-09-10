/*
  # Add user_id column to registrations table

  1. Changes
    - Add `user_id` column to `registrations` table
    - Update RLS policies to use user_id for authentication
    - Create proper INSERT policy for authenticated users

  2. Security
    - Update RLS policies to allow authenticated users to insert their own registrations
    - Ensure users can only access their own registration data
*/

-- Add user_id column to registrations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE registrations ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can register" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can read registrations" ON registrations;

-- Create new RLS policies
CREATE POLICY "Authenticated users can insert their own registrations"
  ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);