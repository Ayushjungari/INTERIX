import { requireAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      // find user in db by clerk ID
      let user = await User.findOne({ clerkId });

      // FALLBACK: if the Inngest webhook never fired (dev, missing webhook, etc.)
      // create the user on-the-fly from Clerk so create/join session never breaks.
      if (!user) {
        try {
          const clerkUser = await clerkClient.users.getUser(clerkId);
          const email =
            clerkUser.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
              ?.emailAddress ||
            clerkUser.emailAddresses?.[0]?.emailAddress ||
            `${clerkId}@no-email.local`;

          const name =
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            clerkUser.username ||
            "User";

          user = await User.findOneAndUpdate(
            { clerkId },
            {
              clerkId,
              email,
              name,
              profileImage: clerkUser.imageUrl || "",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          // best-effort Stream upsert; do NOT fail auth if Stream is down
          await upsertStreamUser({
            id: clerkId,
            name,
            image: clerkUser.imageUrl || "",
          }).catch((e) => console.warn("Stream upsert failed:", e.message));
        } catch (fallbackErr) {
          console.error("Auto-provision user from Clerk failed:", fallbackErr);
          return res
            .status(404)
            .json({ message: "User not found and auto-provisioning failed" });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
