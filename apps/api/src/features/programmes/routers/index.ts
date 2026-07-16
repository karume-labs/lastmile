import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../../middlewares/authenticate';
import { validate } from '../../../middlewares/validate';
import { programmeService } from '../services';

const router = Router();

const amountSchema = z.coerce.number().positive();

const createProgrammeSchema = z.object({
  name: z.string().trim().min(1),
  currency: z.string().trim().length(3).optional(),
  amount: amountSchema,
});

const updateProgrammeSchema = createProgrammeSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'Provide at least one field to update',
);

const getProgrammeId = (id: string | string[]) => (Array.isArray(id) ? id[0] : id);

router.use(authenticate);

router.get('/', async (_req, res, next) => {
  try {
    const programmes = await programmeService.listProgrammes();
    res.json({ programmes });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createProgrammeSchema), async (req, res, next) => {
  try {
    const programme = await programmeService.createProgramme(req.body);
    res.status(201).json({ programme });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const programme = await programmeService.getProgramme(getProgrammeId(req.params.id));

    if (!programme) {
      res.status(404).json({ success: false, error: 'Programme not found' });
      return;
    }

    res.json({ programme });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validate(updateProgrammeSchema), async (req, res, next) => {
  try {
    const programme = await programmeService.updateProgramme(getProgrammeId(req.params.id), req.body);

    if (!programme) {
      res.status(404).json({ success: false, error: 'Programme not found' });
      return;
    }

    res.json({ programme });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const programme = await programmeService.deleteProgramme(getProgrammeId(req.params.id));

    if (!programme) {
      res.status(404).json({ success: false, error: 'Programme not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
