import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const waitlistEntries = sqliteTable(
  "waitlist_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    xHandle: text("x_handle").notNull(),
    walletAddress: text("wallet_address").notNull(),
    cardCode: text("card_code").notNull(),
    eligibilityStatus: text("eligibility_status").notNull().default("pending_verification"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    uniqueIndex("waitlist_x_handle_unique").on(table.xHandle),
    uniqueIndex("waitlist_wallet_unique").on(table.walletAddress),
    uniqueIndex("waitlist_card_code_unique").on(table.cardCode),
  ],
);
