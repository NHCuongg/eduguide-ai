
import { pgTable, text, timestamp, boolean, uuid, integer, jsonb, primaryKey, index } from "drizzle-orm/pg-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    password: text("password"),
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
        userIdx: index("account_user_idx").on(account.userId),
    })
)

export const sessions = pgTable(
    "session",
    {
        sessionToken: text("sessionToken").primaryKey(),
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (table) => ({
        userIdx: index("session_user_idx").on(table.userId),
    })
)

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

export const profiles = pgTable("profile", {
    userId: text("userId").primaryKey().references(() => users.id, { onDelete: "cascade" }),
    targetSkill: text("target_skill"),
    currentLevel: text("current_level"),
    onboardingData: jsonb("onboarding_data"), 
    streak: integer("streak").default(0),
    xp: integer("xp").default(0),
    lastActiveDate: timestamp("last_active_date", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const roadmaps = pgTable(
    "roadmap",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        content: jsonb("content").notNull(),
        status: text("status", { enum: ["active", "completed", "archived"] }).default("active").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userIdx: index("roadmap_user_idx").on(table.userId),
        userStatusIdx: index("roadmap_user_status_idx").on(table.userId, table.status),
    })
)

export const studyModules = pgTable(
    "study_module",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        roadmapId: uuid("roadmap_id").references(() => roadmaps.id, { onDelete: "cascade" }).notNull(),
        moduleIndex: integer("module_index").notNull(),
        title: text("title").notNull(),
        isCompleted: boolean("is_completed").default(false).notNull(),
        completedAt: timestamp("completed_at"),
    },
    (table) => ({
        roadmapIdx: index("study_module_roadmap_idx").on(table.roadmapId),
    })
)

export const flashcardDecks = pgTable(
    "flashcard_deck",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        topic: text("topic").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        userIdx: index("flashcard_deck_user_idx").on(table.userId),
    })
)

export const flashcards = pgTable(
    "flashcard",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        deckId: uuid("deck_id").references(() => flashcardDecks.id, { onDelete: "cascade" }).notNull(),
        front: text("front").notNull(),
        back: text("back").notNull(),
        isMastered: boolean("is_mastered").default(false).notNull(),
        lastReviewed: timestamp("last_reviewed"),
    },
    (table) => ({
        deckIdx: index("flashcard_deck_idx").on(table.deckId),
    })
)

export const notes = pgTable(
    "note",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
        title: text("title").notNull(),
        content: text("content").default("").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    },
    (table) => ({
        userIdx: index("note_user_idx").on(table.userId),
        userUpdatedIdx: index("note_user_updated_idx").on(table.userId, table.updatedAt),
    })
)
