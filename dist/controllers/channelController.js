"use strict";
// // src/controllers/channelController.ts
// import { Request, Response } from 'express';
// import { Channel } from '../models/channel';
// import { Message } from '../models/message';
// export const createChannel = async (req: Request, res: Response) => {
//   try {
//     const { user1_id, user2_id } = req.body;
//     // Check if a channel between these users already exists
//     let channel = await Channel.findOne({
//       $or: [
//         { user1_id, user2_id },
//         { user1_id: user2_id, user2_id: user1_id }
//       ]
//     });
//     if (channel) {
//       return res.status(200).json(channel); // Return existing channel
//     }
//     // Create new channel
//     channel = new Channel({ user1_id, user2_id });
//     await channel.save();
//     res.status(201).json(channel);
//   } catch (error) {
//     console.error('Error creating channel:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export const sendMessageToChannel = async (req: Request, res: Response) => {
//   try {
//     const { channel_id } = req.params;
//     const { sender_id, content } = req.body;
//     // Validate if channel exists
//     const channel = await Channel.findById(channel_id);
//     if (!channel) {
//       return res.status(404).json({ error: 'Channel not found' });
//     }
//     // Validate if sender is part of the channel
//     if (![channel.user1_id.toString(), channel.user2_id.toString()].includes(sender_id)) {
//       return res.status(403).json({ error: 'Sender not part of the channel' });
//     }
//     // Create and save message
//     const message = new Message({
//       sender_id,
//       receiver_id: channel.user1_id.toString() === sender_id ? channel.user2_id : channel.user1_id,
//       content,
//       timestamp: new Date()
//     });
//     await message.save();
//     res.status(201).json(message);
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export const getChannelMessages = async (req: Request, res: Response) => {
//   try {
//     const { channel_id } = req.params;
//     // Validate if channel exists
//     const channel = await Channel.findById(channel_id);
//     if (!channel) {
//       return res.status(404).json({ error: 'Channel not found' });
//     }
//     // Get messages from this channel
//     const messages = await Message.find({
//       $or: [
//         { sender_id: channel.user1_id, receiver_id: channel.user2_id },
//         { sender_id: channel.user2_id, receiver_id: channel.user1_id }
//       ]
//     }).sort({ timestamp: 1 });
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error getting messages:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
