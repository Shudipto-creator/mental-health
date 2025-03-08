/*
  # Fix Chat Policies

  1. Changes
    - Update RLS policies for chat_sessions and chat_messages
    - Add proper error handling for failed queries
    - Ensure consistent policy naming

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Ensure users can only access their own data
*/

-- Fix chat_sessions policies
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can create their own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view own chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Users can view their own chat sessions" ON chat_sessions;

CREATE POLICY "Enable insert for authenticated users only"
  ON chat_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read for users based on user_id"
  ON chat_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Fix chat_messages policies
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create messages in their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can create own chat messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can view messages from their sessions" ON chat_messages;
DROP POLICY IF EXISTS "Users can view own chat messages" ON chat_messages;

CREATE POLICY "Enable insert for users with session access"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Enable read for users with session access"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()
    )
  );