import express from 'express';
import { authenticate } from '../middleware/authenticate';
import { getGroupMessages, getMessages, sendMessage, sendMessageToGroup } from '../controllers/messageController';

const router = express.Router();

router.use(authenticate);

router.post('/send/:receiver_id', sendMessage);
router.get('/receive/:receiver_id',  getMessages)
router.post('/groups/:groupId/messages', sendMessageToGroup);
router.get('/groups/:groupId/messages', getGroupMessages);


export default router;
