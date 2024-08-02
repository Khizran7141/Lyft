import { Router } from 'express';
import { getUsers, loginUser } from '../controllers/authcontroller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/login', loginUser);
router.get('/getusers', getUsers);

export default router;
