"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.use(authenticate_1.authenticate);
router.post('/send/:receiver_id', messageController_1.sendMessage);
router.get('/receive/:receiver_id', messageController_1.getMessages);
router.post('/groups/:groupId/messages', messageController_1.sendMessageToGroup);
router.get('/groups/:groupId/messages', messageController_1.getGroupMessages);
exports.default = router;
