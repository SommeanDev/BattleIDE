import { verifyToken } from "@clerk/backend";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../db/models/User.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("Auth Error: No token provided in Authorization header");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    if (!process.env.CLERK_SECRET_KEY) {
      console.error("Auth Error: Missing CLERK_SECRET_KEY from .env file");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    // ✅ Increased clock tolerance
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      clockSkewInSeconds: 120, // allow 2 minutes drift
    });


    if (!payload?.sub) {
      console.error("Auth Error: No userId (sub) found in Clerk token payload");
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const clerkUserId = payload.sub;
    console.log("✅ Clerk user verified:", clerkUserId);

    let user = await User.findOne({ authId: clerkUserId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      user = new User({
        authId: clerkUserId,
        username:
          clerkUser.username ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        rating: 1200,
        avatarUrl: clerkUser.imageUrl,
      });
      await user.save();
      console.log(`🆕 New user created in DB: ${user.username}`);
    }

    req.user = { id: user._id, authId: user.authId };
    next();
  } catch (err) {
    console.error(`❌ Auth Error: ${err.message}`);
    if (err.errors) console.error("Clerk Error Details:", err.errors);
    return res.status(401).json({
      error: "Unauthenticated",
      details: err.message,
    });
  }
};
