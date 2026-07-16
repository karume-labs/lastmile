import { db } from "@lastmile/db/client";
import { disbursements } from "@lastmile/db/schemas/programmes";
import { and, eq } from "drizzle-orm";

export const relayerService = {
  /**
   * Unlocks funds upon successful OTP verification via USSD.
   * In production, this constructs and submits the Soroban transaction.
   */
  async unlockFunds(referenceId: string): Promise<boolean> {
    try {
      const result = await db
        .update(disbursements)
        .set({ status: "claimed" })
        .where(and(eq(disbursements.referenceId, referenceId), eq(disbursements.status, "pending")))
        .returning({ id: disbursements.id });

      return result.length > 0;
    } catch (error) {
      console.error("Relayer execution failed:", error);
      return false;
    }
  },
};
