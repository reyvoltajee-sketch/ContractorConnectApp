import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    supabaseUrl: process.env.SUPABASE_URL || 'https://wtdkgbdrmilpbdqpynym.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZGtnYmRybWlscGJkcXB5bnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjc4NTMsImV4cCI6MjA4MDgwMzg1M30.Tdhhfo68DqXiO0jX65GNopuushplBBI5riDjqA7OILE',
  },
});
