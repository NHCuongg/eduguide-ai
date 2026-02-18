
import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, primaryKey } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

// --- Auth Tables (NextAuth Standard) ---

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
})

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId]
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
            columns: [verificationToken.identifier, verificationToken.token]
        }),
    })
)

// --- Application Tables ---

export const profiles = pgTable("profile", {
    userId: text("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    targetSkill: text("target_skill"),
    currentLevel: text("current_level"),
    streak: integer("streak").default(0),
    xp: integer("xp").default(0),
    lastActiveDate: timestamp("last_active_date", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const roadmaps = pgTable("roadmap", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: jsonb("content").notNull(), // Stores the detailed AI structure
    status: text("status", { enum: ["active", "completed", "archived"] }).default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const studyModules = pgTable("study_module", {
    id: uuid("id").defaultRandom().primaryKey(),
    roadmapId: uuid("roadmap_id").references(() => roadmaps.id, { onDelete: "cascade" }).notNull(),
    moduleIndex: integer("module_index").notNull(), // To map back to the JSON array index
    title: text("title").notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
    completedAt: timestamp("completed_at"),
})

export const flashcardDecks = pgTable("flashcard_deck", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    topic: text("topic").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const flashcards = pgTable("flashcard", {
    id: uuid("id").defaultRandom().primaryKey(),
    deckId: uuid("deck_id").references(() => flashcardDecks.id, { onDelete: "cascade" }).notNull(),
    front: text("front").notNull(),
    back: text("back").notNull(),
    isMastered: boolean("is_mastered").default(false).notNull(),
    lastReviewed: timestamp("last_reviewed"),
})
