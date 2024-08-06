import { Request, Response } from 'express';
import { Message, IMessage } from '../models/message';
import { IUser, User } from '../models/Users';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { io } from '../SocketIoO/server';
import { Group } from '../models/group';
import { send } from 'process';

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = req.user?.id;
    const user = req.params.receiver_id;
    const { message, device, title } = req.body;

    const sender = await User.findById(token);
    const receiver = await User.findById(user);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or receiver not found' });
    }

    let group = await Group.findOne({
      $or: [
        { users: { $all: [token, user], $size: 2 } },
        { users: { $all: [user, token], $size: 2 } }
      ]
    });
    if (!group) {
      group = await Group.create({
        token,
        users: [token, user],
      });
    }
    const newMessage: IMessage = new Message({
      token,
      user,
      message,
      title,
      device
    });
    if (newMessage) {
      group.messages.push(newMessage._id as mongoose.Types.ObjectId);
    }
    await Promise.all([group.save(), newMessage.save()]);

    io.to(user).emit('message', newMessage);

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    // console.log("error", error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};


export const sendMessageToGroup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { message, device, title } = req.body;
    const token = req.user?.id;

    const group = await Group.findById(groupId).populate('users');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const sender = await User.findById(token);
    if (!sender) {
      return res.status(404).json({ message: 'Sender not found' });
    }
    const groupUserIds = group.users.map(user => user._id as mongoose.Types.ObjectId);

    // let channel = await Channel.findOne({ groupId });
    // if (!channel) {
    //   channel = new Channel({
    //     groupId,
    //     members: [token, ...group.users.map(user => user._id as mongoose.Types.ObjectId)],
    //   });
    //   await channel.save();
    // }
    const newMessage: IMessage = new Message({
      token,
      user: groupId,
      message,
      title,
      device,
      timestamp: new Date()
    });

    if (newMessage) {
      // channel.messages.push(newMessage._id as mongoose.Types.ObjectId);
      group.messages.push(newMessage._id as mongoose.Types.ObjectId);
    }
    await Promise.all([newMessage.save(), group.save()]);

    res.status(201).json({ message: 'Message sent to group successfully', data: newMessage });
  } catch (error) {
    console.error("Error sending message to group:", error);
    res.status(500).json({ message: 'Error sending message to group', error });
  }
};



export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    const receiver_id = req.params.receiver_id;

    let conversation = await Group.findOne({
      users: { $all: [senderId, receiver_id], $size: 2 }
    }).populate("messages");
    if (!conversation) {
      return res.status(201).json([]);
    }
    const messages = conversation?.messages;
    res.status(201).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getGroupMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId).populate('users messages');
    // console.log("group", group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // const channel = await Channel.findOne({ groupId}).populate('messages');
    // console.log(channel);
    // if (!channel) {
    //   return res.status(200).json([]); 
    // }

    const isUserInGroup = group.users.some(user => user._id.toString() === userId);
    if (!isUserInGroup) {
      return res.status(403).json({ message: 'User not part of the group' });
    }


    // Retrieve messages from the channels
    const messages = group.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
