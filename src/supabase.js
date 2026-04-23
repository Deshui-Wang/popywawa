import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ioyxvsteumnedbdlzfpw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXh2c3RldW1uZWRiZGx6ZnB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MDk3NDAsImV4cCI6MjA5MjQ4NTc0MH0.bEDi2FpCLBesqzyoXvHoFkGu9UYMHqnMC9iOhCKDJkM'

export const supabase = createClient(supabaseUrl, supabaseKey)
