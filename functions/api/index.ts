// functions/api/index.ts
import express from 'express';
import connectDB from '../../src/config/db';
import authRoutes from '../../src/routes/authRoutes';
import messageRoutes from '../../src/routes/messageRoutes';
import groupRoutes from '../../src/routes/groupRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import { Socket } from 'socket.io';
import { app, io } from '../../src/SocketIoO/server';
import serverless from 'serverless-http';

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/message', messageRoutes);
app.use('/api', groupRoutes);

io.on('connection', (socket: Socket) => {
    console.log('A user connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });

    socket.on('message', (msg) => {
        const parsedMessage = JSON.parse(msg);
        io.emit('message', parsedMessage);
    });

    socket.on('join', (userId) => {
        socket.join(userId);
    });
});

module.exports.handler = serverless(app);
