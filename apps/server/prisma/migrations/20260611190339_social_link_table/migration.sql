-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_userId_platform_key" ON "SocialLink"("userId", "platform");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Backfill from the legacy Profile handle columns (handles -> full URLs)
INSERT INTO "SocialLink" ("id", "userId", "platform", "url", "order")
SELECT gen_random_uuid()::text, "userId", 'github', 'https://github.com/' || "github", 0
FROM "Profile" WHERE "github" IS NOT NULL AND "github" <> '';

INSERT INTO "SocialLink" ("id", "userId", "platform", "url", "order")
SELECT gen_random_uuid()::text, "userId", 'linkedin', 'https://linkedin.com/in/' || "linkedin", 1
FROM "Profile" WHERE "linkedin" IS NOT NULL AND "linkedin" <> '';

INSERT INTO "SocialLink" ("id", "userId", "platform", "url", "order")
SELECT gen_random_uuid()::text, "userId", 'twitter', 'https://x.com/' || "twitter", 2
FROM "Profile" WHERE "twitter" IS NOT NULL AND "twitter" <> '';

INSERT INTO "SocialLink" ("id", "userId", "platform", "url", "order")
SELECT gen_random_uuid()::text, "userId", 'instagram', 'https://instagram.com/' || "instagram", 3
FROM "Profile" WHERE "instagram" IS NOT NULL AND "instagram" <> '';
