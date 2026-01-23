import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ujbjijycqazpcdalrwxv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqYmppanljcWF6cGNkYWxyd3h2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNTQyMTcsImV4cCI6MjA4NDczMDIxN30.e5KEDdmg5qB2vCdiJTqxlwR1NxwGxSSKJF2t3R_zhl4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
