import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { getMessages, sendMessage } from '../controllers/messageController';

const router = express.Router();

router.use(authenticate);

router.post('/send/:receiver_id', sendMessage);
router.get('/receive/:receiver_id',  getMessages)

export default router;
