"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("./SocketIoO/server");
dotenv_1.default.config();
(0, db_1.default)();
server_1.app.use((0, cors_1.default)());
server_1.app.use(express_1.default.json());
server_1.app.use('/api/auth', authRoutes_1.default);
server_1.app.use('/message', messageRoutes_1.default);
server_1.app.use('/api', groupRoutes_1.default);
const PORT = process.env.PORT || 8000;
server_1.server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Setup basic socket.io event listeners
server_1.io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected: ', socket.id);
    });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        server_1.io.emit('chat message', msg);
    });
});
