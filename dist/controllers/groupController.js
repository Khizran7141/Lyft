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
exports.addUserToGroup = exports.getGroupById = exports.getGroups = exports.createGroup = void 0;
const group_1 = require("../models/group");
const Users_1 = require("../models/Users");
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { name, users } = req.body;
        const group = yield group_1.Group.create({ token, name, users });
        res.status(201).json({ message: 'Group created successfully', data: group });
    }
    catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ message: 'Error creating group', error });
    }
});
exports.createGroup = createGroup;
const getGroups = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const groups = yield group_1.Group.find({ token: token });
        const formattedGroups = groups.map(group => ({
            group: group._id,
            name: group.name,
        }));
        const response = {
            status: 1,
            request: token,
            groups: formattedGroups,
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving groups', error });
    }
});
exports.getGroups = getGroups;
const getGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupId = req.params.id;
        const group = yield group_1.Group.findById(groupId).populate('users', '_id username');
        if (!group) {
            return res.status(404).json({ status: 0, message: 'Group not found' });
        }
        const response = {
            status: 1,
            request: group.token,
            name: group.name,
            users: group.users
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching group:", error);
        res.status(500).json({ status: 0, message: 'Error fetching group', error });
    }
});
exports.getGroupById = getGroupById;
const addUserToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { groupId, userId } = req.params;
        const group = yield group_1.Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        // Find the user by userId
        const user = yield Users_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add the user to the group
        group.users.push(user._id);
        yield group.save();
        res.status(200).json({ message: 'User added to the group successfully', group });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.addUserToGroup = addUserToGroup;
