-- Gallery folders: categories or events that group photos
CREATE TABLE IF NOT EXISTS gallery_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add folder_id to gallery_photos (nullable: photos can be uncategorized)
ALTER TABLE gallery_photos ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES gallery_folders(id) ON DELETE SET NULL;

-- Index for filtering photos by folder
CREATE INDEX IF NOT EXISTS idx_gallery_photos_folder_id ON gallery_photos(folder_id);

-- Optional: trigger to update folder updated_at
CREATE OR REPLACE FUNCTION update_gallery_folder_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS gallery_folders_updated_at ON gallery_folders;
CREATE TRIGGER gallery_folders_updated_at
  BEFORE UPDATE ON gallery_folders
  FOR EACH ROW EXECUTE FUNCTION update_gallery_folder_updated_at();

