import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AllocatorsPage from './pages/AllocatorsPage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fdzklibcyyrzjbfgufyr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg to-dark-card">
      <AllocatorsPage supabase={supabase} />
    </div>
  );
}

export default App;