-- Add profile fields used by the auth, onboarding, and profile routes.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "interests" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Store cats added during onboarding.
CREATE TABLE IF NOT EXISTS "Cat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT,
    "age" INTEGER,
    "image" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cat_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Cat_ownerId_idx" ON "Cat"("ownerId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Cat_ownerId_fkey'
  ) THEN
    ALTER TABLE "Cat"
      ADD CONSTRAINT "Cat_ownerId_fkey"
      FOREIGN KEY ("ownerId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Store notification preferences added during onboarding.
CREATE TABLE IF NOT EXISTS "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notifyAdoption" BOOLEAN NOT NULL DEFAULT false,
    "notifyMarketplace" BOOLEAN NOT NULL DEFAULT false,
    "notifyMating" BOOLEAN NOT NULL DEFAULT false,
    "notifyVets" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserPreferences_userId_key" ON "UserPreferences"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserPreferences_userId_fkey'
  ) THEN
    ALTER TABLE "UserPreferences"
      ADD CONSTRAINT "UserPreferences_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
