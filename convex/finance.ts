import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Helper to get authenticated user ID or throw error
const getUserId = async (ctx: any): Promise<Id<"users">> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
};

// === Categories ===

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const addCategory = mutation({
  args: {
    name: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    await ctx.db.insert("categories", {
      userId,
      name: args.name,
      icon: args.icon,
    });
  },
});

export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const category = await ctx.db.get(args.categoryId);

    if (!category || category.userId !== userId) {
      throw new Error("Category not found or user not authorized");
    }

    // Optional: Check if category is used in expenses before deleting
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_category", q => q.eq("userId", userId).eq("categoryId", args.categoryId))
      .first();

    if (expenses) {
      throw new Error("Cannot delete category with associated expenses.");
    }

    await ctx.db.delete(args.categoryId);
  },
});

export const addDefaultCategories = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const existingCategories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first(); // Check if *any* category exists

    if (existingCategories) {
      console.log("User already has categories. Skipping default setup.");
      return; // Don't add defaults if user already has some
    }

    const defaultCategories = [
      { name: "Groceries", icon: "🛒" },
      { name: "Utilities", icon: "💡" },
      { name: "Rent/Mortgage", icon: "🏠" },
      { name: "Transportation", icon: "🚗" },
      { name: "Dining Out", icon: "🍽️" },
      { name: "Entertainment", icon: "🎬" },
      { name: "Shopping", icon: "🛍️" },
      { name: "Health", icon: "❤️" },
      { name: "Insurance", icon: "🛡️" },
      { name: "Debt Payment", icon: "💳" },
      { name: "Personal Care", icon: "🧴" },
      { name: "Gifts/Donations", icon: "🎁" },
      { name: "Other", icon: "❓" },
    ];

    for (const category of defaultCategories) {
      await ctx.db.insert("categories", {
        userId,
        name: category.name,
        icon: category.icon,
      });
    }
  },
});


// === Expenses ===

export const listExpenses = query({
  args: {}, // Add pagination later if needed
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc") // Sort by date descending
      .collect();

    // Fetch category details for each expense
    const expensesWithCategory = await Promise.all(
      expenses.map(async (expense) => {
        const category = await ctx.db.get(expense.categoryId);
        return {
          ...expense,
          categoryName: category?.name ?? "Unknown",
          categoryIcon: category?.icon,
        };
      })
    );
    return expensesWithCategory;
  },
});

export const addExpense = mutation({
  args: {
    amount: v.number(),
    categoryId: v.id("categories"),
    date: v.number(), // Store as timestamp
    description: v.optional(v.string()),
    isRecurring: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);

    // Validate category belongs to user (optional but good practice)
    const category = await ctx.db.get(args.categoryId);
    if (!category || category.userId !== userId) {
      throw new Error("Invalid category selected.");
    }

    await ctx.db.insert("expenses", {
      userId,
      amount: args.amount,
      categoryId: args.categoryId,
      date: args.date,
      description: args.description,
      isRecurring: args.isRecurring,
    });

    // Handle recurring logic later if isRecurring is true
  },
});

export const deleteExpense = mutation({
  args: { expenseId: v.id("expenses") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const expense = await ctx.db.get(args.expenseId);

    if (!expense || expense.userId !== userId) {
      throw new Error("Expense not found or user not authorized");
    }

    await ctx.db.delete(args.expenseId);
  },
});

// === Income ===

export const listIncome = query({
  args: {}, // Add pagination later
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    return await ctx.db
      .query("income")
      .withIndex("by_user_date", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const addIncome = mutation({
  args: {
    amount: v.number(),
    source: v.string(),
    date: v.number(), // Store as timestamp
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    await ctx.db.insert("income", {
      userId,
      amount: args.amount,
      source: args.source,
      date: args.date,
      description: args.description,
    });
  },
});

export const deleteIncome = mutation({
  args: { incomeId: v.id("income") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const income = await ctx.db.get(args.incomeId);

    if (!income || income.userId !== userId) {
      throw new Error("Income record not found or user not authorized");
    }

    await ctx.db.delete(args.incomeId);
  },
});

// === Income Goals ===

export const setIncomeGoal = mutation({
    args: {
        targetAmount: v.number(),
        period: v.literal("monthly"), // Only monthly for now
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        // Check if a goal already exists for this user
        const existingGoal = await ctx.db
            .query("incomeGoals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existingGoal) {
            // Update existing goal
            await ctx.db.patch(existingGoal._id, {
                targetAmount: args.targetAmount,
                period: args.period,
            });
        } else {
            // Insert new goal
            await ctx.db.insert("incomeGoals", {
                userId,
                targetAmount: args.targetAmount,
                period: args.period,
            });
        }
    },
});

export const getIncomeGoal = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getUserId(ctx);
        const goal = await ctx.db
            .query("incomeGoals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first(); // Assuming only one goal per user for now
        return goal; // Returns the goal document or null
    },
});

// === Monthly Summary ===

// Internal helper query to fetch data for a specific month/year
export const getMonthlyData = internalQuery({
  args: { userId: v.id("users"), month: v.number(), year: v.number() },
  handler: async (ctx, args) => {
    const startDate = new Date(args.year, args.month, 1).getTime();
    const endDate = new Date(args.year, args.month + 1, 1).getTime(); // Start of next month

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).gte("date", startDate).lt("date", endDate)
      )
      .collect();

    const income = await ctx.db
      .query("income")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId).gte("date", startDate).lt("date", endDate)
      )
      .collect();

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_user", q => q.eq("userId", args.userId))
      .collect();

    return { expenses, income, categories };
  }
});

// Helper function (can be moved or kept if needed elsewhere)
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '$--.--';
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}






