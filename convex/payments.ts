import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
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

// Check if user has paid for the app
export const getUserPaymentStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    
    return {
      hasPaid: true, // Temporarily return true for demo
      paymentDate: payment?.paymentDate,
      stripeSessionId: payment?.stripeSessionId,
    };
  },
});

// TODO: Implement Stripe checkout session



// Internal mutation to create pending payment
export const createPendingPayment = internalMutation({
  args: {
    userId: v.id("users"),
    stripeSessionId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if payment record already exists
    const existing = await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Update existing record
      await ctx.db.patch(existing._id, {
        stripeSessionId: args.stripeSessionId,
        amount: args.amount,
        isPaid: false,
      });
    } else {
      // Create new record
      await ctx.db.insert("payments", {
        userId: args.userId,
        stripeSessionId: args.stripeSessionId,
        amount: args.amount,
        isPaid: false,
      });
    }
  },
});

// Internal query to get payment by user
export const getPaymentByUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Internal mutation to mark payment as completed
export const markPaymentCompleted = internalMutation({
  args: {
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripe_session", (q) => q.eq("stripeSessionId", args.stripeSessionId))
      .first();

    if (!payment) {
      throw new Error("Payment record not found");
    }

    await ctx.db.patch(payment._id, {
      isPaid: true,
      paymentDate: Date.now(),
    });

    return payment.userId;
  },
});

// TODO: Implement Stripe webhook handler
