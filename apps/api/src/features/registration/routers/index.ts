import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../../middlewares/authenticate';
import { validate } from '../../../middlewares/validate';
import { registrationService } from '../services';

const router = Router();

const createRegistrationSchema = z.object({
  referenceId: z.string().min(1).optional(),
  programmeId: z.string().min(1),
  payload: z.unknown(),
});

router.use(authenticate);

router.get('/', async (_req, res, next) => {
  try {
    const registrations = await registrationService.listRegistrations();
    res.json({ registrations });
  } catch (error) {
    next(error);
  }
});

router.post('/', validate(createRegistrationSchema), async (req, res, next) => {
  try {
    const registration = await registrationService.createRegistration({
      referenceId: req.body.referenceId,
      programmeId: req.body.programmeId,
      payload: req.body.payload,
    });

    res.status(201).json({ registration });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const registration = await registrationService.getRegistration(req.params.id);

    if (!registration) {
      res.status(404).json({ success: false, error: 'Registration not found' });
      return;
    }

    res.json({ registration });
  } catch (error) {
    next(error);
  }
});

export default router;