import { Prisma } from '@prisma/client';
import { randomBytes } from 'node:crypto';
import { prisma } from '../../../lib/prisma';

const makeReferenceId = () => {
  const suffix = randomBytes(3).toString('hex').toUpperCase();
  return `REG-${Date.now().toString(36).toUpperCase()}-${suffix}`;
};

const registrationInclude = {
  programme: true,
  syncJobs: {
    orderBy: {
      runAt: 'desc' as const,
    },
  },
} satisfies Prisma.RegistrationInclude;

type CreateRegistrationInput = {
  referenceId?: string;
  programmeId: string;
  payload: Prisma.InputJsonValue;
};

export const registrationService = {
  async listRegistrations() {
    return prisma.registration.findMany({
      include: registrationInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  async getRegistration(id: string) {
    return prisma.registration.findUnique({
      where: { id },
      include: registrationInclude,
    });
  },

  async createRegistration(input: CreateRegistrationInput) {
    const programme = await prisma.programme.findUnique({
      where: { id: input.programmeId },
      select: { id: true },
    });

    if (!programme) {
      throw new Error('Programme not found');
    }

    const referenceId = input.referenceId?.trim() || makeReferenceId();

    return prisma.registration.create({
      data: {
        referenceId,
        programmeId: input.programmeId,
        payload: input.payload,
        syncStatus: 'PENDING',
        syncJobs: {
          create: {
            status: 'PENDING',
            attempts: 1,
          },
        },
      },
      include: registrationInclude,
    });
  },

  async updateSyncStatus(
    registrationId: string,
    syncStatus: 'PENDING' | 'SUCCESS' | 'FAILED',
    failureReason?: string | null,
  ) {
    return prisma.registration.update({
      where: { id: registrationId },
      data: {
        syncStatus,
        failureReason: failureReason ?? null,
      },
      include: registrationInclude,
    });
  },
};