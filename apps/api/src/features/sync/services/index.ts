import { prisma } from '../../../lib/prisma';
import { registrationService } from '../../registration/services';

const syncJobInclude = {
  registration: {
    include: {
      programme: true,
    },
  },
} satisfies Parameters<typeof prisma.syncJob.findMany>[0]['include'];

export const syncService = {
  async listJobs() {
    return prisma.syncJob.findMany({
      include: syncJobInclude,
      orderBy: {
        runAt: 'desc',
      },
    });
  },

  async getJob(id: string) {
    return prisma.syncJob.findUnique({
      where: { id },
      include: syncJobInclude,
    });
  },

  async listPendingRegistrations() {
    return prisma.registration.findMany({
      where: {
        syncStatus: {
          in: ['PENDING', 'FAILED'],
        },
      },
      include: {
        programme: true,
        syncJobs: {
          orderBy: {
            runAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  },

  async retryRegistration(registrationId: string) {
    const latestJob = await prisma.syncJob.findFirst({
      where: { registrationId },
      orderBy: {
        runAt: 'desc',
      },
      select: {
        attempts: true,
      },
    });

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      select: { id: true },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    const syncJob = await prisma.syncJob.create({
      data: {
        registrationId,
        status: 'PENDING',
        attempts: (latestJob?.attempts ?? 0) + 1,
      },
      include: syncJobInclude,
    });

    await registrationService.updateSyncStatus(registrationId, 'PENDING', null);

    return syncJob;
  },

  async updateJob(
    jobId: string,
    input: {
      status: 'PENDING' | 'SUCCESS' | 'FAILED';
      errorLog?: string;
      attempts?: number;
    },
  ) {
    const existingJob = await prisma.syncJob.findUnique({
      where: { id: jobId },
      select: {
        id: true,
        registrationId: true,
      },
    });

    if (!existingJob) {
      throw new Error('Sync job not found');
    }

    const updatedJob = await prisma.syncJob.update({
      where: { id: jobId },
      data: {
        status: input.status,
        errorLog: input.errorLog ?? null,
        ...(typeof input.attempts === 'number' ? { attempts: input.attempts } : {}),
      },
      include: syncJobInclude,
    });

    await registrationService.updateSyncStatus(
      existingJob.registrationId,
      input.status,
      input.status === 'FAILED' ? input.errorLog ?? 'Sync failed' : null,
    );

    return updatedJob;
  },
};
