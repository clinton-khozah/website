-- Remove Professional and Enterprise storage plans
-- This will deactivate them so they don't show up in the UI

UPDATE storage_plans
SET is_active = FALSE
WHERE name IN ('Professional', 'Enterprise');

-- Or if you want to completely delete them (uncomment the line below):
-- DELETE FROM storage_plans WHERE name IN ('Professional', 'Enterprise');

