import express from 'express';
import { addUserToGroup, createGroup, getGroupById, getGroups, removeUserFromGroup } from '../controllers/groupController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.use(authenticate);

router.post('/groups', createGroup);
router.get('/getgroups', getGroups);
router.get('/groups/:id', getGroupById);
router.post('/groups/:groupId/add-user/:userId', addUserToGroup);
router.delete('/groups/:groupId/users/:userId', removeUserFromGroup);

export default router;
