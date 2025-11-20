"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

// Returns array of uppercased stock symbols in user's watchlist
export const getWatchlistSymbolsByEmail = async (
  email: string,
): Promise<string[]> => {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection not established");

    // Find user in Better Auth users collection
    const user = await db
      .collection("users")
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();

    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("Error fetching watchlist symbols by email:", err);
    return [];
  }
};
