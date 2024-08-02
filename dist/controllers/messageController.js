"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMessages = exports.getMessages = exports.sendMessageToGroup = exports.sendMessage = void 0;
const message_1 = require("../models/message");
const Users_1 = require("../models/Users");
const channel_1 = require("../models/channel");
const server_1 = require("../SocketIoO/server");
const group_1 = require("../models/group");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = req.params.receiver_id;
        const { message, device, title } = req.body;
        const sender = yield Users_1.User.findById(token);
        const receiver = yield Users_1.User.findById(user);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
        let channel = yield channel_1.Channel.findOne({ members: { $all: [token, user] } });
        if (!channel) {
            channel = yield channel_1.Channel.create({
                members: [token, user],
            });
        }
        const newMessage = new message_1.Message({
            token,
            user,
            message,
            title,
            device
        });
        if (newMessage) {
            channel.messages.push(newMessage._id);
        }
        yield Promise.all([channel.save(), newMessage.save()]);
        server_1.io.to(user).emit('new message', newMessage);
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    }
    catch (error) {
        console.log("error", error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
const sendMessageToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { groupId } = req.params;
        const { message, device, title } = req.body;
        const token = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const group = yield group_1.Group.findById(groupId).populate('users');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const sender = yield Users_1.User.findById(token);
        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }
        const groupUserIds = group.users.map(user => user._id);
        let channel = yield channel_1.Channel.findOne({ groupId });
        if (!channel) {
            channel = new channel_1.Channel({
                members: [token, ...group.users.map(user => user._id)],
            });
            yield channel.save();
        }
        const newMessage = new message_1.Message({
            token,
            user: groupId,
            message,
            title,
            device,
            timestamp: new Date()
        });
        if (newMessage) {
            channel.messages.push(newMessage._id);
            group.messages.push(newMessage._id);
        }
        yield Promise.all([channel.save(), newMessage.save(), group.save()]);
        res.status(201).json({ message: 'Message sent to group successfully', data: newMessage });
    }
    catch (error) {
        console.error("Error sending message to group:", error);
        res.status(500).json({ message: 'Error sending message to group', error });
    }
});
exports.sendMessageToGroup = sendMessageToGroup;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const senderId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.id;
        const receiver_id = req.params.receiver_id;
        let conversation = yield channel_1.Channel.findOne({
            members: { $all: [senderId, receiver_id] }
        }).populate("messages");
        if (!conversation) {
            return res.status(201).json([]);
        }
        const messages = conversation === null || conversation === void 0 ? void 0 : conversation.messages;
        res.status(201).json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getMessages = getMessages;
const getGroupMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
        console.log(userId);
        const groupId = req.params.groupId;
        const group = yield group_1.Group.findById(groupId).populate('users');
        // console.log("group", group);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const channel = yield channel_1.Channel.findOne({ members: { $all: [userId] } }).populate('messages');
        console.log(channel);
        if (!channel) {
            return res.status(200).json([]);
        }
        const isUserInGroup = channel.members.some(user => user._id.toString() === userId);
        console.log(isUserInGroup);
        if (!isUserInGroup) {
            return res.status(403).json({ message: 'User not part of the group' });
        }
        // Retrieve messages from the channels
        const messages = channel.messages;
        res.status(200).json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getGroupMessages = getGroupMessages;
