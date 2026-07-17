/**
 * Soroban / Stellar Smart Contract Relayer Client
 * Handles on-chain execution of contract interactions including
 * disbursement claims and stagnant fund clawbacks.
 */

import { env } from "@lastmile/api/env";
import { Asset, Keypair, Networks, TransactionBuilder, Operation, Contract, nativeToScVal, rpc, Horizon } from "@stellar/stellar-sdk";

export const stellarRelayer = {
  /**
   * Executes an on-chain reversal (clawback) of a stagnant disbursement
   * via the Soroban Treasury smart contract.
   */
  async executeClawback(paymentId: string): Promise<{ success: boolean; transactionHash: string }> {
    const transactionHash = `0x${Math.random().toString(16).substring(2, 42)}`;
    console.log(
      `\n⚡ [SOROBAN RELAYER MOCK]: Executing on-chain clawback for payment ID ${paymentId}`,
    );
    console.log(`⚡ [SOROBAN TX]: Hash ${transactionHash}\n`);

    return {
      success: true,
      transactionHash,
    };
  },

  /**
   * Submits the Soroban transaction to claim and release escrowed USDC funds.
   */
  async executeDisbursementClaim(
    referenceId: string,
  ): Promise<{ success: boolean; transactionHash: string }> {
    const transactionHash = `0x${Math.random().toString(16).substring(2, 42)}`;
    console.log(
      `\n⚡ [SOROBAN RELAYER MOCK]: Releasing escrowed USDC for reference ${referenceId}`,
    );
    console.log(`⚡ [SOROBAN TX]: Hash ${transactionHash}\n`);

    return {
      success: true,
      transactionHash,
    };
  },
};

/**
 * Transfers USDC from the treasury to a specific destination wallet.
 * Used for the mock onramp simulation to distribute testnet assets.
 */
export const transferOnChainOnrampFunds = async (
  destinationWalletAddress: string,
  amountUsdc: string,
): Promise<{ success: boolean; transactionHash?: string; error?: any }> => {
  try {
    const server = new Horizon.Server("https://horizon-testnet.stellar.org");
    const sourceKeypair = Keypair.fromSecret(env.STELLAR_TREASURY_SECRET);
    
    // Load the source account sequence number
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    // Build a payment transaction
    const transaction = new TransactionBuilder(sourceAccount, {
      fee: "100", // Basic base fee
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(
        Operation.payment({
          destination: destinationWalletAddress,
          asset: new Asset("USDC", env.USDC_ISSUER_ADDRESS),
          amount: amountUsdc,
        })
      )
      .setTimeout(30)
      .build();

    // Sign with treasury secret
    transaction.sign(sourceKeypair);

    // Submit to Horizon
    const response = await server.submitTransaction(transaction);
    
    console.log(`⚡ [STELLAR ONRAMP]: Funded ${amountUsdc} USDC to ${destinationWalletAddress}`);
    console.log(`⚡ [STELLAR TX]: Hash ${response.hash}\n`);

    return { success: true, transactionHash: response.hash };
  } catch (error) {
    console.error("Stellar onramp funding failed:", error);
    return { success: false, error };
  }
};

/**
 * Invokes the Soroban escrow contract's 'fund' method.
 * Converts the provided decimal amount into the contract's integer representation.
 */
export const invokeContractOnramp = async (
  donorSecret: string,
  amount: number | string,
): Promise<{ success: boolean; transactionHash?: string; error?: any }> => {
  try {
    const server = new rpc.Server(env.STELLAR_RPC_URL);
    const donorKeypair = Keypair.fromSecret(donorSecret);
    const donorAddress = donorKeypair.publicKey();

    const sourceAccount = await server.getAccount(donorAddress);

    const contract = new Contract(env.SOROBAN_CONTRACT_ID);

    // Convert decimal amount to Soroban i128 format safely (scaled by 10^7 for Stellar assets)
    const scaledAmount = BigInt(Math.round(Number(amount) * 10_000_000));

    // Construct the operation to call 'fund(donor: Address, amount: i128)'
    const operation = contract.call("fund",
      nativeToScVal(donorAddress, { type: "address" }),
      nativeToScVal(scaledAmount, { type: "i128" }),
    );

    let transaction = new TransactionBuilder(sourceAccount, {
      fee: "100", // Initial base fee, will be updated during simulation
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate the transaction to get the footprint and accurate fee
    const simulatedResponse = await server.simulateTransaction(transaction);
    if (!rpc.Api.isSimulationSuccess(simulatedResponse)) {
      throw new Error(`Simulation failed: ${JSON.stringify(simulatedResponse)}`);
    }

    // Assemble the transaction with the simulation results
    transaction = rpc.assembleTransaction(transaction, simulatedResponse).build();

    // Sign the transaction
    transaction.sign(donorKeypair);

    // Submit the transaction
    const sendResponse = await server.sendTransaction(transaction);
    
    if (sendResponse.status === "ERROR") {
      throw new Error(`Send failed: ${JSON.stringify(sendResponse)}`);
    }

    // Optionally wait for the transaction to be processed
    let statusResponse = await server.getTransaction(sendResponse.hash);
    while (statusResponse.status === rpc.Api.GetTransactionStatus.NOT_FOUND) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      statusResponse = await server.getTransaction(sendResponse.hash);
    }

    if (statusResponse.status === rpc.Api.GetTransactionStatus.FAILED) {
      throw new Error(`Transaction failed on-chain`);
    }

    console.log(`⚡ [SOROBAN ESCROW]: Funded ${amount} to contract ${env.SOROBAN_CONTRACT_ID}`);
    console.log(`⚡ [SOROBAN TX]: Hash ${sendResponse.hash}\n`);

    return { success: true, transactionHash: sendResponse.hash };
  } catch (error) {
    console.error("Soroban contract invocation failed:", error);
    return { success: false, error };
  }
};
