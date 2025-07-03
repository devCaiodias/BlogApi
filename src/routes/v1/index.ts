import { Router } from 'express';

const router = Router();

// Root route

router.get('/', (_req, res) => {
  res.status(200).json({
    message: 'Api Live',
    status: 'Ok',
    version: '1.0.0',
    docs: 'http://docs.blog-api.codewithsadee.com',
    timeStamp: new Date().toISOString()
  });
});

export default router;