import { Prisma } from '@prisma/client';
import { prisma } from '../../../lib/prisma';

const programmeInclude = {
  _count: {
    select: {
      participants: true,
      registrations: true,
    },
  },
} satisfies Prisma.ProgrammeInclude;

type CreateProgrammeInput = {
  name: string;
  currency?: string;
  amount: Prisma.Decimal | number | string;
};

type UpdateProgrammeInput = Partial<CreateProgrammeInput>;

export const programmeService = {
  async listProgrammes() {
    return prisma.programme.findMany({
      where: { deletedAt: null },
      include: programmeInclude,
      orderBy: { createdAt: 'desc' },
    });
  },

  async getProgramme(id: string) {
    return prisma.programme.findFirst({
      where: { id, deletedAt: null },
      include: programmeInclude,
    });
  },

  async createProgramme(input: CreateProgrammeInput) {
    return prisma.programme.create({
      data: {
        name: input.name.trim(),
        currency: input.currency?.trim().toUpperCase() || 'KES',
        amount: input.amount,
      },
      include: programmeInclude,
    });
  },

  async updateProgramme(id: string, input: UpdateProgrammeInput) {
    const programme = await this.getProgramme(id);

    if (!programme) {
      return null;
    }

    return prisma.programme.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        ...(input.currency !== undefined
          ? { currency: input.currency.trim().toUpperCase() }
          : {}),
        ...(input.amount !== undefined ? { amount: input.amount } : {}),
      },
      include: programmeInclude,
    });
  },

  async deleteProgramme(id: string) {
    const programme = await this.getProgramme(id);

    if (!programme) {
      return null;
    }

    return prisma.programme.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
