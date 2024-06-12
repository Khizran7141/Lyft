import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser, User } from '../models/Users';
import { AuthenticatedRequest } from '../middleware/authenticate';

dotenv.config();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials', status: false });
      }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loggedInUserId = req.user?.id;

    const users = await User.find({ _id: { $ne: loggedInUserId } });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};