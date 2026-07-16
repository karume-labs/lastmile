import { sdpAdapter } from "../../integrations/sdp";
import { logAudit } from "../../audit";
import { participantRepository } from "../../registration/repositories/participant.repository";
import { disbursementRepository } from "../repositories/disbursement.repository";
import { Disbursement, DisbursementStatus, Participant, Proxy } from "@prisma/client";
import { logger } from "../../../config/logger";

export class DisbursementService {
  /**
   * Syncs all disbursements from the Stellar Disbursement Platform (SDP).
   * Discovers new disbursements and updates statuses of existing ones.
   */
  async syncDisbursements(): Promise<void> {
    try {
      const remoteDisbursements = await sdpAdapter.listDisbursements();

      for (const remote of remoteDisbursements) {
        // Find local participant
        const participant = await participantRepository.findByReferenceId(remote.participantReferenceId);
        if (!participant) {
          logger.error(`Failed to sync disbursement: participant not found for reference ID ${remote.participantReferenceId}`, {
            sdpId: remote.sdpId,
          });
          continue;
        }

        // Check if disbursement already exists locally
        const existing = await disbursementRepository.findBySdpId(remote.sdpId);

        // Upsert the record
        const updated = await disbursementRepository.upsertBySdpId(remote.sdpId, {
          participantId: participant.id,
          amount: remote.amount,
          status: remote.status,
        });

        if (!existing) {
          // It's a new disbursement
          await logAudit({
            userId: null,
            action: "DISBURSEMENT_DISCOVERED",
            details: `Disbursement ${remote.sdpId} of ${remote.amount} ${remote.currency} discovered for participant ${remote.participantReferenceId}`,
          });
        } else if (existing.status !== remote.status) {
          // Status changed
          await logAudit({
            userId: null,
            action: "DISBURSEMENT_STATUS_SYNCED",
            details: `Disbursement ${remote.sdpId} status synced from ${existing.status} to ${remote.status}`,
          });
        }
      }
    } catch (error) {
      logger.error("Failed to sync disbursements from SDP", { error });
      throw error;
    }
  }

  /**
   * Triggers an on-demand status refresh for a specific disbursement.
   */
  async retrySync(id: string, adminUserId?: string): Promise<Disbursement> {
    const disbursement = await disbursementRepository.findById(id);
    if (!disbursement) {
      throw new Error(`Disbursement not found with ID: ${id}`);
    }

    try {
      const remote = await sdpAdapter.getDisbursementStatus(disbursement.sdpId);

      const updated = await disbursementRepository.upsertBySdpId(disbursement.sdpId, {
        participantId: disbursement.participantId,
        amount: Number(disbursement.amount),
        status: remote.status,
      });

      if (disbursement.status !== remote.status) {
        await logAudit({
          userId: adminUserId || null,
          action: "DISBURSEMENT_STATUS_SYNCED",
          details: `Disbursement ${disbursement.sdpId} status manually retried/synced from ${disbursement.status} to ${remote.status}`,
        });
      }

      return updated;
    } catch (error) {
      logger.error(`Failed to retry/sync disbursement ${disbursement.sdpId}`, { error });
      throw error;
    }
  }

  /**
   * Get all local disbursements.
   */
  async getAllDeliveries(): Promise<(Disbursement & { participant: Participant & { proxy: Proxy | null } })[]> {
    return disbursementRepository.findAll();
  }

  /**
   * Get all local stagnant disbursements (status is PENDING).
   */
  async getStagnantFunds(): Promise<(Disbursement & { participant: Participant & { proxy: Proxy | null } })[]> {
    return disbursementRepository.findStagnant();
  }
}

export const disbursementService = new DisbursementService();
