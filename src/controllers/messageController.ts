import { Request, Response } from 'express';
import { Message, IMessage } from '../models/message';
import { IUser, User } from '../models/Users';
import { Channel } from '../models/channel';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { io } from '../SocketIoO/server'; // Import io from server

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

    let channel = await Channel.findOne({members: {$all: [token, user]}});
    if (!channel) {
        channel = await Channel.create({
            members: [token, user],
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
        channel.messages.push(newMessage._id as mongoose.Types.ObjectId);
    }
    await Promise.all([channel.save(), newMessage.save()]);

    // Emit the new message event
    io.to(user).emit('new message', newMessage);

    res.status(201).json({ message: 'Message sent successfully', data: newMessage });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: 'Error sending message', error });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const senderId = req.user?.id;
      const receiver_id = req.params.receiver_id;

      let conversation = await Channel.findOne({members: {$all: [senderId, receiver_id]}
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
