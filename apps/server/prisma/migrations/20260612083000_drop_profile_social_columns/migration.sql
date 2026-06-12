-- Legacy handle columns; data was backfilled into "SocialLink" in
-- 20260611190339_social_link_table.
ALTER TABLE "Profile"
  DROP COLUMN "github",
  DROP COLUMN "instagram",
  DROP COLUMN "twitter",
  DROP COLUMN "linkedin";
