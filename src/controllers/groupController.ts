import { Request, Response } from 'express';
import { Group, IGroup } from '../models/group';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { User } from 'src/models/Users';

export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = req.user?._id;
    const { name, users } = req.body;

    const group: IGroup = await Group.create({ token, name, users });

    res.status(201).json({ message: 'Group created successfully', data: group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: 'Error creating group', error });
  }
};


export const getGroups = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const token = req.user?._id;
      const groups = await Group.find({token: token});

      const formattedGroups = groups.map(group => ({
        group: group._id,
        name: group.name,
      }));

      const response = {
        status: 1,
        request: token,
        groups: formattedGroups,
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving groups', error });
    }
  };

  export const getGroupById = async (req: Request, res: Response) => {
    try {
      const groupId = req.params.id;
      const group = await Group.findById(groupId).populate('users', '_id username');
  
      if (!group) {
        return res.status(404).json({ status: 0, message: 'Group not found' });
      }
  
      const response = {
        status: 1,
        request: group.token,
        name: group.name,
        users: group.users
      };
  
      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching group:", error);
      res.status(500).json({ status: 0, message: 'Error fetching group', error });
    }
  };


  export const addUserToGroup = async (req: Request, res: Response) => {
    try {
        const { groupId, userId } = req.params;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the user to the group
        group.users.push(user._id);
        await group.save();

        res.status(200).json({ message: 'User added to the group successfully', group });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};