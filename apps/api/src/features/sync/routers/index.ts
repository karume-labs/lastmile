import { Router } from 'express';
import { z } from 'zod';
import { authenticate } from '../../../middlewares/authenticate';
import { validate } from '../../../middlewares/validate';
import { syncService } from '../services';

const router = Router();

const updateSyncJobSchema = z.object({
  status: z.enum(['PENDING', 'SUCCESS', 'FAILED']),
  errorLog: z.string().optional(),
  attempts: z.number().int().positive().optional(),
});

router.use(authenticate);

router.get('/pending-registrations', async (_req, res, next) => {
  try {
    const registrations = await syncService.listPendingRegistrations();
    res.json({ registrations });
  } catch (error) {
    next(error);
  }
});

router.get('/jobs', async (_req, res, next) => {
  try {
    const jobs = await syncService.listJobs();
    res.json({ jobs });
  } catch (error) {
    next(error);
  }
});

router.get('/jobs/:id', async (req, res, next) => {
  try {
    const job = await syncService.getJob(req.params.id);

    if (!job) {
      res.status(404).json({ success: false, error: 'Sync job not found' });
      return;
    }

    res.json({ job });
  } catch (error) {
    next(error);
  }
});

router.post('/registrations/:registrationId/retry', async (req, res, next) => {
  try {
    const syncJob = await syncService.retryRegistration(req.params.registrationId);
    res.status(201).json({ syncJob });
  } catch (error) {
    next(error);
  }
});

router.patch('/jobs/:id', validate(updateSyncJobSchema), async (req, res, next) => {
  try {
    const job = await syncService.updateJob(req.params.id, req.body);
    res.json({ job });
  } catch (error) {
    next(error);
  }
});

export default router;