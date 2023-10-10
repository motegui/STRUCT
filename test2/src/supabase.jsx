import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkdpcpsryixjcglwqfaa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrZHBjcHNyeWl4amNnbHdxZmFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQxMDk4NjAsImV4cCI6MjAwOTY4NTg2MH0.k1K1cSMSTg1L1zRhO9lllu72IGfl1UtRy88FJhahpxY';

export const supabase = createClient(supabaseUrl, supabaseKey);