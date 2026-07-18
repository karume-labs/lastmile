export const kotaniPaySimulation = {
  processPayout: async (
    phoneNumber: string,
    amountUsdc: number,
    referenceId: string,
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    console.log(
      `[KotaniPay] Simulating offramp of ${amountUsdc} USDC to ${phoneNumber} for ${referenceId}`,
    );

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const isSuccess = Math.random() < 0.95;

    if (isSuccess) {
      const { stellarRelayer } = await import("../../../lib/stellar");
      const result = await stellarRelayer.executeDisbursementClaim(referenceId, amountUsdc);

      return {
        success: true,
        transactionHash: result.transactionHash,
      };
    } else {
      return {
        success: false,
        error: "Simulation Error: Insufficient liquidity or network failure",
      };
    }
  },
};
