import { prisma } from "../../../config/prisma";
import { Disbursement, DisbursementStatus, Participant, Proxy } from "@prisma/client";

export class DisbursementRepository {
  async upsertBySdpId(
    sdpId: string,
    data: { participantId: string; amount: number; status: DisbursementStatus }
  ): Promise<Disbursement> {
    return prisma.disbursement.upsert({
      where: { sdpId },
      update: {
        status: data.status,
        amount: data.amount,
      },
      create: {
        sdpId,
        participantId: data.participantId,
        amount: data.amount,
        status: data.status,
      },
    });
  }

  async findBySdpId(sdpId: string): Promise<Disbursement | null> {
    return prisma.disbursement.findUnique({
      where: { sdpId },
      include: {
        participant: {
          include: {
            proxy: true,
          },
        },
      },
    });
  }

  async findAll(): Promise<(Disbursement & { participant: Participant & { proxy: Proxy | null } })[]> {
    return prisma.disbursement.findMany({
      include: {
        participant: {
          include: {
            proxy: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findStagnant(): Promise<(Disbursement & { participant: Participant & { proxy: Proxy | null } })[]> {
    return prisma.disbursement.findMany({
      where: {
        status: DisbursementStatus.PENDING,
      },
      include: {
        participant: {
          include: {
            proxy: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<Disbursement | null> {
    return prisma.disbursement.findUnique({
      where: { id },
      include: {
        participant: {
          include: {
            proxy: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: DisbursementStatus): Promise<Disbursement> {
    return prisma.disbursement.update({
      where: { id },
      data: { status },
    });
  }
}

export const disbursementRepository = new DisbursementRepository();
