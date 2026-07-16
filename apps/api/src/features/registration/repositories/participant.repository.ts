import { prisma } from "../../../config/prisma";
import { Participant, Proxy } from "@prisma/client";

export class ParticipantRepository {
  async findByReferenceId(referenceId: string): Promise<Participant | null> {
    return prisma.participant.findUnique({
      where: { referenceId },
    });
  }

  async findByIdWithProxy(id: string): Promise<(Participant & { proxy: Proxy | null }) | null> {
    return prisma.participant.findUnique({
      where: { id },
      include: { proxy: true },
    });
  }
}

export const participantRepository = new ParticipantRepository();
