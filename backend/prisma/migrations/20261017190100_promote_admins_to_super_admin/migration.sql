-- The existing admins (the founders) become Super Admins, who alone can appoint
-- other admins and manage monetization. Separate migration because Postgres can't
-- use an enum value in the same transaction that added it.
UPDATE "UserProfile" SET "role" = 'SUPER_ADMIN' WHERE "role" = 'ADMIN';
