import { query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api"; // Explicitly import api and internal

// Helper to get authenticated user ID or throw error
const getUserId = async (ctx: any): Promise<Id<"users">> => {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  return userId;
};

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

// Public query for the monthly summary
export const getMonthlySummary = query({
  args: { month: v.number(), year: v.number() },
  handler: async (ctx, args): Promise<{
    totalExpenses: number;
    totalIncome: number;
    totalNetWorth: number;
    expensesByCategory: Array<{
      categoryId: Id<"categories">;
      name: string;
      icon?: string;
      value: number;
    }>;
    incomeBySource: Array<{
      name: string;
      value: number;
    }>;
  }> => {
    const userId = await getUserId(ctx);
    // Ensure the internal function reference is correct
    const { expenses, income, categories }: {
      expenses: any[];
      income: any[];
      categories: any[];
    } = await ctx.runQuery(internal.summaries.getMonthlyData, { userId, month: args.month, year: args.year });

    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    const totalIncome = income.reduce((sum: number, inc: any) => sum + inc.amount, 0);

    // Calculate expenses by category
    const categoryMap = new Map(categories.map((cat: any) => [cat._id, { name: cat.name, icon: cat.icon }]));
    const expensesByCategoryMap = new Map<Id<"categories">, number>();

    for (const expense of expenses) {
      expensesByCategoryMap.set(
        expense.categoryId,
        (expensesByCategoryMap.get(expense.categoryId) || 0) + expense.amount
      );
    }

    const expensesByCategory = Array.from(expensesByCategoryMap.entries())
      .map(([categoryId, value]) => ({
        categoryId,
        name: (categoryMap.get(categoryId) as any)?.name ?? "Unknown",
        icon: (categoryMap.get(categoryId) as any)?.icon,
        value,
      }))
      .sort((a, b) => b.value - a.value); // Sort descending by value

    // Calculate income by source
    const incomeBySourceMap = new Map<string, number>();
    for (const inc of income) {
        incomeBySourceMap.set(
            inc.source,
            (incomeBySourceMap.get(inc.source) || 0) + inc.amount
        );
    }
    const incomeBySource = Array.from(incomeBySourceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort descending

    // Simple Net Worth for now (Income - Expenses for the month)
    const totalNetWorth = totalIncome - totalExpenses;

    return {
      totalExpenses,
      totalIncome,
      totalNetWorth,
      expensesByCategory,
      incomeBySource,
    };
  },
});
