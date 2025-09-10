/*
  # Make user_id nullable in registrations table

  1. Changes
    - Make user_id column nullable to allow registrations without authentication
    - Update RLS policies to allow anonymous registrations
  
  2. Security
    - Allow anonymous users to insert registrations
    - Allow anyone to read registrations (for admin purposes)
*/

-- Make user_id nullable
ALTER TABLE registrations ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Authenticated users can insert their own registrations" ON registrations;
DROP POLICY IF EXISTS "Users can read their own registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update their own registrations" ON registrations;

-- Create new policies that allow anonymous access
CREATE POLICY "Anyone can insert registrations"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read registrations"
  ON registrations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update registrations"
  ON registrations
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);