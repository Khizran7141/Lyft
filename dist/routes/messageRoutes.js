"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middleware/authenticate");
const messageController_1 = require("../controllers/messageController");
const router = express_1.default.Router();
router.post('/send/:receiver_id', authenticate_1.authenticate, messageController_1.sendMessage);
router.get('/receive', authenticate_1.authenticate, messageController_1.getMessages);
exports.default = router;
