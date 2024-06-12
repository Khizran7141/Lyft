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
exports.getMessages = exports.sendMessage = void 0;
const message_1 = require("../models/message");
const Users_1 = require("../models/Users");
const channel_1 = require("../models/channel");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sender_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const receiver_id = req.params.receiver_id;
        const { content } = req.body;
        // Ensure both sender and receiver exist
        const sender = yield Users_1.User.findById(sender_id);
        const receiver = yield Users_1.User.findById(receiver_id);
        if (!sender || !receiver) {
            return res.status(404).json({ message: 'Sender or receiver not found' });
        }
        let channel = yield channel_1.Channel.findOne({ members: { $all: [sender_id, receiver_id] } });
        if (!channel) {
            channel = yield channel_1.Channel.create({
                members: [sender_id, receiver_id],
            });
        }
        const newMessage = new message_1.Message({
            sender_id,
            receiver_id,
            content,
        });
        if (newMessage) {
            channel.messages.push(newMessage._id);
        }
        yield channel.save();
        yield newMessage.save();
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    }
    catch (error) {
        console.log("erre", error);
        res.status(500).json({ message: 'Error sending message', error });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const messages = yield message_1.Message.find({ sender_id: userId });
        res.json(messages);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getMessages = getMessages;
