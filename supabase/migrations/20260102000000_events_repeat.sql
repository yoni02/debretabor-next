-- Add end_time and ensure description column exists (some setups use desc)
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS description TEXT;
-- If table has desc but not description, copy over (run manually if needed)
-- UPDATE events SET description = COALESCE(description, desc) WHERE description IS NULL;
