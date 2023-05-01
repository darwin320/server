import {Router} from 'express';
import validateToken from './validate-token';

const router = Router();

router.get('/home',validateToken);

export default router;