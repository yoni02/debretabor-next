# Gallery Folders

The gallery supports organizing photos into folders (categories or events). Each folder has a title and thumbnail (auto-generated from the first photo).

## Database Setup

Run this migration in your Supabase SQL editor to create the `gallery_folders` table and add `folder_id` to `gallery_photos`:

```sql
-- Run the contents of: supabase/migrations/20260101000000_gallery_folders.sql
```

Or run via Supabase CLI:
```bash
supabase db push
```

## Usage

- **Public gallery**: Shows folder cards (thumbnail + title). Click a folder to see its photos. "All Photos" shows everything.
- **Admin**: Use "Manage Folders" to create, edit, and delete folders. When uploading or editing photos, assign them to a folder.
