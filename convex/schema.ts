import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  expenses: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    categoryId: v.id("categories"),
    date: v.number(),
    description: v.optional(v.string()),
    isRecurring: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"])
    .index("by_user_category", ["userId", "categoryId"]),

  income: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    source: v.string(),
    date: v.number(),
    description: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),

  incomeGoals: defineTable({
    userId: v.id("users"),
    targetAmount: v.number(),
    period: v.literal("monthly"),
  }).index("by_user", ["userId"]),

  payments: defineTable({
    userId: v.id("users"),
    stripeSessionId: v.string(),
    amount: v.number(),
    isPaid: v.boolean(),
    paymentDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_session", ["stripeSessionId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
