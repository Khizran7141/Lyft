import express from 'express';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import messageRoutes from './routes/messageRoutes';
import groupRoutes from './routes/groupRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import { app, server, io } from './SocketIoO/server';
import { Socket } from 'socket.io';

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/message', messageRoutes);
app.use('/api', groupRoutes)

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Setup basic socket.io event listeners
io.on('connection', (socket: Socket) => {
  console.log('A user connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected: ', socket.id);
  });

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});
