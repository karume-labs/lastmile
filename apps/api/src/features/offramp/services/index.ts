export const kotaniPaySimulation = {
  processPayout: async (
    phoneNumber: string,
    amountUsdc: number,
    referenceId: string,
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> => {
    // In a real scenario, this would call the Kotani Pay API to offramp the USDC to mobile money (M-PESA)
    // and wait for the webhook response.
    
    console.log(`[KotaniPay] Simulating offramp of ${amountUsdc} USDC to ${phoneNumber} for ${referenceId}`);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    const isSuccess = Math.random() < 0.95;

    if (isSuccess) {
      return {
        success: true,
        transactionHash: `kp_txn_${Math.random().toString(36).substring(7)}`,
      };
    } else {
      return {
        success: false,
        error: "Simulation Error: Insufficient liquidity or network failure",
      };
    }
  },
};
