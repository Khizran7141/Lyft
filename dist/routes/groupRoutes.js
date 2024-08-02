"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const groupController_1 = require("../controllers/groupController");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
router.use(authenticate_1.authenticate);
router.post('/groups', groupController_1.createGroup);
router.get('/getgroups', groupController_1.getGroups);
router.get('/groups/:id', groupController_1.getGroupById);
router.post('/groups/:groupId/add-user/:userId', groupController_1.addUserToGroup);
exports.default = router;
