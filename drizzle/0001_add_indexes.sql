-- Performance indexes for hot query paths.
-- Safe to run against an existing DB (IF NOT EXISTS).

CREATE INDEX IF NOT EXISTS "account_user_idx" ON "account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_idx" ON "session" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roadmap_user_idx" ON "roadmap" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "roadmap_user_status_idx" ON "roadmap" ("userId", "status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "study_module_roadmap_idx" ON "study_module" ("roadmap_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flashcard_deck_user_idx" ON "flashcard_deck" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "flashcard_deck_idx" ON "flashcard" ("deck_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_user_idx" ON "note" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "note_user_updated_idx" ON "note" ("userId", "updated_at");
