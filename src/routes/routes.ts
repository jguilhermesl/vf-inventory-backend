import { login } from '@/http/auth/login';
import { createUser } from '@/http/users/create-user';
import { deleteUser } from '@/http/users/delete-user';
import { editUser } from '@/http/users/edit-user';
import { getUserProfile } from '@/http/users/get-user';
import { isAuthenticated } from '@/middlewares/auth-middleware';
import { Router } from 'express';

const router = Router();

router.post('/users/signin', login);
router.post('/users', isAuthenticated, createUser)
router.delete('/users/:id', isAuthenticated, deleteUser)
router.put('/users/:id', isAuthenticated, editUser)
router.get('/users/:id', isAuthenticated, getUserProfile)

export { router }